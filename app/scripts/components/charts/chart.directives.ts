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

  /* @ngInject */
  function BarChart($window: IGDCWindowService): ng.IDirective {
    return {
      restrict: "EA",
      replace: true,
      transclude: true,
      scope: {
        data: "=",
        heading: "@",
        yLabel: "@"
      },
      templateUrl: "components/charts/templates/bar-chart.html",
      controller: function($scope: IBarChartScope) {
        this.sortAsc = function() {
          $scope.sortingAsc = true;
          $scope.sortingDesc = false;
          $scope.data.data = _.sortBy($scope.data.data, "y");
          $scope.redraw();
        };
        this.unSort = function() {
          $scope.sortingAsc = false;
          $scope.sortingDesc = false;
          $scope.data = _.assign({}, $scope.originalData);
          $scope.redraw();
        };
        this.sortDesc = function() {
          $scope.sortingAsc = false;
          $scope.sortingDesc = true;
          $scope.data.data = _.sortBy($scope.data.data, "y").reverse();
          $scope.redraw();
        };
      },
      link: function ($scope: IBarChartScope, element: ng.IAugmentedJQuery) {
        $scope.originalData = _.assign({}, $scope.data);

        var margin = { top: 10, right: 20, bottom: 60, left: 40 },
            width = element.find(".chart-container")[0].clientWidth - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        function buildChart() {
          var x = d3.scale.ordinal()
              .rangeRoundBands([0, width], .1);

          var y = d3.scale.linear()
              .range([height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .tickFormat(function(x) {
                if (typeof x === "string") {
                  // If label is longer than 12 chars, make it an ellipsis.
                  if (x.length > 12) {
                    x = x.substring(0, 11) + "...";
                  }
                  return x;
                }

                return "";
              });

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(8)
              .tickFormat(function(y) {
                if (y < 10000) {
                  return y;
                }

                y = Math.round(y / 1000);
                return y + "k";
              });

          var svg = d3.select(element.find(".chart-container")[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          $scope.data.xLabelPrefix = $scope.data.xLabelPrefix || "";
          $scope.data.xLabelPrefix += " ";

          /* Initialize tooltip */
          var tip = d3.tip().attr("class", "d3-tip").html(function(d) {
            return "<label class='x-text'>" + $scope.data.xLabelPrefix + d.x + "</label>: <span class='value'>" + d.y + "</span>";
          });

          x.domain($scope.data.data.map(function(d) {
            return d.x;
          }));
          y.domain([0, d3.max($scope.data.data, function(d: any) {
            return d.y;
          })]);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", function(d) {
                return "rotate(-45)";
              });

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-weight", 600)
            .text($scope.yLabel);

          svg.selectAll(".bar")
              .data($scope.data.data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.x); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.y); })
              .attr("height", function(d) { return height - y(d.y); })
              .on("mouseover", tip.show)
              .on("mouseout", tip.hide);

          /* Invoke the tip in the context of your visualization */
          svg.call(tip);
        }

        buildChart();

        var redraw = function() {
          width = parseInt(d3.select(element.find(".chart-container")[0]).style("width"), 10);
          width = width - margin.left - margin.right;

          d3.select(element.find(".chart-container > svg")[0]).remove();
          buildChart();
        };

        $scope.redraw = redraw;
        $window.jQuery($window).resize(redraw);

        $scope.$on("$destroy", function() {
          $window.jQuery($window).off("resize", redraw);
        });
      }
    };
  }

  /* @ngInject */
  function SortChart(): ng.IDirective {
    return {
      restrict: "EA",
      require: ["^?barChart"],
      replace: true,
      transclude: true,
      templateUrl: "components/charts/templates/sort.html",
      link: function($scope: ISortChartScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: any) {
        $scope.vm = controllers[0];
      }
    };
  }

  angular.module("components.charts", [])
      .directive("barChart", BarChart)
      .directive("sortChart", SortChart);
}

