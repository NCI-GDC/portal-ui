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
    caret(input:any, offset: number);
    enter();
    gql: IGqlResult;
    query: string;
    Error: IGqlSyntaxError;
    errors: IGqlError[];
    totalErrors: IGqlExpected[];
    ajax: boolean;
    term: string;
    focus: boolean;
    active: number;
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
      link: function ($scope: IGqlScope, element: any) {
        var inactive = -1;

        $scope.ajax = false;
        $scope.term = "";
        $scope.focus = false;
        $scope.active = inactive;

        function contains(phrase: string, sub: string): boolean {
          var phraseStr = (phrase + "").toLowerCase();
          return phraseStr.indexOf((sub + "").toLowerCase()) > -1;
        }

        function clean(e: string): boolean {
          return (e !== undefined) && ['[A-Za-z0-9\\-_.]', '[0-9]', '[ \\t\\r\\n]', '"', '('].indexOf(e) == -1;
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

        function ajaxRequest(field: string): ng.IPromise {
          var xs = field.split(".");
          var doc_type = xs.shift();
          var facet = xs.join(".");

          if (doc_type == "files") {
            return FilesService.getFiles({
              facets: [facet],
              size: 0,
              filters: {}
            }).then((fs: IFiles): IGqlError[] => {
              return _.map(fs.aggregations[facet].buckets, (b) => {
                return {text: b.key, value: b.key};
              });
            });
          } else {
            return ParticipantsService.getParticipants({
              facets: [facet],
              size: 0,
              filters: {}
            }).then((fs: IParticipants): IGqlError[] => {
              return _.map(fs.aggregations[facet].buckets, (b) => {
                return {text: b.key, value: b.key};
              });
            });
          }
        }

        function gqlParse() {
          try {
            // setup gql
            $scope.gql = $window.gql.parse($scope.query);
            // if ajax
            // T: filter ajax response
            if ($scope.ajax) {
              var xs: string[] = $scope.query.substr($scope.Error.offset).split(" ");
              var term = xs[xs.length - 1];
              $scope.errors = formatForAutoComplete(_.filter($scope.totalErrors, (e) => {
                return contains(e.value, term);
              }));
            } else {
              // F: reset errors
              $scope.errors = [];
              $scope.totalErrors = [];
            }
            console.log('no error:', $scope.ajax);
          } catch (Error) {
            // capture Error info
            $scope.Error = Error;

            // determine if ajax needed
            $scope.ajax = _.some(Error.expected, (e: IGqlExpected): boolean => {
              return '[A-Za-z0-9\\-_.]' == e.value
            });
            if ($scope.ajax) {
              var qs: string[] = _.filter($scope.query.substr(0, Error.offset).split(" "), (x: string): boolean => {
                return !!x.length;
              });
              // left of current search term
              var op: string = qs[qs.length - 1];
              // 2 left of current search term
              var field: string = qs[qs.length - 2];
              ajaxRequest(field).then(function (es: IGqlError[]) {
                $scope.totalErrors = [];
                $scope.errors = es;
              });
              return;
            } else {
              var xs: string[] = $scope.query.substr(Error.offset).split(" ");
              var term = xs[0];
              $scope.totalErrors = Error.expected;
              $scope.errors = formatForAutoComplete(_.filter($scope.totalErrors, (e) => {
                return contains(e.value, term) && clean(e.value);
              }));
            }
            console.log('TotalError: ', $scope.totalErrors);
            console.log('Error: ', _.pluck($scope.errors, 'value'));
          }
        }

        $scope.onChange = () => {
          $scope.focus = true;
          gqlParse();
        };

        $scope.clearActive = () => {
          if ($scope.errors) {
            for (var i = 0; i < $scope.errors.length; ++i) {
              $scope.errors[i].active = false;
            }
            $scope.active = inactive;
          }
        };

        $scope.setActive = (active: number) => {
          $scope.clearActive();
          $scope.active = active;
          $scope.errors[active].active = true;
        };

        $scope.cycle = (val: number) => {
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

        $scope.keypress = (e: any) => {
          if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            $scope.enter();
          } else if (e.which === 27 || e.keyCode === 27) {
            $scope.focus = false;
          } else if (e.which === 32 || e.keyCode === 32) {
            $scope.ajax = false;
          } else if (e.which === 38 || e.keyCode === 38) {
            e.preventDefault();
            $scope.cycle(-1);
          } else if (e.which === 40 || e.keyCode === 40) {
            e.preventDefault();
            $scope.cycle(1);
          }
        };

        $scope.caret = (input:any, offset: number) => {
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

        $scope.enter = (): void => {
          $scope.ajax = false;
          var left = $scope.query.substr(0, $scope.Error.offset);
          var qs = _.filter($scope.query.substr($scope.Error.offset).split(" "), (x) => {
            return x.length;
          });

          var active = $scope.active == -1 ? 0 : $scope.active;

          if ($scope.errors.length) {
            var oldOffset = $scope.Error.offset;
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
