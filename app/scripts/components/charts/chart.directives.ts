module ngApp.components.charts {
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;

  interface IDonutChartScope extends ng.IScope {
    data: any;
    height: number;
    config: any;
    title: string;
    filter: boolean;
  }

  /* @ngInject */
  function PieChart($window: IGDCWindowService, $filter: ng.IFilterService,
                      $state: ng.ui.IStateService): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        data: "=",
        height: "@",
        config: "=",
        title: "@",
        filter: "="
      },
      templateUrl: "components/charts/templates/pie-chart.html",
      link: function($scope: IPieChartScope, element: ng.IAugmentedJQuery) {
        // Used to namespace each resize event
        var id = "." + $window.Math.round($window.Math.random() * 120000);

        $scope.$watch('data',function(a){
          updateChart();
        });

        $scope.showDefault = true;
        function getNestedValue(item, path) {
          if (path.length === 1) {
            return item[path[0]];
          }

          item = item[path[0]];
          path.shift();

          return getNestedValue(item, path);
        }

        function updateChart() {
          $window.$($window).off("resize" + id);

          $window.$($window).on("resize" + id, _.debounce(() => {
            updateChart();
          }, 150));

          if (element.find(".chart-container > svg").length) {
            d3.select(element.find(".chart-container > svg")[0]).remove();
          }

          // Account for padding on left/right
          var margin = { left: 30 };
          var width = element.find(".chart-container")[0].clientWidth - margin.left;
          var height = (parseInt($scope.height, 10) || 500);
          var data = $scope.data;
          var config = $scope.config;

          var color = d3.scale.category20();
          var outerRadius = height / 2 - 20,
              cornerRadius = 10;

          var pie = d3.layout.pie()
              .sort(null)
              .value(function(d) {
                return getNestedValue(d, config.sortKey.split("."));
              });

          var arc = d3.svg.arc()
              .padRadius(outerRadius)
              .innerRadius(0);
          var data = $scope.data;

          if (!data || !data.length) {
            return;
          }

          var svg = d3.select(element.find(".chart-container")[0]).append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          var g = svg.selectAll(".arc")
              .data(pie(data))
            .enter().append("g")
              .each(function(d) { d.outerRadius = outerRadius - 20; })
              .attr("class", "arc");

          var gPath = g.append("path");
          var legendData = {
            title: $scope.title,
            elem: element.find(".chart-container > svg > g"),
            parent: element,
            data: []
          };

          gPath.attr("d", arc)
              .each(function(d, i) {
                legendData.data.push({
                  color: color(i),
                  data: d.data
                });
              })
              .style("fill", function(d, i) { return color(i); })
              .attr("state", function(d) {
                return config.state ? "true" : "false";
              })
              .on("click", goToState)
              .on("mouseover.text", function(d) {
                $scope.showDefault = false;
                $scope.hoverKey = d.data.key;
                $scope.hoverCount = d.data.doc_count;
                $scope.hoverSize = d.data.file_size.value;
                $scope.$apply();
              })
              .on("mouseout.text", function() {
                $scope.showDefault = true;
                $scope.$apply();
              })
              .on("mouseover.legend", function() {
                element.find(".chart-legend").removeClass("invisible");
              })
              .on("mouseout.legend", function() {
                element.find(".chart-legend").addClass("invisible");
              });

          $scope.legendData = legendData;
          
          if (data.length > 1) {
            gPath.on("mouseover.tween", arcTween(outerRadius - 10, 0))
                 .on("mouseout.tween", arcTween(outerRadius - 20, 150));
          }

          function goToState(d) {
            if (!config.state || (!config.state[d.data.key] &&
                !config.state["default"])) {
              return;
            }

            if (config.state[d.data.key]) {
              var state = config.state[d.data.key];

              $state.go(state.name, state.params, {inherit: false});
              return;
            }

            var state = config.state["default"],
                params = {
                  filters: state.params.filters(d.data.key)
                };

            $state.go(state.name, params, {inherit: false});
          }

          function arcTween(outerRadius, delay) {
            return function() {
              d3.select(this).transition().delay(delay).attrTween("d", function(d) {
                var i = d3.interpolate(d.outerRadius, outerRadius);
                return function(t) { d.outerRadius = i(t); return arc(d); };
              });
            };
          }
        }

        updateChart();
      }
    };
  }

  /* @ngInject */
  function ChartLegend($window: ng.IGDCWindowService): ng.IDirective {
    return {
      restrict: "A",
      replace: true,
      scope: {
        data: "="
      },
      templateUrl: "components/charts/templates/chart-legend.html",
      link: function($scope, elem) {
        var id = "." + $window.Math.round($window.Math.random() * 120000);

        $scope.limit = 10;

        function calculateLeft() {
          var parent = $scope.data.parent.find(".chart-container");
          var width = $scope.data.elem[0].getBoundingClientRect().width;
          var LEGEND_WIDTH = 275;
          var offset = $scope.data.elem.offset();
          var left = width + ((parent.width() - width) / 2) + 20;

          if (width + offset.left + LEGEND_WIDTH < $window.innerWidth) {
            elem.css("left", left + "px");
          } else {
            elem.css("right", left + "px");
          }
        }

        $scope.$watch("data", function(newVal) {
          if (newVal) {
            $window.$($window).off("resize" + id);
            $window.$($window).on("resize" + id, calculateLeft);

            $scope.data.data.sort(function(a, b) {
              if (a.data.doc_count < b.data.doc_count) {
                return 1;
              }

              if (a.data.doc_count > b.data.doc_count) {
                return -1;
              }

              return 0;
            });

            $scope.displayedData = $scope.data.data.slice(0, 10);

            _.defer(() => {
              var top;

              if (elem.height() < $scope.data.parent.height()) {
                top = ($scope.data.parent.height() - elem.height()) / 2;
              }

              if (elem.height() > $scope.data.parent.height()) {
                top = 0;
              }

              elem.css("top", top + "px");

              calculateLeft(elem, $scope.data.parent.find(".chart-container"));
            });
          }
        });
      }
    }
  }

  angular.module("components.charts", [])
      .directive("chartLegend", ChartLegend)
      .directive("pieChart", PieChart);
}

