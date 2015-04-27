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
  import IGDCWindowService = ngApp.models.IGDCWindowService;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;

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
    mode: string;
    active: number;
    onChange(): void;
    left: string;
    right: string;
    query: string;
    Error: IGqlSyntaxError;
    ddItems: IDdItem[];
    gql: IGqlResult;
    setActive(active: number): void;
    cycle(val: number): void;
    showResults(): void;
    enter(item?: any): void;
    keypress(e: any): void;
    focus: boolean;
  }

  /* @ngInject */
  function gqlInput($window: IGDCWindowService,
                    $compile: ng.ICompileService,
                    $timeout: ng.ITimeoutService,
                    Restangular: restangular.IService,
                    FilesService: IFilesService,
                    ParticipantsService: IParticipantsService): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        gql: '=',
        query: '=',
        error: '='
      },
      templateUrl: "components/gql/templates/gql.html",
      link: function ($scope: IGqlScope, element: any) {
        var ds = Restangular.all("gql");
        var mapping;
        ds.get('_mapping', {}).then((m) => {
          mapping = m;
        });

        var INACTIVE = -1;
        $scope.active = INACTIVE;

        function getPos(element) {
          if ('selectionStart' in element) {
            return element.selectionStart;
          } else if (document.selection) {
            element.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -element.value.length);
            return sel.text.length - selLen;
          }
        }

        function setPos(element, caretPos) {
          if (element.createTextRange) {
            var range = element.createTextRange();
            range.move('character', caretPos);
            range.select();
          } else {
            element.focus();
            if (element.selectionStart !== undefined) {
              $timeout(() => element.setSelectionRange(caretPos, caretPos));
            }
          }
        }

        function countNeedle(stack: string, needle: string) {
          // http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript
          return stack.split(needle).length - 1
        }

        function isCountOdd(stack: string, needle: string): boolean {
          return countNeedle(stack, needle) % 2 !== 0;
        }

        function unbalanced(stack: string, start: string, end: string) {
          var numStart = countNeedle(stack, start);
          var numEnd = countNeedle(stack, end);
          return numStart > numEnd;
        }

        $scope.mode = "";

        $scope.onChange = () => {
          gqlParse();
          var index = getPos(element[0]);
          $scope.left = $scope.query.substring(0, index);
          $scope.right = $scope.query.substring(index);

          var OB = '[';
          var CB = ']';
          var QUOTE = '"';
          var SPACE = ' ';

          if ($scope.Error && _.some($scope.Error.expected, (e: IGqlExpected): boolean => {
                return ["in", "and"].indexOf(e.value.toString()) !== -1;
              })) {
            $scope.mode = "op";

            var parts = $scope.left.split(' ');
            var needle = parts[parts.length - 1];

            $scope.ddItems = _.map(_.filter($scope.Error.expected, (e) => {
              return contains(e.value, needle) && clean(e.value);
            }), (m) => {
              return {
                field: m.value,
                full: m.value
              };
            });

          } else {

            // in_list_of_values
            if (unbalanced($scope.left, OB, CB)) {
              $scope.mode = "list";

              var ls = $scope.left.lastIndexOf(OB) + 1;
              var le = $scope.right.indexOf(CB) !== -1 ? $scope.right.indexOf(CB) : $scope.right.length;

              var vsFromStart = $scope.left.substring(ls);
              var vsFromEnd = $scope.right.substring(0, le);

              var vss = vsFromStart.split(",");

              var needle = vss[vss.length - 1];

              var values = _.map((vsFromStart + vsFromEnd).split(','), (x) => {
                return x.trim();
              });

              var newLeft = $scope.left.substring(0, ls);

              var parts = _.filter(newLeft.split(SPACE), (x) => {
                return x;
              });
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];

              ajaxRequest(field.replace("(", "")).then((d)=> {
                $scope.ddItems = _.take(_.filter(d, (m) => {
                  console.log(values);
                  console.log(m);
                  console.log(values.indexOf(m));
                  return values.indexOf(m.field) === -1 && contains(m.full, needle.trim().replace('"', "")) && clean(m.full);
                }), 10);
              });
            } else if (isCountOdd($scope.left, QUOTE)) { //in_quoted_string
              $scope.mode = "quoted";
              var lastQuote = $scope.left.lastIndexOf('"');
              var newLeft = $scope.left.substring(0, lastQuote);
              var needle = $scope.left.substring(lastQuote + 1);

              var parts = newLeft.split(' ');
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];

              ajaxRequest(field.replace("(", "")).then((d)=> {
                $scope.ddItems = _.take(_.filter(d, (m) => {
                  return contains(m.full, needle) && clean(m.full);
                }), 10);
              });
            } else {
              var parts = $scope.left.split(' ');
              var needle = parts[parts.length - 1];
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];

              if (parts.length === 1 || ["and", "or"].indexOf(op) !== -1) { // is_field_string
                $scope.mode = "field";
                $scope.ddItems = _.take(_.filter(mapping, (m) => {
                  return contains(m.full, needle.replace("(", "")) && clean(m.full);
                }), 10);
              } else if (["=", "!="].indexOf(op) !== -1) { // is_value_string
                $scope.mode = "unquoted";

                ajaxRequest(field.replace("(", "")).then((d)=> {
                  $scope.ddItems = _.take(_.filter(d, (m) => {
                    return contains(m.full, needle) && clean(m.full);
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

        function contains(phrase: string, sub: string): boolean {
          if (sub.length === 0) return true;
          var phraseStr = (phrase + "").toLowerCase();
          return phraseStr.indexOf((sub + "").toLowerCase()) > -1;
        }

        function clean(e: string): boolean {
          return (e !== undefined) && ['[A-Za-z0-9\\-_.]', '[0-9]', '[ \\t\\r\\n]', '"', '('].indexOf(e) == -1;
        }

        function ajaxRequest(field: string): ng.IPromise {
          var xs = field.split(".");
          var doc_type = xs.shift();
          var facet = xs.join(".");

          if (doc_type == "files") {
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

        $scope.setActive = (active: number) => {
          if ($scope.active >= 0) $scope.ddItems[$scope.active].active = false;
          $scope.ddItems[active].active = true;
          $scope.active = active;
        };

        $scope.cycle = (val: number) => {
          $scope.showResults();

          var active = $scope.active + val;

          if (active >= $scope.ddItems.length) {
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

        $scope.keypress = (e: any) => {
          if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            $scope.enter();
          } else if (e.which === 27 || e.keyCode === 27) {
            clearActive();
          } else if (e.which === 32 || e.keyCode === 32) {
            if ($scope.mode !== "quoted") $scope.ddItems = [];
          } else if (e.which === 38 || e.keyCode === 38) {
            e.preventDefault();
            $scope.cycle(-1);
          } else if (e.which === 40 || e.keyCode === 40) {
            e.preventDefault();
            $scope.cycle(1);
          }
        };

        function clearActive() {
          if ($scope.ddItems[$scope.active])
            $scope.ddItems[$scope.active].active = false;
          $scope.ddItems = [];
          $scope.active = INACTIVE;
          $scope.focus = false;
        }

        $scope.enter = (item: any): void => {
          item = item || $scope.ddItems[$scope.active];

          if (item.full.indexOf(" ") !== -1) item.full = '"' + item.full + '"';
          clearActive();

          var left = $scope.left;
          var right = $scope.right;

          if (["field", "op", "unquoted"].indexOf($scope.mode) !== -1) {
            var lLastToken;
            if ($scope.mode === "field") {
              var lLastSpace = left.lastIndexOf(' ');
              var lLastParen = left.lastIndexOf('(');
              lLastToken = lLastSpace > lLastParen ? lLastSpace : lLastParen;
            }
            else lLastToken = left.lastIndexOf(' ');
            var newLeft = left.substring(0, lLastToken + 1);

            var rFirstSpace = right.indexOf(' ');
            var newRight = right.substring(rFirstSpace);

            $scope.query = newLeft + item.full + newRight;
            setPos(element[0], (newLeft + item.full).length);
          } else if (["quoted"].indexOf($scope.mode) !== -1) {
            var lLastQuote = left.lastIndexOf('"');
            var newLeft = left.substring(0, lLastQuote);

            var rFirstSpace = right.search(/[a-z]"/i);
            var newRight = right.substring(rFirstSpace + 2);

            $scope.query = newLeft + item.full + newRight;
            setPos(element[0], (newLeft + item.full).length);
          } else if (["list"].indexOf($scope.mode) !== -1) {
            var lLastBracket = left.lastIndexOf('[');
            var lLastComma = left.lastIndexOf(',');
            var lLastToken = lLastComma > lLastBracket ? lLastComma : lLastBracket;
            var newLeft = left.substring(0, lLastToken + 1);

            var rFirstBracket = right.indexOf(']');
            var rFirstComma = right.indexOf(',');
            var rFirstToken = rFirstComma < rFirstBracket ? rFirstComma : rFirstBracket;
            var newRight = right.substring(rFirstToken);

            $scope.query = newLeft + item.full + newRight;
            setPos(element[0], (newLeft + item.full).length);
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
      link: function ($scope) {
        $scope.click = function (item) {
          $scope.enter(item)
        };
      }
    };
  }

  angular.module("gql.directives", [])
      .directive("gql", gqlInput)
      .directive("gqlDropdown", gqlDropdown);
}


