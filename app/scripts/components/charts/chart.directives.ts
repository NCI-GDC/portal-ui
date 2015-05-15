module ngApp.components.charts {
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;

  interface IPieChartScope extends ng.IScope {
    data: any;
    labelFilter: string;
    redraw(): void;
  }

  /* @ngInject */
  function PieChart($window: IGDCWindowService, $filter: ng.IFilterService,
                    $state: ng.ui.IStateService): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        data: "=",
        config:'='
      },
      link: function($scope: IPieChartScope, element: ng.IAugmentedJQuery) {
        $scope.$watch('data',function(a){
          updateChart();
        });

        var color = d3.scale.category20();

        var data = $scope.data;
        var config = $scope.config;

        var width = 450,
            height = 175,
            radius = Math.min(width, height) / 2;
        
        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.value;
          });        
        
        function updateChart() {
          var data = $scope.data;
          d3.select('svg').remove();
          
          var svg = d3.select(element[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 3.5 + "," + height / 2 + ")");
                    
          var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

          var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

          var legendX = 125;
          var legendStartY = -5;
          var legendSpaceEach = 55;

          g.append("path")
            .attr("d", arc)
            .attr("state", function(d) {
              return d.data.state ? "true" : "false";
            })
            .style("fill", function(d,i) {
              return color(i);
            })
            .on("click", function(d) {
              if (d.data.state) {
                $state.go(d.data.state.name, d.data.state.params, {inherit: false});
              }
            });

          var legendSquares = svg.selectAll('rect')
            .data(data,function(a){
              return a.key;
            })
            .enter()
              .append('rect')
              .attr('width', 25)
              .attr('height', 25)
              .attr("transform", function(d, i) {
                return "translate(" + legendX +","+ (legendStartY + legendSpaceEach * (i - 1)) + ")";
              })
              .style("fill", function(d, i) {
                return color(i);
              });

          var legendText = svg.selectAll('text')
            .data(data)
            .enter()
              .append("text")
              .attr("transform", function(d,i) { return "translate(" + (legendX+30) +","+ ((legendStartY+10) + legendSpaceEach * (i - 1)) + ")"; })
              .style("text-anchor", "left")
              .style("fill", function(d,i) { return 'black'})
              .text(function(d) { return config.legend[d.key].replace('%!%',d.value)})
              .attr('y',0)
              .attr('dy',0)
              .call(wrap, 150)
              .attr('class','pie-legend-text');
        }

        data.forEach(function(d) {
          d.value = +d.value;
        });

        function wrap(text, width) {

          text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
              }
            }
          });
        }
      }
    };
  }

  interface IDonutChartScope extends ng.IScope {
    data: any;
    height: number;
    redraw(): void;
  }

  /* @ngInject */
  function DonutChart($window: IGDCWindowService, $filter: ng.IFilterService,
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
      templateUrl: "components/charts/templates/donut-chart.html",
      link: function($scope: IDonutChartScope, element: ng.IAugmentedJQuery) {
        $scope.$watch('data',function(a){
          updateChart();
        });

        function getNestedValue(item, path) {
          if (path.length === 1) {
            return item[path[0]];
          }

          item = item[path[0]];
          path.shift();

          return getNestedValue(item, path);
        }

        // Account for padding on left/right
        var margin = { left: 30 };
        var width = element.find(".chart-container")[0].clientWidth - margin.left;
        var height = (parseInt($scope.height, 10) || 500);
        var data = $scope.data;
        var config = $scope.config;

        var color = d3.scale.category20();
        var outerRadius = height / 2 - 20,
            innerRadius = outerRadius / 2,
            cornerRadius = 10;

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
              return getNestedValue(d, config.sortKey.split("."));
            });

        var arc = d3.svg.arc()
            .padRadius(outerRadius)
            .innerRadius(innerRadius);

        function updateChart() {
          var data = $scope.data;
          var fontSize = 18;

          $window.jQuery($window).off("resize");

          if (element.find(".chart-container > svg").length) {
            d3.select(element.find(".chart-container > svg")[0]).remove();
          }

          if (!data || !data.length) {
            return;
          }

          var svg = d3.select(element.find(".chart-container")[0]).append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


          var insideTextMouse = svg.append("text")
            .attr("id", "inside-text-key-mouse")
            .attr("dy", "-0.35em")
            .style("text-anchor", "middle")
            .style("font-weight", "700")
            .attr("class", "inside");

          svg.append("text")
            .attr("id", "inside-text-default")
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-weight", "700")
            .attr("class", "inside");

          var insideLabelMouse = svg.append("text")
            .attr("id", "inside-text-label-mouse")
            .attr("dy", ".75em")
            .style("text-anchor", "middle")
            .attr("class", "inside");

          if (height < 250) {
            insideTextMouse.style("font-size", "70%");
            insideLabelMouse.style("font-size", "70%");
          }

          var g = svg.selectAll(".arc")
              .data(pie(data))
            .enter().append("g")
              .each(function(d) { d.outerRadius = outerRadius - 20; })
              .attr("class", "arc");

          var gPath = g.append("path");

          gPath.attr("d", arc)
              .style("fill", function(d, i) { return color(i); })
              .attr("state", function(d) {
                return config.state && config.state[d.data.key] ? "true" : "false";
              })
              .on("click", goToState)
              .on("mouseover.text", function(d) {
                svg.select("#inside-text-default").text(function() {
                  return "";
                });

                svg.select("#inside-text-key-mouse").text(function() {
                  return $filter("humanify")(d.data.key);
                });

                svg.select("#inside-text-label-mouse").text(function() {
                  var val = getNestedValue(d.data, config.textValue.split(".")),
                      labelString = d.data.doc_count > 1 ? config.label + "s" : config.label,
                      label = $filter("translate")($filter("humanify")(labelString));

                  if (config.textFilter) {
                    val = $filter(config.textFilter)(val);
                  } else {
                    val = $filter("number")(val);
                  }

                  return val + ", " + d.data.doc_count + " " + label;
                });
              })
              .on("mouseout.text", setDefaultText);
          
          if (data.length > 1) {
            gPath.on("mouseover", arcTween(outerRadius - 10, 0))
                 .on("mouseout", arcTween(outerRadius - 20, 150));
          }

          function setDefaultText() {
            svg.select("#inside-text-default").text(function() {
              var text = data.length > 1 ? config.defaultText + "s" : config.defaultText;
              return data.length + " " +
                     $filter("translate")($filter("humanify")(text));
            });

            svg.select("#inside-text-key-mouse").text(function() {
              return "";
            });

            svg.select("#inside-text-label-mouse").text(function() {
              return "";
            });
          }

          setDefaultText();

          $window.jQuery($window).on("resize", updateChart);
        }

        function goToState(d) {
          if (!config.state || !config.state[d.data.key]) {
            return;
          }

          var state = config.state[d.data.key];

          $state.go(state.name, state.params, {inherit: false});
        }

        function arcTween(outerRadius, delay) {
          return function() {
            d3.select(this).transition().delay(delay).attrTween("d", function(d) {
              var i = d3.interpolate(d.outerRadius, outerRadius);
              return function(t) { d.outerRadius = i(t); return arc(d); };
            });
          };
        }

        updateChart();
      }
    };
  }

  angular.module("components.charts", [])
      .directive("donutChart", DonutChart)
      .directive("pieChart", PieChart);
}

