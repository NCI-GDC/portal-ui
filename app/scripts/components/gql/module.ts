module ngApp.components.gql {
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IFacet = ngApp.core.models.IFacet;
  import IBucket = ngApp.core.models.IBucket;

  enum KeyCode { Space = 32, Enter = 13, Esc = 27, Up = 38, Down = 40 }
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
    ) {    }
    
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
      return (e !== undefined) && ['[A-Za-z0-9\\-_.]', '[0-9]', '[ \\t\\r\\n]', this.GqlTokens.QUOTE, this.GqlTokens.LPARENS].indexOf(e) == -1;
    }
    
    getStartOfList(s: string): number {
      return s.lastIndexOf(this.GqlTokens.LBRACKET) + 1;
    }
    
    getEndOfList(s: string): number {
      return s.indexOf(this.GqlTokens.RBRACKET) !== -1 ? s.indexOf(this.GqlTokens.RBRACKET) : s.length;
    }
    
    getValuesOfList(s:string): string[] {
      return _.map(s.split(this.GqlTokens.COMMA), (x) => x.trim().split(this.GqlTokens.QUOTE).join(this.GqlTokens.NOTHING));
    }
    
    getNeedleFromList(s:string): string {
      return _.last(this.getValuesOfList(s))
                .trim()
                .replace(this.GqlTokens.QUOTE, this.GqlTokens.NOTHING)
                .replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING);
    }
    
    getParts(s: string): IParts {
      var parts = s.split(this.GqlTokens.SPACE);
      var needle = parts[parts.length - 1];
      var op = parts[parts.length - 2];
      var field = parts[parts.length - 3];
      if (field) {
        field = field.replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING); 
      }
      
      return {
        needle: needle,
        op: op,
        field: field
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
    
    parseGrammarError(left: string, error: IGqlSyntaxError): IDdItem[] {
      // Handles GQL Parser errors
      var parts = left.split(this.GqlTokens.SPACE);
      var needle = parts[parts.length - 1];

      return _.map(_.filter(error.expected, (e) => {
        return this.contains(e.value, needle) && this.clean(e.value);
      }), (m) => {
        return {
          field: m.value,
          full: m.value
        };
      });
    }
    
    parseList(left: string, right: string): ng.IPromise<IDdItem[]> {
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
      // Get the end of the list
      var listEnd = this.getEndOfList(right)
      // Get the values of the list
      var listContent = left.substring(listStart) + right.substring(listEnd);
      // Get array of list values
      var listValues = this.getValuesOfList(listContent); 
      // Get all the fields needed for Ajax
      var parts = this.getComplexParts(left, listStart);
      
      // Autocomplete suggestions
      return this.ajaxRequest(parts.field).then((d) => {
        return _.take(_.filter(d, (m) => {
          // Filter out values that are already in the list
          return listValues.indexOf(m.field) === -1 && 
            this.contains(m.full, parts.needle) && 
            this.clean(m.full);
        }), 10)
      });
    }
    
    parseQuoted(left: string): ng.IPromise<IDdItem[]> {
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
      var parts = this.getComplexParts(left, lastQuote);
      
      // Autocomplete suggestions
      return this.ajaxRequest(parts.field).then((d)=> {
        return _.take(_.filter(d, (m) => {
          return this.contains(m.full, parts.needle) &&
          this.clean(m.full);
        }), 10);
      });
    }
    
     lhsTokenField(left: string): number {
      // Fields can happen after a space ' ' or a paren '('
      var lLastSpace = left.lastIndexOf(this.GqlTokens.SPACE);
      var lLastParen = left.lastIndexOf(this.GqlTokens.LPARENS);
      return lLastSpace > lLastParen ? lLastSpace : lLastParen;
    }
    
    lhsRewrite(left: string, mode: Mode): string {
      var lLastToken: number = mode === Mode.Field ?
         this.lhsTokenField(left) :
         left.lastIndexOf(this.GqlTokens.SPACE);
      return left.substring(0, lLastToken + 1);
    }
    
    rhsRewrite(right: string): string {
      var rFirstSpace = right.indexOf(this.GqlTokens.SPACE);
      var tokenIndex = rFirstSpace === -1 ? right.length : rFirstSpace;
      return right.substring(tokenIndex);
    }
    
    lhsRewriteQuoted(left: string): string {
      var lLastQuote = left.lastIndexOf(this.GqlTokens.QUOTE);
      return left.substring(0, lLastQuote);
    }
    
    rhsRewriteQuoted(right: string): string {
      var rFirstSpace = right.search(/[a-z]"/i);
      return right.substring(rFirstSpace + 2);
    }
    
    lhsRewriteList(left: string): string {
      var lLastBracket = left.lastIndexOf(this.GqlTokens.LBRACKET);
      var lLastComma = left.lastIndexOf(this.GqlTokens.COMMA);
      var lLastToken = lLastComma > lLastBracket ? lLastComma : lLastBracket;
      return left.substring(0, lLastToken + 1);
    }
    
    rhsRewriteList(right: string): string {
      var rFirstBracket = right.indexOf(this.GqlTokens.RBRACKET);
      var rFirstComma = right.indexOf(this.GqlTokens.COMMA);
      var rFirstToken = rFirstComma < rFirstBracket ? rFirstComma : rFirstBracket;
      return right.substring(rFirstToken);
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
        var mapping;
        ds.get('_mapping', {}).then(m => mapping = m);
              
        $scope.active = INACTIVE;
        
        $scope.onChange = function() {
          gqlParse();
          var index = GqlService.getPos(element[0]);
          $scope.left = $scope.query.substring(0, index);
          $scope.right = $scope.query.substring(index);
          var left = $scope.left;
          var right = $scope.right;
	        
          if ($scope.Error && _.some($scope.Error.expected, (e): boolean => {
                return [T.IN, T.AND].indexOf(e.value.toString()) !== -1;
              })) {
            $scope.mode = Mode.Op;
  	        
            $scope.ddItems = GqlService.parseGrammarError(left, $scope.Error)
          } else if ($scope.Error && _.some($scope.Error.expected, (e): boolean => {
                return [T.MISSING].indexOf(e.value.toString()) !== -1;
              })) {
            $scope.mode = Mode.Unquoted;
  	        
            $scope.ddItems = GqlService.parseGrammarError(left, $scope.Error)
          } else {
            if (GqlService.isUnbalanced(left, T.LBRACKET, T.RBRACKET)) {
              // in_list_of_values
              $scope.mode = Mode.List;
              GqlService.parseList(left, right).then((d) => {
                $scope.ddItems = d;
              });
            } else if (GqlService.isCountOdd(left, T.QUOTE)) {
              //in_quoted_string
              $scope.mode = Mode.Quoted;
              GqlService.parseQuoted(left).then((d) => {
                $scope.ddItems = d;
              });
            } else {
              var parts = GqlService.getParts(left);
              
              if ((parts.needle && !parts.op) || [T.AND, T.OR].indexOf(parts.op) !== -1) { 
                // is_field_string
                $scope.mode = Mode.Field;
                
                $scope.ddItems = _.take(_.filter(mapping, (m: IDdItem) => {
                  return GqlService.contains(m.full, parts.needle.replace(T.LPARENS, T.NOTHING)) && GqlService.clean(m.full);
                }), 10);
              } else if ([T.EQ, T.NE].indexOf(parts.op) !== -1) { 
                // is_value_string is_unquoted_string
                $scope.mode = Mode.Unquoted;

                GqlService.ajaxRequest(parts.field).then((d)=> {
                  $scope.ddItems = _.take(_.filter(d, (m) => {
                    return GqlService.contains(m.full, parts.needle) && GqlService.clean(m.full);
                  }), 10);
                });
              }
            }
          }
        };

        function gqlParse() {
          try {
            $scope.gql = $window.gql.parse($scope.query);
            $scope.Error = null;
          } catch (Error) {
            $scope.Error = Error;
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
            // TODO ajax for more things
            active = 0;
          } else if (active < 0) {
            active = $scope.ddItems.length - 1;
          }

          $scope.setActive(active);
        };

        $scope.showResults = function() {
          var results = $scope.ddItems ? !!$scope.ddItems.length : false;
          return !!($scope.focus && $scope.query.length > 0 && results);
        };

        $scope.keypress = function(e: KeyboardEvent): void {
          var key = e.which || e.keyCode
          
          switch (key) {
            case KeyCode.Enter:
              e.preventDefault();
              $scope.enter();
              break;
            case KeyCode.Up:
              e.preventDefault();
              $scope.cycle(Cycle.Up);
              break;
            case KeyCode.Down:
              e.preventDefault();
              $scope.cycle(Cycle.Down);
              break;
            case KeyCode.Space:
              if ($scope.mode !== Mode.Quoted) {
                $scope.ddItems = [];
                gqlParse();
              }
              break;
            case KeyCode.Esc:
              clearActive();
              break;
          
            default:
              $scope.onChange();
              break;
          }
        }

        function clearActive() {
          if ($scope.ddItems[$scope.active])
            $scope.ddItems[$scope.active].active = false;
          $scope.ddItems = [];
          $scope.active = INACTIVE;
          $scope.focus = false;
        }

        $scope.enter = function(item: IDdItem): void {
          item = item || $scope.ddItems[$scope.active];

          // Quote the value if it has a space so the parse can handle it  
          if (item.full.indexOf(T.SPACE) !== -1) item.full = T.QUOTE + item.full + T.QUOTE;
          
          // After selecting a value close the autocomplete
          clearActive();

          var left = $scope.left;
          var right = $scope.right;

          if ([Mode.Field, Mode.Op, Mode.Unquoted].indexOf($scope.mode) !== -1) {
            var newLeft = GqlService.lhsRewrite(left, $scope.mode);
            var newRight = GqlService.rhsRewrite(right);
      
            $scope.query = newLeft + item.full + newRight;
            GqlService.setPos(element[0], (newLeft + item.full).length);
          } else if ($scope.mode === Mode.Quoted) {
            var newLeft = GqlService.lhsRewriteQuoted(left);
            var newRight = GqlService.rhsRewriteQuoted(right);

            $scope.query = newLeft + item.full + newRight;
            GqlService.setPos(element[0], (newLeft + item.full).length);
          } else if ($scope.mode === Mode.List) {
            var newLeft = GqlService.lhsRewriteList(left);
            var newRight = GqlService.rhsRewriteList(right);
      
            $scope.query = newLeft + item.full + newRight;
            GqlService.setPos(element[0], (newLeft + item.full).length);
          }
          gqlParse();
        };

        function blur() {
          $scope.focus = false;
        }

        gqlParse();

        $scope.$on('application:click', blur);

        element.after($compile('<gql-dropdown></gql-dropdown>')($scope));
      }
    };
  }

  /* @ngInject */
  function gqlDropdown(): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: "components/gql/templates/gql_dropdown.html",
      link: function ($scope: IGqlScope) {
        $scope.click = function (item) {
          $scope.enter(item)
        };
      }
    };
  }
  
  var Tokens: ITokens = {
      EQ: "=",
      NE: "!=",
      IN: "in",
      OR: "or",
      AND: "and",
      LBRACKET: '[',
      RBRACKET: ']',
      LPARENS: '(',
      RPARENS: ')',
      QUOTE: '"',
      SPACE: ' ',
      COMMA: ',',
      NOTHING: '',
      PERIOD: '.',
      MISSING: "missing"
    }
    
  angular.module("components.gql", [])
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
    getValuesOfList(s: string): string[];
    getNeedleFromList(s: string): string;
    getComplexParts(s: string, n: number): IParts;
    splitField(s: string): IFieldParts;
    getParts(s: string): IParts;
    parseGrammarError(left: string, error: IGqlSyntaxError): IDdItem[];
    parseList(left: string, right: string): ng.IPromise<IDdItem[]>;
    parseQuoted(left: string): ng.IPromise<IDdItem[]>;
    ajaxRequest(field: string): ng.IPromise<IDdItem[]>;
    lhsRewrite(left: string, mode: Mode): string;
    rhsRewrite(left: string): string;
    lhsTokenField(left: string): number;
    lhsRewriteQuoted(left: string): string;
    lhsRewriteList(left: string): string;
    rhsRewriteQuoted(left: string): string;
    rhsRewriteList(left: string): string;
  }

  interface ITokens {
    EQ: string;
    NE: string;
    IN: string;
    AND: string;
    OR: string;
    LBRACKET: string;
    RBRACKET: string;
    LPARENS: string;
    RPARENS: string;
    QUOTE: string;
    SPACE: string;
    COMMA: string;
    NOTHING: string;
    PERIOD: string;
    MISSING: string;
  }
  
  interface IGqlFilters {
    op: string;
    content: IGqlFilters[]
  }

  interface IGqlResult {
    filters: IGqlFilters;
  }

  interface IGqlSyntaxError {
    column: number;
    expected: IGqlExpected[];
    found: string;
    line: number;
    message: string;
    name: string;
    offset: number;
  }

  interface IGqlExpected {
    description?: string;
    type?: string;
    value: string;
    icon?: string;
    active?: boolean;
    text: string;
  }

  interface IDdItem {
    field: string;
    full: string;
    active?: boolean;
  }

  interface IGqlScope extends ng.IScope {
    mode: Mode;
    mapping: IDdItem[];
    active: number;
    onChange(): void;
    left: string;
    right: string;
    query: string;
    Error: IGqlSyntaxError;
    ddItems: IDdItem[];
    gql: IGqlResult;
    setActive(active: number): void;
    cycle(val: Cycle): void;
    showResults(): void;
    enter(item?: IDdItem): void;
    keypress(e: KeyboardEvent): void;
    focus: boolean;
    click(item: IDdItem): void;
  }
}
