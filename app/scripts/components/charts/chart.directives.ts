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
  function PieChart(
    $window: IGDCWindowService,
    LocationService: ILocationService,
    $state: ng.ui.IStateService,
    $rootScope,
    $timeout
  ): ng.IDirective {
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
        var tip = d3.tip()
                    .attr("class", "tooltip")
                    .offset([-5, 0])
                    .html(function(d) {
                          return "Further filtering in this view can be performed using the Advanced Search above";
                          });

        // Used to namespace each resize event
        var id = "." + $window.Math.round($window.Math.random() * 120000);

        $scope.$watch("data", function(a){
          if (element.find(".chart-container").is(":visible")) {
            updateChart();
          }
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
          if (element.find(".chart-container > svg").length) {
            d3.select(element.find(".chart-container > svg")[0]).remove();
          }

          // Account for padding on left/right
          var margin = { left: 30 };
          var width = element.find(".chart-container")[0].clientWidth - margin.left;
          var height = (parseInt($scope.height, 10) || 500);
          var data = $scope.data;
          var config = $scope.config;

          if (!data || !data.length) {
            return;
          }

          data = data.slice();

          $scope.prunedData = data = _.filter(data.sort(function(a, b) {
            if (a[config.sortKey] > b[config.sortKey]) {
              return -1;
            }

            if (b[config.sortKey] > a[config.sortKey]) {
              return 1;
            }

            return 0;
          }), (datum) => {
            return datum[config.sortKey] !== 0;
          });

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
                  $scope.hoverSize = d.data.file_size;
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
              })
              .call(tip)
              .on("mouseout", tip.hide);

          $scope.legendData = legendData;
          if (data.length > 1) {
            gPath.on("mouseover.tween", arcTween(outerRadius - 15, 0))
                 .on("mouseout.tween", arcTween(outerRadius - 20, 150));
          }

          function setFilters(d) {
            if (LocationService.path().indexOf("/query") === 0) {
              tip.show();
              return;
            }
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

        if (element.find(".chart-container").is(":visible")) {
          updateChart();
        }

        $window.$($window).off("resize" + id);

        $window.$($window).on("resize" + id, _.debounce(() => {
          if (element.find(".chart-container").is(":visible")) {
            updateChart();
          }
        }, 150));

        $rootScope.$on("toggleFacets", () => {
          $timeout(updateChart)
        });
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
        //make sure width is never neg
        if(width <= 0) {
          width = 300;
        }

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

          var g = elements
              .enter().append("g")
              .attr("transform", (d) => { return "translate(" + x(d.key) + ",0)"; });

              // an invisible bar with tooltip behind the real bar
              // so that very short bars still display tooltip
              g.append("rect")
              .attr("y", () => 0)
              .attr("height", () => $scope.height)
              .attr("width", x.rangeBand())
              .attr("class", "invisible-bar")
              .call(tip)
              .on("mouseover", tip.show)
              .on("mouseout", tip.hide);

              g.append("rect")
              .attr("y", (d) => { return y(d.doc_count); })
              .attr("height", (d) => { return $scope.height - y(d.doc_count); })
              .attr("width", x.rangeBand())
              .attr("class", "bar")
              .on("mouseover", tip.show)
              .on("mouseout", tip.hide);

        }
      }
    }
  }

  interface IMarkFunction {
    (data: { key: number; doc_count: number }): boolean;
  }

  interface ID3ToolTipFunction {
    (data: any): string;
  }

  interface IMarkedBarChartScope extends ng.IScope {
    title?: string;
    markedLegendLabel?: string;
    chartClasses?: string;
    data: Array<{ key: number; doc_count: number }>;
    margins?: { top: number; bottom: number; left: number; right: number; };
    height?: number;
    width?: number;
    toolTipFn?: ID3ToolTipFunction;
    markFn?: IMarkFunction;
  }

  /* @ngInject */
  function MarkedBarChart($state: ng.ui.IStateService): ng.IDirective {

    return {
      restrict: "EA",
      replace: true,
      scope: {
        title: "@",
        markedLegendLabel: "@",
        chartClasses: "@",
        data: "=",
        margins: "=",
        height: "@",
        width: "@",
        toolTipFn: "=",
        markFn: "&"
      },
      templateUrl: "components/charts/templates/marked-bar-chart.html",
      link: function ($scope: IMarkedBarChartScope, element: ng.IAugmentedJQuery) {

        var ASPECT_RATIO = 1.33,
            CLAMP_HEIGHT = Number.POSITIVE_INFINITY, //470;
            CLAMP_WIDTH = Number.POSITIVE_INFINITY,
            NUM_Y_TICKS = 4,
            PADDING = 25;

        var _data,
            _svg,
            _barChartBoundingBox,
            _barChartCanvas,
            _barChartTitle,
            _barChartLegend,
            //_barChartMarkerGroup,
            _barChartCaption,
            //_barChartBG,
            _chartMargin,
            _width,
            _height,
            _tipFn,
            _axisTipFn,
            _xScale,
            _yScale,
            _invYScale,
            _xAxis,
            _yAxis,
            _xAxisGroup,
            _yAxisGroup,
            _colourScale,
            _postFixID = _getUniqueChartID(8);

        function _getUniqueChartID(size) {
          var text = "";
          var possibleVals = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (var i=0; i < size; i++ ) {
            text += possibleVals.charAt(Math.floor(Math.random() * possibleVals.length));
          }

          return text;
        }


        function _initChartSize() {
          _height = Math.min(CLAMP_HEIGHT, $scope.height || element.parent().outerHeight());
          _width = Math.min(CLAMP_WIDTH, $scope.width || element.parent().outerWidth());

          if (! _svg) {

            // This is the first time the chart is being initializes so
            // set the default values for our elements
            _svg = d3.select(element[0]).select("svg.marked-bar-chart-component")
              .attr("viewPort", "0 0 " + _width + " " + _height);

            _xAxisGroup = _svg.append("g")
              .classed("x axis", true);

            _yAxisGroup = _svg.append("g")
              .classed("y axis", true);

            _barChartCanvas = _svg.append("g")
              .classed("bar-chart-canvas", true);

            _barChartTitle = _svg.select("g.chart-title-container")
              .append("g")
              .classed("marked-bar-chart-title", true)
              .append("text")
              .attr("y", _chartMargin.top);

            _barChartLegend = _svg.select("g.chart-title-container")
              .append("g")
              .classed("marked-bar-chart-legend", true);

            /*
            _barChartMarkerGroup = _barChartLegend.append("g")
              .attr("transform", "translate(-25, 55)");

            _barChartMarkerGroup.append("circle")
              .classed("marked-bar-chart-marker", true)
              .attr("cx", 10)
              .attr("cy", 10)
              .attr("r", 8);

            _barChartMarkerGroup.append("use")
              .attr("xlink:href", "#bar-chart-marker-symbol")
              .attr("fill", "#fff")
              .attr("x", 115)
              .attr("y", 95)
              .attr("transform", "scale(0.030, 0.030)");
            */

            _barChartCaption = _barChartLegend.append("text")
              .classed("marked-bar-chart-title-label", true)
              .attr("y", _chartMargin.top + 0);


            _barChartBoundingBox = _svg.select(".chart-canvas-area > rect");

            _barChartBoundingBox.attr("x", _chartMargin.left)
              .attr("y", _chartMargin.top + 50);

            //_barChartBG = _svg.select(".bg");
          }

          // Set the new svg height and width
          _svg.attr("width", _width)
            .attr("height", _height + 60);

          // Calculate the new center of the title if there is one
          if ($scope.title) {
            _barChartTitle
              .text($scope.title)
              .attr("text-anchor", "middle")
              .transition()
              .attr("x", Math.round(_width / 2));
          }

          // Calculate the new center of the legend caption if there is one
          if ($scope.markedLegendLabel) {
            _barChartCaption
              .text($scope.markedLegendLabel);
            //.attr("text-anchor", "middle")

            _barChartLegend
              .transition()
              .attr("transform", "translate(" + (Math.round((_width - _barChartLegend.node().getBBox().width) / 2) + _chartMargin.left) + ", 0)")
          }

          // if (_barChartBG) {
          //   _barChartBG.transition()
          //     .attr("transform", "translate(" + (Math.round((_width - _barChartBG.node().getBBox().width) / 2) + 100) + ", 0)");
          // }

          // Calculate the new bounding box
          _barChartBoundingBox
            .attr("width", _width - _chartMargin.left - _chartMargin.right)
            .attr("height", _height - _chartMargin.top - _chartMargin.bottom - 40);
        }

        function _renderBars() {

          _xScale.rangeRoundBands([ _chartMargin.left, (_width - _chartMargin.right - _chartMargin.left)], 0.3);
          _yScale.range([0, _barChartBoundingBox.attr("height")]);
          _invYScale.range([_barChartBoundingBox.attr("height"), 0]);

          _xAxis = d3.svg.axis()
            .scale(_xScale)
            .orient("bottom")
            .ticks(_data.length)
            .outerTickSize(0);


          _yAxis = d3.svg.axis()
            .scale(_invYScale)
            .orient("left")
            .ticks(NUM_Y_TICKS)
            .tickSize(0,0);

          _yAxisGroup
            .attr("transform", "translate(" + Math.round(_chartMargin.left + PADDING) + ", " + Math.round(_chartMargin.top + 50) + ")")
            .call(_yAxis)
            .selectAll("text")
            .style({
              "text-anchor": "end",
              "font-size":"0.8rem",
              "font-family": "Lucida Grande, Lucida Sans Unicode, Arial, sans-serif",
            });


          var yGridLines = _barChartCanvas.selectAll("line.horizontalGrid").data(_invYScale.ticks(NUM_Y_TICKS));

          yGridLines.enter()
            .append("line")
            .classed("horizontalGrid", true);

          yGridLines.attr({

              "x1" : "-2",
              "x2" : +_barChartBoundingBox.attr("width") - 20,
              "y1" : function(d){ return _invYScale(d);},
              "y2" : function(d){ return _invYScale(d);},
              "fill" : "none",
              "shape-rendering" : "crispEdges",
              "stroke" : "#eee",
              "stroke-width" : function(d) {

                if(_invYScale(d) === _barChartBoundingBox.attr("height") || d === 0){
                  return "0px";
                }
                return "1px";
              },
              "transform": "translate(" + Math.round(_chartMargin.left + PADDING) + ", " + Math.round(_chartMargin.top + 50) + ")"
            });


          _xAxisGroup
            .attr("transform", "translate(" + Math.round((_chartMargin.left - _xScale.rangeBand()) / 2 + PADDING) + ", " + Math.round(_height - (_chartMargin.bottom / 2 )) + ")")
            .call(_xAxis)
            .selectAll("text")
            .style({
              "text-anchor": "end",
              "font-size":"10px",
              "font-family": "Lucida Grande, Lucida Sans Unicode, Arial, sans-serif",
            })
            .attr("dy", "0rem")
            .attr("dx", "-12px")
            .attr("transform", "rotate(-45)")
            // .call(_axisTipFn)
            // .on("mouseover", function (d) {
            //   var tick = d3.select(this);

            //   tick.style({"font-size":"10px", "fill":  d3.hsl(_colourScale(d)).darker(1)});

            //   _axisTipFn.show(tick.data())

            // })
            // .on("mouseout", function () {
            //   var tick = d3.select(this);

            //   _axisTipFn.hide();

            //   tick.style({"font-size":"10px", "fill": ""});
            // })
            .on("click", function () {
              var tick = d3.select(this);
              var filters = {
                "op":"and",
                "content":[
                  {
                    "op":"in", "content": {"field":"primary_site","value":tick.data()}
                  }
                ]};

              $state.go("projects.table", {
                  filters: JSON.stringify(filters)
                },
                {
                  inherit: false
                }
              );
            });


          var barGroups = _barChartCanvas.selectAll("g.stacked-rect")
            .data(_data);

          barGroups.enter().append("g").classed("stacked-rect", true);

          barGroups
            .attr("transform", function(d) { return "translate(" + (_xScale(d._key) - (_xScale.rangeBand() * 4)) + ", " + _height + ")"; })
            .transition()
            .delay(function(d, i) {
              return i / _data.length * 500;
            })
            .attr("transform", function(d) { return "translate(" + (_xScale(d._key) + PADDING) + ", " +
              (_height - _yScale(d._count) - _chartMargin.bottom + 10) + ")"; });


          var stackedBars = barGroups.selectAll("rect.stacked-bar-item")
            .data(function(d) { return d.stacks; });


          stackedBars.enter().append("rect")
            .classed("bar-item stacked-bar-item", true)
            .attr("x", 0)
            .attr("y", 0);


          let selectionColoursMap = {};
          //http://stackoverflow.com/questions/1664140/js-function-to-calculate-complementary-colour
          //convert to hsl, shift the hue 180, return hex string
          let hueShift = (h,s) => { h += s; while (h >= 360.0) h -= 360.0; while (h < 0.0) h += 360.0; return h; }
          let getReadableComplementaryColour = (colour: string): string => {
            let c = d3.hsl(colour);
            c.h = hueShift(c.h ? c.h : 0, 180);
            // bump s & l for readability
            if (c.s < 0.4) {
              c.s += 0.5;
            }
            c.l = 0.5;
            return c.toString();
          }

          stackedBars
            .attr("y", function(d) { return _yScale(d.y0); })
            .attr("width", _xScale.rangeBand())
            .attr("height", function(d) { return _yScale(d.y1) - _yScale(d.y0); })
            .attr("fill", function(d, i) {
              d._colour = _colourScale(d._key);
              if ( i === 0) {
                selectionColoursMap[d._key] = getReadableComplementaryColour(d._colour);
              }
              if (i > 0) {
                d._colour = d3.hsl(d._colour).darker(i%(Math.random()*2) + 0.1*i, -0.2).toString();
              }
              return d._colour;
            })
            .call(_tipFn)
            .on("click", function(d) {

              _tipFn.hide(d);

              $state.go("project", {
                projectId: d.projectID
              }, {inherit: false});
            })
            .on("mouseover", function(d) {
              let bar = d3.select(this);
              bar.interrupt()
                .transition();
              _svg.append('rect')
                .classed('chart-focus', true)
                .attr("transform", () => "translate(" + (_xScale(d._key) - (_xScale.rangeBand() * 4)) + ", " + _height + ")")
                .attr('width', _xScale.rangeBand())
                .attr('height', () => _yScale(d.y1) - _yScale(d.y0))
                .attr('fill', 'none')
                .attr('stroke', selectionColoursMap[d._key])
                .attr('stroke-width', 2)
                .attr('y', _yScale(d.y0))
                .attr("transform", () => {
                  var totalCount = _data.reduce((total, d2) => d2._key === d._key ? d2._count : total, 0);
                  return "translate(" + (_xScale(d._key) + PADDING) + ", " + (_height - _yScale(totalCount) - _chartMargin.bottom + 10) + ")";
                });

              _tipFn.show(d);

            })
            .on("mouseout", function(d) {

              var bar = d3.select(this),
                  barColour = d._colour;

              bar.interrupt()
                .transition()
                .attr("fill", barColour)
                .attr("transform", "translate(0, 0)");
                _svg.selectAll('.chart-focus').remove();
              _tipFn.hide(d);
            });


          yGridLines.exit().remove();
          stackedBars.exit().remove();
          barGroups.exit().remove();

        }

        function _initListeners() {

          var hoverEventName = "resize." + _postFixID;

          // Add listener to respond to window resize events (i.e. redraw visualization)
          jQuery(window).on(hoverEventName, _.debounce(() => {
            _initChartSize();
            _renderBars();
          }, 200));


          $scope.$on("$destroy", function () {
            jQuery(window).unbind(hoverEventName);
          });

          $scope.$watch(function() {
              return $scope.data;
          },
          function(newData, oldData){

            if (! _.isArray(newData) || newData.length === 0 || (newData === oldData && _data)) {

              _barChartCanvas
                .append("g")
                .classed("message", true)
                .append("text")
                .attr("x", Math.round(_width / 2))
                .attr("y", 200)
                .attr("text-anchor", "middle")
                .text("Loading...");

              return;
            }

            // Delete any messages
            _svg.selectAll(".message").remove();

            // Make original data read only...
            _data = _.cloneDeep(newData);

            _xScale = d3.scale.ordinal()
               .domain(_.map(_data, function(d) { return d._key; }));

            _yScale = d3.scale.linear()
              .clamp(true)
              .domain([0, d3.max(_data, function(d) { return d._maxY; })]);

            _invYScale = d3.scale.linear()
              .clamp(true)
              .domain([0, d3.max(_data, function(d) { return d._maxY; })]);

            _colourScale = d3.scale.category20c()
              .domain(_.map(_data, function(d) { return d._key; }));

            _renderBars();


          });
        }

        function _initChart() {


          _chartMargin = $scope.margins || {top: 0, bottom: 40, left: 20, right: 20};

          _initChartSize();

          var boundClipPathID = "boundRect-" + _postFixID;

          _svg.select("clipPath").attr("id", boundClipPathID);
          _barChartCanvas.attr("clip-path", "url(#" + boundClipPathID + ")");

          var tipFn = function (d) {
            return "<h4>" + d._key + "</h4><p>" + d._count + "</p>";
          };


          // Ensure that the tip function (if included) returns a string
          if (_.isFunction($scope.toolTipFn)) {
            tipFn = $scope.toolTipFn;
          }

          // Initialize the tip function
          _tipFn = d3.tip()
            .attr("class", "tooltip")
            .offset([-5, 0])
            .html(tipFn);

          // _axisTipFn = d3.tip()
          //   .attr("class", "tooltip")
          //   .offset([-30, 10])
          //   .html(function(d) {
          //     return d;
          //   });

          _initListeners();

        }

        _initChart();

      }
    };

  }

  angular.module("components.charts", [
      "location.services"
    ])
    .directive("chartLegend", ChartLegend)
    .directive("pieChart", PieChart)
    .directive("barChart", BarChart)
    .directive("markedBarChart", MarkedBarChart);
}
