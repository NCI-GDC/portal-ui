// FIXME kind of getting out of hand

/*
 Behaviours Requirements

 - Autocomplete fields names
 - Autocomplete operators
 - Autocomplete values
 - TODO Autocomplete Ids

 - Autocomplete values in array [..., ..., …]
 - Handle autocomplete while inside parens

 - TODO Make available all autocomplete results, limit view, offer scrolling

 - Position aware autocomplete when editing query
 - Autocomplete when modifying values
 - Autocomplete when modifying fields

 - TODO Give feedback on Errors

 - TODO Field type aware operator suggestions - eg. only offer < > for numeric/date types

 - Handle keyboard actions (arrow keys, TODO enter to submit, ...)
 */

module ngApp.components.gql.directives {
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;
  import IGqlService = ngApp.components.gql.services.IGqlService;

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
    mode: ParseMode;
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
    enter(item?: any): void;
    keypress(e: any): void;
    focus: boolean;
  }

  

  enum KeyCode { Space = 32, Enter = 13, Esc = 27, Up = 38, Down = 40 }
  enum ParseMode { Field, Quoted, Unquoted, List, Op }
  enum Cycle { Up = -1, Down = 1 }

  /* @ngInject */
  function gqlInput($window: IGDCWindowService,
                    $document: ng.IDocumentService,
                    $compile: ng.ICompileService,
                    $timeout: ng.ITimeoutService,
                    Restangular: restangular.IService,
                    FilesService: IFilesService,
                    ParticipantsService: IParticipantsService,
                    GqlService: IGqlService): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        gql: '=',
        query: '=',
        error: '='
      },
      templateUrl: "components/gql/templates/gql.html",
      link: function ($scope: IGqlScope, element: Node) {
        "use strict";
        
        const INACTIVE = -1;
        const TOKENS = GqlService.tokens;
        const ds = Restangular.all("gql");
        let mapping;
        ds.get('_mapping', {}).then(m => mapping = m);
        
        $scope.active = INACTIVE;

        $scope.onChange = () => {

          gqlParse();
          const index = GqlService.getPos(element[0]);
          $scope.left = $scope.query.substring(0, index);
          $scope.right = $scope.query.substring(index);

          if ($scope.Error && _.some($scope.Error.expected, (e: IGqlExpected): boolean => {
                return [TOKENS.IN, TOKENS.AND].indexOf(e.value.toString()) !== -1;
              })) {
            $scope.mode = ParseMode.Op;

            var parts = $scope.left.split(TOKENS.SPACE);
            var needle = parts[parts.length - 1];

            $scope.ddItems = _.map(_.filter($scope.Error.expected, (e) => {
              return GqlService.contains(e.value, needle) && GqlService.clean(e.value);
            }), (m) => {
              return {
                field: m.value,
                full: m.value
              };
            });

          } else {

            // in_list_of_values
            if (GqlService.unbalanced($scope.left, TOKENS.LBRACKET, TOKENS.RBRACKET)) {
              $scope.mode = ParseMode.List;

              var ls = $scope.left.lastIndexOf(TOKENS.LBRACKET) + 1;
              var le = $scope.right.indexOf(TOKENS.RBRACKET) !== -1 ? $scope.right.indexOf(TOKENS.RBRACKET) : $scope.right.length;

              var vsFromStart = $scope.left.substring(ls);
              var vsFromEnd = $scope.right.substring(0, le);

              var vss = vsFromStart.split(TOKENS.COMMA);

              var needle = vss[vss.length - 1];

              var values = _.map((vsFromStart + vsFromEnd).split(TOKENS.COMMA), (x) => {
                return x.trim();
              });

              var newLeft = $scope.left.substring(0, ls);

              var parts = _.filter(newLeft.split(TOKENS.SPACE), (x) => {
                return x;
              });
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];

              ajaxRequest(field.replace(TOKENS.LPARENS, TOKENS.NOTHING)).then((d)=> {
                $scope.ddItems = _.take(_.filter(d, (m) => {
                  console.log(values);
                  console.log(m);
                  console.log(values.indexOf(m));
                  return values.indexOf(m.field) === -1 && 
                    GqlService.contains(m.full, needle.trim().replace(TOKENS.QUOTE, TOKENS.NOTHING)) && 
                    GqlService.clean(m.full);
                }), 10);
              });
            } else if (GqlService.isCountOdd($scope.left, TOKENS.QUOTE)) { //in_quoted_string
              $scope.mode = ParseMode.Quoted;
              var lastQuote = $scope.left.lastIndexOf(TOKENS.QUOTE);
              var newLeft = $scope.left.substring(0, lastQuote);
              var needle = $scope.left.substring(lastQuote + 1);

              var parts = newLeft.split(TOKENS.SPACE);
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];

              ajaxRequest(field.replace(TOKENS.LPARENS, TOKENS.NOTHING)).then((d)=> {
                $scope.ddItems = _.take(_.filter(d, (m) => {
                  return GqlService.contains(m.full, needle) && GqlService.clean(m.full);
                }), 10);
              });
            } else {
              var parts = $scope.left.split(TOKENS.SPACE);
              var needle = parts[parts.length - 1];
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];

              if (parts.length === 1 || [TOKENS.AND, TOKENS.OR].indexOf(op) !== -1) { // is_field_string
                $scope.mode = ParseMode.Field;
                $scope.ddItems = _.take(_.filter(mapping, (m) => {
                  return GqlService.contains(m.full, needle.replace(TOKENS.LPARENS, TOKENS.NOTHING)) && GqlService.clean(m.full);
                }), 10);
              } else if ([TOKENS.EQ, TOKENS.NE].indexOf(op) !== -1) { // is_value_string
                $scope.mode = ParseMode.Unquoted;

                ajaxRequest(field.replace(TOKENS.LPARENS, TOKENS.NOTHING)).then((d)=> {
                  $scope.ddItems = _.take(_.filter(d, (m) => {
                    return GqlService.contains(m.full, needle) && GqlService.clean(m.full);
                  }), 10);
                });
              } else {
                console.log('else:', $scope.Error);
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

        

        function ajaxRequest(field: string): ng.IPromise {
          var xs = field.split(TOKENS.PERIOD);
          var doc_type = xs.shift();
          var facet = xs.join(TOKENS.PERIOD);

          if (doc_type === "files") {
            return FilesService.getFiles({
              facets: [facet],
              size: 0,
              filters: {}
            }).then((fs: IFiles): any[] => {
              return _.map(fs.aggregations[facet].buckets, (b) => {
                return {field: b.key, full: b.key};
              });
            });
          } else {
            return ParticipantsService.getParticipants({
              facets: [facet],
              size: 0,
              filters: {}
            }).then((fs: IParticipants): any[] => {
              return _.map(fs.aggregations[facet].buckets, (b) => {
                return {field: b.key, full: b.key};
              });
            });
          }
        }

        $scope.setActive = (active: number): void => {
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

        $scope.showResults = () => {
          var results = $scope.ddItems ? !!$scope.ddItems.length : false;
          return !!($scope.focus && $scope.query.length > 0 && results);
        };

        $scope.keypress = function(e: KeyboardEvent): void {
          const key = e.which || e.keyCode
          
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
              if ($scope.mode !== ParseMode.Quoted) {
                $scope.ddItems = [];
                $scope.onChange();
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

        $scope.enter = (item: any): void => {
          item = item || $scope.ddItems[$scope.active];

          if (item.full.indexOf(TOKENS.SPACE) !== -1) item.full = TOKENS.QUOTE + item.full + TOKENS.QUOTE;
          clearActive();

          var left = $scope.left;
          var right = $scope.right;

          if ([ParseMode.Field, 
               ParseMode.Op, 
               ParseMode.Unquoted].indexOf($scope.mode) !== -1) {
            var lLastToken: number;
            if ($scope.mode === ParseMode.Field) {
              var lLastSpace = left.lastIndexOf(TOKENS.SPACE);
              var lLastParen = left.lastIndexOf(TOKENS.LPARENS);
              lLastToken = lLastSpace > lLastParen ? lLastSpace : lLastParen;
            }
            else lLastToken = left.lastIndexOf(TOKENS.SPACE);
            var newLeft = left.substring(0, lLastToken + 1);

            var rFirstSpace = right.indexOf(TOKENS.SPACE);
            var newRight = right.substring(rFirstSpace);

            $scope.query = newLeft + item.full + newRight;
            GqlService.setPos(element[0], (newLeft + item.full).length);
          } else if ($scope.mode === ParseMode.Quoted) {
            var lLastQuote = left.lastIndexOf(TOKENS.QUOTE);
            var newLeft = left.substring(0, lLastQuote);

            var rFirstSpace = right.search(/[a-z]"/i);
            var newRight = right.substring(rFirstSpace + 2);

            $scope.query = newLeft + item.full + newRight;
            GqlService.setPos(element[0], (newLeft + item.full).length);
          } else if ($scope.mode === ParseMode.List) {
            var lLastBracket = left.lastIndexOf(TOKENS.LBRACKET);
            var lLastComma = left.lastIndexOf(TOKENS.COMMA);
            var lLastToken = lLastComma > lLastBracket ? lLastComma : lLastBracket;
            var newLeft = left.substring(0, lLastToken + 1);

            var rFirstBracket = right.indexOf(TOKENS.RBRACKET);
            var rFirstComma = right.indexOf(TOKENS.COMMA);
            var rFirstToken = rFirstComma < rFirstBracket ? rFirstComma : rFirstBracket;
            var newRight = right.substring(rFirstToken);

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
      link: function ($scope: ng.IScope) {
        $scope.click = function (item) {
          $scope.enter(item)
        };
      }
    };
  }

  angular.module("gql.directives", ["gql.services"])
      .directive("gql", gqlInput)
      .directive("gqlDropdown", gqlDropdown);
}


