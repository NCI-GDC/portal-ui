module ngApp.components.gql {
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IFacet = ngApp.core.models.IFacet;
  import IBucket = ngApp.core.models.IBucket;     

  enum KeyCode { Space = 32, Enter = 13, Esc = 27, Left = 37, Right = 39, Up = 38, Down = 40 }
  enum Mode { Field, Quoted, Unquoted, List, Op }
  enum Cycle { Up = -1, Down = 1 }	
  
  class GqlService implements IGqlService {
    /* @ngInject */
    constructor(
      private $timeout: ng.ITimeoutService,
      private $document: ng.IDocumentService,
      private FilesService: IFilesService,
      private ParticipantsService: IParticipantsService,
      private GqlTokens: ITokens
    ) {  }
    
    getPos(element: any): number {
      if ('selectionStart' in element) {
        return element.selectionStart;
      } else if (this.$document['selection']) {
        element.focus();
        var sel: any = this.$document['selection'].createRange();
        var selLen: number = this.$document['selection'].createRange().text.length;
        sel.moveStart('character', -element.value.length);
        return sel.text.length - selLen;
      }
    }

    setPos(element: any, caretPos: number): void {
      if (element.createTextRange) {
        var range = element.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        element.focus();
        if (element.selectionStart !== undefined) {
          this.$timeout(() => element.setSelectionRange(caretPos, caretPos));
        }
      }
    }

    countNeedle(stack: string, needle: string): number {
      // http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript
      return stack.split(needle).length - 1
    }

    isCountOdd(stack: string, needle: string): boolean {
      return this.countNeedle(stack, needle) % 2 !== 0;
    }

    isUnbalanced(stack: string, start: string, end: string): boolean {
      var numStart = this.countNeedle(stack, start);
      var numEnd = this.countNeedle(stack, end);
      return numStart > numEnd;
    }
    
    contains(phrase: string, sub: string): boolean {
      if (sub.length === 0) return true;
      var phraseStr = (phrase + this.GqlTokens.NOTHING).toLowerCase();
      return phraseStr.indexOf((sub + this.GqlTokens.NOTHING).toLowerCase()) > -1;
    }

    clean(e:string): boolean {
      return (e !== undefined) && [
          '[A-Za-z0-9\\-_.]', 
          '[0-9]', 
          'whitespace', 
          'newline', 
          'end of input',
          '_missing', 
          this.GqlTokens.QUOTE, 
          this.GqlTokens.LPARENS
        ].indexOf(e) == -1;
    }
    
    getStartOfList(s: string): number {
      var bracket = s.lastIndexOf(this.GqlTokens.LBRACKET);
      return bracket === -1 ? s.length : bracket + 1;
    }
    
    getEndOfList(s: string): number {
      return s.indexOf(this.GqlTokens.RBRACKET) !== -1 ? s.indexOf(this.GqlTokens.RBRACKET) : s.length;
    }
    
    getValuesOfList(s:string): string[] {
      return _.map(s.split(this.GqlTokens.COMMA), (x) => x.trim().split(this.GqlTokens.QUOTE).join(this.GqlTokens.NOTHING));
    }
    
    cleanNeedle(s: string): string {
      return s.trim()
                .replace(this.GqlTokens.QUOTE, this.GqlTokens.NOTHING)
                .replace(this.GqlTokens.LBRACKET, this.GqlTokens.NOTHING)
                .replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING);  
    }
    getNeedleFromList(s:string): string {
      return this.cleanNeedle(_.last(this.getValuesOfList(s)))
    }
    
    getParts(s: string): IParts {
      var parts = s.split(this.GqlTokens.SPACE);
      var needle = this.cleanNeedle(parts[parts.length - 1] || '');
      var op = parts[parts.length - 2] || '';
      var field = parts[parts.length - 3] || '';
      
      if (field) {
        field = field.replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING); 
      }
      
      return {
        field: field,
        op: op.toUpperCase(),
        needle: needle
      };
    }
    
    getComplexParts(s: string, n: number): IParts {
      var parts = this.getParts(s.substring(0, n));
      parts.needle = this.getNeedleFromList(s.substring(n));
      return parts;
    }
    
    splitField(s: string): IFieldParts {
      var xs = s.split(this.GqlTokens.PERIOD);
      
      return {
        docType: xs.shift(),
        facet: xs.join(this.GqlTokens.PERIOD)
      }
    }
    
    isQuoted(s: string): boolean {
      return s.toString().indexOf(this.GqlTokens.SPACE) !== -1
    }
    
    ajaxRequest(field: string): ng.IPromise<IDdItem[]> {
      var parts = this.splitField(field);
      
      var params = {
        facets: [parts.facet],
        size: 0,
        filters: {}
      };
      
      if (parts.docType === "files") {
        return this.FilesService.getFiles(params)
          .then((fs: IFiles): IDdItem[] => {
            var f: IFacet = fs.aggregations[parts.facet];
            return _.map(f.buckets, (b) => {
              return {field: b.key, full: b.key};
            });
          });
      } else {
        return this.ParticipantsService.getParticipants(params)
          .then((fs: IParticipants): IDdItem[] => {
            var f: IFacet = fs.aggregations[parts.facet];
            return _.map(f.buckets, (b) => {
              return {field: b.key, full: b.key};
            });
          });
      }
    }
    
    parseGrammarError(needle: string, error: IGqlSyntaxError): IDdItem[] {
      // Handles GQL Parser errors
      return _.map(_.filter(error.expected, (e) => {
        return this.contains(e.description, needle) && this.clean(e.description);
      }), (m) => {
          var val = m.description ? m.description : m.value
        return {
          field: val,
          full: val
        };
      });
    }
    
    getLastComma(s: string): number {
      return s.lastIndexOf(this.GqlTokens.COMMA) + 1;
    }
    
    getFirstComma(s: string): number {
      return s.indexOf(this.GqlTokens.COMMA);
    }
    
    getListContent(left: string, listStart: number, right: string): string {
      var lComma = this.getLastComma(left);
      lComma = lComma === 0 ? listStart : lComma;
      var rComma = this.getFirstComma(right);
      var listEnd = this.getEndOfList(right);
      return left.substring(listStart, lComma) + right.substring(rComma + 1, listEnd);
    }
    
    parseList(left: string, right: string): { parts: IParts; listValues: string[] } {
      /*
      * ... FIELD OP [vvv, vvv, nnn|xxx, vvv, vvv] ...
      * FIELD = field searching on
      * OP = operator using on search
      * | = current cursor position
      * nnn = active part of value - used in filtering
      * xxx = ignored - NOT used in filtering and removed after adding new value
      * vvv = other values in the list
      * ... = uninteresting parts of the query
      *
      * Requirements for List:
      *  - Get the beginning of the list
      *  - Get the end of the list
      *  - Get the values of the list
      *  - Get active search term
      *  - Autocomplete values for FIELD
      *  - Remove current values from autocomplete 
      */
      // Get the beginning of the list
      var listStart = this.getStartOfList(left);
      // Get the values of the list
      var listContent = this.getListContent(left, listStart, right);
      // Get array of list values
      var listValues = this.getValuesOfList(listContent); 
      // Get all the fields needed for Ajax
      
      return { 
        parts: this.getComplexParts(left, listStart),
        listValues: listValues 
      }
    }
    
    ajaxList(parts: IParts, listValues): ng.IPromise<IDdItem[]> {
      // Autocomplete suggestions
      return this.ajaxRequest(parts.field).then((d) => {
        return _.filter(d, (m) => {
          // Filter out values that are already in the list
          return m && m.full && listValues.indexOf(m.field.toString()) === -1 && 
            this.contains(m.full.toString(), parts.needle) && 
            this.clean(m.full.toString());
        });
      });
    }
    
    parseQuoted(left: string): IParts {
       /*
      * ... FIELD OP "nnn nnn|xxx ...
      * FIELD = field searching on
      * OP = operator using on search
      * | = current cursor position
      * nnn = active part of value - used in filtering
      * xxx = ignored - NOT used in filtering and removed after adding new value
      * ... = uninteresting parts of the query
      *
      * Requirements for List:
      *  - Get the beginning of the quoted term
      *  - Get active search term
      *  - Autocomplete values for FIELD
      */
      // Get the last quote
      var lastQuote = left.lastIndexOf(this.GqlTokens.QUOTE);
      
      // Get all the fields needed for Ajax
      return this.getComplexParts(left, lastQuote);
    }
    
    ajaxQuoted(parts: IParts): ng.IPromise<IDdItem[]> {
      // Autocomplete suggestions
      return this.ajaxRequest(parts.field).then((d)=> {
        return _.filter(d, (m) => {
          return m && m.full && this.contains(m.full.toString(), parts.needle) &&
          this.clean(m.full.toString());
        });
      });
    }
    
    lhsRewrite(left: string, needleLength: number): string {
      return left.substring(0, left.length - needleLength)
    }
    
    rhsRewrite(right: string): string {
      var rFirstSpace = right.indexOf(this.GqlTokens.SPACE);
      var tokenIndex = rFirstSpace === -1 ? right.length : rFirstSpace;
      return right.substring(tokenIndex);
    }
    
    rhsRewriteQuoted(right: string): string {
      var rFirstSpace = right.search(/[a-z]"/i);
      return right.substring(rFirstSpace + 2);
    }
    
    rhsRewriteList(right: string): string {
      var bracket = right.indexOf(this.GqlTokens.RBRACKET);
      var comma = right.indexOf(this.GqlTokens.COMMA);
      // is there a comma before the ] - if yes use that
      var pos = comma >= 0 && comma < bracket ? comma : bracket;
      // other wise is there a ] at all - then use that
      // else end of line
      pos = pos === -1 ? right.length : pos;
      return right.substring(pos);
    }
    
    humanError(s: string, e: IGqlSyntaxError): string {
      var right = s.substring(e.location.start.offset);
      var space = right.indexOf(this.GqlTokens.SPACE);
      space = space === -1 ? right.length : space;
      var token = right.substring(0, space);
      if (e.found) {
        e.message = e.message.replace(/but.*$/, 'but "' + token + '" found.');
      }
      return e.location.start.line + " : " + e.location.start.column + " - " + e.message
    }
  }
  
  /* @ngInject */
  function gqlInput($window: IGDCWindowService,
                    $document: ng.IDocumentService,
                    $compile: ng.ICompileService,
                    $timeout: ng.ITimeoutService,
                    Restangular: restangular.IService,
                    GqlService: IGqlService,
                    GqlTokens: ITokens): IGqlInput {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        gql: '=',
        query: '=',
        error: '='
      },
      templateUrl: "components/gql/templates/gql.html",
      link: function ($scope, element) {
        var INACTIVE = -1;
        var T = GqlTokens;
        var ds = Restangular.all("gql");
        var mapping: IDdItem[];
        ds.get('_mapping', {}).then((m: IDdItem[]) => mapping = m);
              
        $scope.active = INACTIVE;
        $scope.offset = 0;
        $scope.limit = 10;
        
        $scope.onChange = function() {
          $scope.focused = true;
          $scope.active = INACTIVE;
          gqlParse();
          var index = GqlService.getPos(element[0]);
          $scope.left = $scope.query.substring(0, index);
          $scope.right = $scope.query.substring(index);
          var left = $scope.left;
          var right = $scope.right;
          $scope.parts = GqlService.getParts(left);

          if ($scope.error && _.some($scope.error.expected, (e): boolean => {
                return [T.IN, T.AND].indexOf(e.description) !== -1;
              })) {           
            $scope.mode = Mode.Op;
            
            $scope.ddItems = _.filter(
                GqlService.parseGrammarError($scope.parts.needle, $scope.error), 
                (item: IDdItem): boolean => {
                    var op: IDdItem = mapping[$scope.parts.op.toLowerCase()] || {}; 
                    if ((op.type || '') === 'long' || (op.full || '').toString().indexOf('datetime') != -1) {
                        return [T.EQ, T.NE, T.GT, T.GTE, T.LT, T.LTE, T.IS, T.NOT].indexOf(item.full.toString()) != -1
                    } else if (op.type === 'string') {
                        return [T.EQ, T.NE, T.IN, T.EXCLUDE, T.IS, T.NOT].indexOf(item.full.toString()) != -1
                    } else {
                        return false;
                    } 
                }
            );
          }  else if ($scope.error && _.some($scope.error.expected, (e): boolean => {
                return [T.MISSING].indexOf(e.description) !== -1;
              })) {
            $scope.mode = Mode.Unquoted;
  	        
            $scope.ddItems = GqlService.parseGrammarError($scope.parts.needle, $scope.error)
          } else {
            if ([T.IN, T.EXCLUDE].indexOf($scope.parts.op) !== -1 || 
            GqlService.isUnbalanced(left, T.LBRACKET, T.RBRACKET)) {
              // in_list_of_values
              $scope.mode = Mode.List;
              var ret: { parts: IParts; listValues: string[] } = GqlService.parseList(left, right);
              $scope.parts = ret.parts; 
              GqlService.ajaxList($scope.parts, ret.listValues).then((d) => {
                $scope.ddItems = d;
              });
            } else if (GqlService.isCountOdd(left, T.QUOTE)) {
              //in_quoted_string
              $scope.mode = Mode.Quoted;
              $scope.parts = GqlService.parseQuoted(left);
              GqlService.ajaxQuoted($scope.parts).then((d) => {
                $scope.ddItems = d;
              });
            } else {
              if (($scope.parts.needle.toUpperCase() && !$scope.parts.op) || [T.AND, T.OR].indexOf($scope.parts.op) !== -1) {
                // is_field_string
                $scope.mode = Mode.Field;
                $scope.ddItems = _.filter(mapping, (m: IDdItem) => {
                  return (
                    m && 
                    m.full &&
                    GqlService.clean(m.full.toString()) && 
                    (
                        GqlService.contains(m.full.toString(), $scope.parts.needle.replace(T.LPARENS, T.NOTHING)) ||
                        GqlService.contains(m.type, $scope.parts.needle.replace(T.LPARENS, T.NOTHING))
                    ) 
                    
                  );
                });
              } else if ([T.EQ, T.NE].indexOf($scope.parts.op) !== -1) {
                // is_value_string is_unquoted_string
                $scope.mode = Mode.Unquoted;

                GqlService.ajaxRequest($scope.parts.field).then((d)=> {
                  $scope.ddItems = _.filter(d, (m) => {
                    return m && m.full && GqlService.contains(m.full.toString(), $scope.parts.needle) && GqlService.clean(m.full.toString());
                  });
                });
              }
            }
          }
        };

        function gqlParse() {
          try {
            $scope.gql = $window.gql.parse($scope.query);
            $scope.error = null;
          } catch (Error) {
            Error.human = GqlService.humanError($scope.query, Error); 
            $scope.error = Error;
            $scope.gql = null;
          }
        }

        $scope.setActive = function(active: number): void {
          if ($scope.active >= 0) $scope.ddItems[$scope.active].active = false;
          $scope.ddItems[active].active = true;
          $scope.active = active;
        };

        $scope.cycle = (val: Cycle): void => {
          $scope.showResults();
          
          var active = $scope.active + val;
  
          if (active >= $scope.ddItems.length) {
            active = 0;
            $scope.offset = 0;
          } else if (active < 0) {
            active = $scope.ddItems.length - 1;
            if ($scope.ddItems.length > $scope.limit) {
              $scope.offset = $scope.ddItems.length - $scope.limit
            }
          } else if (active >= $scope.offset + $scope.limit) {
            $scope.offset++;
          } else if (active < $scope.offset) {
            $scope.offset--;
          } 

          $scope.setActive(active);
        };

        $scope.showResults = function(): boolean {
          var results = $scope.ddItems ? !!$scope.ddItems.length : false;
          var bool = !!($scope.focused && $scope.query.length > 0 && results);
          if (!bool) $scope.offset = 0;
          return bool;
        };

        $scope.keypress = function(e: KeyboardEvent): void {
          var key = e.which || e.keyCode
          
          switch (key) {
            case KeyCode.Enter:
              e.preventDefault();
              if ($scope.showResults()) {
                $scope.enter();
              }
              break;
            case KeyCode.Up:
              e.preventDefault();
              if ($scope.showResults()) {
                $scope.cycle(Cycle.Up);
              }
              break;
            case KeyCode.Down:
              e.preventDefault();
              if ($scope.showResults()) {
                $scope.cycle(Cycle.Down);
              } else {
                $scope.onChange();
              }
              break;
            case KeyCode.Space:
              if ($scope.mode !== Mode.Quoted) {
                $scope.ddItems = [];
                gqlParse();
                if ($scope.query && !$scope.error) {
                    $scope.ddItems = [{
                        field: 'AND',
                        full: 'AND'
                    }, {
                        field: 'OR',
                        full: 'OR'
                    }];
                }
              }
              break;
            case KeyCode.Esc:
              clearActive();
              break;
          
            case KeyCode.Left:
            case KeyCode.Right:
            default:
            //   $scope.onChange();
              break;
          }
        }

        function clearActive() {
          if ($scope.ddItems && $scope.ddItems[$scope.active]) {
            $scope.ddItems[$scope.active].active = false;
          }
          $scope.ddItems = [];
          $scope.active = INACTIVE;
          $scope.focused = false;
        }

        $scope.enter = function(item: IDdItem): void {
          item = item || ($scope.active === INACTIVE ? $scope.ddItems[0] : $scope.ddItems[$scope.active]);
  	      var needleLength = $scope.parts.needle.length;
          // Quote the value if it has a space so the parse can handle it  
          if (GqlService.isQuoted(item.full)) item.full = T.QUOTE + item.full + T.QUOTE;
          
          // After selecting a value close the autocomplete
          clearActive();

          var left = $scope.left;
          var right = $scope.right;

          if ([Mode.Field, Mode.Op, Mode.Unquoted].indexOf($scope.mode) !== -1) {
              
            var newLeft = GqlService.lhsRewrite(left, needleLength);
            var newRight = GqlService.rhsRewrite(right);
            
            var insert = [T.IN, T.EXCLUDE].indexOf(item.full.toString().toUpperCase()) != -1 ? 
                            item.full.toString() + T.SPACE + T.LBRACKET :
                            item.full;   
            
            $scope.query = newLeft + insert + newRight;
            GqlService.setPos(element[0], (newLeft + insert).length);
          } else if ($scope.mode === Mode.Quoted) {
            var newLeft = GqlService.lhsRewrite(left, needleLength + 1);
            var newRight = GqlService.rhsRewriteQuoted(right);

            $scope.query = newLeft + item.full + newRight;
            GqlService.setPos(element[0], (newLeft + item.full).length);
          } else if ($scope.mode === Mode.List) {
            if (GqlService.isCountOdd(left, T.QUOTE)) needleLength++;
            // [OICR-925] Auto insert [ if not there already
            // if (left.substr(-4).toUpperCase() === T.SPACE + T.IN + T.SPACE) left += T.LBRACKET;
            var newLeft = GqlService.lhsRewrite(left, needleLength);
            var newRight = GqlService.rhsRewriteList(right);
      
            $scope.query = newLeft + item.full + newRight;
            GqlService.setPos(element[0], (newLeft + item.full).length);
          }
          gqlParse();
        };

        function blur() {
          clearActive();
        }
        
        $scope.focus = function() {
            element[0].focus();
            $scope.focused = true;
        }

        gqlParse();

        // $scope.$on('application:click', blur);

        element.after($compile('<gql-dropdown></gql-dropdown>')($scope));
      }
    };
  }

  /* @ngInject */
  function gqlDropdown($interval: ng.IIntervalService): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: "components/gql/templates/gql_dropdown.html",
      link: function ($scope: IGqlScope) {
        $scope.click = function (item) {
          $scope.enter(item)
        };
        $scope.mouseIn = function(idx) {
          $scope.setActive(idx + $scope.offset);
        }
        $scope.handleOnClickUpArrow = function () {
          $scope.focus();
          if ($scope.offset > 0) $scope.cycle(Cycle.Up);
        };
        $scope.handleOnClickDownArrow = function() {
          $scope.focus();
          if ($scope.ddItems.length > $scope.offset + $scope.limit) $scope.cycle(Cycle.Down);
        }
      }
    };
  }
      
  var Tokens: ITokens = {
      EQ: "=",
      NE: "!=",
      GT: ">",
      GTE: ">=",
      LT: "<",
      LTE: "<=",
      IN: "IN",
      EXCLUDE: "EXCLUDE",
      OR: "OR",
      AND: "AND",
      IS: "IS",
      NOT: "NOT",
      MISSING: "MISSING",
      LBRACKET: '[',
      RBRACKET: ']',
      LPARENS: '(',
      RPARENS: ')',
      QUOTE: '"',
      SPACE: ' ',
      COMMA: ',',
      NOTHING: '',
      PERIOD: '.'
    }
    
  angular.module("components.gql", [
      "gql.filters",
  ])
    .service("GqlService", GqlService)
    .directive("gql", gqlInput)
    .directive("gqlDropdown", gqlDropdown)
    .constant('GqlTokens', Tokens);
   
  interface IFieldParts {
    docType: string;
    facet: string;
  }
    
  interface IParts {
    op: string;
    field: string;
    needle: string;
  }
    
  interface IGqlInput extends ng.IDirective {
    link($scope: IGqlScope, element: Node): void;
  }
  
  interface IGqlService {
    getPos(element: any): number;
    setPos(element: any, caretPos: number): void;
    countNeedle(stack: string, needle: string): number;
    isCountOdd(stack: string, needle: string): boolean;
    isUnbalanced(stack: string, start: string, end: string): boolean;
    contains(phrase: string, sub: string): boolean;
    clean(e: string): boolean;
    getStartOfList(s: string): number;
    getEndOfList(s: string): number;
    getListContent(left: string, listStart: number, right: string): string;
    getValuesOfList(s: string): string[];
    getNeedleFromList(s: string): string;
    getComplexParts(s: string, n: number): IParts;
    splitField(s: string): IFieldParts;
    getParts(s: string): IParts;
    parseGrammarError(left: string, error: IGqlSyntaxError): IDdItem[];
    parseList(left: string, right: string): { parts: IParts; listValues: string[] };
    ajaxList(parts: IParts, listValues: string[]): ng.IPromise<IDdItem[]>;
    parseQuoted(left: string): IParts;
    ajaxQuoted(parts: IParts): ng.IPromise<IDdItem[]>;
    ajaxRequest(field: string): ng.IPromise<IDdItem[]>;
    lhsRewrite(left: string, needleLength: number): string;
    rhsRewrite(left: string): string;
    rhsRewriteQuoted(left: string): string;
    rhsRewriteList(left: string): string;
    isQuoted(s: string | number): boolean;
    humanError(s: string, e: IGqlSyntaxError): string;
  }

  interface ITokens {
    EQ: string;
    NE: string;
    EXCLUDE: string;
    IN: string;
    AND: string;
    OR: string;
    IS: string;
    NOT: string;
    GT: string;
    GTE: string;
    LT: string;
    LTE: string;  
    MISSING: string;
    LBRACKET: string;
    RBRACKET: string;
    LPARENS: string;
    RPARENS: string;
    QUOTE: string;
    SPACE: string;
    COMMA: string;
    NOTHING: string;
    PERIOD: string;
  }
  
  interface IGqlFilters {
    op: string;
    content: IGqlFilters[]
  }

  interface IGqlResult {
    filters: IGqlFilters;
  }

  interface IGqlSyntaxErrorLocationValues {
    offset: number;
    line: number;
    column: number;  
  }
  
  interface IGqlSyntaxErrorLocation {
    start: IGqlSyntaxErrorLocationValues;
    end: IGqlSyntaxErrorLocationValues;  
  }
  
  interface IGqlSyntaxError {
    expected: IGqlExpected[];
    found: string;
    message: string;
    name: string;
    location: IGqlSyntaxErrorLocation
    human?: string;
  }

  interface IGqlExpected {
    description?: string;
    value?: string;
    type?: string;
    doc_type?: string;
    icon?: string;
    active?: boolean;
    text: string;
  }

  interface IDdItem {
    field: string | number;
    full: string | number;
    description?: string;
    type?: string;
    active?: boolean;
  }

  interface IGqlScope extends ng.IScope {
    offset: number;
    limit: number;
    mouseIn(idx: number): void; 
    mode: Mode;
    parts: IParts;
    mapping: IDdItem[];
    active: number;
    onChange(): void;
    left: string;
    right: string;
    query: string;
    error: IGqlSyntaxError;
    ddItems: IDdItem[];
    gql: IGqlResult;
    setActive(active: number): void;
    cycle(val: Cycle): void;
    showResults(): boolean;
    enter(item?: IDdItem): void;
    keypress(e: KeyboardEvent): void;
    focused: boolean;
    focus(): void;
    click(item: IDdItem): void;
    handleOnClickUpArrow(): void;
    handleOnClickDownArrow(): void;
  }
}
