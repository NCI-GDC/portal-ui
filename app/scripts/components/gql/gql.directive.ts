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
  }

  interface IGqlError extends IGqlExpected {
    icon?: string;
    text: string;
  }

  interface IGqlScope extends ng.IScope {
    onChange(): void;
    gql: IGqlResult;
    query: string;
    Error: IGqlSyntaxError;
    errors: IGqlExpected[];
    totalErrors: IGqlExpected[];
    ajax: boolean;
    term: string;
  }

  /* @ngInject */
  function gqlInput($window: IGDCWindowService,
                    $compile: ng.ICompileService,
                    FilesService: IFilesService,
                    ParticipantsService: IParticipantsService): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        gql: '=',
        query: '='
      },
      templateUrl: "components/gql/templates/gql.html",
      link: function ($scope: IGqlScope, element: ng.IAugmentedJQueryStatic) {
        $scope.ajax = false;
        $scope.term = "";

        $scope.focus = true;

        var focus: boolean = true;
        var inactive = -1;
        $scope.active = inactive;

        function contains(phrase:string, sub:string): boolean {
          var phraseStr = (phrase + "").toLowerCase();
          return phraseStr.indexOf((sub + "").toLowerCase()) > -1;
        }

        function formatForAutoComplete(errors: IGqlExpected[]): IGqlError[] {
          return _.map(_.take(errors, 10), (e) => {
            var es: string[] = e.value.split(".");
            if (es.length > 1) {
              e.icon = es[0];
              es.shift();
            }
            e.text = es.join(".");
            return e;
          });
        }

        function filterByTerm(errors: IGqlExpected[], last: string): IGqlExpected[] {
          return _.filter(errors, (e) => {
            return contains(e.value, last);
          });
        }

        function cleanOutRegexTerms(errors: IGqlExpected[]): IGqlExpected[] {
          return _.filter(errors, (err) => {
            var e = err.value;
            return (e !== undefined) && ['[A-Za-z0-9\\-_.]', '[0-9]', '[ \\t\\r\\n]', '"', '('].indexOf(e) == -1;
          });
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
            }).then((fs: IFiles): IGqlExpected[] => {
              return _.map(fs.aggregations[facet].buckets, (b) => {
                return {text: b.key, value: b.key};
              });
            });
          } else {
            return ParticipantsService.getParticipants({
              facets: [facet],
              size: 0,
              filters: {}
            }).then((fs: IParticipants): IGqlExpected[] => {
              return _.map(fs.aggregations[facet].buckets, (b) => {
                return {text: b.key, value: b.key};
              });
            });
          }
        }

        $scope.onChange = () => {
          focus = true;
          try {
            // setup gql
            $scope.gql = $window.gql.parse($scope.query);
            // if ajax
            // T: filter ajax response
            if ($scope.ajax) {
              // TODO scope.term!!!!!
              $scope.errors = formatForAutoComplete(filterByTerm($scope.totalErrors, $scope.term));
            } else {
            // F: reset errors
              $scope.errors = [];
            }
            $scope.ajax = false;
            console.log('no error:', $scope.ajax);
          } catch (Error) {
            // capture Error info
            $scope.Error = Error;

            // determine if ajax needed
            $scope.ajax = _.some(Error.expected, (e: IGqlExpected): boolean => {
              return '[A-Za-z0-9\\-_.]' == e.value
            });

            var xs: string[] = $scope.query.substr(Error.offset).split(" ");
            var term: string = "";
            if (!$scope.ajax) {
              term = xs[0];
              // remove noise from errors
              $scope.totalErrors = Error.expected;
            } else {
              term = xs[xs.length - 1];
            }

            // Split the query based on where the error is
            // ex. modifying the middle of a search
            var qs: string[] = _.filter($scope.query.substr(0, Error.offset).split(" "), (x: string): boolean => {
              return !!x.length;
            });

            // left of current search term
            var op: string = qs[qs.length - 1];
            // 2 left of current search term
            var field: string = qs[qs.length - 2];

            // send ajax if needed
            console.log('ajax: ', $scope.ajax);
            if ($scope.ajax) {
              ajaxRequest(field).then(function(es: IGqlExpected[]){
                $scope.totalErrors = $scope.errors = es;
              });

            } else {
              // handle cursor offsets

              // filter error list by term
              // limit and format errors for dropdown
              $scope.errors = formatForAutoComplete(filterByTerm(cleanOutRegexTerms($scope.totalErrors), term));
            }
            console.log('TotalError: ', $scope.totalErrors);
            console.log('Error: ', _.pluck($scope.errors, 'value'));
          }
        };

        $scope.onChange1 = () => {
          $scope.focus = true;
          try {
            $scope.gql = $window.gql.parse($scope.query);
            console.log($scope.gql);
            $scope.errorMsg = $scope.error = null;
            $scope.tErrors = [];
            if (ajax) {
              $scope.errors = _.map(_.take(_.filter($scope.errors, (e) => {
                return $scope.contains(e.value, last);
              }), 10), (e) => {
                var xs: string[] = e.value.split(".");
                if (xs.length > 1) {
                  e.icon = xs[0];
                  xs.shift();
                }
                e.text = xs.join(".");
                return e;
              });
            } else {
              $scope.errors = [];
            }
          } catch (Error) {
            console.log('Error:', Error);
            $scope.gql = null;
            $scope.errorMsg = Error.message;
            $scope.offset = Error.offset;

            for (var i = 0; i < Error.expected.length; i++) {
              if ('[A-Za-z0-9\\-_.]' == Error.expected[i].value) {
                ajax = true;
                break;
              }
              ajax = false;
            }
            console.log(ajax);
            // Filter out regex errors
            if (!ajax) {
              var last = $scope.query.substr($scope.offset).split(" ")[0];
              $scope.tErrors = _.filter(Error.expected, (err) => {
                var e = err.value;
                return (e !== undefined) && ['[A-Za-z0-9\\-_.]', '[0-9]', '[ \\t\\r\\n]', '"', '('].indexOf(e) == -1;
              });
            } else {
              var qs = $scope.query.substr($scope.offset).split(" ");
              var last = qs[qs.length - 1];
              $scope.tErrors = $scope.errors;
            }

            // 1 filter errors by current search term
            // 2 limit number of results
            // 3 format results
            $scope.errors = _.map(_.take(_.filter($scope.tErrors, (e) => {
              return $scope.contains(e.value, last);
            }), 10), (e) => {
              var xs: string[] = e.value.split(".");
              if (xs.length > 1) {
                e.icon = xs[0];
                xs.shift();
              }
              e.text = xs.join(".");
              return e;
            });

            if (!ajax) {
              // Split the query based on where the error is
              // ex. modifying the middle of a search
              var left = $scope.query.substr(0, $scope.offset);
              // remove extra spaces
              var qs = _.filter(left.split(" "), (x) => {
                return x.length;
              });

              // left of current search term
              var op = qs[qs.length - 1];
              // 2 left of current search term
              var field = qs[qs.length - 2];

              // if left of search is in ops list send ajax
              if (['!=', '='].indexOf(op) !== -1) {
                ajax = true;
                var fs = field.split(".");
                var type = fs[0];
                fs.shift();
                var facet = fs.join(".");

                if (type == "files") {
                  FilesService.getFiles({
                    facets: [facet],
                    size: 0,
                    filters: {}
                  }).then((fs) => {
                    $scope.errors = _.map(fs.aggregations[facet].buckets, (b) => {
                      return {text: b.key, value: b.key};
                    });
                  });
                } else {
                  ParticipantsService.getParticipants({
                    facets: [facet],
                    size: 0
                  }).then((fs) => {
                    $scope.errors = _.map(fs.aggregations[facet].buckets, (b) => {
                      return {text: b.key, value: b.key};
                    });
                  });
                }
              }
            }
          }
        };

        $scope.clearActive = () => {
          if ($scope.errors) {
            for (var i = 0; i < $scope.errors.length; ++i) {
              $scope.errors[i].active = false;
            }
            $scope.active = inactive;
          }
        };

        $scope.setActive = (active) => {
          $scope.clearActive();
          $scope.active = active;
          $scope.errors[active].active = true;
        };

        $scope.cycle = (val) => {
          $scope.showResults();

          var active = $scope.active + val;

          if (active >= $scope.errors.length) {
            active = 0;
          } else if (active < 0) {
            active = $scope.errors.length - 1;
          }

          $scope.setActive(active);
        };

        $scope.showResults = () => {
          var results = $scope.errors ? !!$scope.errors.length : false;
          return !!($scope.focus && $scope.query.length > 0 && results);
        };

        $scope.keypress = (e) => {
          if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            $scope.enter(e);
          } else if (e.which === 38 || e.keyCode === 38) {
            e.preventDefault();
            $scope.cycle(-1);
          } else if (e.which === 40 || e.keyCode === 40) {
            e.preventDefault();
            $scope.cycle(1);
          }
        };

        $scope.caret = (input, offset) => {
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

        $scope.enter = (e) => {
          var left = $scope.query.substr(0, $scope.offset);
          var qs = _.filter($scope.query.substr($scope.offset).split(" "), (x) => {
            return x.length;
          });

          var active = $scope.active == -1 ? 0 : $scope.active;

          if ($scope.errors.length) {
            var oldOffset = $scope.offset;
            var v = $scope.errors[active].value;
            var v = v == "in" ? "in [" : v;

            qs.shift();
            qs.unshift(v);
            $scope.query = left + qs.join(" ") + " ";
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
        console.log('here');
        $scope.mouseover = function (i) {
          $scope.setActive(i);
        };

        $scope.mouseout = function () {
          $scope.clearActive();
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
