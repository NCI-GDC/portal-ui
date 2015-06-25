module ngApp.components.charts {
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;
  import ILocationService = ngApp.components.location.services.ILocationService;

  interface IDonutChartScope extends ng.IScope {
    data: any;
    height: number;
    config: any;
    title: string;
  }

  /* @ngInject */
  function PieChart($window: IGDCWindowService, LocationService: ILocationService,
                    $state: ng.ui.IStateService): ng.IDirective {
    return {
      restrict: "EA",
      replace: true,
      scope: {
        data: "=",
        height: "@",
        config: "=",
        title: "@",
        legendLimit: "@"
      },
      templateUrl: "components/charts/templates/pie-chart.html",
      link: function($scope: IPieChartScope, element: ng.IAugmentedJQuery) {
        // Used to namespace each resize event
        var id = "." + $window.Math.round($window.Math.random() * 120000);

        $scope.$watch('data',function(a){
          updateChart();
        });

        $scope.legendLimit = $window.parseInt($scope.legendLimit);
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
            if (element.find(".chart-container").is(":visible")) {
              updateChart();
            }
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
          var outerRadius = height / 2 + 10;

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
              .on("click", setFilters)
              .on("mouseover.text", function(d) {
                $scope.showDefault = false;
                $scope.hoverKey = d.data[config.displayKey];
                $scope.hoverCount = d.data[config.sortKey];

                if (!config.hideFileSize) {
                  $scope.hoverSize = d.data.file_size.value;
                }

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
            gPath.on("mouseover.tween", arcTween(outerRadius - 15, 0))
                 .on("mouseout.tween", arcTween(outerRadius - 20, 150));
          }

          function setFilters(d) {
            if (LocationService.path().startsWith('/query')) return;
            var params;

            if (!config.filters || (!config.filters[d.data[config.displayKey]] &&
                !config.filters["default"])) {
              return;
            }

            if (config.filters[d.data[config.displayKey]]) {
              var filters = config.filters[d.data[config.displayKey]];
              params = filters.params;
            } else {
              params = {
                filters: config.filters["default"].params.filters(d.data[config.displayKey])
              };
            }

            if (config.state) {
              $state.go(config.state.name, {
                filters: params.filters
              }, {inherit: false});
              return;
            }

            var filters = LocationService.filters();

            if (!filters.content) {
              filters.content = [];
              filters.op = "and";
            }

            var newFilters = angular.fromJson(params.filters);

            _.forEach(newFilters.content, (filter) => {
              var oldFilter = _.find(filters.content, (oFilter) => {
                return oFilter.content.field === filter.content.field;
              });

              if (oldFilter) {
                oldFilter.content.value.concat(filter.content.value);
              } else {
                filters.content.push(filter);
              }
            });

            LocationService.setFilters(filters);
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
        data: "=",
        config: "="
      },
      templateUrl: "components/charts/templates/chart-legend.html",
      link: function($scope, elem) {
        var id = "." + $window.Math.round($window.Math.random() * 120000);

        function calculateLeft() {
          if (!$scope.data.parent.find(".chart-container").is(":visible")) {
            return;
          }

          var parent = $scope.data.parent.find(".chart-container");
          var LEGEND_WIDTH = elem.width();
          var offset = $scope.data.elem.offset();
          var width = $scope.data.elem[0].getBoundingClientRect().width;
          var diff = parent.width() - width;
          var left = width + (diff / 2) + 5;

          if (left + offset.left + LEGEND_WIDTH < $window.innerWidth) {
            elem.css("left", left + "px");
          } else {
            elem.css("right", left + "px");
          }
        }

        $scope.$watch("data", function(newVal) {
          if (newVal) {
            $window.$($window).off("resize" + id);
            $window.$($window).on("resize" + id, calculateLeft);

            $scope.displayedData = $scope.data.data;

            _.defer(() => {
              var top = 0;
              var containerHeight = $scope.data.parent.find(".chart-container").height();

              if (elem.height() < containerHeight) {
                top = (containerHeight - elem.height()) / 2;
              }

              elem.css("top", top + "px");

              calculateLeft();
            });
          }
        });
      }
    }
  }

  interface IBarChartScope extends ng.IScope {
    data: Array<{ key: number; doc_count: number }>;
    height: number;
    maxNumBars: number;
  }

  function BarChart($window: IGDCWindowService): ng.IDirective {
    return {
      restrict: "EA",
      replace: true,
      scope: {
        data: "=",
        height: "@",
        maxNumBars: "@",
      },
      templateUrl: "components/charts/templates/bar-chart.html",
      link: function($scope: IBarChartScope, element: ng.IAugmentedJQuery) {
        var sortedData = [];
        $scope.maxNumBars = $scope.maxNumBars || Number.POSITIVE_INFINITY;

        var margin = { right: 10, left: 10 };
        var width = element.parent().parent()[0].clientWidth - margin.left - margin.right;
        createChart();

        // Used to namespace each resize event
        var id = "." + $window.Math.round($window.Math.random() * 120000);
        $window.$($window).on("resize" + id, _.debounce(() => {
          resizeChart();
        }, 150));

        $scope.$watch("data", (n, o) => {
          if (n !== o || sortedData.length === 0) {
            if (n.length != 0) {
              var noMissing = _.reject(n, (datum) => { return datum.key === "_missing"; });
              sortedData = _.sortBy(noMissing, (n) => { return n.key; });
              if (sortedData.length > $scope.maxNumBars) {
                var chunked = _.chunk(sortedData, sortedData.length/$scope.maxNumBars);
                sortedData = _.map(chunked, (chunk) => {
                                    var keys = _.pluck(chunk, "key");
                                    return { "doc_count": _.sum(chunk, "doc_count"),
                                             "key": keys.length > 1 ? _.min(keys) + "-" + _.max(keys) : _.first(keys)
                                            };
                                  });
              }
              drawBars();
            } else {
              var chart = d3.select(element.find(".chart-container > svg")[0]);
              chart.selectAll("g").remove();

              chart.append("g").append("text")
              .attr("x", 20)
              .attr("y", 20)
              .text("no data to graph");

            }
          }
        });

        function resizeChart() {
          if (element.find(".chart-container").is(":visible")) {
            width = element.parent().parent()[0].clientWidth - margin.left - margin.right;
            d3.select(element.find(".chart-container > svg")[0])
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", $scope.height);
              drawBars();
            }
        }

        function createChart() {
          var height = $scope.height;

          var chart = d3.select(element.find(".chart-container")[0])
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(-10,0)");
        }

        function drawBars() {
          var x = d3.scale.ordinal()
                  .domain(_.pluck(sortedData, "key"))
                  .rangeRoundBands([0, width], 0);

          var y = d3.scale.linear()
                  .domain([0, _.max(_.pluck(sortedData, "doc_count"))])
                  .range([$scope.height, 0]);

          var chart = d3.select(element.find(".chart-container > svg")[0]);
          chart.selectAll("g").remove();

          var elements = chart.selectAll("g")
                        .data(sortedData);

          var tip = d3.tip()
                    .attr("class", "tooltip")
                    .offset([-5, 0])
                    .html(function(d) {
                            return d.key + ": " + d.doc_count;
                          });

          var bars = elements
              .enter().append("g")
              .attr("transform", (d) => { return "translate(" + x(d.key) + ",0)"; })
              .append("rect")
              .attr("y", (d) => { return y(d.doc_count); })
              .attr("height", (d) => { return $scope.height - y(d.doc_count); })
              .attr("width", x.rangeBand())
              .attr("class", "bar")
              .call(tip)
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
            }
      }
    }
  }

  angular.module("components.charts", [
      "location.services"
    ])
    .directive("chartLegend", ChartLegend)
    .directive("pieChart", PieChart)
    .directive("barChart", BarChart);
}

