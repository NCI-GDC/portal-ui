// FIXME kind of getting out of hand

/*
 Behaviours Requirements

 - Autocomplete fields names
 - Autocomplete operators
 - Autocomplete values
 - Autocomplete Ids

 - Autocomplete values in array [..., ..., …]
 - Handle autocomplete while inside parens

 - Make available all autocomplete results, limit view, offer scrolling

 - Position aware autocomplete when editing query
 - Autocomplete when modifying values
 - Autocomplete when modifying fields

 - Give feedback on Errors

 - Field type aware operator suggestions - eg. only offer < > for numeric/date types

 - Handle keyboard actions (arrow keys, enter to submit, ...)
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

  interface IGqlScope extends ng.IScope {
    onChange(): void;
    clearActive(): void;
    setActive(active: number);
    showResults();
    cycle(val: number);
    keypress(e: any);
    caret(input: any, offset: number);
    enter(item: any);
    gql: IGqlResult;
    query: string;
    Error: IGqlSyntaxError;
    errors: IGqlExpected[];
    totalErrors: IGqlExpected[];
    ajax: boolean;
    term: string;
    focus: boolean;
    active: number;
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
        var mapping, mapping_names;
        ds.get('_mapping', {}).then((m) => {
          mapping = m;
        });

        var inactive = -1;

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
            console.log(1);
            var range = element.createTextRange();
            range.move('character', caretPos);
            range.select();
          } else {
            console.log(2);
            element.focus();
            if (element.selectionStart !== undefined) {
              console.log(3);
              //element.focus();
              $timeout(() => element.setSelectionRange(caretPos, caretPos));
            }
          }
        }

        //$scope.keypress = (event) => {
        //  var index = getPos(element[0]);
        //  console.log($scope.query.substring(0, index));
        //  console.log($scope.query.substring(index));
        //};

        function countNeedle(stack: string, needle: string) {
          return stack.split(needle).length - 1
        }

        function isCountOdd(stack: string, needle: string): boolean {
          return countNeedle(stack, needle) % 2 !== 0;
        }

        function unbalanced(stack: string, start: string, end: string) {
          // http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript
          var numStart = countNeedle(stack, start);
          var numEnd = countNeedle(stack, end);
          return numStart > numEnd;
        }

        //$scope.is_field_string = false;
        //$scope.is_value_string = false;
        //$scope.in_quoted_string = false;
        //$scope.in_list_of_values = false;
        //$scope.in_op_mode = false;

        $scope.mode = "";

        $scope.onChange = () => {
          gqlParse();

          var index = getPos(element[0]);
          var left = $scope.query.substring(0, index);
          var right = $scope.query.substring(index);

          if ($scope.Error && _.some($scope.Error.expected, (e: IGqlExpected): boolean => {
                return ["in", "and"].indexOf(e.value.toString()) !== -1;
              })) {
            $scope.mode = "op";

            var parts = left.split(' ');
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

            var ob = '[';
            var cb = ']';
            var quote = '"';
            var space = ' ';

            if ($scope.in_list_of_values = unbalanced(left, ob, cb)) {
              $scope.mode = "list";

              var ls = left.lastIndexOf(ob) + 1;
              var le = right.indexOf(cb) !== -1 ? right.indexOf(cb) : right.length;
              var vsFromStart = left.substring(ls);
              var vsFromEnd = right.substring(0, le);
              var values = _.map((vsFromStart + vsFromEnd).split(','), (x) => {
                return x.trim();
              });
              var newLeft = left.substring(0, ls);
              var parts = _.filter(newLeft.split(space), (x) => {
                return x;
              });
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];
            }

            else if ($scope.in_quoted_string = isCountOdd(left, quote)) {
              $scope.mode = "quoted";
              console.log($scope.mode);
            } else {
              var parts = left.split(' ');
              var needle = parts[parts.length - 1];
              var op = parts[parts.length - 2];
              var field = parts[parts.length - 3];

              if ($scope.is_value_string = ["=", "!="].indexOf(op) !== -1) {
                $scope.mode = "unquoted";
                console.log("in value: ", needle);
                console.log("op: ", op);
                console.log("field: ", field);

                ajaxRequest(field.replace("(", "")).then((d)=>{
                  $scope.ddItems = _.take(_.filter(d, (m) => {
                    return contains(m.full, needle) && clean(m.full);
                  }), 10);
                });
              }

              else if ($scope.is_field_string = parts.length === 1 || ["and", "or"].indexOf(op) !== -1) {
                $scope.mode = "field";
                console.log("left: ", left);
                console.log("right: ", right);
                console.log("needle: ", needle);
                console.log("op: ", op);
                console.log("field: ", field);

                $scope.ddItems = _.take(_.filter(mapping, (m) => {
                  return contains(m.full, needle.replace("(", "")) && clean(m.full);
                }), 10);
              } else {
                console.log("else");
              }
            }
          }
        };


        function gqlParse() {
          try {
            $scope.gql = $window.gql.parse($scope.query);
            $scope.Error = null;
            console.log($scope.gql);
          } catch (Error) {
            console.log(Error);
            $scope.Error = Error;
            $scope.gql = null;
          }
        }


        $scope.ajax = false;
        $scope.term = "";
        $scope.focus = false;
        $scope.active = inactive;

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

        var oldQuery = "";

        function gqlParse1() {
          try {
            if ($scope.query != oldQuery) {
              oldQuery = $scope.query;
              // setup gql
              $scope.gql = $window.gql.parse($scope.query);
              $scope.gql.filters = $scope.gql.filters || {};

              // if ajax
              // T: filter ajax response
              if ($scope.ajax) {
                var xs: string[] = $scope.query.substr($scope.Error.offset).split(" ");
                var term = xs[xs.length - 1];
                $scope.ddItems = formatForAutoComplete(_.filter($scope.totalErrors, (e) => {
                  return contains(e.value, term);
                }));
              } else {
                // F: reset errors
                $scope.totalErrors = $scope.ddItems = [];
              }
            }
          } catch (Error) {
            $scope.gql = null;
            // capture Error info
            $scope.Error = Error;
            $scope.error = Error;

            var field_mode = _.some(Error.expected, (e: IGqlExpected): boolean => {
              return ["[A-Za-z0-9\\-_.]"].indexOf(e.value.toString()) !== -1;
            });

            // determine if ajax needed
            $scope.ajax = _.some(Error.expected, (e: IGqlExpected): boolean => {
              return ['\"', ','].indexOf(e.value) !== -1;
            });

            if (field_mode) {
              $scope.totalErrors = $scope.ddItems = mapping;
              console.log($scope.ddItems);
            }
            else if ($scope.ajax) {
              var terms: string[] = [];
              var qs = splitOnOp(Error.offset);
              if (qs[qs.length - 2] === " in [") {
                terms = _.map(qs[qs.length - 1].split(','), (t) => {
                  return t.replace(/^\s+|\s+$/g, '')
                });
                var term: string = terms[terms.length - 1];
              } else {
                var term: string = qs[qs.length - 1].replace(/^\s+|\s+$/g, '');
              }
              var field: string = qs[qs.length - 3].replace(/^\s+|\s+$/g, '');

              ajaxRequest(field).then(function (es: IGqlExpected[]) {
                $scope.totalErrors = es;
                $scope.ddItems = formatForAutoComplete(_.filter($scope.totalErrors, (e) => {
                  return contains(e.value, term)
                      && (terms.indexOf(e.value) === -1 && terms.indexOf('"' + e.value + '"') === -1);
                }));
              });
            } else {
              var xs: string[] = _.filter(($scope.query.substr(Error.offset) + " ").split(
                  /(!=|=|<|>| and | or | in \[?)/
              ), (x: string): boolean => {
                return !!x.length;
              });
              var term = xs[0].replace(/^\s+|\s+$/g, '');
              $scope.totalErrors = Error.expected;
              $scope.ddItems = formatForAutoComplete(_.filter($scope.totalErrors, (e) => {
                return contains(e.value, term) && clean(e.value);
              }));
            }
          }
        }

        function splitOnOp(offset: number): string[] {
          return _.filter(($scope.query.substr(0, offset) + " ").split(
              /(!=|=|<|>| and | or | in \[?)/
          ), (x: string): boolean => {
            return !!x.length;
          });
        }

        $scope.onChange1 = () => {
          $scope.focus = true;
          gqlParse();
        };

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
          console.log('active: ', active);
          $scope.setActive(active);
        };

        $scope.showResults = () => {
          var results = $scope.ddItems ? !!$scope.ddItems.length : false;
          return !!($scope.focus && $scope.query.length > 0 && results);
        };

        $scope.keypress = (e: any) => {
          console.log('beep');
          console.log(e);
          console.log(e.which);
          console.log('boop');
          if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            console.log('here: ', e.which);
            $scope.enter();
          } else if (e.which === 27 || e.keyCode === 27) {
            $scope.ddItems = [];
            $scope.active = -1;
            $scope.focus = false;
          } else if (e.which === 32 || e.keyCode === 32) {
            console.log('here');
            if ($scope.mode !== "quoted") $scope.ddItems = [];
            //$scope.ajax = false;
          } else if (e.which === 38 || e.keyCode === 38) {
            e.preventDefault();
            $scope.cycle(-1);
          } else if (e.which === 40 || e.keyCode === 40) {
            e.preventDefault();
            $scope.cycle(1);
          }
          else {
            //gqlParse();
          }
        };

        $scope.caret = (input: any, offset: number) => {
          if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(offset, offset);
          }
          else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', offset);
            range.moveStart('character', offset);
            range.select();
          }
        };

        $scope.enter = (item: any): void => {
          item = item || $scope.ddItems[$scope.active];
          console.log(item);
          if (item.full.indexOf(" ") !== -1) item.full = '"' + item.full + '"';
          $scope.ddItems = [];
          $scope.active = -1;

          if (["field", "op", "unquoted"].indexOf($scope.mode) !== -1) {
            console.log('!!!!!!!!!!!!!!!!!');
            var index = getPos(element[0]);
            var left = $scope.query.substring(0, index);
            var right = $scope.query.substring(index);
            console.log('left: ', left);
            console.log('right: ', right);
            var lLastToken;
            if ($scope.mode === "field") {
              var lLastSpace = left.lastIndexOf(' ');
              var lLastParen = left.lastIndexOf('(');
              lLastToken = lLastSpace > lLastParen ? lLastSpace : lLastParen;
            }
            else lLastToken = left.lastIndexOf(' ');
            var newLeft = $scope.query.substring(0, lLastToken + 1);
            var rFirstSpace = right.indexOf(' ');
            var newRight = right.substring(rFirstSpace, right.length);
            console.log('Nleft: ', newLeft);
            console.log('Nright: ', newRight);
            $scope.query = newLeft + item.full + newRight;
            setPos(element[0], (newLeft + item.full).length);
            console.log('@@@@@@@@@@@@@@@@@@');
          }
        };

        $scope.enter1 = (): void => {
          $scope.ajax = false;

          var lhs = $scope.query.substr(0, $scope.Error.offset);
          var rhs_qs = _.filter(($scope.query.substr($scope.Error.offset) + " ").split(
              /(?=!=|=|<|>|\ and | or | in \[? | \])/
          ), (x: string): boolean => {
            return !!x.length;
          });

          var active = $scope.active == -1 ? 0 : $scope.active;

          if ($scope.ddItems.length) {
            var oldOffset = $scope.Error.offset;
            var v = $scope.ddItems[active].value;
            v = v.indexOf(" ") !== -1 ? '"' + v + '"' : v;
            v = v == "in" ? "in [" : v;

            var rhs_clean = rhs_qs[0].replace(/^\s+|\s+$/g, '');

            var is_in = _.some($scope.Error.expected, (e: IGqlExpected): boolean => {
              return [','].indexOf(e.value) !== -1;
            });

            if (is_in) {
              var lhs_xs = lhs.split('[');
              var term_list = lhs_xs.pop();
              var terms = term_list.split(',');
              terms.pop();
              terms.push(v);
              lhs = lhs_xs.join('[') + "[" + terms.join(', ');
              $scope.query = lhs + rhs_qs.join('');
            } else {
              if (rhs_qs[0].indexOf(']') === -1
                  && (v.toLowerCase().indexOf(rhs_clean.toLowerCase()) > -1)
                  && rhs_qs.length == 1
              ) {
                rhs_qs.shift();
              }
              rhs_qs.unshift(v + " ");

              $scope.query = lhs + rhs_qs.join('');
            }

            $scope.focus = false;
            $scope.clearActive();

            $scope.onChange();

            setTimeout(() => {
              $scope.caret(element[0], oldOffset + v.length + 1);
            }, 0);
          }
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
        $scope.mouseover = function (i) {
          //$scope.setActive(i);
        };

        $scope.mouseout = function () {
          //$scope.clearActive();
        };

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
