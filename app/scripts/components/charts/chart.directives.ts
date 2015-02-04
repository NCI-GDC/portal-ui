module ngApp.components.charts {
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  interface IBarChartScope extends ng.IScope {
    data: any;
    originalData: any;
    heading: string;
    yLabel: string;
    sortingAsc: boolean;
    sortingDesc: boolean;
    redraw(): void;
  }

  interface ISortChartScope extends ng.IScope {
    vm: any;
  }

  interface IPieChartScope extends ng.IScope {
    data: any;
    heading: string;
    height: number;
    labelFilter: string;  
    redraw(): void;
  }

  /* @ngInject */
  function PieChart($window: IGDCWindowService, $filter: ng.IFilterService): ng.IDirective {
    return {
      restrict: "EA",
      replace: true,
      transclude: true,
      scope: {
        data: "=",
        heading: "@",
        height: "@",
        labelFilter: "@"
      },
      templateUrl: "components/charts/templates/pie-chart.html",
      link: function($scope: IPieChartScope, element: ng.IAugmentedJQuery) {
        var margin = { top: 30, right: 20, bottom: 30, left: 20 };
        var width = element.find(".chart-container")[0].clientWidth - margin.left - margin.right;
        var height = (parseInt($scope.height, 10) || 500) - margin.top - margin.bottom;
        var radius = Math.min(width, height) / 2;

        function buildChart() {
          var colour = d3.scale.category20c();
          var arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

          var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) { return d.value; });
          var svg = d3.select(element.find(".chart-container")[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
          var total = d3.sum($scope.data.data, function(item) {
            return item.value;
          });

          var tip = d3.tip().attr("class", "d3-tip").html(function(d) {
            var ret = "<label class='x-text'>" + d.data.label +
                      "</label>: <span class='value'>{{ val }}, " +
                      ((d.data.value / total) * 100).toFixed("2") + "%</span>";
            if ($scope.labelFilter) {
              ret = ret.replace("{{ val }}", $filter($scope.labelFilter)(d.data.value));
            } else {
              ret = ret.replace("{{ val }}", d.data.value);
            }
            return ret;
          });

          var g = svg.selectAll(".arc")
                  .data(pie($scope.data.data))
                  .enter().append("g")
                  .attr("class", "arc")
                  .on("mouseover", tip.show)
                  .on("mouseout", tip.hide);

          g.append("path")
          .attr("d", arc)
          .style("fill", function(d, i) { return colour(i); });
          svg.call(tip);
        }
        buildChart();
        var redraw = function() {
          width = parseInt(d3.select(element.find(".chart-container")[0]).style("width"), 10);
          width = width - margin.left - margin.right;
          radius = Math.min(width, height) / 2;
          d3.select(element.find(".chart-container > svg")[0]).remove();
          buildChart();
        };

        $scope.redraw = redraw;
        $window.jQuery($window).resize(redraw);
        $scope.$watch("data", redraw);
        $scope.$on("$destroy", function() {
          $window.jQuery($window).off("resize", redraw);
        });

      }
    };
  }

  function BarChart($window: IGDCWindowService, $filter: ng.IFilterService): ng.IDirective {
    return {
      restrict: "EA",
      replace: true,
      transclude: true,
      scope: {
        data: "=",
        heading: "@",
        yLabel: "@",
        height: "@",
        direction: "@",
        formatFilter: "@"
      },
      templateUrl: "components/charts/templates/bar-chart.html",
      link: function ($scope: IBarChartScope, element: ng.IAugmentedJQuery) {
        $scope.direction = $scope.direction || "vertical";
        var chart;
        var baseChartOptions = {
          bindto: element.find(".chart-container")[0],
          size: {
            height: parseInt($scope.height) || 500
          },
          data: {
            columns: [],
            type: "bar",
            labels: true
          },
          tooltip: {
            show: false
          },
          axis: {
            rotated: $scope.direction === "horizontal",
            x: {
              tick: {
                format: function(x) {
                  return "";
                },
                count: 0
              }
            },
            y: {
              tick: {
                count: 6,
                format: function(x) {
                  if (isNaN(x)) {
                    return x;
                  }

                  return Math.round(x);
                }
              }
            }
          }
        };

        function buildChart() {
          var chartOptions = _.assign({}, baseChartOptions);

          _.each($scope.data, (item: any) => {
            var dataArray = [
              item.label
            ];
            dataArray = dataArray.concat(item.value);
            chartOptions.data.columns.push(dataArray);
          });

          var formatFunction = function(d) {
            return $filter($scope.formatFilter)(d);
          }

          if ($scope.formatFilter) {

            if (chartOptions.axis.rotated) {
              chartOptions.axis.y.tick.format = formatFunction;
            } else {
              chartOptions.axis.x.tick.format = formatFunction;
            }

            chartOptions.data.labels = {
              format: formatFunction
            };
          }

          chart = $window.c3.generate(chartOptions);

          // Adds accessible related information as per
          // http://www.sitepoint.com/tips-accessible-svg/
          d3.select(chartOptions.bindto)
            .select("svg")
            .append("title")
              .text(function() {
                return $filter("translate")($scope.heading);
              });
          d3.select(chartOptions.bindto)
            .select("svg")
            .append("desc")
              .text(function() {
                return $filter("translate")($scope.heading);
              });

          element.find("svg").attr("aria-labelledby", "title");
          element.find("svg").attr("role", "img");
        }

        buildChart();

        var redraw = function() {
          var chartOptions = {
            unload: true,
            columns: []
          };

          _.each($scope.data, (item: any) => {
            var dataArray = [
              item.label
            ];
            dataArray = dataArray.concat(item.value);
            chartOptions.columns.push(dataArray);
          });

          chart.load(chartOptions);
        };

        $scope.redraw = redraw;
        $scope.$watch("data", redraw);
      }
    };
  }

  angular.module("components.charts", [])
      .directive("barChart", BarChart)
      .directive("pieChart", PieChart);
}

