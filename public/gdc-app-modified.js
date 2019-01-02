(function(){
appConfig.$inject = ["$urlRouterProvider", "$locationProvider", "RestangularProvider", "config", "$compileProvider", "$httpProvider"];
appRun.$inject = ["gettextCatalog", "Restangular", "$state", "CoreService", "$rootScope", "config", "notify", "$cookies", "UserService", "ProjectsService", "$window", "$uibModalStack", "LocalStorageService"];
exceptionDecorator.$inject = ["$provide"];var ngApp;
(function (ngApp) {
    var notFound;
    (function (notFound) {
        "use strict";
        /* @ngInject */
        notFoundConfig.$inject = ["$stateProvider"];
        function notFoundConfig($stateProvider) {
            $stateProvider.state("404", {
                url: "/404",
                controller: "NotFoundController as nf",
                templateUrl: "404/templates/404.html"
            });
        }
        angular
            .module("ngApp.notFound", [
            "notFound.controller",
            "ui.router.state"
        ])
            .config(notFoundConfig);
    })(notFound = ngApp.notFound || (ngApp.notFound = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var annotations;
    (function (annotations) {
        "use strict";
        /* @ngInject */
        annotationsConfig.$inject = ["$stateProvider"];
        function annotationsConfig($stateProvider) {
            $stateProvider.state("annotations", {
                url: "/annotations?filters",
                controller: "AnnotationsController as asc",
                templateUrl: "annotations/templates/annotations.html",
                reloadOnSearch: false
            });
            $stateProvider.state("annotation", {
                url: "/annotations/:annotationId",
                controller: "AnnotationController as ac",
                templateUrl: "annotations/templates/annotation.html",
                resolve: {
                    annotation: ["$stateParams", "AnnotationsService", function ($stateParams, AnnotationsService) {
                        if (!$stateParams.annotationId) {
                            throw Error('Missing route parameter: annotationId. Redirecting to 404 page.');
                        }
                        return AnnotationsService.getAnnotation($stateParams["annotationId"], {
                            fields: [
                                "annotation_id",
                                "category",
                                "status",
                                "entity_type",
                                "entity_id",
                                "entity_submitter_id",
                                "submitter_id",
                                "classification",
                                "notes",
                                "created_datetime",
                                "project.project_id",
                                "case_id",
                                "case_submitter_id",
                            ]
                        });
                    }]
                }
            });
        }
        angular
            .module("ngApp.annotations", [
            "annotations.controller",
            "ui.router.state"
        ])
            .config(annotationsConfig);
    })(annotations = ngApp.annotations || (ngApp.annotations = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        "use strict";
        cartConfig.$inject = ["$stateProvider"];
        function cartConfig($stateProvider) {
            $stateProvider.state("cart", {
                url: "/cart",
                controller: "CartController as cc",
                templateUrl: "cart/templates/cart.html",
                resolve: {
                    files: ["CartService", function (CartService) {
                        return CartService.getFiles();
                    }]
                }
            });
        }
        angular
            .module("ngApp.cart", [
            "cart.controller",
            "cart.services",
            "cart.directives",
            "ngApp.files",
            "ui.router.state",
            "ui.bootstrap"
        ])
            .config(cartConfig);
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));

angular
    .module("components.header", [
    "header.controller",
    "header.directives"
]);

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var xmlviewer;
        (function (xmlviewer) {
            XMLViewer.$inject = ["$window"];
            function XMLViewer($window) {
                return {
                    restrict: "EA",
                    scope: {
                        xml: "="
                    },
                    link: function ($scope) {
                        $window.LoadXMLString("xmlViewer", $scope.xml);
                    }
                };
            }
            angular
                .module("components.xmlviewer", [])
                .directive("xmlViewer", XMLViewer);
        })(xmlviewer = components.xmlviewer || (components.xmlviewer = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets) {
            angular.module("components.facets", [
                "facets.directives"
            ]);
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var directives;
            (function (directives) {
                angular.module("components.tables", [
                    "tables.directives",
                    "tableicious.directive",
                    "tables.services",
                    "pagination.directives"
                ]);
            })(directives = tables.directives || (tables.directives = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function ($templateCache) {
                    $templateCache.put("template/accordion/accordion-group.html", "<div class=\"panel panel-default\">\n" +
                        "  <div class=\"panel-heading\">\n" +
                        "    <h4 class=\"panel-title\">\n" +
                        "      <a class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\">" +
                        "<span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
                        "    </h4>\n" +
                        "  </div>\n" +
                        "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
                        "   <div class=\"list-group\" ng-transclude></div>\n" +
                        "  </div>\n" +
                        "</div>");
                }]);
            angular.module("components.ui", [
                "ui.scroll",
                "ui.file",
                "ui.search",
                "ui.string",
                "ui.control",
                "ui.biospecimen",
                "ui.count-card"
            ]);
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var location;
        (function (location) {
            angular.module("components.location", [
                "location.services"
            ]);
        })(location = components.location || (components.location = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var charts;
        (function (charts) {
            /* @ngInject */
            PieChart.$inject = ["$window", "LocationService", "$state", "$rootScope", "$timeout"];
            ChartLegend.$inject = ["$window"];
            MarkedBarChart.$inject = ["$state"];
            BarChart.$inject = ["$window"];
            function PieChart($window, LocationService, $state, $rootScope, $timeout) {
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
                    link: function ($scope, element) {
                        var tip = d3.tip()
                            .attr("class", "tooltip")
                            .offset([-5, 0])
                            .html(function (d) {
                            return "Further filtering in this view can be performed using the Advanced Search above";
                        });
                        // Used to namespace each resize event
                        var id = "." + $window.Math.round($window.Math.random() * 120000);
                        $scope.$watch("data", function (a) {
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
                            $scope.prunedData = data = _.filter(data.sort(function (a, b) {
                                if (a[config.sortKey] > b[config.sortKey]) {
                                    return -1;
                                }
                                if (b[config.sortKey] > a[config.sortKey]) {
                                    return 1;
                                }
                                return 0;
                            }), function (datum) {
                                return datum[config.sortKey] !== 0;
                            });
                            var color = d3.scale.category20();
                            var outerRadius = height / 2 + 10;
                            var pie = d3.layout.pie()
                                .sort(null)
                                .value(function (d) {
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
                                .each(function (d) { d.outerRadius = outerRadius - 20; })
                                .attr("class", "arc");
                            var gPath = g.append("path");
                            var legendData = {
                                elem: element.find(".chart-container > svg > g"),
                                parent: element,
                                data: []
                            };
                            gPath.attr("d", arc)
                                .each(function (d, i) {
                                legendData.data.push({
                                    color: color(i),
                                    data: d.data
                                });
                            })
                                .style("fill", function (d, i) { return color(i); })
                                .attr("state", function (d) {
                                return config.state ? "true" : "false";
                            })
                                .on("click", setFilters)
                                .on("mouseover.text", function (d) {
                                $scope.showDefault = false;
                                $scope.hoverKey = d.data[config.displayKey];
                                $scope.hoverCount = d.data[config.sortKey];
                                if (!config.hideFileSize) {
                                    $scope.hoverSize = d.data.file_size;
                                }
                                $scope.$apply();
                            })
                                .on("mouseout.text", function () {
                                $scope.showDefault = true;
                                $scope.$apply();
                            })
                                .on("mouseover.legend", function () {
                                element.find(".chart-legend").removeClass("invisible");
                            })
                                .on("mouseout.legend", function () {
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
                                }
                                else {
                                    params = {
                                        filters: config.filters["default"].params.filters(d.data[config.displayKey])
                                    };
                                }
                                if (config.state) {
                                    $state.go(config.state.name, {
                                        filters: params.filters
                                    }, { inherit: false });
                                    return;
                                }
                                var filters = LocationService.filters();
                                if (!filters.content) {
                                    filters.content = [];
                                    filters.op = "and";
                                }
                                var newFilters = angular.fromJson(params.filters);
                                _.forEach(newFilters.content, function (filter) {
                                    var oldFilter = _.find(filters.content, function (oFilter) {
                                        return oFilter.content.field === filter.content.field;
                                    });
                                    if (oldFilter) {
                                        oldFilter.content.value.concat(filter.content.value);
                                    }
                                    else {
                                        filters.content.push(filter);
                                    }
                                });
                                LocationService.setFilters(filters);
                            }
                            function arcTween(outerRadius, delay) {
                                return function () {
                                    d3.select(this).transition().delay(delay).attrTween("d", function (d) {
                                        var i = d3.interpolate(d.outerRadius, outerRadius);
                                        return function (t) { d.outerRadius = i(t); return arc(d); };
                                    });
                                };
                            }
                        }
                        if (element.find(".chart-container").is(":visible")) {
                            updateChart();
                        }
                        $window.$($window).off("resize" + id);
                        $window.$($window).on("resize" + id, _.debounce(function () {
                            if (element.find(".chart-container").is(":visible")) {
                                updateChart();
                            }
                        }, 150));
                        $rootScope.$on("toggleFacets", function () {
                            $timeout(updateChart);
                        });
                    }
                };
            }
            /* @ngInject */
            function ChartLegend($window) {
                return {
                    restrict: "A",
                    replace: true,
                    scope: {
                        data: "=",
                        config: "="
                    },
                    templateUrl: "components/charts/templates/chart-legend.html",
                    link: function ($scope, elem) {
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
                            }
                            else {
                                elem.css("right", left + "px");
                            }
                        }
                        $scope.$watch("data", function (newVal) {
                            if (newVal) {
                                $window.$($window).off("resize" + id);
                                $window.$($window).on("resize" + id, calculateLeft);
                                $scope.displayedData = $scope.data.data;
                                _.defer(function () {
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
                };
            }
            function BarChart($window) {
                return {
                    restrict: "EA",
                    replace: true,
                    scope: {
                        data: "=",
                        height: "@",
                        maxNumBars: "@"
                    },
                    templateUrl: "components/charts/templates/bar-chart.html",
                    link: function ($scope, element) {
                        var sortedData = [];
                        $scope.maxNumBars = $scope.maxNumBars || Number.POSITIVE_INFINITY;
                        var margin = { right: 10, left: 10 };
                        var width = element.parent().parent()[0].clientWidth - margin.left - margin.right;
                        //make sure width is never neg
                        if (width <= 0) {
                            width = 300;
                        }
                        createChart();
                        // Used to namespace each resize event
                        var id = "." + $window.Math.round($window.Math.random() * 120000);
                        $window.$($window).on("resize" + id, _.debounce(function () {
                            resizeChart();
                        }, 150));
                        $scope.$watch("data", function (n, o) {
                            if (n !== o || sortedData.length === 0) {
                                if (n.length != 0) {
                                    var noMissing = _.reject(n, function (datum) { return datum.key === "_missing"; });
                                    sortedData = _.sortBy(noMissing, function (n) { return n.key; });
                                    if (sortedData.length > $scope.maxNumBars) {
                                        var chunked = _.chunk(sortedData, sortedData.length / $scope.maxNumBars);
                                        sortedData = _.map(chunked, function (chunk) {
                                            var keys = _.pluck(chunk, "key");
                                            return { "doc_count": _.sum(chunk, "doc_count"),
                                                "key": keys.length > 1 ? _.min(keys) + "-" + _.max(keys) : _.first(keys)
                                            };
                                        });
                                    }
                                    drawBars();
                                }
                                else {
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
                                .html(function (d) {
                                return d.key + ": " + d.doc_count;
                            });
                            var g = elements
                                .enter().append("g")
                                .attr("transform", function (d) { return "translate(" + x(d.key) + ",0)"; });
                            // an invisible bar with tooltip behind the real bar
                            // so that very short bars still display tooltip
                            g.append("rect")
                                .attr("y", function () { return 0; })
                                .attr("height", function () { return $scope.height; })
                                .attr("width", x.rangeBand())
                                .attr("class", "invisible-bar")
                                .call(tip)
                                .on("mouseover", tip.show)
                                .on("mouseout", tip.hide);
                            g.append("rect")
                                .attr("y", function (d) { return y(d.doc_count); })
                                .attr("height", function (d) { return $scope.height - y(d.doc_count); })
                                .attr("width", x.rangeBand())
                                .attr("class", "bar")
                                .on("mouseover", tip.show)
                                .on("mouseout", tip.hide);
                        }
                    }
                };
            }
            /* @ngInject */
            function MarkedBarChart($state) {
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
                    link: function ($scope, element) {
                        var ASPECT_RATIO = 1.33, CLAMP_HEIGHT = Number.POSITIVE_INFINITY, //470;
                        CLAMP_WIDTH = Number.POSITIVE_INFINITY, NUM_Y_TICKS = 4, PADDING = 25;
                        var _data, _svg, _barChartBoundingBox, _barChartCanvas, _barChartTitle, _barChartLegend,
                        //_barChartMarkerGroup,
                        _barChartCaption,
                        //_barChartBG,
                        _chartMargin, _width, _height, _tipFn, _axisTipFn, _xScale, _yScale, _invYScale, _xAxis, _yAxis, _xAxisGroup, _yAxisGroup, _colourScale, _postFixID = _getUniqueChartID(8);
                        function _getUniqueChartID(size) {
                            var text = "";
                            var possibleVals = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                            for (var i = 0; i < size; i++) {
                                text += possibleVals.charAt(Math.floor(Math.random() * possibleVals.length));
                            }
                            return text;
                        }
                        function _initChartSize() {
                            _height = Math.min(CLAMP_HEIGHT, $scope.height || element.parent().outerHeight());
                            _width = Math.min(CLAMP_WIDTH, $scope.width || element.parent().outerWidth());
                            if (!_svg) {
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
                                    .attr("transform", "translate(" + (Math.round((_width - _barChartLegend.node().getBBox().width) / 2) + _chartMargin.left) + ", 0)");
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
                            _xScale.rangeRoundBands([_chartMargin.left, (_width - _chartMargin.right - _chartMargin.left)], 0.3);
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
                                .tickSize(0, 0);
                            _yAxisGroup
                                .attr("transform", "translate(" + Math.round(_chartMargin.left + PADDING) + ", " + Math.round(_chartMargin.top + 50) + ")")
                                .call(_yAxis)
                                .selectAll("text")
                                .style({
                                "text-anchor": "end",
                                "font-size": "0.8rem",
                                "font-family": "Lucida Grande, Lucida Sans Unicode, Arial, sans-serif"
                            });
                            var yGridLines = _barChartCanvas.selectAll("line.horizontalGrid").data(_invYScale.ticks(NUM_Y_TICKS));
                            yGridLines.enter()
                                .append("line")
                                .classed("horizontalGrid", true);
                            yGridLines.attr({
                                "x1": "-2",
                                "x2": +_barChartBoundingBox.attr("width") - 20,
                                "y1": function (d) { return _invYScale(d); },
                                "y2": function (d) { return _invYScale(d); },
                                "fill": "none",
                                "shape-rendering": "crispEdges",
                                "stroke": "#eee",
                                "stroke-width": function (d) {
                                    if (_invYScale(d) === _barChartBoundingBox.attr("height") || d === 0) {
                                        return "0px";
                                    }
                                    return "1px";
                                },
                                "transform": "translate(" + Math.round(_chartMargin.left + PADDING) + ", " + Math.round(_chartMargin.top + 50) + ")"
                            });
                            _xAxisGroup
                                .attr("transform", "translate(" + Math.round((_chartMargin.left - _xScale.rangeBand()) / 2 + PADDING) + ", " + Math.round(_height - (_chartMargin.bottom / 2)) + ")")
                                .call(_xAxis)
                                .selectAll("text")
                                .style({
                                "text-anchor": "end",
                                "font-size": "10px",
                                "font-family": "Lucida Grande, Lucida Sans Unicode, Arial, sans-serif"
                            })
                                .attr("dy", "0rem")
                                .attr("dx", "-12px")
                                .attr("transform", "rotate(-45)")
                                .on("click", function () {
                                var tick = d3.select(this);
                                var filters = {
                                    "op": "and",
                                    "content": [
                                        {
                                            "op": "in", "content": { "field": "primary_site", "value": tick.data() }
                                        }
                                    ] };
                                $state.go("projects.table", {
                                    filters: JSON.stringify(filters)
                                }, {
                                    inherit: false
                                });
                            });
                            var barGroups = _barChartCanvas.selectAll("g.stacked-rect")
                                .data(_data);
                            barGroups.enter().append("g").classed("stacked-rect", true);
                            barGroups
                                .attr("transform", function (d) { return "translate(" + (_xScale(d._key) - (_xScale.rangeBand() * 4)) + ", " + _height + ")"; })
                                .transition()
                                .delay(function (d, i) {
                                return i / _data.length * 500;
                            })
                                .attr("transform", function (d) {
                                return "translate(" + (_xScale(d._key) + PADDING) + ", " +
                                    (_height - _yScale(d._count) - _chartMargin.bottom + 10) + ")";
                            });
                            var stackedBars = barGroups.selectAll("rect.stacked-bar-item")
                                .data(function (d) { return d.stacks; });
                            stackedBars.enter().append("rect")
                                .classed("bar-item stacked-bar-item", true)
                                .attr("x", 0)
                                .attr("y", 0);
                            var selectionColoursMap = {};
                            //http://stackoverflow.com/questions/1664140/js-function-to-calculate-complementary-colour
                            //convert to hsl, shift the hue 180, return hex string
                            var hueShift = function (h, s) { h += s; while (h >= 360.0)
                                h -= 360.0; while (h < 0.0)
                                h += 360.0; return h; };
                            var getReadableComplementaryColour = function (colour) {
                                var c = d3.hsl(colour);
                                c.h = hueShift(c.h ? c.h : 0, 180);
                                // bump s & l for readability
                                if (c.s < 0.4) {
                                    c.s += 0.5;
                                }
                                c.l = 0.5;
                                return c.toString();
                            };
                            stackedBars
                                .attr("y", function (d) { return _yScale(d.y0); })
                                .attr("width", _xScale.rangeBand())
                                .attr("height", function (d) { return _yScale(d.y1) - _yScale(d.y0); })
                                .attr("fill", function (d, i) {
                                d._colour = _colourScale(d._key);
                                if (i === 0) {
                                    selectionColoursMap[d._key] = getReadableComplementaryColour(d._colour);
                                }
                                if (i > 0) {
                                    d._colour = d3.hsl(d._colour).darker(i % (Math.random() * 2) + 0.1 * i, -0.2).toString();
                                }
                                return d._colour;
                            })
                                .call(_tipFn)
                                .on("click", function (d) {
                                _tipFn.hide(d);
                                $state.go("project", {
                                    projectId: d.projectID
                                }, { inherit: false });
                            })
                                .on("mouseover", function (d) {
                                var bar = d3.select(this);
                                bar.interrupt()
                                    .transition();
                                _svg.append('rect')
                                    .classed('chart-focus', true)
                                    .attr("transform", function () { return "translate(" + (_xScale(d._key) - (_xScale.rangeBand() * 4)) + ", " + _height + ")"; })
                                    .attr('width', _xScale.rangeBand())
                                    .attr('height', function () { return _yScale(d.y1) - _yScale(d.y0); })
                                    .attr('fill', 'none')
                                    .attr('stroke', selectionColoursMap[d._key])
                                    .attr('stroke-width', 2)
                                    .attr('y', _yScale(d.y0))
                                    .attr("transform", function () {
                                    var totalCount = _data.reduce(function (total, d2) { return d2._key === d._key ? d2._count : total; }, 0);
                                    return "translate(" + (_xScale(d._key) + PADDING) + ", " + (_height - _yScale(totalCount) - _chartMargin.bottom + 10) + ")";
                                });
                                _tipFn.show(d);
                            })
                                .on("mouseout", function (d) {
                                var bar = d3.select(this), barColour = d._colour;
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
                            jQuery(window).on(hoverEventName, _.debounce(function () {
                                _initChartSize();
                                _renderBars();
                            }, 200));
                            $scope.$on("$destroy", function () {
                                jQuery(window).unbind(hoverEventName);
                            });
                            $scope.$watch(function () {
                                return $scope.data;
                            }, function (newData, oldData) {
                                if (!_.isArray(newData) || newData.length === 0 || (newData === oldData && _data)) {
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
                                    .domain(_.map(_data, function (d) { return d._key; }));
                                _yScale = d3.scale.linear()
                                    .clamp(true)
                                    .domain([0, d3.max(_data, function (d) { return d._maxY; })]);
                                _invYScale = d3.scale.linear()
                                    .clamp(true)
                                    .domain([0, d3.max(_data, function (d) { return d._maxY; })]);
                                _colourScale = d3.scale.category20c()
                                    .domain(_.map(_data, function (d) { return d._key; }));
                                _renderBars();
                            });
                        }
                        function _initChart() {
                            _chartMargin = $scope.margins || { top: 0, bottom: 40, left: 20, right: 20 };
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
        })(charts = components.charts || (components.charts = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var overrides;
    (function (overrides) {
        angular.module("components.overrides", [
            "overrides.directives"
        ]);
    })(overrides = ngApp.overrides || (ngApp.overrides = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var user;
        (function (user) {
            angular.module("components.user", [
                "user.services"
            ]);
        })(user = components.user || (components.user = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var githut;
        (function (githut) {
            /* @ngInject */
            function GitHut() {
                return {
                    restrict: "AE",
                    scope: {
                        config: "=",
                        data: "="
                    },
                    replace: true,
                    templateUrl: "components/githut/templates/graph.html",
                    controller: "GitHutController as ghc"
                };
            }
            angular.module("components.githut", ["githut.controllers"])
                .directive("gitHut", GitHut);
        })(githut = components.githut || (components.githut = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var gql;
        (function (gql) {
            gqlInput.$inject = ["$window", "$document", "$compile", "$timeout", "Restangular", "GqlService", "GqlTokens"];
            gqlDropdown.$inject = ["$interval"];
            var KeyCode;
            (function (KeyCode) {
                KeyCode[KeyCode["Space"] = 32] = "Space";
                KeyCode[KeyCode["Enter"] = 13] = "Enter";
                KeyCode[KeyCode["Esc"] = 27] = "Esc";
                KeyCode[KeyCode["Left"] = 37] = "Left";
                KeyCode[KeyCode["Right"] = 39] = "Right";
                KeyCode[KeyCode["Up"] = 38] = "Up";
                KeyCode[KeyCode["Down"] = 40] = "Down";
            })(KeyCode || (KeyCode = {}));
            var Mode;
            (function (Mode) {
                Mode[Mode["Field"] = 0] = "Field";
                Mode[Mode["Quoted"] = 1] = "Quoted";
                Mode[Mode["Unquoted"] = 2] = "Unquoted";
                Mode[Mode["List"] = 3] = "List";
                Mode[Mode["Op"] = 4] = "Op";
            })(Mode || (Mode = {}));
            var Cycle;
            (function (Cycle) {
                Cycle[Cycle["Up"] = -1] = "Up";
                Cycle[Cycle["Down"] = 1] = "Down";
            })(Cycle || (Cycle = {}));
            var GqlService = (function () {
                /* @ngInject */
                GqlService.$inject = ["$timeout", "$document", "FilesService", "ParticipantsService", "GqlTokens"];
                function GqlService($timeout, $document, FilesService, ParticipantsService, GqlTokens) {
                    var _this = this;
                    this.$timeout = $timeout;
                    this.$document = $document;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.GqlTokens = GqlTokens;
                    this._isValidField = function (validFields, node) {
                        if (validFields === void 0) { validFields = []; }
                        if (node === void 0) { node = {}; }
                        return _.includes(validFields, (node.field || ''));
                    };
                    this._findBogusFields = function (gqlTree, isValidField) {
                        if (gqlTree === void 0) { gqlTree = {}; }
                        if (isValidField === void 0) { isValidField = function () { return false; }; }
                        return [].concat(gqlTree).reduce(function (acc, g) {
                            var content = g.content || {};
                            var newFinding = _.isArray(content) ?
                                // recursion ahead - if stack overflow is a concern here (it shouldn't be), rewrite this with proper tail call (for ES6).
                                _this._findBogusFields(content, isValidField) :
                                (isValidField(content) ? '' : (content.field || ''));
                            return acc.concat(newFinding);
                        }, []);
                    };
                    this.findInvalidFields = function (validFields, gqlTree) {
                        if (validFields === void 0) { validFields = []; }
                        if (gqlTree === void 0) { gqlTree = {}; }
                        var result = _this._findBogusFields(gqlTree, _.partial(_this._isValidField, validFields));
                        return _.unique(result)
                            .filter(function (f) { return f.length > 0; });
                    };
                }
                GqlService.prototype.getPos = function (element) {
                    if (element.selectionStart) {
                        return element.selectionStart;
                    }
                    else if (this.$document.selection) {
                        element.focus();
                        var sel = this.$document.selection.createRange();
                        var selLen = this.$document.selection.createRange().text.length;
                        sel.moveStart('character', -element.value.length);
                        return sel.text.length - selLen;
                    }
                };
                GqlService.prototype.setPos = function (element, caretPos) {
                    if (element.createTextRange) {
                        var range = element.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    }
                    else {
                        element.focus();
                        if (element.selectionStart !== undefined) {
                            this.$timeout(function () { return element.setSelectionRange(caretPos, caretPos); });
                        }
                    }
                };
                GqlService.prototype.countNeedle = function (stack, needle) {
                    // http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript
                    return stack.split(needle).length - 1;
                };
                GqlService.prototype.isCountOdd = function (stack, needle) {
                    return this.countNeedle(stack, needle) % 2 !== 0;
                };
                GqlService.prototype.isUnbalanced = function (stack, start, end) {
                    var numStart = this.countNeedle(stack, start);
                    var numEnd = this.countNeedle(stack, end);
                    return numStart > numEnd;
                };
                GqlService.prototype.contains = function (phrase, sub) {
                    if (sub.length === 0)
                        return true;
                    var phraseStr = (phrase + this.GqlTokens.NOTHING).toLowerCase();
                    return phraseStr.indexOf((sub + this.GqlTokens.NOTHING).toLowerCase()) > -1;
                };
                GqlService.prototype.clean = function (e) {
                    return (e !== undefined) && [
                        '[A-Za-z0-9\\-_.]',
                        '[0-9]',
                        'whitespace',
                        'newline',
                        'end of input',
                        '_missing',
                        this.GqlTokens.QUOTE,
                        this.GqlTokens.LPARENS
                    ].indexOf(e) == -1;
                };
                GqlService.prototype.getStartOfList = function (s) {
                    var bracket = s.lastIndexOf(this.GqlTokens.LBRACKET);
                    return bracket === -1 ? s.length : bracket + 1;
                };
                GqlService.prototype.getEndOfList = function (s) {
                    return s.indexOf(this.GqlTokens.RBRACKET) !== -1
                        ? s.indexOf(this.GqlTokens.RBRACKET)
                        : s.length;
                };
                GqlService.prototype.getValuesOfList = function (s) {
                    var _this = this;
                    return s.split(this.GqlTokens.COMMA).map(function (x) {
                        return x.trim().split(_this.GqlTokens.QUOTE).join(_this.GqlTokens.NOTHING);
                    });
                };
                GqlService.prototype.cleanNeedle = function (s) {
                    return s.trim()
                        .replace(this.GqlTokens.QUOTE, this.GqlTokens.NOTHING)
                        .replace(this.GqlTokens.LBRACKET, this.GqlTokens.NOTHING)
                        .replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING);
                };
                GqlService.prototype.getNeedleFromList = function (s) {
                    return this.cleanNeedle(_.last(this.getValuesOfList(s)));
                };
                GqlService.prototype.getParts = function (s) {
                    var parts = s.split(this.GqlTokens.SPACE);
                    var needle = this.cleanNeedle(parts[parts.length - 1] || '');
                    var op = parts[parts.length - 2] || '';
                    var field = parts[parts.length - 3] || '';
                    if (field) {
                        field = field.replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING);
                    }
                    return { field: field, needle: needle, op: op.toUpperCase() };
                };
                GqlService.prototype.getComplexParts = function (s, n) {
                    var parts = this.getParts(s.substring(0, n));
                    parts.needle = this.getNeedleFromList(s.substring(n));
                    return parts;
                };
                GqlService.prototype.splitField = function (s) {
                    var xs = s.split(this.GqlTokens.PERIOD);
                    return {
                        docType: xs.shift(),
                        facet: xs.join(this.GqlTokens.PERIOD)
                    };
                };
                GqlService.prototype.isQuoted = function (s) {
                    return s.toString().indexOf(this.GqlTokens.SPACE) !== -1;
                };
                GqlService.prototype.ajaxRequest = function (field) {
                    var parts = this.splitField(field);
                    var params = {
                        facets: [parts.facet],
                        size: 0,
                        filters: {}
                    };
                    if (parts.docType === "files") {
                        return this.FilesService.getFiles(params)
                            .then(function (fs) {
                            var f = (fs.aggregations || {})[parts.facet] || [];
                            return _.map(f.buckets, function (b) {
                                return { field: b.key, full: b.key };
                            });
                        });
                    }
                    else {
                        return this.ParticipantsService.getParticipants(params)
                            .then(function (fs) {
                            var f = (fs.aggregations || {})[parts.facet] || [];
                            return _.map(f.buckets, function (b) {
                                return { field: b.key, full: b.key };
                            });
                        });
                    }
                };
                GqlService.prototype.parseGrammarError = function (needle, error) {
                    var _this = this;
                    // Handles GQL Parser errors
                    return _.map(_.filter(error.expected, function (e) {
                        return _this.contains(e.description, needle) && _this.clean(e.description);
                    }), function (m) {
                        var val = m.description ? m.description : m.value;
                        return {
                            field: val,
                            full: val
                        };
                    });
                };
                GqlService.prototype.getLastComma = function (s) {
                    return s.lastIndexOf(this.GqlTokens.COMMA) + 1;
                };
                GqlService.prototype.getFirstComma = function (s) {
                    return s.indexOf(this.GqlTokens.COMMA);
                };
                GqlService.prototype.getListContent = function (left, listStart, right) {
                    var lComma = this.getLastComma(left);
                    lComma = lComma === 0 ? listStart : lComma;
                    var rComma = this.getFirstComma(right);
                    var listEnd = this.getEndOfList(right);
                    return left.substring(listStart, lComma) + right.substring(rComma + 1, listEnd);
                };
                GqlService.prototype.parseList = function (left, right) {
                    /*
                    * ... FIELD OP [vvv, vvv, nnn|xxx, vvv, vvv] ...
                    * FIELD = field searching on
                    * OP = operator using on search
                    * | = current cursor position
                    * nnn = active part of value - used in filtering
                    * xxx = ignored - NOT used in filtering and removed after adding new value
                    * vvv = other values in the list
                    * ... = uninteresting parts of the query
                    *
                    * Requirements for List:
                    *  - Get the beginning of the list
                    *  - Get the end of the list
                    *  - Get the values of the list
                    *  - Get active search term
                    *  - Autocomplete values for FIELD
                    *  - Remove current values from autocomplete
                    */
                    // Get the beginning of the list
                    var listStart = this.getStartOfList(left);
                    // Get the values of the list
                    var listContent = this.getListContent(left, listStart, right);
                    // Get array of list values
                    var listValues = this.getValuesOfList(listContent);
                    // Get all the fields needed for Ajax
                    return {
                        parts: this.getComplexParts(left, listStart),
                        listValues: listValues
                    };
                };
                GqlService.prototype.ajaxList = function (parts, listValues) {
                    var _this = this;
                    // Autocomplete suggestions
                    return this.ajaxRequest(parts.field).then(function (d) {
                        return _.filter(d, function (m) {
                            // Filter out values that are already in the list
                            return m && m.full && listValues.indexOf(m.field.toString()) === -1 &&
                                _this.contains(m.full.toString(), parts.needle) &&
                                _this.clean(m.full.toString());
                        });
                    });
                };
                GqlService.prototype.parseQuoted = function (left) {
                    /*
                   * ... FIELD OP "nnn nnn|xxx ...
                   * FIELD = field searching on
                   * OP = operator using on search
                   * | = current cursor position
                   * nnn = active part of value - used in filtering
                   * xxx = ignored - NOT used in filtering and removed after adding new value
                   * ... = uninteresting parts of the query
                   *
                   * Requirements for List:
                   *  - Get the beginning of the quoted term
                   *  - Get active search term
                   *  - Autocomplete values for FIELD
                   */
                    // Get the last quote
                    var lastQuote = left.lastIndexOf(this.GqlTokens.QUOTE);
                    // Get all the fields needed for Ajax
                    return this.getComplexParts(left, lastQuote);
                };
                GqlService.prototype.ajaxQuoted = function (parts) {
                    var _this = this;
                    // Autocomplete suggestions
                    return this.ajaxRequest(parts.field).then(function (d) {
                        return _.filter(d, function (m) {
                            return m && m.full && _this.contains(m.full.toString(), parts.needle) &&
                                _this.clean(m.full.toString());
                        });
                    });
                };
                GqlService.prototype.lhsRewrite = function (left, needleLength) {
                    return left.substring(0, left.length - needleLength);
                };
                GqlService.prototype.rhsRewrite = function (right) {
                    var rFirstSpace = right.indexOf(this.GqlTokens.SPACE);
                    var tokenIndex = rFirstSpace === -1 ? right.length : rFirstSpace;
                    return right.substring(tokenIndex);
                };
                GqlService.prototype.rhsRewriteQuoted = function (right) {
                    var rFirstSpace = right.search(/[a-z]"/i);
                    return right.substring(rFirstSpace + 2);
                };
                GqlService.prototype.rhsRewriteList = function (right) {
                    var bracket = right.indexOf(this.GqlTokens.RBRACKET);
                    var comma = right.indexOf(this.GqlTokens.COMMA);
                    // is there a comma before the ] - if yes use that
                    var pos = comma >= 0 && comma < bracket ? comma : bracket;
                    // other wise is there a ] at all - then use that
                    // else end of line
                    pos = pos === -1 ? right.length : pos;
                    return right.substring(pos);
                };
                GqlService.prototype.humanError = function (s, e) {
                    var right = s.substring(e.location.start.offset);
                    var space = right.indexOf(this.GqlTokens.SPACE);
                    space = space === -1 ? right.length : space;
                    var token = right.substring(0, space);
                    if (e.found) {
                        e.message = e.message.replace(/but.*$/, "but \"" + token + "\" found.");
                    }
                    return e.location.start.line + " : " + e.location.start.column + " - " + e.message;
                };
                return GqlService;
            }());
            /* @ngInject */
            function gqlInput($window, $document, $compile, $timeout, Restangular, GqlService, GqlTokens) {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: {
                        gql: '=',
                        query: '=',
                        error: '='
                    },
                    templateUrl: "components/gql/templates/gql.html",
                    link: function ($scope, element) {
                        $document.on('click', function (e) {
                            if (element !== e.target && !element[0].contains(e.target)) {
                                $scope.$apply(function () {
                                    $scope.onBlur();
                                });
                            }
                        });
                        $document.on('keydown', function (e) {
                            var key = e.which || e.keyCode;
                            if (key === KeyCode.Esc) {
                                $scope.onBlur();
                            }
                        });
                        var INACTIVE = -1;
                        var T = GqlTokens;
                        var mapping;
                        var validFields = [];
                        Restangular.all('gql').get('_mapping', {}).then(function (m) {
                            mapping = m;
                            validFields = _.keys(mapping);
                            gqlParse();
                        });
                        $scope.active = INACTIVE;
                        $scope.offset = 0;
                        $scope.limit = 10;
                        $scope.onChange = function () {
                            $scope.focused = true;
                            $scope.active = INACTIVE;
                            gqlParse();
                            var index = GqlService.getPos(element[0]);
                            $scope.left = $scope.query.substring(0, index);
                            $scope.right = $scope.query.substring(index);
                            var left = $scope.left;
                            var right = $scope.right;
                            $scope.parts = GqlService.getParts(left);
                            if ($scope.error && _.some($scope.error.expected, function (e) {
                                return [T.IN, T.AND].indexOf(e.description) !== -1;
                            })) {
                                $scope.mode = Mode.Op;
                                var ddItems = GqlService.parseGrammarError($scope.parts.needle, $scope.error);
                                $scope.ddItems = ddItems.filter(function (item) {
                                    var op = mapping[$scope.parts.op.toLowerCase()] || {};
                                    if (['long', 'integer'].indexOf(op.type || '') !== -1) {
                                        return [T.EQ, T.NE, T.GT, T.GTE, T.LT, T.LTE, T.IS, T.NOT].indexOf(item.full.toString()) !== -1;
                                    }
                                    else if ((op.full || '').toString().indexOf('datetime') != -1) {
                                        return [T.GT, T.GTE, T.LT, T.LTE, T.IS, T.NOT].indexOf(item.full.toString()) !== -1;
                                    }
                                    else {
                                        return [T.EQ, T.NE, T.IN, T.EXCLUDE, T.IS, T.NOT].indexOf(item.full.toString()) !== -1;
                                    }
                                });
                            }
                            else if ($scope.error && _.some($scope.error.expected, function (e) {
                                return [T.MISSING].indexOf(e.description) !== -1;
                            })) {
                                $scope.mode = Mode.Unquoted;
                                $scope.ddItems = GqlService.parseGrammarError($scope.parts.needle, $scope.error);
                            }
                            else {
                                if ([T.IN, T.EXCLUDE].indexOf($scope.parts.op) !== -1 ||
                                    GqlService.isUnbalanced(left, T.LBRACKET, T.RBRACKET)) {
                                    // in_list_of_values
                                    $scope.mode = Mode.List;
                                    var ret = GqlService.parseList(left, right);
                                    $scope.parts = ret.parts;
                                    GqlService.ajaxList($scope.parts, ret.listValues).then(function (d) {
                                        $scope.ddItems = d;
                                    });
                                }
                                else if (GqlService.isCountOdd(left, T.QUOTE)) {
                                    //in_quoted_string
                                    $scope.mode = Mode.Quoted;
                                    $scope.parts = GqlService.parseQuoted(left);
                                    GqlService.ajaxQuoted($scope.parts).then(function (d) {
                                        $scope.ddItems = d;
                                    });
                                }
                                else {
                                    if (($scope.parts.needle.toUpperCase() && !$scope.parts.op) || [T.AND, T.OR].indexOf($scope.parts.op) !== -1) {
                                        // is_field_string
                                        $scope.mode = Mode.Field;
                                        $scope.ddItems = _.filter(mapping, function (m) {
                                            return (m &&
                                                m.full &&
                                                GqlService.clean(m.full.toString()) &&
                                                (GqlService.contains(m.full.toString(), $scope.parts.needle.replace(T.LPARENS, T.NOTHING)) ||
                                                    GqlService.contains(m.type, $scope.parts.needle.replace(T.LPARENS, T.NOTHING)) ||
                                                    GqlService.contains(m.description, $scope.parts.needle.replace(T.LPARENS, T.NOTHING))));
                                        });
                                    }
                                    else if ([T.EQ, T.NE].indexOf($scope.parts.op) !== -1) {
                                        // is_value_string is_unquoted_string
                                        $scope.mode = Mode.Unquoted;
                                        GqlService.ajaxRequest($scope.parts.field).then(function (d) {
                                            $scope.ddItems = _.filter(d, function (m) {
                                                return m && m.full && GqlService.contains(m.full.toString(), $scope.parts.needle) && GqlService.clean(m.full.toString());
                                            });
                                        });
                                    }
                                }
                            }
                        };
                        function gqlParse() {
                            if (validFields.length === 0)
                                return;
                            try {
                                $scope.gql = $window.gql.parse($scope.query);
                                $scope.error = null;
                                var invalids = GqlService.findInvalidFields(validFields, $scope.gql.filters);
                                if (invalids.length > 0) {
                                    throw new Error('' + invalids.length + ' invalid field' +
                                        ((invalids.length > 1) ? 's' : '') +
                                        ' found: ' + invalids.join(', '));
                                }
                            }
                            catch (Error) {
                                Error.human = Error.location ?
                                    GqlService.humanError($scope.query, Error) :
                                    Error.message;
                                $scope.error = Error;
                                $scope.gql = null;
                            }
                        }
                        $scope.setActive = function (active) {
                            if ($scope.active >= 0)
                                $scope.ddItems[$scope.active].active = false;
                            $scope.ddItems[active].active = true;
                            $scope.active = active;
                        };
                        $scope.cycle = function (val) {
                            $scope.showResults();
                            var active = $scope.active + val;
                            if (active >= $scope.ddItems.length) {
                                active = 0;
                                $scope.offset = 0;
                            }
                            else if (active < 0) {
                                active = $scope.ddItems.length - 1;
                                if ($scope.ddItems.length > $scope.limit) {
                                    $scope.offset = $scope.ddItems.length - $scope.limit;
                                }
                            }
                            else if (active >= $scope.offset + $scope.limit) {
                                $scope.offset++;
                            }
                            else if (active < $scope.offset) {
                                $scope.offset--;
                            }
                            $scope.setActive(active);
                        };
                        $scope.showResults = function () {
                            var results = $scope.ddItems ? !!$scope.ddItems.length : false;
                            var bool = !!($scope.focused && $scope.query.length > 0 && results);
                            if (!bool)
                                $scope.offset = 0;
                            return bool;
                        };
                        $scope.keypress = function (e) {
                            var key = e.which || e.keyCode;
                            switch (key) {
                                case KeyCode.Enter:
                                    e.preventDefault();
                                    if ($scope.showResults()) {
                                        $scope.enter();
                                    }
                                    break;
                                case KeyCode.Up:
                                    e.preventDefault();
                                    if ($scope.showResults()) {
                                        $scope.cycle(Cycle.Up);
                                    }
                                    break;
                                case KeyCode.Down:
                                    e.preventDefault();
                                    if ($scope.showResults()) {
                                        $scope.cycle(Cycle.Down);
                                    }
                                    else {
                                        $scope.onChange();
                                    }
                                    break;
                                case KeyCode.Space:
                                    if ($scope.mode !== Mode.Quoted) {
                                        $scope.ddItems = [];
                                        gqlParse();
                                        if ($scope.query && !$scope.error) {
                                            $scope.ddItems = [{
                                                    field: 'AND',
                                                    full: 'AND'
                                                }, {
                                                    field: 'OR',
                                                    full: 'OR'
                                                }];
                                        }
                                    }
                                    break;
                                case KeyCode.Esc:
                                    clearActive();
                                    break;
                                case KeyCode.Left:
                                case KeyCode.Right:
                                default:
                                    //   $scope.onChange();
                                    break;
                            }
                        };
                        function clearActive() {
                            if ($scope.ddItems && $scope.ddItems[$scope.active]) {
                                $scope.ddItems[$scope.active].active = false;
                            }
                            $scope.ddItems = [];
                            $scope.active = INACTIVE;
                            $scope.focused = false;
                        }
                        $scope.enter = function (item) {
                            item = item || ($scope.active === INACTIVE ? $scope.ddItems[0] : $scope.ddItems[$scope.active]);
                            var needleLength = $scope.parts.needle.length;
                            // Quote the value if it has a space so the parse can handle it
                            if (GqlService.isQuoted(item.full))
                                item.full = T.QUOTE + item.full + T.QUOTE;
                            // After selecting a value close the autocomplete
                            clearActive();
                            var left = $scope.left;
                            var right = $scope.right;
                            if ([Mode.Field, Mode.Op, Mode.Unquoted].indexOf($scope.mode) !== -1) {
                                var newLeft = GqlService.lhsRewrite(left, needleLength);
                                var newRight = GqlService.rhsRewrite(right);
                                var insert = [T.IN, T.EXCLUDE].indexOf(item.full.toString().toUpperCase()) !== -1
                                    ? item.full.toString() + T.SPACE + T.LBRACKET
                                    : item.full;
                                $scope.query = newLeft + insert + newRight;
                                GqlService.setPos(element[0], (newLeft + insert).length);
                            }
                            else if ($scope.mode === Mode.Quoted) {
                                var newLeft = GqlService.lhsRewrite(left, needleLength + 1);
                                var newRight = GqlService.rhsRewriteQuoted(right);
                                $scope.query = newLeft + item.full + newRight;
                                GqlService.setPos(element[0], (newLeft + item.full).length);
                            }
                            else if ($scope.mode === Mode.List) {
                                if (GqlService.isCountOdd(left, T.QUOTE))
                                    needleLength++;
                                // [OICR-925] Auto insert [ if not there already
                                // if (left.substr(-4).toUpperCase() === T.SPACE + T.IN + T.SPACE) left += T.LBRACKET;
                                var newLeft = GqlService.lhsRewrite(left, needleLength);
                                var newRight = GqlService.rhsRewriteList(right);
                                $scope.query = newLeft + item.full + newRight;
                                GqlService.setPos(element[0], (newLeft + item.full).length);
                            }
                            gqlParse();
                        };
                        function blur() {
                            clearActive();
                        }
                        $scope.onBlur = blur;
                        $scope.focus = function () {
                            element[0].focus();
                            $scope.focused = true;
                        };
                        gqlParse();
                        element.after($compile('<gql-dropdown></gql-dropdown>')($scope));
                    }
                };
            }
            /* @ngInject */
            function gqlDropdown($interval) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: "components/gql/templates/gql_dropdown.html",
                    link: function ($scope) {
                        $scope.click = function (item) { return $scope.enter(item); };
                        $scope.mouseIn = function (idx) { return $scope.setActive(idx + $scope.offset); };
                        $scope.handleOnClickUpArrow = function () {
                            $scope.focus();
                            if ($scope.offset > 0)
                                $scope.cycle(Cycle.Up);
                        };
                        $scope.handleOnClickDownArrow = function () {
                            $scope.focus();
                            if ($scope.ddItems.length > $scope.offset + $scope.limit)
                                $scope.cycle(Cycle.Down);
                        };
                    }
                };
            }
            var Tokens = {
                EQ: "=",
                NE: "!=",
                GT: ">",
                GTE: ">=",
                LT: "<",
                LTE: "<=",
                IN: "IN",
                EXCLUDE: "EXCLUDE",
                OR: "OR",
                AND: "AND",
                IS: "IS",
                NOT: "NOT",
                MISSING: "MISSING",
                LBRACKET: '[',
                RBRACKET: ']',
                LPARENS: '(',
                RPARENS: ')',
                QUOTE: '"',
                SPACE: ' ',
                COMMA: ',',
                NOTHING: '',
                PERIOD: '.'
            };
            angular.module("components.gql", [
                "gql.filters",
            ])
                .service("GqlService", GqlService)
                .directive("gql", gqlInput)
                .directive("gqlDropdown", gqlDropdown)
                .constant('GqlTokens', Tokens);
        })(gql = components.gql || (components.gql = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

/// <reference path="header/module"/>
/// <reference path="xmlviewer/xmlviewer.directive.ts"/>
/// <reference path="facets/module"/>
/// <reference path="tables/module"/>
/// <reference path="ui/module"/>
/// <reference path="location/module"/>
/// <reference path="charts/chart.directives.ts"/>
/// <reference path="overrides/module"/>
/// <reference path="user/module"/>
/// <reference path="githut/module"/>
/// <reference path="gql/module"/>
angular
    .module("ngApp.components", [
    "components.header",
    "components.xmlviewer",
    "components.facets",
    "components.tables",
    "components.ui",
    "components.location",
    "components.charts",
    "components.overrides",
    "components.user",
    "components.githut",
    "components.gql",
    "components.quickSearch",
    "components.summaryCard",
    "components.downloader"
]);

angular
    .module("ngApp.core", [
    "core.controller",
    "core.directives",
    "core.services",
    "core.filters"
])
    .constant('DATA_TYPES', {
    GEQ: { full: "Gene Expression Quantification", abbr: "GEQ" }
})
    .constant('DATA_CATEGORIES', {
    SEQ: { full: "Sequencing Reads", abbr: "Seq" },
    EXP: { full: "Transcriptome Profiling", abbr: "Exp" },
    SNV: { full: "Simple Nucleotide Variation", abbr: "SNV" },
    CNV: { full: "Copy Number Variation", abbr: "CNV" },
    CLINICAL: { full: "Clinical", abbr: "Clinical" },
    BIOSPECIMEN: { full: "Biospecimen", abbr: "Bio" }
});

var ngApp;
(function (ngApp) {
    var files;
    (function (files) {
        "use strict";
        /* @ngInject */
        filesConfig.$inject = ["$stateProvider"];
        function filesConfig($stateProvider) {
            $stateProvider.state("file", {
                url: "/files/:fileId",
                controller: "FileController as fc",
                templateUrl: "files/templates/file.html",
                resolve: {
                    file: ["$stateParams", "FilesService", function ($stateParams, FilesService) {
                        if (!$stateParams.fileId) {
                            throw Error('Missing route parameter: fileId. Redirecting to 404 page.');
                        }
                        return FilesService.getFile($stateParams["fileId"], {
                            expand: [
                                "metadata_files"
                            ],
                            fields: [
                                "state",
                                "md5sum",
                                "access",
                                "data_format",
                                "data_type",
                                "data_category",
                                "file_name",
                                "file_size",
                                "file_id",
                                "platform",
                                "experimental_strategy",
                                "center.short_name",
                                "cases.case_id",
                                "cases.project.project_id",
                                "cases.samples.sample_type",
                                "cases.samples.portions.portion_id",
                                "cases.samples.portions.analytes.analyte_id",
                                "cases.samples.portions.analytes.aliquots.aliquot_id",
                                "annotations.annotation_id",
                                "annotations.entity_id",
                                "tags",
                                "submitter_id",
                                "archive.archive_id",
                                "archive.submitter_id",
                                "archive.revision",
                                "associated_entities.entity_id",
                                "associated_entities.entity_type",
                                "associated_entities.case_id",
                                "analysis.analysis_id",
                                "analysis.workflow_type",
                                "analysis.updated_datetime",
                                "analysis.input_files.file_id",
                                "analysis.metadata.read_groups.read_group_id",
                                "analysis.metadata.read_groups.is_paired_end",
                                "analysis.metadata.read_groups.read_length",
                                "analysis.metadata.read_groups.library_name",
                                "analysis.metadata.read_groups.sequencing_center",
                                "analysis.metadata.read_groups.sequencing_date",
                                "downstream_analyses.output_files.access",
                                "downstream_analyses.output_files.file_id",
                                "downstream_analyses.output_files.file_name",
                                "downstream_analyses.output_files.data_category",
                                "downstream_analyses.output_files.data_type",
                                "downstream_analyses.output_files.data_format",
                                "downstream_analyses.workflow_type",
                                "downstream_analyses.output_files.file_size",
                                "index_files.file_id"
                            ]
                        });
                    }]
                }
            });
        }
        angular
            .module("ngApp.files", [
            "files.controller",
            "files.directives",
            "ui.router.state"
        ])
            .config(filesConfig);
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var home;
    (function (home) {
        "use strict";
        /* @ngInject */
        homeConfig.$inject = ["$stateProvider"];
        function homeConfig($stateProvider) {
            $stateProvider.state("home", {
                url: "/",
                controller: "HomeController as hc",
                templateUrl: "home/templates/home.html"
            });
        }
        angular
            .module("ngApp.home", [
            "home.controller",
            "ui.router.state"
        ])
            .config(homeConfig);
    })(home = ngApp.home || (ngApp.home = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var participants;
    (function (participants) {
        "use strict";
        /* @ngInject */
        participantsConfig.$inject = ["$stateProvider"];
        function participantsConfig($stateProvider) {
            $stateProvider.state("case", {
                url: "/cases/:caseId?{bioId:any}",
                controller: "ParticipantController as pc",
                templateUrl: "participant/templates/participant.html",
                resolve: {
                    participant: ["$stateParams", "ParticipantsService", function ($stateParams, ParticipantsService) {
                        if (!$stateParams.caseId) {
                            throw Error('Missing route parameter: caseId. Redirecting to 404 page.');
                        }
                        return ParticipantsService.getParticipant($stateParams["caseId"], {
                            fields: [
                                "case_id",
                                "submitter_id",
                                "annotations.annotation_id"
                            ],
                            expand: [
                                "demographic",
                                "diagnoses",
                                "diagnoses.treatments",
                                "exposures",
                                "family_histories",
                                "files",
                                "project",
                                "project.program",
                                "summary",
                                "summary.experimental_strategies",
                                "summary.data_categories",
                                "samples",
                                "samples.portions",
                                "samples.portions.analytes",
                                "samples.portions.analytes.aliquots",
                                "samples.portions.analytes.aliquots.annotations",
                                "samples.portions.analytes.annotations",
                                "samples.portions.submitter_id",
                                "samples.portions.slides",
                                "samples.portions.annotations",
                                "samples.portions.center",
                            ]
                        });
                    }]
                }
            });
        }
        angular
            .module("ngApp.participants", [
            "participants.controller",
            "ui.router.state"
        ])
            .config(participantsConfig);
    })(participants = ngApp.participants || (ngApp.participants = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        "use strict";
        /* ngInject */
        projectsConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
        function projectsConfig($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("/projects", "/projects/t");
            $stateProvider.state("projects", {
                url: "/projects?filters",
                controller: "ProjectsController as prsc",
                templateUrl: "projects/templates/projects.html",
                reloadOnSearch: false
            });
            $stateProvider.state("projects.table", {
                url: "/t",
                data: {
                    tab: "table"
                },
                reloadOnSearch: false
            });
            $stateProvider.state("projects.graph", {
                url: "/g",
                data: {
                    tab: "graph"
                },
                reloadOnSearch: false
            });
            $stateProvider.state("project", {
                url: "/projects/:projectId",
                controller: "ProjectController as prc",
                templateUrl: "projects/templates/project.html",
                resolve: {
                    project: ["$stateParams", "ProjectsService", function ($stateParams, ProjectsService) {
                        if (!$stateParams.projectId) {
                            throw Error('Missing route parameter: projectId. Redirecting to 404 page.');
                        }
                        return ProjectsService.getProject($stateParams["projectId"], {
                            fields: [
                                "name",
                                "program.name",
                                "primary_site",
                                "project_id",
                                "disease_type",
                                "summary.case_count",
                                "summary.file_count"
                            ],
                            expand: [
                                "summary.data_categories",
                                "summary.experimental_strategies"
                            ]
                        });
                    }]
                }
            });
        }
        angular
            .module("ngApp.projects", [
            "projects.controller",
            "tables.services",
            "ui.router.state"
        ])
            .config(projectsConfig);
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var query;
    (function (query) {
        "use strict";
        /* @ngInject */
        queryConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
        function queryConfig($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("/query", "/query/f");
            $stateProvider.state("query", {
                url: "/query?query&filters&pagination",
                controller: "QueryController as qc",
                templateUrl: "query/templates/query.html",
                reloadOnSearch: false
            });
            $stateProvider.state("query.summary", {
                url: "/s",
                data: {
                    tab: "summary"
                },
                reloadOnSearch: false
            });
            $stateProvider.state("query.participants", {
                url: "/c",
                data: {
                    tab: "participants"
                },
                reloadOnSearch: false
            });
            $stateProvider.state("query.files", {
                url: "/f",
                data: {
                    tab: "files"
                },
                reloadOnSearch: false
            });
        }
        angular
            .module("ngApp.query", [
            "query.controller",
            "ui.router.state"
        ])
            .config(queryConfig);
    })(query = ngApp.query || (ngApp.query = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var reports;
    (function (reports) {
        "use strict";
        reportsConfig.$inject = ["$stateProvider"];
        var reportServiceExpand = [
            "data_access",
            "data_subtypes",
            "tags",
            "countries",
            "data_formats",
            "experimental_strategies",
            "platforms",
            "user_access_types",
            "data_types",
            "centers"
        ];
        /* @ngInject */
        function reportsConfig($stateProvider) {
            $stateProvider.state("reports", {
                url: "/reports/data-download-statistics",
                controller: "ReportsController as rsc",
                templateUrl: "reports/templates/reports.html",
                resolve: {
                    reports: ["ReportsService", function (ReportsService) {
                        return ReportsService.getReports({
                            expand: reportServiceExpand
                        });
                    }]
                }
            });
        }
        angular
            .module("ngApp.reports", [
            "reports.controller",
            "ui.router.state"
        ])
            .value("reportServiceExpand", reportServiceExpand)
            .config(reportsConfig);
    })(reports = ngApp.reports || (ngApp.reports = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        "use strict";
        /* @ngInject */
        searchConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
        function searchConfig($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("/search", "/search/f");
            $stateProvider.state("search", {
                url: "/search?{filters:any}&pagination&{facetTab:string}",
                controller: "SearchController as sc",
                templateUrl: "search/templates/search.html",
                reloadOnSearch: false
            });
            $stateProvider.state("search.summary", {
                url: "/s",
                data: {
                    tab: "summary"
                },
                reloadOnSearch: false
            });
            $stateProvider.state("search.participants", {
                url: "/c",
                data: {
                    tab: "participants"
                },
                reloadOnSearch: false
            });
            $stateProvider.state("search.files", {
                url: "/f",
                data: {
                    tab: "files"
                },
                reloadOnSearch: false
            });
        }
        angular
            .module("ngApp.search", [
            "search.controller",
            "ui.router.state"
        ])
            .config(searchConfig);
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));

// LIBS DEFINITION
/// <reference path="../../typings/main.d.ts"/>
// APP TYPES
/// <reference path="404/module.ts"/>
/// <reference path="annotations/module.ts"/>
/// <reference path="cart/module.ts"/>
/// <reference path="components/module.ts"/>
/// <reference path="core/module.ts"/>
/// <reference path="files/module.ts"/>
/// <reference path="home/module.ts"/>
/// <reference path="participant/module.ts"/>
/// <reference path="projects/module.ts"/>
/// <reference path="query/module.ts"/>
/// <reference path="reports/module.ts"/>
/// <reference path="search/module.ts"/>
/// <reference path="search/module.ts"/>

/// <reference path="./types.ts"/>
function logVersionInfo(config) {
    console.groupCollapsed("%câ˜… UI Git Info\n"
        + "=============", "color: rgb(173, 30, 30); font-weight: bold;");
    console.info("%cTag: %c" + config.tag, "font-weight: bold;", "color: rgb(89, 139, 214);");
    console.info("%cCommit Link: %c" + config.commitLink, "font-weight: bold;", "color: rgb(89, 139, 214);");
    console.groupEnd();
    console.groupCollapsed("%câ˜… API Git Info\n"
        + "==============", "color: rgb(173, 30, 30); font-weight: bold;");
    console.info("%cTag: %c" + config.apiTag, "font-weight: bold;", "color: rgb(89, 139, 214);");
    console.info("%cCommit Link: %c" + config.apiCommitLink, "font-weight: bold;", "color: rgb(89, 139, 214);");
    console.groupEnd();
}
// Cross-Site Request Forgery (CSRF) Prevention
// https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#General_Recommendation:_Synchronizer_Token_Pattern
function addTokenToRequest(element, operation, route, url, headers, params, httpConfig) {
    var csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return {
        element: element,
        headers: _.extend(headers, { 'X-CSRFToken': csrftoken }),
        params: params,
        httpConfig: httpConfig
    };
}
/* @ngInject */
function appConfig($urlRouterProvider, $locationProvider, RestangularProvider, config, $compileProvider, $httpProvider) {
    $compileProvider.debugInfoEnabled(!config.production);
    // $locationProvider.html5Mode(true);
    // $urlRouterProvider.otherwise("/404");
    RestangularProvider.setBaseUrl(config.api);
    RestangularProvider.setDefaultHttpFields({
        cache: true
    });
    /**
    The regex is from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie in Example #2.
    Cookies are stored in document.cookie as "cookieName1=cookieValue; cookieName2=cookieValue"
    so the capturing group after the "csrftoken=" captures the value and places it into var csrftoken.
    Unable to use $cookies because services can't be injected in config step
    **/
    var csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrftoken;
}
/* @ngInject */
function appRun(gettextCatalog, Restangular, $state, CoreService, $rootScope, config, notify, $cookies, UserService, ProjectsService, $window, $uibModalStack, LocalStorageService) {
    if (navigator.cookieEnabled && $cookies.get("GDC-Portal-Sha") !== config.commitHash) {
        $cookies.put("GDC-Portal-Sha", config.commitHash);
        ["Projects-col", "Annotations-col", "Files-col", "Cases-col",
            "Cart-col", "gdc-cart-items", "gdc-cart-updated", "gdc-facet-config"
        ].forEach(function (item) { return LocalStorageService.removeItem(item); });
    }
    gettextCatalog.debug = true;
    $rootScope.config = config;
    Restangular.addFullRequestInterceptor(addTokenToRequest);
    Restangular.addResponseInterceptor(function (data, operation, model, url, response, deferred) {
        // Ajax
        CoreService.xhrDone();
        if (response.headers('content-disposition')) {
            return deferred.resolve({ 'data': data, 'headers': response.headers() });
        }
        else {
            return deferred.resolve(data);
        }
    });
    Restangular.all('status').get('').then(function (data) {
        config.apiVersion = data['tag'];
        config.apiCommitHash = data['commit'];
        config.apiTag = "https://github.com/NCI-GDC/gdcapi/releases/tag/" + config.apiVersion;
        config.apiCommitLink = "https://github.com/NCI-GDC/gdcapi/commit/" + config.apiCommitHash;
        logVersionInfo(config);
        if (+data.version !== +config.supportedAPI) {
            config.apiIsMismatched = true;
        }
    }, function (response) {
        notify.config({ duration: 60000 });
        notify.closeAll();
        notify({
            message: "",
            messageTemplate: "<span>\n          Unable to connect to the GDC API. Make sure you have accepted the Security Certificate. <br>\n          If not, please click <a target='_blank' href=\"" + config.api + "/status\">here</a>\n          and accept the Security Certificate\n        </span>",
            container: "#notification",
            classes: "alert-danger"
        });
    });
    UserService.login();
    ProjectsService.getProjects({ size: 100 })
        .then(function (data) {
        ProjectsService.projectIdMapping =
            data.hits.reduce(function (acc, project) {
                acc[project.project_id] = project.name;
                return acc;
            }, {});
    });
    $rootScope.$on("$stateChangeStart", function () {
        // Page change
        //CoreService.setLoadedState(false);
        // Close all notifcation windows
        notify.closeAll();
    });
    $rootScope.$on("$stateChangeSuccess", function () {
        // Page change
        CoreService.setLoadedState(true);
    });
    $rootScope.$on("$stateChangeError", function () {
        $state.go("404", {}, { location: "replace" });
    });
}
angular
    .module("ngApp", [
    "cgNotify",
    "ngProgressLite",
    "ngAnimate",
    "ngAria",
    "ngCookies",
    "ngSanitize",
    "ngApp.config",
    "ui.router.state",
    "ui.bootstrap",
    "restangular",
    "gettext",
    "ngTagsInput",
    "ui.sortable",
    "ngApp.core",
    "ngApp.search",
    "ngApp.query",
    "ngApp.participants",
    "ngApp.files",
    "ngApp.annotations",
    "ngApp.home",
    "ngApp.projects",
    "ngApp.cases",
    "ngApp.components",
    "ngApp.cart",
    "ngApp.notFound",
    "ngApp.reports",
    "templates"
])
    .config(appConfig)
    .factory('RestFullResponse', ["Restangular", function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setFullResponse(true);
    })
        .addFullRequestInterceptor(addTokenToRequest);
}])
    // .run(appRun)
    .factory('AuthRestangular', ["Restangular", "config", "CoreService", function (Restangular, config, CoreService) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(config.auth);
        RestangularConfigurer.setDefaultHttpFields({ cache: false });
    })
        .addFullRequestInterceptor(addTokenToRequest)
        .addResponseInterceptor(function (data, operation, model, url, response, deferred) {
        // Ajax
        CoreService.xhrDone();
        if (response.headers('content-disposition')) {
            return deferred.resolve({ 'data': data, 'headers': response.headers() });
        }
        else {
            return deferred.resolve(data);
        }
    });
}]);

var ngApp;
(function (ngApp) {
    var notFound;
    (function (notFound) {
        var controllers;
        (function (controllers) {
            var NotFoundController = (function () {
                /* @ngInject */
                NotFoundController.$inject = ["CoreService"];
                function NotFoundController(CoreService) {
                    this.CoreService = CoreService;
                    CoreService.setPageTitle("404 - Not Found");
                }
                return NotFoundController;
            }());
            angular
                .module("notFound.controller", [
                "core.services"
            ])
                .controller("NotFoundController", NotFoundController);
        })(controllers = notFound.controllers || (notFound.controllers = {}));
    })(notFound = ngApp.notFound || (ngApp.notFound = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var annotations;
    (function (annotations) {
        var controllers;
        (function (controllers) {
            var AnnotationsController = (function () {
                /* @ngInject */
                AnnotationsController.$inject = ["$scope", "$rootScope", "AnnotationsService", "CoreService", "AnnotationsTableModel", "FacetService"];
                function AnnotationsController($scope, $rootScope, AnnotationsService, CoreService, AnnotationsTableModel, FacetService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.AnnotationsService = AnnotationsService;
                    this.CoreService = CoreService;
                    this.AnnotationsTableModel = AnnotationsTableModel;
                    this.FacetService = FacetService;
                    CoreService.setPageTitle("Annotations");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("annotations") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    $scope.tableConfig = AnnotationsTableModel;
                    this.refresh();
                }
                AnnotationsController.prototype.refresh = function () {
                    var _this = this;
                    this.$rootScope.$emit('ShowLoadingScreen');
                    this.AnnotationsService.getAnnotations({
                        fields: this.AnnotationsTableModel.fields,
                        facets: this.FacetService.filterFacets(this.AnnotationsTableModel.facets)
                    }).then(function (data) {
                        _this.$rootScope.$emit('ClearLoadingScreen');
                        if (!data.hits.length) {
                            _this.CoreService.setSearchModelState(true);
                        }
                        _this.annotations = data;
                    });
                };
                return AnnotationsController;
            }());
            var AnnotationController = (function () {
                /* @ngInject */
                AnnotationController.$inject = ["annotation", "ProjectsService", "CoreService"];
                function AnnotationController(annotation, ProjectsService, CoreService) {
                    this.annotation = annotation;
                    this.ProjectsService = ProjectsService;
                    this.CoreService = CoreService;
                    CoreService.setPageTitle("Annotation", annotation.annotation_id);
                }
                return AnnotationController;
            }());
            angular
                .module("annotations.controller", [
                "annotations.services",
                "core.services",
                "annotations.table.model"
            ])
                .controller("AnnotationsController", AnnotationsController)
                .controller("AnnotationController", AnnotationController);
        })(controllers = annotations.controllers || (annotations.controllers = {}));
    })(annotations = ngApp.annotations || (ngApp.annotations = {}));
})(ngApp || (ngApp = {}));



var ngApp;
(function (ngApp) {
    var annotations;
    (function (annotations) {
        var services;
        (function (services) {
            var AnnotationsService = (function () {
                /* @ngInject */
                AnnotationsService.$inject = ["Restangular", "LocationService", "CoreService", "$rootScope", "$q", "UserService"];
                function AnnotationsService(Restangular, LocationService, CoreService, $rootScope, $q, UserService) {
                    this.LocationService = LocationService;
                    this.CoreService = CoreService;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.UserService = UserService;
                    this.ds = Restangular.all("annotations");
                }
                AnnotationsService.prototype.getAnnotation = function (id, params) {
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    return this.ds.get(id, params).then(function (response) {
                        return response["data"];
                    });
                };
                AnnotationsService.prototype.getAnnotations = function (params) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("facets")) {
                        params["facets"] = params["facets"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    var paging = angular.fromJson(this.LocationService.pagination()["annotations"]);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || 'entity_type:asc',
                        filters: this.LocationService.filters()
                    };
                    defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "annotations.project.project_id");
                    this.CoreService.setSearchModelState(false);
                    var abort = this.$q.defer();
                    var prom = this.ds.withHttpConfig({
                        timeout: abort.promise
                    })
                        .get("", angular.extend(defaults, params)).then(function (response) {
                        _this.CoreService.setSearchModelState(true);
                        return response["data"];
                    });
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                        _this.CoreService.setSearchModelState(true);
                    });
                    return prom;
                };
                return AnnotationsService;
            }());
            angular
                .module("annotations.services", [
                "restangular",
                "components.location",
                "user.services",
                "core.services"
            ])
                .service("AnnotationsService", AnnotationsService);
        })(services = annotations.services || (annotations.services = {}));
    })(annotations = ngApp.annotations || (ngApp.annotations = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var models;
        (function (models) {
            var AnnotationsTableModel = {
                title: "Annotations",
                rowId: 'annotation_id',
                headings: [
                    {
                        name: "ID",
                        id: "annotation_id",
                        td: function (row) { return '<a href="annotations/' + row.annotation_id + '">' + row.annotation_id + '</a>'; },
                        sortable: true,
                        tdClassName: 'id-cell',
                        toolTipText: function (row) { return row.annotation_id; }
                    },
                    {
                        name: "Case UUID",
                        id: "case_id",
                        td: function (row) { return '<a href="cases/' + row.case_id + '">' + row.case_id + '</a>'; },
                        sortable: true,
                        tdClassName: 'id-cell',
                        toolTipText: function (row) { return row.case_id; }
                    },
                    {
                        name: "Program",
                        id: "project.program.name",
                        td: function (row) { return row.project && row.project.program && row.project.program.name; },
                        sortable: true,
                        hidden: true
                    },
                    {
                        name: "Project",
                        id: "project.project_id",
                        td: function (row) { return row.project && '<a href="projects/' + row.project.project_id +
                            '">' + row.project.project_id + '</a>'; },
                        sortable: true,
                        toolTipText: function (row) { return row.project.name; }
                    },
                    {
                        name: "Entity Type",
                        id: "entity_type",
                        td: function (row, $scope) { return $scope.$filter("humanify")(row.entity_type); },
                        sortable: true
                    },
                    {
                        name: "Entity ID",
                        id: "entity_id",
                        td: function (row) {
                            return '<a data-ui-sref="case({ caseId: row.case_id, bioId: row.entity_id, \'#\': \'biospecimen\' })">'
                                + row.entity_id
                                + '</a>';
                        },
                        sortable: true,
                        tdClassName: 'id-cell',
                        toolTipText: function (row) { return row.entity_id; }
                    },
                    {
                        name: "Entity Barcode",
                        id: "entity_submitter_id",
                        td: function (row) { return row.entity_submitter_id; },
                        sortable: true,
                        hidden: true
                    },
                    {
                        name: "Category",
                        id: "category",
                        td: function (row) { return row.category; },
                        tdClassName: 'white-space-wrap',
                        sortable: true
                    },
                    {
                        name: "Classification",
                        id: "classification",
                        td: function (row) { return row.classification; },
                        sortable: true
                    },
                    {
                        name: "Created Date",
                        id: "created_datetime",
                        td: function (row, $scope) { return row.created_datetime && $scope.$filter('date')(row.created_datetime, 'yyyy-MM-dd'); }
                    },
                    {
                        name: "Status",
                        id: "status",
                        td: function (row) { return row.status; },
                        sortable: true,
                        hidden: true
                    },
                    {
                        name: "Notes",
                        id: "notes",
                        td: function (row) { return row.notes; },
                        sortable: false,
                        hidden: true
                    }
                ],
                fields: [
                    "annotation_id",
                    "category",
                    "created_datetime",
                    "status",
                    "entity_type",
                    "entity_id",
                    "entity_submitter_id",
                    "notes",
                    "classification",
                    "case_id",
                    "notes",
                    "project.program.name",
                    "project.project_id",
                    "project.name",
                ],
                facets: [
                    {
                        name: 'annotation_id',
                        facetType: 'free-text'
                    }, {
                        name: 'classification',
                        facetType: 'terms'
                    }, {
                        name: 'category',
                        facetType: 'terms'
                    }, {
                        name: 'created_datetime',
                        facetType: 'range'
                    }, {
                        name: 'status',
                        facetType: 'terms'
                    }, {
                        name: 'entity_type',
                        facetType: 'terms'
                    }, {
                        name: 'project.primary_site',
                        facetType: 'terms'
                    }, {
                        name: 'project.program.name',
                        facetType: 'terms'
                    }, {
                        name: 'project.project_id',
                        facetType: 'terms'
                    }]
            };
            angular.module("annotations.table.model", [])
                .value("AnnotationsTableModel", AnnotationsTableModel);
        })(models = projects.models || (projects.models = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        var controllers;
        (function (controllers) {
            var CartController = (function () {
                /* @ngInject */
                CartController.$inject = ["$scope", "$state", "$filter", "files", "CoreService", "CartService", "UserService", "CartTableModel", "Restangular", "SearchService", "FilesService", "ParticipantsService", "CartState"];
                function CartController($scope, $state, $filter, files, CoreService, CartService, UserService, CartTableModel, Restangular, SearchService, FilesService, ParticipantsService, CartState) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.files = files;
                    this.CoreService = CoreService;
                    this.CartService = CartService;
                    this.UserService = UserService;
                    this.CartTableModel = CartTableModel;
                    this.Restangular = Restangular;
                    this.SearchService = SearchService;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.CartState = CartState;
                    this.helpHidden = false;
                    this.defaultFiles = {
                        hits: [],
                        pagination: {
                            count: 0,
                            total: 0,
                            size: 0,
                            from: 0,
                            page: 0,
                            pages: 0,
                            sort: ''
                        }
                    };
                    var data = $state.current.data || {};
                    this.CartState.setActive("tabs", data.tab);
                    this.lastModified = this.CartService.lastModified;
                    this.cartTableConfig = CartTableModel;
                    this.CartService.reloadFromLocalStorage();
                    this.refresh();
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("cart") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("cart-update", function (event) {
                        _this.refresh();
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    this.projectCountChartConfig = {
                        textValue: "file_size",
                        textFilter: "size",
                        filterKey: "file_size",
                        label: "file",
                        sortKey: "doc_count",
                        displayKey: "key",
                        sortData: true,
                        defaultText: "project",
                        pluralDefaultText: "projects"
                    };
                    this.fileCountChartConfig = {
                        textValue: "file_size",
                        textFilter: "size",
                        label: "file",
                        sortKey: "doc_count",
                        displayKey: "key",
                        sortData: true,
                        defaultText: "authorization level",
                        pluralDefaultText: "authorization levels"
                    };
                    this.clinicalDataExportFilters = this.biospecimenDataExportFilters = {
                        'files.file_id': this.CartService.getFileIds()
                    };
                    this.clinicalDataExportExpands = ['demographic', 'diagnoses', 'family_histories', 'exposures'];
                    this.clinicalDataExportFileName = 'clinical.cart';
                    this.biospecimenDataExportExpands =
                        ['samples', 'samples.portions', 'samples.portions.analytes', 'samples.portions.analytes.aliquots',
                            'samples.portions.analytes.aliquots.annotations', 'samples.portions.analytes.annotations',
                            'samples.portions.submitter_id', 'samples.portions.slides', 'samples.portions.annotations',
                            'samples.portions.center'];
                    this.biospecimenDataExportFileName = 'biospecimen.cart';
                }
                CartController.prototype.getSummary = function () {
                    var _this = this;
                    var filters = {
                        op: "and",
                        content: [
                            {
                                op: "in",
                                content: {
                                    field: "files.file_id",
                                    value: this.CartService.getFileIds()
                                }
                            }
                        ]
                    };
                    this.SearchService.getSummary(filters, true).then(function (data) {
                        _this.summary = data;
                    });
                    var UserService = this.UserService;
                    var authCountAndFileSizes = _.reduce(this.CartService.getFiles(), function (result, file) {
                        var canDownloadKey = UserService.userCanDownloadFile(file) ? 'authorized' : 'unauthorized';
                        result[canDownloadKey].count += 1;
                        result[canDownloadKey].file_size += file.file_size;
                        return result;
                    }, { 'authorized': { 'count': 0, 'file_size': 0 }, 'unauthorized': { 'count': 0, 'file_size': 0 } });
                    this.fileCountChartData = _.filter([
                        {
                            key: 'authorized',
                            doc_count: authCountAndFileSizes.authorized.count || 0,
                            file_size: authCountAndFileSizes.authorized.file_size
                        },
                        {
                            key: 'unauthorized',
                            doc_count: authCountAndFileSizes.unauthorized.count || 0,
                            file_size: authCountAndFileSizes.unauthorized.file_size
                        }
                    ], function (i) { return i.doc_count; });
                };
                CartController.prototype.refresh = function () {
                    var _this = this;
                    var fileIds = this.CartService.getFileIds();
                    this.CoreService.setPageTitle("Cart", "(" + fileIds.length + ")");
                    // in the event that our cart is empty
                    if (fileIds.length < 1) {
                        this.files = {};
                        return;
                    }
                    var filters = { 'content': [{ 'content': { 'field': 'files.file_id', 'value': fileIds }, 'op': 'in' }], 'op': 'and' };
                    var fileOptions = {
                        filters: filters,
                        fields: [
                            'access',
                            'file_name',
                            'file_id',
                            'data_type',
                            'data_format',
                            'file_size',
                            'annotations.annotation_id',
                            'cases.case_id',
                            'cases.project.project_id',
                            'cases.project.name'
                        ]
                    };
                    this.FilesService.getFiles(fileOptions, 'POST').then(function (data) {
                        _this.files = _this.files || {};
                        if (!_.isEqual(_this.files.hits, data.hits)) {
                            _this.files = data;
                            _this.ParticipantsService.getParticipants({ filters: filters, size: 0 }, 'POST')
                                .then(function (data) {
                                _this.participantCount = data.pagination.total;
                            });
                        }
                    }).finally(function () { return _this.getSummary(); });
                };
                CartController.prototype.getTotalSize = function () {
                    return _.reduce(this.files, function (sum, hit) {
                        return sum + hit.file_size;
                    }, 0);
                };
                CartController.prototype.getFileIds = function () {
                    return _.pluck(this.files, "file_id");
                };
                CartController.prototype.getRelatedFileIds = function () {
                    return _.reduce(this.files, function (ids, file) {
                        return ids.concat(file.related_ids);
                    }, []);
                };
                CartController.prototype.removeAll = function () {
                    // edge case where there is only 1 file in the cart,
                    // need to pass the file to CartService.remove because CartService
                    // does not store file names and the file name is displayed in
                    // remove notification
                    if (this.files.pagination.count === 1) {
                        this.CartService.remove(this.files.hits);
                    }
                    else {
                        this.CartService.removeAll();
                    }
                    this.lastModified = this.CartService.lastModified;
                    this.files = {};
                };
                CartController.prototype.getManifest = function (selectedOnly) {
                    if (selectedOnly === void 0) { selectedOnly = false; }
                    this.FilesService.downloadManifest(_.pluck(this.CartService.getFiles(), "file_id"), function (complete) {
                        if (complete) {
                            return true;
                        }
                    });
                };
                return CartController;
            }());
            var LoginToDownloadController = (function () {
                /* @ngInject */
                LoginToDownloadController.$inject = ["$uibModalInstance"];
                function LoginToDownloadController($uibModalInstance) {
                    this.$uibModalInstance = $uibModalInstance;
                }
                LoginToDownloadController.prototype.cancel = function () {
                    this.$uibModalInstance.close(false);
                };
                LoginToDownloadController.prototype.goAuth = function () {
                    this.$uibModalInstance.close(true);
                };
                return LoginToDownloadController;
            }());
            var AddToCartSingleCtrl = (function () {
                /* @ngInject */
                AddToCartSingleCtrl.$inject = ["CartService"];
                function AddToCartSingleCtrl(CartService) {
                    this.CartService = CartService;
                }
                AddToCartSingleCtrl.prototype.addToCart = function () {
                    if (this.CartService.getCartVacancySize() < 1) {
                        this.CartService.sizeWarning();
                        return;
                    }
                    this.CartService.addFiles([this.file], true);
                };
                AddToCartSingleCtrl.prototype.removeFromCart = function () {
                    this.CartService.remove([this.file]);
                };
                return AddToCartSingleCtrl;
            }());
            var AddToCartAllCtrl = (function () {
                /* @ngInject */
                AddToCartAllCtrl.$inject = ["CartService", "UserService", "LocationService", "FilesService", "$timeout", "notify"];
                function AddToCartAllCtrl(CartService, UserService, LocationService, FilesService, $timeout, notify) {
                    this.CartService = CartService;
                    this.UserService = UserService;
                    this.LocationService = LocationService;
                    this.FilesService = FilesService;
                    this.$timeout = $timeout;
                    this.notify = notify;
                    this.CartService = CartService;
                }
                AddToCartAllCtrl.prototype.removeAll = function () {
                    var _this = this;
                    // Query ES using the current filter and the file uuids in the Cart
                    // If an id is in the result, then it is both in the Cart and in the current Search query
                    var filters = this.filter || this.LocationService.filters();
                    var size = this.CartService.getFiles().length;
                    if (!filters.content) {
                        filters.op = "and";
                        filters.content = [];
                    }
                    filters.content.push({
                        content: {
                            field: "files.file_id",
                            value: _.pluck(this.CartService.getFiles(), "file_id")
                        },
                        op: "in"
                    });
                    this.FilesService.getFiles({
                        fields: ["file_id", "file_name"],
                        filters: filters,
                        size: size,
                        from: 0
                    }, 'POST').then(function (data) {
                        _this.CartService.remove(data.hits);
                    });
                };
                AddToCartAllCtrl.prototype.getFiles = function () {
                    var filters = (this.filter ? JSON.parse(this.filter) : undefined) || this.LocationService.filters();
                    filters = this.UserService.addMyProjectsFilter(filters, "cases.project.project_id");
                    return this.FilesService.getFiles({
                        fields: [
                            "access",
                            "file_id",
                            "file_size",
                            "cases.project.project_id",
                        ],
                        filters: filters,
                        sort: "",
                        size: this.size,
                        from: 0
                    });
                };
                AddToCartAllCtrl.prototype.addAll = function (files) {
                    var _this = this;
                    if (files === void 0) { files = []; }
                    if (files.length) {
                        if (files.length > this.CartService.getCartVacancySize()) {
                            this.CartService.sizeWarning();
                        }
                        else {
                            this.CartService.addFiles(files, false);
                        }
                    }
                    else {
                        if (this.size > this.CartService.getCartVacancySize()) {
                            this.CartService.sizeWarning();
                        }
                        else {
                            var addingMsgPromise = this.$timeout(function () {
                                _this.notify({
                                    message: "",
                                    messageTemplate: "<span data-translate>Adding <strong>" + _this.size + "</strong> files to cart</span>",
                                    container: "#notification",
                                    classes: "alert-info"
                                });
                            }, 1000);
                            this.getFiles().then(function (data) {
                                _this.CartService.addFiles(data.hits, false);
                                _this.$timeout.cancel(addingMsgPromise);
                            }).catch(function (e) { return console.log(e); });
                        }
                    }
                };
                return AddToCartAllCtrl;
            }());
            angular
                .module("cart.controller", [
                "cart.services",
                "core.services",
                "user.services",
                "cart.table.model",
                "search.services"
            ])
                .controller("LoginToDownloadController", LoginToDownloadController)
                .controller("AddToCartAllCtrl", AddToCartAllCtrl)
                .controller("AddToCartSingleCtrl", AddToCartSingleCtrl)
                .controller("CartController", CartController);
        })(controllers = cart.controllers || (cart.controllers = {}));
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        var directives;
        (function (directives) {
            // remove from cart page
            AddToCartAllDropDown.$inject = ["SearchTableFilesModel"];
            DownloadMetadataFiles.$inject = ["CartService", "$uibModal", "config"];
            AddToCartAllButton.$inject = ["SearchTableFilesModel"];
            AddToCartFiltered.$inject = ["SearchTableFilesModel"];
            DownloadButtonAllCart.$inject = ["UserService", "CartService", "$uibModal", "config"];
            DownloadManifestCart.$inject = ["CartService", "$uibModal", "config"];
            function RemoveSingleCart() {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {},
                    bindToController: {
                        file: '='
                    },
                    templateUrl: "cart/templates/remove-single.html",
                    controllerAs: 'ctrl',
                    controller: ["$scope", "CartService", function ($scope, CartService) {
                        disabled: boolean = false;
                        this.remove = function () {
                            CartService.remove([this.file]);
                            this.disabled = true;
                        };
                    }]
                };
            }
            // add/remove to cart on file search page
            function AddToCartSingleIcon() {
                return {
                    restrict: 'E',
                    scope: {},
                    bindToController: {
                        file: '='
                    },
                    templateUrl: 'cart/templates/add-to-cart-button-single.html',
                    controller: 'AddToCartSingleCtrl as ctrl'
                };
            }
            // add/remove to cart on file entity page
            function AddToCartSingleLabelled() {
                return {
                    restrict: 'E',
                    scope: {},
                    replace: true,
                    bindToController: {
                        file: '='
                    },
                    templateUrl: 'cart/templates/add-to-cart-button-labelled.html',
                    controller: 'AddToCartSingleCtrl as ctrl'
                };
            }
            // add to cart on summary
            function AddToCartAllButton(SearchTableFilesModel) {
                return {
                    restrict: 'E',
                    scope: {},
                    bindToController: {
                        files: '=',
                        filter: '@',
                        size: '='
                    },
                    templateUrl: "cart/templates/add-to-cart-all-button.html",
                    controller: "AddToCartAllCtrl as ctrl"
                };
            }
            // add to cart dropdown on top of file search
            function AddToCartAllDropDown(SearchTableFilesModel) {
                return {
                    restrict: 'E',
                    scope: {},
                    bindToController: {
                        files: '=',
                        size: '@'
                    },
                    templateUrl: "cart/templates/add-to-cart-all-dropdown.html",
                    controller: "AddToCartAllCtrl as ctrl"
                };
            }
            // add to cart dropdown on cases search table
            function AddToCartFiltered(SearchTableFilesModel) {
                return {
                    restrict: "E",
                    scope: {},
                    bindToController: {
                        row: "="
                    },
                    controllerAs: 'ctrl',
                    templateUrl: "cart/templates/add-to-cart-button-filtered.html",
                    controller: ["$scope", "CartService", "LocationService", "FilesService", "ParticipantsService", function ($scope, CartService,
                        //QueryCartService: IQueryCartService,
                        LocationService, FilesService, ParticipantsService) {
                        var _this = this;
                        this.files = [];
                        this.CartService = CartService;
                        function areFiltersApplied(content) {
                            return content && _.some(content, function (item) {
                                var content = item.hasOwnProperty('content') ? item.content : item;
                                return content.field.indexOf("files.") === 0;
                            });
                        }
                        function getContent() {
                            var content = LocationService.filters().content;
                            return content && !Array.isArray(content) ? [content] : content;
                        }
                        var content = getContent();
                        this.areFiltersApplied = areFiltersApplied(content);
                        $scope.$on("$locationChangeSuccess", function () {
                            var content = getContent();
                            _this.areFiltersApplied = areFiltersApplied(content);
                        });
                        this.getFiles = function () {
                            var _this = this;
                            this.retrievingFiles = true;
                            var filters = LocationService.filters();
                            if (filters.op !== "and") {
                                filters = { op: "and", content: [filters] };
                            }
                            var uuid = this.row.case_id;
                            filters.content.push({
                                content: {
                                    field: "files.cases.case_id",
                                    value: [
                                        uuid
                                    ]
                                },
                                op: "in"
                            });
                            if (this.areFiltersApplied) {
                                FilesService.getFiles({
                                    fields: ["file_name", "file_id", "cases.project_id", "access"],
                                    expand: [],
                                    filters: filters,
                                    size: CartService.getCartVacancySize()
                                }).then(function (data) {
                                    _this.retrievingFiles = _this.files.length ? false : true;
                                    _this.filteredRelatedFiles = data;
                                });
                            }
                            if (!this.files.length) {
                                ParticipantsService.getParticipant(uuid, {
                                    fields: [
                                        "case_id",
                                        "submitter_id",
                                        "annotations.annotation_id",
                                        "project.project_id",
                                        "project.name",
                                        'files.access',
                                        'files.file_name',
                                        'files.file_id',
                                        'files.file_size',
                                        'files.data_type',
                                        'files.data_format'
                                    ]
                                }).then(function (data) {
                                    if (_this.areFiltersApplied) {
                                        _this.retrievingFiles = _this.filteredRelatedFiles ? false : true;
                                    }
                                    else {
                                        _this.retrievingFiles = false;
                                    }
                                    var fs = _.map(data.files, function (f) {
                                        f.cases = [{
                                                case_id: data.case_id,
                                                project: {
                                                    project_id: data.project.project_id,
                                                    name: data.project.name
                                                }
                                            }];
                                    });
                                    _this.files = data.files;
                                    _this.calculateFileCount();
                                });
                            }
                        };
                        this.addFilteredRelatedFiles = function () {
                            var filters = LocationService.filters();
                            if (filters.op !== "and") {
                                filters = { op: "and", content: [filters] };
                            }
                            var uuid = this.row.case_id;
                            filters.content.push({
                                content: {
                                    field: "files.cases.case_id",
                                    value: [
                                        uuid
                                    ]
                                },
                                op: "in"
                            });
                            CartService.addFiles(this.filteredRelatedFiles.hits);
                        };
                        this.addRelatedFiles = function () {
                            var uuid = this.row.case_id;
                            CartService.addFiles(this.files);
                        };
                        this.removeRelatedFiles = function () {
                            CartService.remove(this.inBoth);
                        };
                        this.calculateFileCount = function () {
                            this.inBoth = this.files.reduce(function (acc, f) {
                                if (CartService.getFiles().find(function (cartF) { return cartF.file_id === f.file_id; })) {
                                    return acc.concat(f);
                                }
                                return acc;
                            }, []);
                        };
                    }]
                };
            }
            /** This directive, which can be placed anywhere, removes any unauthorized files from the cart **/
            function RemoveUnauthorizedFilesButton() {
                return {
                    restrict: "AE",
                    templateUrl: "cart/templates/remove-unauthorized-files.button.html",
                    replace: true,
                    controller: ["$scope", "$element", "UserService", "CartService", "FilesService", function ($scope, $element, UserService, CartService, FilesService) {
                        //todo
                        $scope.$watch(function () {
                            return CartService.getUnauthorizedFiles();
                        }, function (f) {
                            $scope.files = f;
                        }, true);
                        $scope.remove = function () {
                            CartService.remove($scope.files);
                        };
                    }]
                };
            }
            function DownloadManifestCart(CartService, $uibModal, config) {
                return {
                    restrict: "AE",
                    scope: true,
                    link: function ($scope, $element, $attrs) {
                        $element.on('click', function () {
                            $scope.active = false;
                            var reportStatus = _.isFunction($scope.$parent.reportStatus) ?
                                _.partial($scope.$parent.reportStatus, $scope.$id) :
                                function () { };
                            var inProgress = function () {
                                $scope.active = true;
                                reportStatus($scope.active);
                                $attrs.$set('disabled', 'disabled');
                            };
                            var done = function () {
                                $scope.active = false;
                                reportStatus($scope.active);
                                $element.removeAttr('disabled');
                            };
                            var files = [].concat(CartService.getFiles());
                            var params = { ids: files.map(function (f) { return f.file_id; }) };
                            var url = config.auth_api + '/manifest?annotations=true&related_files=true';
                            var checkProgress = $scope.download(params, url, function () { return $element; }, 'POST');
                            checkProgress(inProgress, done);
                        });
                    }
                };
            }
            function DownloadMetadataFiles(CartService, $uibModal, config) {
                return {
                    restrict: "AE",
                    scope: true,
                    link: function ($scope, $element, $attrs) {
                        $element.on('click', function () {
                            $scope.active = false;
                            var reportStatus = _.isFunction($scope.$parent.reportStatus)
                                ? _.partial($scope.$parent.reportStatus, $scope.$id)
                                : function () { };
                            var inProgress = function () {
                                $scope.active = true;
                                reportStatus($scope.active);
                                $attrs.$set('disabled', 'disabled');
                            };
                            var done = function () {
                                $scope.active = false;
                                reportStatus($scope.active);
                                $element.removeAttr('disabled');
                            };
                            var files = [].concat(CartService.getFiles());
                            var params = { ids: files.map(function (f) { return f.file_id; }) };
                            var url = config.auth_api + '/data/metadata_files';
                            var checkProgress = $scope.download(params, url, function () { return $element; }, 'POST');
                            checkProgress(inProgress, done, true);
                        });
                    }
                };
            }
            function DownloadButtonAllCart(UserService, CartService, $uibModal, config) {
                return {
                    restrict: "AE",
                    scope: true,
                    link: function ($scope, $element, $attrs) {
                        var scope = $scope;
                        scope.active = false;
                        var MAX_FILE_SIZE_ALLOWED = 5e+9;
                        var reportStatus = _.isFunction(scope.$parent.reportStatus)
                            ? _.partial(scope.$parent.reportStatus, scope.$id)
                            : function () { };
                        var inProgress = function () {
                            scope.active = true;
                            reportStatus(scope.active);
                            $attrs.$set('disabled', 'disabled');
                        };
                        var done = function () {
                            scope.active = false;
                            reportStatus(scope.active);
                            $element.removeAttr('disabled');
                        };
                        var url = config.auth_api + '/data?annotations=true&related_files=true';
                        var download = function (files) {
                            if ((files || []).length > 0) {
                                var params = { ids: files.map(function (f) { return f.file_id; }) };
                                var checkProgress = scope.download(params, url, function () { return $element; }, 'POST');
                                checkProgress(inProgress, done, true);
                            }
                        };
                        $element.on('click', function () {
                            var authorizedInCart = CartService.getAuthorizedFiles();
                            var unauthorizedInCart = CartService.getUnauthorizedFiles();
                            var files = [].concat(authorizedInCart);
                            // "meta" is referenced in the html templates used below.
                            scope.meta = {
                                unauthorized: unauthorizedInCart,
                                authorized: authorizedInCart
                            };
                            if (unauthorizedInCart.length) {
                                if (UserService.currentUser) {
                                    // Makes sure the user session has not expired.
                                    UserService.loginPromise().then(function () {
                                        // Session is still active.
                                        var modalInstance = $uibModal.open({
                                            templateUrl: "core/templates/request-access-to-download.html",
                                            controller: "LoginToDownloadController",
                                            controllerAs: "wc",
                                            backdrop: true,
                                            keyboard: true,
                                            scope: scope,
                                            size: "lg",
                                            animation: false
                                        });
                                        modalInstance.result.then(function (a) {
                                            if (a) {
                                                download(files);
                                            }
                                        });
                                    }, function (response) {
                                        console.log('User session has expired.', response);
                                        var modalInstance = $uibModal.open({
                                            templateUrl: "core/templates/session-expired.html",
                                            controller: "LoginToDownloadController",
                                            controllerAs: "wc",
                                            backdrop: true,
                                            keyboard: true,
                                            scope: scope,
                                            size: "lg",
                                            animation: false
                                        });
                                        modalInstance.result.then(function () { return UserService.logout(); });
                                    });
                                }
                                else {
                                    // User is NOT logged in.
                                    var modalInstance = $uibModal.open({
                                        templateUrl: "core/templates/login-to-download.html",
                                        controller: "LoginToDownloadController",
                                        controllerAs: "wc",
                                        backdrop: true,
                                        keyboard: true,
                                        scope: scope,
                                        size: "lg",
                                        animation: false
                                    });
                                    modalInstance.result.then(function (a) {
                                        if (a) {
                                            download(files);
                                        }
                                    });
                                }
                            }
                            else if (authorizedInCart.reduce(function (acc, x) { return acc + x.file_size; }, 0) > MAX_FILE_SIZE_ALLOWED) {
                                $uibModal.open({
                                    templateUrl: 'core/templates/modal.html',
                                    controller: 'WarningController',
                                    controllerAs: 'wc',
                                    backdrop: 'static',
                                    keyboard: false,
                                    backdropClass: 'warning-backdrop',
                                    animation: false,
                                    size: 'lg',
                                    resolve: {
                                        warning: function () {
                                            return "Your cart contains more than 5GBs of data. <br />.\n                   Please select the \"Download > Manifest\" option and use the\n                   <a href='https://gdc.nci.nih.gov/access-data/gdc-data-transfer-tool' target='_blank'>\n                     GDC Data Transfer Tool\n                   </a> to continue.";
                                        },
                                        header: null
                                    }
                                });
                            }
                            else {
                                download(files);
                            }
                        });
                    }
                };
            }
            angular.module("cart.directives", [
                "user.services",
                "location.services",
                "files.services",
                "search.table.files.model",
                "cgNotify"
            ])
                .directive("addToCartSingleIcon", AddToCartSingleIcon)
                .directive("addToCartSingleLabelled", AddToCartSingleLabelled)
                .directive("addToCartAllDropdown", AddToCartAllDropDown)
                .directive("downloadMetadataFiles", DownloadMetadataFiles)
                .directive("addToCartAllButton", AddToCartAllButton)
                .directive("addToCartFiltered", AddToCartFiltered)
                .directive("downloadButtonAllCart", DownloadButtonAllCart)
                .directive("downloadManifestCart", DownloadManifestCart)
                .directive("removeUnauthorizedFilesButton", RemoveUnauthorizedFilesButton)
                .directive("removeSingleCart", RemoveSingleCart);
        })(directives = cart.directives || (cart.directives = {}));
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        var services;
        (function (services) {
            var QueryCartService = (function () {
                /* @ngInject */
                QueryCartService.$inject = ["$window", "$q", "FilesService", "LocalStorageService"];
                function QueryCartService($window, $q, FilesService, LocalStorageService) {
                    this.$window = $window;
                    this.$q = $q;
                    this.FilesService = FilesService;
                    this.LocalStorageService = LocalStorageService;
                    this.files = { hits: [],
                        pagination: { total: 0 }
                    };
                    this.getFiles();
                }
                QueryCartService.prototype.pushAddedQuery = function (query) {
                    var oldQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_QUERY, { "op": "or", content: [] });
                    // if user clicked add all and the query is empty
                    var newQuery = { "op": "or", content: Object.keys(query).length ? oldQuery.content.concat(query) : [] };
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_ADDED_QUERY, newQuery);
                    this.getFiles();
                };
                QueryCartService.prototype.pushRemovedQuery = function (query) {
                    var oldQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_QUERY, { "op": "or", content: [] });
                    var newQuery = { "op": "or", content: oldQuery.content.concat(query) };
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_REMOVED_QUERY, newQuery);
                    this.getFiles();
                };
                QueryCartService.prototype.pushAddedFiles = function (fileIds) {
                    var oldFileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_FILES, []);
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_ADDED_FILES, oldFileIds.concat(fileIds));
                    this.getFiles();
                };
                QueryCartService.prototype.pushRemovedFiles = function (fileIds) {
                    var oldFileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_FILES, []);
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_REMOVED_FILES, oldFileIds.concat(fileIds));
                    this.getFiles();
                };
                QueryCartService.prototype.isInCart = function (fileId) {
                    //todo: better way to do this that includes the files defined by addedQuery
                    var fileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_FILES, []);
                    return fileIds.find(function (f) { return f === fileId; }) ? true : false;
                };
                QueryCartService.prototype.getFiles = function () {
                    var _this = this;
                    var addedQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_QUERY);
                    var removedQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_QUERY);
                    //incomplete
                    var filters = removedQuery ? { "op": "and", "content": [addedQuery, removedQuery] } : addedQuery;
                    if (filters) {
                        return this.FilesService.getFiles({
                            fields: ["access",
                                "file_name",
                                "file_id",
                                "file_size",
                                "data_type",
                                "data_format",
                                "annotations.annotation_id",
                                "cases.case_id",
                                "cases.project.project_id",
                                "cases.project.name"
                            ],
                            filters: filters.content.length ? filters : '',
                            size: 20,
                            from: 0
                        }).then(function (data) {
                            _this.files = data;
                            return data;
                        });
                    }
                    else {
                        // if there was no filter sending an empty query to ES returns everything
                        // so don't send a request but return an empty promise
                        return this.$q(function (resolve) {
                            var data = { hits: [], pagination: { total: 0 } };
                            _this.files = data;
                            resolve(data);
                        });
                    }
                };
                QueryCartService.GDC_CART_ADDED_QUERY = "gdc-cart-added-query";
                QueryCartService.GDC_CART_REMOVED_QUERY = "gdc-cart-removed-query";
                QueryCartService.GDC_CART_ADDED_FILES = "gdc-cart-added-files";
                QueryCartService.GDC_CART_REMOVED_FILES = "gdc-cart-removed-files";
                return QueryCartService;
            }());
            var CartService = (function () {
                /* @ngInject */
                CartService.$inject = ["$window", "notify", "UserService", "LocalStorageService", "$rootScope", "gettextCatalog", "$filter", "$timeout", "$uibModal", "$uibModalStack"];
                function CartService($window, notify, UserService, LocalStorageService, $rootScope, gettextCatalog, $filter, $timeout, $uibModal, $uibModalStack) {
                    var _this = this;
                    this.$window = $window;
                    this.notify = notify;
                    this.UserService = UserService;
                    this.LocalStorageService = LocalStorageService;
                    this.$rootScope = $rootScope;
                    this.gettextCatalog = gettextCatalog;
                    this.$filter = $filter;
                    this.$timeout = $timeout;
                    this.$uibModal = $uibModal;
                    this.$uibModalStack = $uibModalStack;
                    this.reloadFromLocalStorage();
                    // storage event is *only* fired in the other tabs
                    $window.addEventListener && $window.addEventListener('storage', function (event) {
                        _this.$rootScope.$broadcast("cart-update");
                        _this.reloadFromLocalStorage();
                    });
                }
                CartService.prototype.reloadFromLocalStorage = function () {
                    var localTime = this.LocalStorageService.getItem(CartService.GDC_CART_UPDATE);
                    this.lastModified = localTime ? this.$window.moment(localTime) : this.$window.moment();
                    this.files = this.LocalStorageService.getItem(CartService.GDC_CART_KEY, []);
                };
                CartService.prototype.getMaxSize = function () {
                    return CartService.MAX_SIZE;
                };
                CartService.prototype.isFull = function () {
                    return this.files.length >= CartService.MAX_SIZE;
                };
                CartService.prototype.getCartVacancySize = function () {
                    return this.getMaxSize() - this.getFiles().length;
                };
                CartService.prototype.getFiles = function () {
                    return this.files;
                };
                CartService.prototype.getFile = function (fileId) {
                    return _.find(this.getFiles(), { "file_id": fileId });
                };
                CartService.prototype.getAuthorizedFiles = function () {
                    var _this = this;
                    return this.files.filter(function (file) {
                        return _this.UserService.userCanDownloadFile(file);
                    });
                };
                CartService.prototype.getUnauthorizedFiles = function () {
                    var _this = this;
                    return this.files.filter(function (file) {
                        return !_this.UserService.userCanDownloadFile(file);
                    });
                };
                CartService.prototype.isInCart = function (fileId) {
                    return _.some(this.files, { "file_id": fileId });
                };
                CartService.prototype.areInCart = function (files) {
                    var _this = this;
                    return _.every(files, function (f) { return _this.isInCart(f.file_id); });
                };
                CartService.prototype.add = function (file) {
                    this.addFiles([file]);
                };
                CartService.prototype.addFiles = function (files, displayAddingNotification) {
                    var _this = this;
                    if (displayAddingNotification === void 0) { displayAddingNotification = true; }
                    if (navigator.cookieEnabled) {
                        if (displayAddingNotification) {
                            var addingMsgPromise = this.$timeout(function () {
                                _this.notify({
                                    message: "",
                                    messageTemplate: "<span data-translate>Adding <strong>" + files.length + "</strong> files to cart</span>",
                                    container: "#notification",
                                    classes: "alert-info"
                                });
                            }, 1000);
                        }
                        this.lastModifiedFiles = [];
                        var alreadyIn = [];
                        files.forEach(function (file) {
                            if (!_this.isInCart(file.file_id)) {
                                _this.lastModifiedFiles.push(file);
                            }
                            else {
                                alreadyIn.push(file);
                            }
                        });
                        this.files = this.files.concat(this.lastModifiedFiles);
                        if (addingMsgPromise) {
                            this.$timeout.cancel(addingMsgPromise);
                        }
                        this._sync();
                        this.notify.closeAll();
                        this.notify.config({ duration: 5000 });
                        this.notify({
                            message: "",
                            messageTemplate: this.buildAddedMsg(this.lastModifiedFiles, alreadyIn),
                            container: "#notification",
                            classes: "alert-success"
                        });
                    }
                    else {
                        this.$timeout(function () {
                            if (!_this.$uibModalStack.getTop()) {
                                var modalInstance = _this.$uibModal.open({
                                    templateUrl: "core/templates/enable-cookies.html",
                                    controller: "WarningController",
                                    controllerAs: "wc",
                                    backdrop: "static",
                                    keyboard: false,
                                    backdropClass: "warning-backdrop",
                                    animation: false,
                                    resolve: { warning: null, header: null }
                                });
                            }
                        });
                    }
                };
                CartService.prototype.sizeWarning = function () {
                    var cartAvailable = this.getCartVacancySize();
                    var template = [
                        "The cart is limited to " + this.$filter("number")(this.getMaxSize()) + " files.",
                        !this.files.length
                            ? "Please narrow down your search criteria to be able to add files to your cart."
                            : this.files.length < this.getMaxSize()
                                ? this.$filter("number")(cartAvailable) + getRemaining() + "can be added to the cart."
                                : "You cannot add anymore files to the cart."
                    ];
                    function getRemaining() {
                        return cartAvailable > 1 ? " more files " : " more file ";
                    }
                    var messageTemplate = "<span>" + this.gettextCatalog.getString(template.join(" ")) + "</span>";
                    this.notify.config({ duration: 5000 });
                    this.notify.closeAll();
                    this.notify({
                        message: "",
                        messageTemplate: messageTemplate,
                        container: "#notification",
                        classes: "alert-warning"
                    });
                };
                CartService.prototype.buildAddedMsg = function (added, alreadyIn) {
                    var message = this.gettextCatalog.getPlural(added.length, "<span>Added <strong class='word-break-all'>" + _.get(_.first(added), "file_name", "1 file") + "</strong> to the cart.", "<span>Added <strong>" + added.length + "</strong> files to the cart.");
                    if (alreadyIn.length) {
                        message += this.gettextCatalog.getPlural(alreadyIn.length, added.length === 0 ? "<br />The file was already in cart, not added." : "<strong class='word-break-all'>" + _.get(_.first(added), "file_name") + "</strong> already in cart, not added", "<br /><strong>" + alreadyIn.length + "</strong> files were already in cart, not added");
                    }
                    if (added.length !== 0) {
                        message += "<br /> <a data-ng-click='undoClicked(\"added\")'><i class='fa fa-undo'></i> Undo</a>";
                    }
                    return message + "</span>";
                };
                CartService.prototype.buildRemovedMsg = function (removedFiles) {
                    var message = this.gettextCatalog.getPlural(removedFiles.length, "<span>Removed <strong class='word-break-all'>" + _.get(_.first(removedFiles), "file_name", "1 file") + "</strong> from the cart.", "<span>Removed <strong>" + removedFiles.length + "</strong> files from the cart.");
                    if (removedFiles.length !== 0) {
                        message += "<br /> <a data-ng-click='undoClicked(\"removed\")'><i class='fa fa-undo'></i> Undo</a>";
                    }
                    return message + "</span>";
                };
                CartService.prototype.removeAll = function () {
                    this.remove(this.files);
                };
                CartService.prototype.remove = function (filesToRemove) {
                    var _this = this;
                    if (navigator.cookieEnabled) {
                        var partitioned = this.files.reduce(function (acc, f) {
                            var fileToRemove = _.find(filesToRemove, function (f2r) { return f2r.file_id === f.file_id; });
                            return fileToRemove
                                ? { remaining: acc.remaining, removed: acc.removed.concat(fileToRemove) }
                                : { remaining: acc.remaining.concat(f), removed: acc.removed };
                        }, { remaining: [], removed: [] });
                        this.lastModifiedFiles = partitioned.removed;
                        this.notify.closeAll();
                        this.notify({
                            message: "",
                            messageTemplate: this.buildRemovedMsg(this.lastModifiedFiles),
                            container: "#notification",
                            classes: "alert-warning"
                        });
                        this.files = partitioned.remaining;
                        this._sync();
                    }
                    else {
                        this.$timeout(function () {
                            if (!_this.$uibModalStack.getTop()) {
                                var modalInstance = _this.$uibModal.open({
                                    templateUrl: "core/templates/enable-cookies.html",
                                    controller: "WarningController",
                                    controllerAs: "wc",
                                    backdrop: "static",
                                    keyboard: false,
                                    backdropClass: "warning-backdrop",
                                    animation: false,
                                    resolve: { warning: null, header: null }
                                });
                            }
                        });
                    }
                };
                CartService.prototype.getFileIds = function () {
                    return _.pluck(this.files, "file_id");
                };
                CartService.prototype.undoAdded = function () {
                    this.remove(this.lastModifiedFiles);
                };
                CartService.prototype.undoRemoved = function () {
                    this.addFiles(this.lastModifiedFiles, false);
                };
                CartService.prototype._sync = function () {
                    this.$rootScope.$broadcast("cart-update");
                    this.lastModified = this.$window.moment();
                    var filesArray = this.files.map(function (f) {
                        return {
                            access: f.access,
                            file_id: f.file_id,
                            file_size: f.file_size,
                            projects: f.projects || _.map(f.cases, function (c) { return c.project.project_id; })
                        };
                    });
                    this.LocalStorageService.setItem(CartService.GDC_CART_UPDATE, this.lastModified.toISOString());
                    // if cookies disabled this will return false
                    return this.LocalStorageService.setItem(CartService.GDC_CART_KEY, filesArray);
                };
                CartService.GDC_CART_KEY = "gdc-cart-items";
                CartService.GDC_CART_UPDATE = "gdc-cart-updated";
                CartService.MAX_SIZE = 10000;
                return CartService;
            }());
            var State = (function () {
                function State() {
                    this.tabs = {
                        summary: {
                            active: false
                        },
                        items: {
                            active: false
                        }
                    };
                }
                State.prototype.setActive = function (section, tab) {
                    if (section && tab) {
                        _.each(this[section], function (section) {
                            section.active = false;
                        });
                        this[section][tab].active = true;
                    }
                };
                return State;
            }());
            angular
                .module("cart.services", [
                "ngApp.core",
                "ngApp.files",
                "cgNotify"
            ])
                .service("CartState", State)
                .service("QueryCartService", QueryCartService)
                .service("CartService", CartService);
        })(services = cart.services || (cart.services = {}));
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        var models;
        (function (models) {
            function withAnnotationFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = 'annotations?filters=' + filterString;
                var val = '{{' + value + '|number:0}}';
                return "<a href='" + href + "'>" + val + '</a>';
            }
            function withFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = 'search/c?filters=' + filterString;
                var val = '{{' + value + '|number:0}}';
                return "<a href='" + href + "'>" + val + '</a>';
            }
            var CartTableModel = {
                title: 'Cart',
                rowId: 'file_id',
                headings: [
                    {
                        name: "Action",
                        id: "file_actions",
                        td: function (row) { return '<remove-single-cart file="row" />'; },
                        tdClassName: "text-center"
                    }, {
                        name: "Access",
                        id: "access",
                        td: function (row, $scope) {
                            var val = $scope.$filter("humanify")(row.access);
                            return '<i class="fa fa-' + (row.access === 'controlled' ? 'lock' : 'unlock-alt') + '"></i> ' + val;
                        },
                        sortable: true
                    }, {
                        name: "File Name",
                        id: "file_name",
                        toolTipText: function (row) { return row.file_name; },
                        td: function (row) { return '<a href="files/' + row.file_id + '">' + row.file_name + '</a>'; },
                        sortable: true,
                        tdClassName: 'id-cell'
                    }, {
                        name: "Cases",
                        id: "cases",
                        td: function (row, $scope) {
                            function getParticipants(row, $filter) {
                                return row.cases.length == 1 ?
                                    '<a href="cases/' + row.cases[0].case_id + '">1</a>' :
                                    withFilter(row.cases.length, [{ field: "files.file_id", value: row.file_id }], $filter);
                            }
                            return (row.cases || []).length ? getParticipants(row, $scope.$filter) : 0;
                        },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    }, {
                        name: "Project",
                        id: "cases.project.project_id",
                        td: function (row) {
                            return _.unique(row.cases, function (c) { return c.project.project_id; }).map(function (c) {
                                return ('<a href="projects/' + c.project.project_id +
                                    '" data-tooltip="' + c.project.name +
                                    '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' + c.project.project_id + '</a>');
                            }).join('<br>');
                        },
                        sortable: true
                    }, {
                        name: "Data Type",
                        id: "data_type",
                        td: function (row) { return row.data_type; },
                        sortable: true
                    }, {
                        name: "Data Format",
                        id: "data_format",
                        td: function (row) { return row.data_format; },
                        sortable: true
                    }, {
                        name: "Size",
                        id: "file_size",
                        td: function (row, $scope) { return $scope.$filter("size")(row.file_size); },
                        sortable: true,
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    }, {
                        name: "Annotations",
                        id: "annotations",
                        td: function (row, $scope) {
                            function getAnnotations(row, $scope) {
                                return row.annotations.length === 1 ?
                                    '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' :
                                    withAnnotationFilter(row.annotations.length, [{ field: "annotation_id", value: row.annotations.map(function (a) { return a.annotation_id; }) }], $scope.$filter);
                            }
                            return row.annotations ? getAnnotations(row, $scope) : 0;
                        },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    }
                ]
            };
            angular.module("cart.table.model", [])
                .value("CartTableModel", CartTableModel);
        })(models = cart.models || (cart.models = {}));
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var cases;
    (function (cases) {
        var directives;
        (function (directives) {
            var ExportCasesButton = function (config) { return ({
                restrict: 'E',
                replace: true,
                scope: {
                    filterKeyValues: '=',
                    fields: '=',
                    expands: '=',
                    size: '=',
                    filename: '=',
                    fileType: '@',
                    textNormal: '@',
                    textInProgress: '@',
                    styleClass: '@',
                    icon: '@',
                    ngDisabled: '='
                },
                template: '<button tabindex="0" ng-class="[styleClass || \'btn btn-primary\']" data-downloader> \
              <i class="fa {{icon || \'fa-download\'}}" ng-class="{\'fa-spinner\': active, \'fa-pulse\': active}" /> \
              <span ng-if="textNormal"><span ng-if="! active">&nbsp;{{ textNormal }}</span> \
                <span ng-if="active">&nbsp;{{ ::textInProgress }}</span></span></button>',
                link: function (scope, $element, $attrs) {
                    $element.on('click', function () {
                        if (!scope.ngDisabled) {
                            var reportStatus_1 = _.isFunction(scope.$parent.reportStatus)
                                ? _.partial(scope.$parent.reportStatus, scope.$id)
                                : function () { };
                            var inProgress = function () {
                                scope.active = true;
                                reportStatus_1(scope.active);
                                $attrs.$set('disabled', 'disabled');
                            };
                            var done = function () {
                                scope.active = false;
                                reportStatus_1(scope.active);
                                $element.removeAttr('disabled');
                            };
                            var url = config.auth_api + '/cases';
                            var filters = {
                                op: 'and',
                                content: _.values(_.mapValues(scope.filterKeyValues, function (value, key) { return ({
                                    op: 'in',
                                    content: {
                                        field: key,
                                        value: [].concat(value)
                                    }
                                }); }))
                            };
                            var params = _.merge({
                                attachment: true,
                                filters: filters,
                                fields: ['case_id'].concat(scope.fields || []).join(),
                                expand: [].concat(scope.expands || []).join(),
                                format: scope.fileType || 'JSON',
                                pretty: true,
                                size: scope.size || 10000
                            }, scope.filename ? { filename: scope.filename } : {});
                            var checkProgress = scope.download(params, url, function () { return $element; }, 'POST');
                            checkProgress(inProgress, done);
                        }
                    });
                    scope.active = false;
                }
            }); };
            ExportCasesButton.$inject = ["config"];
            angular.module('cases.directives', [])
                .directive('exportCasesButton', ExportCasesButton);
        })(directives = cases.directives || (cases.directives = {}));
    })(cases = ngApp.cases || (ngApp.cases = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var cases;
    (function (cases) {
        angular.module('ngApp.cases', [
            'cases.directives'
        ]);
    })(cases = ngApp.cases || (ngApp.cases = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var controllers;
        (function (controllers) {
            var CoreController = (function () {
                /* @ngInject */
                CoreController.$inject = ["$scope", "$rootScope", "CartService", "notify", "$location", "$cookies", "UserService", "$uibModal", "$uibModalStack", "$timeout", "$window", "$document", "Restangular"];
                function CoreController($scope, $rootScope, CartService, notify, $location, $cookies, UserService, $uibModal, $uibModalStack, $timeout, $window, $document, Restangular) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.CartService = CartService;
                    this.notify = notify;
                    this.$cookies = $cookies;
                    this.$uibModal = $uibModal;
                    this.$uibModalStack = $uibModalStack;
                    this.$timeout = $timeout;
                    this.$window = $window;
                    this.$document = $document;
                    this.Restangular = Restangular;
                    this.showWarning = false;
                    this.notifications = [];
                    this.numDisplayedNotifications = 1; // the 1 is the hardcoded banner
                    this.$rootScope.$on('hideBanner', function () { return _this.numDisplayedNotifications = _this.numDisplayedNotifications - 1; });
                    Restangular.all('notifications').get('').then(function (notifications) {
                        var notifications = angular.fromJson(notifications.data)
                            .filter(function (n) { return _.includes(n.components, 'PORTAL') || _.includes(n.components, 'API'); })
                            .map(function (n) {
                            n.dismissed = false;
                            return n;
                        });
                        _this.notifications = _.sortBy(notifications, function (n) { return n.dismissible; });
                        _this.numDisplayedNotifications = _this.numDisplayedNotifications + _this.notifications.length;
                    }, function (response) {
                        console.log("error getting notifications " + response);
                    });
                    this.loadingTimers = [];
                    this.$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                        UserService.login();
                        _this.$rootScope.$emit('ShowLoadingScreen');
                    });
                    this.$rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState) {
                        _this.$rootScope.$emit('ClearLoadingScreen');
                        if (Object.keys(toState.data || {}).indexOf('tab') === -1) {
                            document.body.scrollTop = 0;
                            document.documentElement.scrollTop = 0;
                        }
                    });
                    this.$rootScope.$on('ShowLoadingScreen', function (data, throttleMs) {
                        _this.loadingTimers.push(_this.$timeout(function () { return _this.showLoadingScreen(); }, throttleMs || 500));
                    });
                    this.$rootScope.$on('ClearLoadingScreen', function () {
                        _this.clearLoadingScreen();
                    });
                    // display login failed warning
                    if (_.get($location.search(), 'error') === 'You are not authorized to gdc services') {
                        this.$timeout(function () {
                            if (!_this.$uibModalStack.getTop()) {
                                var loginWarningModal = _this.$uibModal.open({
                                    templateUrl: "core/templates/login-failed-warning.html",
                                    controller: "WarningController",
                                    controllerAs: "wc",
                                    backdrop: "static",
                                    keyboard: false,
                                    backdropClass: "warning-backdrop",
                                    animation: false,
                                    size: "lg",
                                    resolve: {
                                        warning: null,
                                        header: null
                                    }
                                });
                            }
                        });
                    }
                    if (!$cookies.get("browser-checked")) {
                        if (bowser.msie && bowser.version <= 9) {
                            this.$timeout(function () {
                                if (!_this.$uibModalStack.getTop()) {
                                    var bowserWarningModal = _this.$uibModal.open({
                                        templateUrl: "core/templates/browser-check-warning.html",
                                        controller: "WarningController",
                                        controllerAs: "wc",
                                        backdrop: "static",
                                        keyboard: false,
                                        backdropClass: "warning-backdrop",
                                        animation: false,
                                        size: "lg",
                                        resolve: {
                                            warning: null,
                                            header: null
                                        }
                                    });
                                    bowserWarningModal.result.then(function () {
                                        _this.$cookies.put("browser-checked", "true");
                                    });
                                }
                                ;
                            });
                        }
                        else {
                            this.$cookies.put("browser-checked", "true");
                        }
                    }
                    if (!$cookies.get("NCI-Warning")) {
                        this.$timeout(function () {
                            if (!_this.$uibModalStack.getTop()) {
                                var modalInstance = _this.$uibModal.open({
                                    templateUrl: "core/templates/warning.html",
                                    controller: "WarningController",
                                    controllerAs: "wc",
                                    backdrop: "static",
                                    keyboard: false,
                                    backdropClass: "warning-backdrop",
                                    animation: false,
                                    size: "lg",
                                    resolve: {
                                        warning: null,
                                        header: null
                                    }
                                });
                                modalInstance.result.then(function () {
                                    _this.$cookies.put("NCI-Warning", "true");
                                });
                            }
                        });
                    }
                    $scope.$on("undo", function (event, action) {
                        if (action === "added") {
                            CartService.undoAdded();
                        }
                        else if (action === "removed") {
                            CartService.undoRemoved();
                        }
                        _this.notify.closeAll();
                    });
                    this.$rootScope.undoClicked = function (action) {
                        _this.$rootScope.$broadcast("undo", action);
                    };
                    this.$rootScope.cancelRequest = function () {
                        _this.$rootScope.$broadcast("gdc-cancel-request");
                    };
                    this.$rootScope.handleApplicationClick = function () {
                        $scope.$broadcast('application:click');
                    };
                    this.$rootScope.closeWarning = function () {
                        _this.$rootScope.showWarning = false;
                        _this.$cookies.put("NCI-Warning", "true");
                    };
                }
                CoreController.prototype.showLoadingScreen = function () {
                    var _this = this;
                    this.loading = true;
                    this.loadingTimers = this.loadingTimers.concat(this.$timeout(function () { return _this.loading5s = true; }, 5000), this.$timeout(function () { return _this.loading8s = true; }, 8000));
                };
                CoreController.prototype.clearLoadingScreen = function () {
                    var _this = this;
                    this.loading = false;
                    this.loading5s = false;
                    this.loading8s = false;
                    this.loadingTimers.forEach(function (x) { return _this.$timeout.cancel(x); });
                };
                return CoreController;
            }());
            var WarningController = (function () {
                /* @ngInject */
                WarningController.$inject = ["$uibModalInstance", "warning", "header"];
                function WarningController($uibModalInstance, warning, header) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.warning = warning;
                    this.header = header;
                }
                WarningController.prototype.acceptWarning = function () {
                    this.$uibModalInstance.close();
                };
                return WarningController;
            }());
            angular
                .module("core.controller", ["ngCookies", "user.services"])
                .controller("WarningController", WarningController)
                .controller("CoreController", CoreController);
        })(controllers = core.controllers || (core.controllers = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var directives;
        (function (directives) {
            loginButton.$inject = ["config", "UserService", "$timeout", "$uibModal", "$uibModalStack"];
            logoutButton.$inject = ["config"];
            var KeyCode;
            (function (KeyCode) {
                KeyCode[KeyCode["Space"] = 32] = "Space";
                KeyCode[KeyCode["Enter"] = 13] = "Enter";
                KeyCode[KeyCode["Esc"] = 27] = "Esc";
                KeyCode[KeyCode["Left"] = 37] = "Left";
                KeyCode[KeyCode["Right"] = 39] = "Right";
                KeyCode[KeyCode["Up"] = 38] = "Up";
                KeyCode[KeyCode["Down"] = 40] = "Down";
                KeyCode[KeyCode["Tab"] = 9] = "Tab";
            })(KeyCode || (KeyCode = {}));
            /* @ngInject */
            function loginButton(config, UserService, $timeout, $uibModal, $uibModalStack) {
                return {
                    restrict: 'A',
                    scope: {
                        redirect: "@"
                    },
                    controller: ["$scope", "$element", "$window", function ($scope, $element, $window) {
                        var openLogin = function () {
                            if (navigator.cookieEnabled) {
                                var returningPath_1 = $window.location.pathname + '?' + (+new Date);
                                var redirectUrl_1 = config.auth +
                                    (function (p) { return p ? ('/' + p) : ''; })($scope.redirect) +
                                    '?next=' +
                                    (function (p) { return p ? (':' + p) : ''; })($window.location.port) +
                                    returningPath_1;
                                var closeLogin_1 = function (url) {
                                    if (url === redirectUrl_1) {
                                        // Redirect hasn't happened yet so don't kill the login window.
                                        return false;
                                    }
                                    else {
                                        return _.includes(url, returningPath_1);
                                    }
                                };
                                var win_1 = open(redirectUrl_1, 'Auth', 'width=800, height=600');
                                var interval_1 = setInterval(function () {
                                    try {
                                        // Because the login window redirects to a different domain, checking win.document in IE11 throws
                                        // exceptions right away, which prevents #clearInterval from ever getting called in this block.
                                        // Must check this block (if the login window has been closed) first!
                                        if (win_1.closed) {
                                            clearInterval(interval_1);
                                        }
                                        else if (closeLogin_1(_.get(win_1, 'document.URL', ''))) {
                                            win_1.close();
                                            setTimeout(function () {
                                                clearInterval(interval_1);
                                                UserService.login();
                                            }, 1000);
                                        }
                                    }
                                    catch (err) {
                                        console.log('Error while monitoring the Login window: ', err);
                                    }
                                }, 500);
                            }
                            else {
                                $timeout(function () {
                                    if (!$uibModalStack.getTop()) {
                                        var modalInstance = $uibModal.open({
                                            templateUrl: "core/templates/enable-cookies.html",
                                            controller: "WarningController",
                                            controllerAs: "wc",
                                            backdrop: "static",
                                            keyboard: false,
                                            backdropClass: "warning-backdrop",
                                            animation: false,
                                            resolve: { warning: null, header: null }
                                        });
                                    }
                                });
                            }
                        };
                        $element.on('keypress', function (e) {
                            if (e.keyCode === KeyCode.Enter) {
                                openLogin();
                            }
                        });
                        $element.on('click', openLogin);
                    }]
                };
            }
            function logoutButton(config) {
                return {
                    restrict: 'A',
                    scope: {
                        redirect: "@"
                    },
                    controller: ["$scope", "$element", "$window", function ($scope, $element, $window) {
                        var logout = function () {
                            var redirect = config.auth;
                            var authQuery = "";
                            if ($scope.redirect) {
                                redirect += "/" + $scope.redirect;
                            }
                            if ($window.location.port) {
                                authQuery = "?next=" + ":" + $window.location.port + $window.location.pathname;
                            }
                            else {
                                authQuery = "?next=" + $window.location.pathname;
                            }
                            $window.location = redirect + authQuery;
                        };
                        $element.on('keypress', function (e) {
                            if (e.keyCode === KeyCode.Enter) {
                                logout();
                            }
                        });
                        $element.on('click', logout);
                    }]
                };
            }
            angular
                .module("core.directives", ["ngCookies", "user.services"])
                .directive('loginButton', loginButton)
                .directive('logoutButton', logoutButton);
        })(directives = core.directives || (core.directives = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var filters;
        (function (filters) {
            var MakeFilter = (function () {
                function MakeFilter() {
                    return function (fields, noEscape) {
                        var contentArray = _.map(fields, function (item) {
                            var value;
                            if (_.isArray(item.value)) {
                                value = item.value;
                            }
                            else if (item.value) {
                                value = item.value.split(",");
                            }
                            return {
                                "op": "in",
                                "content": {
                                    "field": item.field,
                                    "value": value
                                }
                            };
                        });
                        if (contentArray.length === 0) {
                            return angular.toJson({});
                        }
                        var ret = angular.toJson({
                            "op": "and",
                            "content": contentArray
                        });
                        if (noEscape) {
                            return ret;
                        }
                        // Still unsure why this causes problems with ui-sref if the stringified
                        // JSON doesn't have quotes and other things escaped, but switching to
                        // this works in all known cases
                        return angular.toJson(ret);
                    };
                }
                return MakeFilter;
            }());
            var MakeDownloadLink = (function () {
                MakeDownloadLink.$inject = ["$rootScope"];
                function MakeDownloadLink($rootScope) {
                    return function (ids, annotations, relatedFiles) {
                        if (annotations === void 0) { annotations = true; }
                        if (relatedFiles === void 0) { relatedFiles = true; }
                        var baseUrl = $rootScope.config.auth_api;
                        ids = _.compact(ids);
                        var url = baseUrl + "/data/" + ids.join(",");
                        var flags = [];
                        if (annotations) {
                            flags.push("annotations=1");
                        }
                        if (relatedFiles) {
                            flags.push("related_files=1");
                        }
                        if (flags.length) {
                            url += "?";
                        }
                        return url + flags.join("&");
                    };
                }
                return MakeDownloadLink;
            }());
            var MakeManifestLink = (function () {
                MakeManifestLink.$inject = ["$rootScope"];
                function MakeManifestLink($rootScope) {
                    return function (ids, baseUrl) {
                        if (baseUrl === void 0) { baseUrl = $rootScope.config.auth_api; }
                        return baseUrl + "/manifest/" + ids.join(",");
                    };
                }
                return MakeManifestLink;
            }());
            angular.module("core.filters", [])
                .filter("makeManifestLink", MakeManifestLink)
                .filter("makeFilter", MakeFilter)
                .filter("makeDownloadLink", MakeDownloadLink)
                .filter("unsafe", ["$sce", "$compile", function ($sce, $compile) { return $sce.trustAsHtml; }]);
        })(filters = core.filters || (core.filters = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var services;
        (function (services) {
            var CoreService = (function () {
                /* @ngInject */
                CoreService.$inject = ["$rootScope", "$state", "$http", "Restangular", "config", "ngProgressLite", "$uibModal", "$uibModalStack", "Restangular", "gettextCatalog"];
                function CoreService($rootScope, $state, $http, Restangular, config, ngProgressLite, $uibModal, $uibModalStack, Restangular, gettextCatalog) {
                    var _this = this;
                    this.$rootScope = $rootScope;
                    this.$state = $state;
                    this.$http = $http;
                    this.Restangular = Restangular;
                    this.config = config;
                    this.ngProgressLite = ngProgressLite;
                    this.$uibModal = $uibModal;
                    this.$uibModalStack = $uibModalStack;
                    this.Restangular = Restangular;
                    this.gettextCatalog = gettextCatalog;
                    this.activeRequests = false;
                    this.finishedRequests = 0;
                    this.requestCount = 0;
                    this.setLoadedState(true);
                    Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
                        _this.xhrDone();
                        if (response.status >= 500) {
                            console.log(JSON.stringify(response.config) + " failed with response.status");
                            return _this.retry(response, deferred, responseHandler);
                        }
                        return true;
                    });
                }
                CoreService.prototype.setLoadedState = function (state) {
                    var wrapper = angular.element(document.getElementById("wrapper"));
                    var flippedState = !state;
                    wrapper.attr("aria-busy", flippedState.toString());
                    this.$rootScope.loaded = state;
                };
                CoreService.prototype.setPageTitle = function (title, id) {
                    // TODO - this could probably be done when the function is called
                    var formattedTitle = this.gettextCatalog.getString(title);
                    formattedTitle = id ? formattedTitle + " - " + id : formattedTitle;
                    this.$rootScope.pageTitle = formattedTitle;
                };
                CoreService.prototype.xhrSent = function () {
                    if (!this.activeRequests) {
                        this.activeRequests = true;
                        this.ngProgressLite.start();
                    }
                    this.requestCount++;
                };
                CoreService.prototype.xhrDone = function () {
                    this.finishedRequests++;
                    if (this.finishedRequests === this.requestCount) {
                        this.activeRequests = false;
                        this.finishedRequests = 0;
                        this.requestCount = 0;
                        this.ngProgressLite.done();
                    }
                };
                CoreService.prototype.setSearchModelState = function (state) {
                    this.$rootScope.modelLoaded = state;
                };
                CoreService.prototype.retry = function (response, deferred, responseHandler) {
                    var _this = this;
                    var r = function () {
                        _this.$http(response.config)
                            .then(responseHandler, function (response) {
                            if (response.config.url.indexOf(_this.config.auth) !== -1) {
                                return;
                            }
                            if (!_this.$uibModalStack.getTop()) {
                                response && _this.$uibModal.open({
                                    templateUrl: "core/templates/internal-server-error.html",
                                    controller: "WarningController",
                                    controllerAs: "wc",
                                    backdrop: "static",
                                    keyboard: false,
                                    backdropClass: "warning-backdrop",
                                    animation: false,
                                    size: "lg",
                                    resolve: {
                                        warning: null,
                                        header: null
                                    }
                                });
                            }
                            _this.$rootScope.$emit('ClearLoadingScreen');
                            deferred.reject();
                        });
                    };
                    var timeOut = Math.floor((Math.random() * 5) + 1) * 1000;
                    console.log("retrying in " + timeOut + "ms");
                    setTimeout(r, timeOut);
                    return false;
                };
                return CoreService;
            }());
            var LocalStorageService = (function () {
                /* @ngInject */
                LocalStorageService.$inject = ["$window", "$uibModal", "$uibModalStack", "$timeout"];
                function LocalStorageService($window, $uibModal, $uibModalStack, $timeout) {
                    this.$window = $window;
                    this.$uibModal = $uibModal;
                    this.$uibModalStack = $uibModalStack;
                    this.$timeout = $timeout;
                }
                LocalStorageService.prototype.removeItem = function (item) {
                    try {
                        this.$window.localStorage.removeItem(item);
                    }
                    catch (e) {
                        console.log(e);
                    }
                };
                LocalStorageService.prototype.getItem = function (item, defaultResponse) {
                    var result;
                    try {
                        try {
                            result = JSON.parse(this.$window.localStorage.getItem(item)) || defaultResponse || {};
                        }
                        catch (e) {
                            result = this.$window.localStorage.getItem(item) || defaultResponse || {};
                        }
                    }
                    catch (e) {
                        console.log(e);
                        result = defaultResponse || {};
                    }
                    return result;
                };
                LocalStorageService.prototype.setItem = function (key, item) {
                    var _this = this;
                    var success = true;
                    try {
                        // always stringify so can always parse
                        this.$window.localStorage.setItem(key, JSON.stringify(item));
                    }
                    catch (e) {
                        console.log(e);
                        success = false;
                        if (key !== 'gdc-facet-config') {
                            this.$timeout(function () {
                                if (!_this.$uibModalStack.getTop()) {
                                    var modalInstance = _this.$uibModal.open({
                                        templateUrl: "core/templates/enable-cookies.html",
                                        controller: "WarningController",
                                        controllerAs: "wc",
                                        backdrop: "static",
                                        keyboard: false,
                                        backdropClass: "warning-backdrop",
                                        animation: false,
                                        resolve: { warning: null, header: null }
                                    });
                                }
                            });
                        }
                    }
                    return success;
                };
                return LocalStorageService;
            }());
            var dataNames = [
                'Sequencing Reads',
                'Gene expression',
                'Simple nucleotide variation',
                'Copy number variation',
                'Structural rearrangement',
                'DNA methylation',
                'Clinical',
                'Biospecimen'
            ];
            var expNames = [
                "Genotyping Array",
                "Gene Expression Array",
                "Exon Array",
                "miRNA Expression Array",
                "Methylation Array",
                "CGH Array",
                "MSI-Mono-Dinucleotide Assay",
                "WGS",
                "WGA",
                "WXS",
                "RNA-Seq",
                "miRNA-Seq",
                "ncRNA-Seq",
                "WCS",
                "CLONE",
                "POOLCLONE",
                "AMPLICON",
                "CLONEEND",
                "FINISHING",
                "ChIP-Seq",
                "MNase-Seq",
                "DNase-Hypersensitivity",
                "Bisulfite-Seq",
                "EST",
                "FL-cDNA",
                "CTS",
                "MRE-Seq",
                "MeDIP-Seq",
                "MBD-Seq",
                "Tn-Seq",
                "FAIRE-seq",
                "SELEX",
                "RIP-Seq",
                "ChIA-PET",
                "DNA-Seq",
                "Total RNA-Seq",
                "VALIDATION",
                "OTHER"
            ];
            angular
                .module("core.services", ["gettext", "ui.bootstrap"])
                .value("DataCategoryNames", dataNames)
                .value("ExperimentalStrategyNames", expNames)
                .service("CoreService", CoreService)
                .service("LocalStorageService", LocalStorageService);
        })(services = core.services || (core.services = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));

/* @ngInject */
function exceptionDecorator($provide) {
    $provide.decorator("$exceptionHandler",
    /* @ngInject */
    ["$delegate", "$injector", "$log", "$window", function ($delegate, $injector, $log, $window) {
        return function (exception, cause) {
            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
            function uuid4() {
                return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
            // TODO: do whatever you want with errors
            var post = {
                "event_id": uuid4(),
                "url": $window.location.href,
                "date": +new Date(),
                "exception": {
                    "message": exception.message,
                    "stack": exception.stack
                },
                "cause": cause
            };
            $log.debug("ERROR", post);
            var Restangular = $injector.get("Restangular");
            // Restangular.all('errors').post(post);
            $delegate(exception, cause);
        };
    }]);
}
angular
    .module("ngApp")
    .config(exceptionDecorator);



var ngApp;
(function (ngApp) {
    var files;
    (function (files_1) {
        var controllers;
        (function (controllers) {
            var FileController = (function () {
                /* @ngInject */
                FileController.$inject = ["file", "$scope", "CoreService", "CartService", "FilesService", "$filter", "BiospecimenService"];
                function FileController(file, $scope, CoreService, CartService, FilesService, $filter, BiospecimenService) {
                    var _this = this;
                    this.file = file;
                    this.$scope = $scope;
                    this.CoreService = CoreService;
                    this.CartService = CartService;
                    this.FilesService = FilesService;
                    this.$filter = $filter;
                    this.BiospecimenService = BiospecimenService;
                    this.archiveCount = 0;
                    this.annotationIds = [];
                    this.tableFilters = {
                        assocEntity: '',
                        readGroup: ''
                    };
                    setTimeout(function () {
                        // long-scrollable-table should become its own directive
                        // --
                        // this function moves the "sticky" header columns which do not scroll
                        // naturally with the table
                        $('.long-scrollable-table-container').scroll(function () {
                            var el = $(this);
                            var div = el.find('.sticky div');
                            div.css({ transform: "translateX(-" + el.scrollLeft() + "px)" });
                        });
                    });
                    CoreService.setPageTitle("File", file.file_name);
                    var toDisplayLogic = {
                        'Sequencing Reads': ['analysis', 'referenceGenome', 'readGroup', 'downstreamAnalysis'],
                        'Transcriptome Profiling': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
                        'Simple Nucleotide Variation': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
                        'Copy Number Variation': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
                        'Structural Rearrangement': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
                        'DNA Methylation': ['analysis', 'referenceGenome', 'downstreamAnalysis'],
                        'Clinical': [],
                        'Biospecimen': []
                    };
                    this.tablesToDisplay = (toDisplayLogic[file.data_category] || []).reduce(function (acc, t) {
                        acc[t] = true;
                        return acc;
                    }, {});
                    if (this.file.archive) {
                        this.FilesService.getFiles({
                            fields: [
                                "archive.archive_id"
                            ],
                            filters: { "op": "=", "content": { "field": "files.archive.archive_id", "value": [file.archive.archive_id] } }
                        }).then(function (data) { return _this.archiveCount = data.pagination.total; });
                    }
                    else {
                        this.archiveCount = 0;
                    }
                    _.forEach(file.associated_entities, function (entity) {
                        var found = BiospecimenService.search(entity.entity_id, _.find(file.cases, { "case_id": entity.case_id }), ['submitter_id', 'sample_id', 'portion_id',
                            'analyte_id', 'slide_id', 'aliquot_id']);
                        entity.sample_type = (_.first(found) || { sample_type: '--' }).sample_type;
                        entity.annotations = _.filter(file.annotations, function (annotation) {
                            return annotation.entity_id === entity.entity_id;
                        });
                        if (entity.annotations) {
                            entity.annotations = _.pluck(entity.annotations, "annotation_id");
                        }
                    });
                    //insert project into top level because it's in the properties table
                    file.projects = _.reject(_.unique(file.cases.map(function (c) { return (c.project || {}).project_id; })), function (p) { return _.isUndefined(p) || _.isNull(p); });
                    //insert cases into related_files for checking isUserProject when downloading
                    _.forEach(file.related_files, function (related_file) {
                        related_file['cases'] = file.cases;
                    });
                    if (file.downstream_analyses) {
                        file.downstream_analyses = file.downstream_analyses.reduce(function (prev, curr) {
                            return prev.concat((curr.output_files || []).map(function (x) {
                                return _.extend({}, x, {
                                    workflow_type: curr.workflow_type,
                                    cases: file.cases.slice()
                                });
                            }));
                        }, []);
                    }
                }
                FileController.prototype.isInCart = function () {
                    return this.CartService.isInCart(this.file.file_id);
                };
                FileController.prototype.handleCartButton = function () {
                    if (this.CartService.isInCart(this.file.file_id)) {
                        this.CartService.remove([this.file.file_id]);
                    }
                    else {
                        this.CartService.addFiles([this.file], true);
                    }
                };
                FileController.prototype.canBAMSlice = function () {
                    return (this.file.data_type || '').toLowerCase() === 'aligned reads' &&
                        (this.file.index_files || []).length != 0 &&
                        (this.file.data_format || '').toLowerCase() === 'bam';
                };
                FileController.prototype.makeSearchPageLink = function (files) {
                    if (files === void 0) { files = []; }
                    if (files.length) {
                        var filterString = this.$filter("makeFilter")([{
                                field: 'files.file_id',
                                value: files.map(function (f) { return f.file_id; })
                            }], true);
                        var href = 'search/f?filters=' + filterString;
                        return files.length ? "<a href='" + href + "'>" + files.length + '</a>' : '0';
                    }
                };
                return FileController;
            }());
            var BAMSlicingController = (function () {
                /* @ngInject */
                BAMSlicingController.$inject = ["$uibModalInstance", "$scope", "FilesService", "file", "GqlService", "completeCallback", "inProgress", "downloader"];
                function BAMSlicingController($uibModalInstance, $scope, FilesService, file, GqlService, completeCallback, inProgress, downloader) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.$scope = $scope;
                    this.FilesService = FilesService;
                    this.file = file;
                    this.GqlService = GqlService;
                    this.completeCallback = completeCallback;
                    this.inProgress = inProgress;
                    this.downloader = downloader;
                    this.exampleShowing = false;
                    this.$scope.bedModel = "";
                }
                BAMSlicingController.prototype.submit = function () {
                    this.FilesService.sliceBAM(this.file.file_id, this.$scope.bedModel, this.completeCallback, this.inProgress, this.downloader);
                    this.$uibModalInstance.close('slicing');
                };
                BAMSlicingController.prototype.allowTab = function ($event) {
                    if (event.keyCode === 9) {
                        event.preventDefault();
                        // current caret pos
                        var start = $event.target.selectionStart;
                        var end = $event.target.selectionEnd;
                        var oldValue = this.$scope.bedModel;
                        this.$scope.bedModel = oldValue.substring(0, start) + '\t' + oldValue.substring(end);
                        // put caret in correct place
                        this.GqlService.setPos($event.target, start + 1);
                    }
                };
                BAMSlicingController.prototype.toggleExample = function () {
                    this.exampleShowing = !this.exampleShowing;
                };
                BAMSlicingController.prototype.closeModal = function () {
                    this.$uibModalInstance.dismiss('cancelled');
                };
                return BAMSlicingController;
            }());
            var BAMFailedModalController = (function () {
                /* @ngInject */
                BAMFailedModalController.$inject = ["$uibModalInstance", "errorStatus", "errorStatusText", "errorBlob"];
                function BAMFailedModalController($uibModalInstance, errorStatus, errorStatusText, errorBlob) {
                    var _this = this;
                    this.$uibModalInstance = $uibModalInstance;
                    this.errorStatus = errorStatus;
                    this.errorStatusText = errorStatusText;
                    this.errorBlob = errorBlob;
                    this.msg400 = "Invalid BED Format. Please refer to the examples described in the BAM Slicing pop-up.";
                    this.errorBlobString = "";
                    var reader = new FileReader();
                    reader.addEventListener("loadend", function () {
                        _this.errorBlobString = _.get(JSON.parse(reader.result), "error", "Error slicing");
                    });
                    reader.readAsText(errorBlob);
                }
                return BAMFailedModalController;
            }());
            angular
                .module("files.controller", [
                "files.services"
            ])
                .controller("BAMSlicingController", BAMSlicingController)
                .controller("BAMFailedModalController", BAMFailedModalController)
                .controller("FileController", FileController);
        })(controllers = files_1.controllers || (files_1.controllers = {}));
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var files;
    (function (files_1) {
        var directives;
        (function (directives) {
            DownloadButton.$inject = ["$log", "UserService", "$uibModal", "config"];
            DownloadManifestButton.$inject = ["FilesService", "config", "LocationService"];
            BAMSlicingButton.$inject = ["$log", "UserService", "$uibModal"];
            var hasControlledFiles = function (files) { return files.some(function (f) { return f.access !== 'open'; }); };
            function DownloadMetadataButton() {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        filename: '@',
                        textNormal: '@',
                        textInProgress: '@',
                        styleClass: '@',
                        icon: '@'
                    },
                    template: '<button tabindex="0" data-ng-class="[styleClass || \'btn btn-primary\']" data-downloader ng-click="ctrl.onClick()"> \
              <i class="fa {{icon || \'fa-download\'}}" ng-class="{\'fa-spinner\': active, \'fa-pulse\': active}" /> \
              <span ng-if="textNormal"><span ng-if="! active">&nbsp;{{ ::textNormal }}</span> \
              <span ng-if="active">&nbsp;{{ ::textInProgress }}</span></span></button>',
                    controllerAs: 'ctrl',
                    controller: ["$scope", "$attrs", "$element", "$uibModal", "CartService", "UserService", "config", function ($scope, $attrs, $element, $uibModal, CartService, UserService, config) {
                        this.onClick = function () {
                            var url = config.auth_api + '/files';
                            var reportStatus = _.isFunction($scope.$parent.reportStatus)
                                ? _.partial($scope.$parent.reportStatus, $scope.$id)
                                : function () { };
                            var inProgress = function () {
                                $scope.active = true;
                                reportStatus($scope.active);
                                $attrs.$set('disabled', 'disabled');
                            };
                            var done = function () {
                                $scope.active = false;
                                reportStatus($scope.active);
                                $element.removeAttr('disabled');
                            };
                            var isLoggedIn = UserService.currentUser;
                            var authorizedInCart = CartService.getAuthorizedFiles();
                            var unauthorizedInCart = CartService.getUnauthorizedFiles();
                            var fileIds = CartService.getFileIds();
                            var filters = { 'content': [{ 'content': { 'field': 'files.file_id', 'value': fileIds }, 'op': 'in' }], 'op': 'and' };
                            var params = _.merge({
                                attachment: true,
                                filters: filters,
                                fields: [
                                    "state",
                                    "md5sum",
                                    "access",
                                    "data_format",
                                    "data_type",
                                    "data_category",
                                    "file_name",
                                    "file_size",
                                    "file_id",
                                    "platform",
                                    "experimental_strategy",
                                    "center.short_name",
                                    "cases.case_id",
                                    "cases.project.project_id",
                                    "annotations.annotation_id",
                                    "annotations.entity_id",
                                    "tags",
                                    "submitter_id",
                                    "archive.archive_id",
                                    "archive.submitter_id",
                                    "archive.revision",
                                    "associated_entities.entity_id",
                                    "associated_entities.entity_type",
                                    "associated_entities.case_id",
                                    "analysis.analysis_id",
                                    "analysis.workflow_type",
                                    "analysis.updated_datetime",
                                    "analysis.input_files.file_id",
                                    "analysis.metadata.read_groups.read_group_id",
                                    "analysis.metadata.read_groups.is_paired_end",
                                    "analysis.metadata.read_groups.read_length",
                                    "analysis.metadata.read_groups.library_name",
                                    "analysis.metadata.read_groups.sequencing_center",
                                    "analysis.metadata.read_groups.sequencing_date",
                                    "downstream_analyses.output_files.access",
                                    "downstream_analyses.output_files.file_id",
                                    "downstream_analyses.output_files.file_name",
                                    "downstream_analyses.output_files.data_category",
                                    "downstream_analyses.output_files.data_type",
                                    "downstream_analyses.output_files.data_format",
                                    "downstream_analyses.workflow_type",
                                    "downstream_analyses.output_files.file_size",
                                    "index_files.file_id"
                                ],
                                expand: [
                                    "metadata_files",
                                    'annotations',
                                    'archive',
                                    'associated_entities',
                                    'center',
                                    'analysis',
                                    'analysis.input_files',
                                    'analysis.metadata',
                                    'analysis.metadata_files',
                                    'analysis.downstream_analyses',
                                    'analysis.downstream_analyses.output_files',
                                    'reference_genome',
                                    'index_file',
                                    'cases',
                                    'cases.demographic',
                                    'cases.diagnoses',
                                    'cases.diagnoses.treatments',
                                    'cases.family_histories',
                                    'cases.exposures',
                                    'cases.samples',
                                    'cases.samples.portions',
                                    'cases.samples.portions.analytes',
                                    'cases.samples.portions.analytes.aliquots',
                                    'cases.samples.portions.analytes.aliquots.annotations',
                                    'cases.samples.portions.analytes.annotations',
                                    'cases.samples.portions.submitter_id',
                                    'cases.samples.portions.slides',
                                    'cases.samples.portions.annotations',
                                    'cases.samples.portions.center'
                                ],
                                format: 'JSON',
                                pretty: true,
                                size: fileIds.length
                            }, $scope.filename ? { filename: $scope.filename } : {});
                            var checkProgress = $scope.download(params, url, function () { return $element; }, 'POST');
                            checkProgress(inProgress, done, true);
                        };
                        $scope.active = false;
                    }]
                };
            }
            function DownloadButton($log, UserService, $uibModal, config) {
                var hasAccess = function (files) { return files.every(function (f) { return UserService.isUserProject(f); }); };
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        files: "=",
                        copy: "@",
                        dlcopy: "@",
                        classes: "@",
                        icon: "@"
                    },
                    template: "<a ng-class=\"[classes || 'btn btn-primary']\" data-downloader>" +
                        "<i class=\"fa {{icon || 'fa-download'}}\" ng-class=\"{'fa-spinner': active, 'fa-pulse': active}\"></i>" +
                        "<span ng-if=\"copy\"><span ng-if=\"!active\">&nbsp;{{copy}}</span><span ng-if=\"active\">&nbsp;{{dlcopy}}</span></span></a>",
                    link: function ($scope, $element, $attrs) {
                        $scope.active = false;
                        var inProgress = function () {
                            $scope.active = true;
                            $attrs.$set('disabled', 'disabled');
                        };
                        var done = function () {
                            $scope.active = false;
                            $element.removeAttr('disabled');
                        };
                        var url = config.auth_api + '/data?annotations=true&related_files=true';
                        var download = function (files) {
                            if ((files || []).length > 0) {
                                var params = { ids: files.map(function (f) { return f.file_id; }) };
                                var checkProgress = $scope.download(params, url, function () { return $element; }, 'POST');
                                checkProgress(inProgress, done, true);
                            }
                        };
                        var showModal = function (template) {
                            return $uibModal.open({
                                templateUrl: template,
                                controller: 'LoginToDownloadController',
                                controllerAs: 'wc',
                                backdrop: true,
                                keyboard: true,
                                animation: false,
                                size: 'lg'
                            });
                        };
                        $element.on('click', function () {
                            var files = [].concat($scope.files);
                            if (hasControlledFiles(files)) {
                                if (UserService.currentUser) {
                                    // Makes sure the user session has not expired.
                                    UserService.loginPromise().then(function () {
                                        // Session is still active.
                                        if (hasAccess(files)) {
                                            download(files);
                                        }
                                        else {
                                            showModal('core/templates/request-access-to-download-single.html');
                                        }
                                    }, function (response) {
                                        $log.log('User session has expired.', response);
                                        showModal('core/templates/session-expired.html').result.then(function (a) {
                                            UserService.logout();
                                        });
                                    });
                                }
                                else {
                                    showModal('core/templates/login-to-download-single.html');
                                }
                            }
                            else {
                                download(files);
                            }
                        });
                    }
                };
            }
            function DownloadManifestButton(FilesService, config, LocationService) {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        projectId: "=",
                        size: "=",
                        copy: "@",
                        dlcopy: "@",
                        classes: "@",
                        icon: "@"
                    },
                    templateUrl: "files/templates/download-manifest-button.html",
                    link: function ($scope, $element, $attrs) {
                        var togglePopover = function (shouldBeOpen) { return $scope.$apply(function () {
                            $scope.open = shouldBeOpen;
                            if (shouldBeOpen) {
                                setTimeout(function () {
                                    $('.popover').mouseleave(function () {
                                        $scope.$apply(function () { return $scope.open = false; });
                                    });
                                });
                            }
                        }); };
                        $element.on('mouseenter', function () { return togglePopover(true); });
                        $element.on('mouseleave', _.debounce(function () {
                            if ($('.popover#hover').length === 0)
                                togglePopover(false);
                        }, 700));
                        $scope.active = false;
                        var inProgress = function () {
                            $scope.active = true;
                            $attrs.$set('disabled', 'disabled');
                        };
                        var done = function () {
                            $scope.active = false;
                            $element.removeAttr('disabled');
                        };
                        $element.on('click', function () {
                            if ($scope.active === true)
                                return;
                            var url = config.auth_api + '/files';
                            var params = {
                                return_type: 'manifest',
                                size: $scope.size,
                                attachment: true,
                                format: 'TSV',
                                filters: $scope.projectId // on project page
                                    ? {
                                        op: 'in',
                                        content: {
                                            field: 'cases.project.project_id',
                                            value: $scope.projectId
                                        }
                                    }
                                    : LocationService.filters()
                            };
                            var checkProgress = $scope.download(params, url, function () { return $element; }, 'POST');
                            checkProgress(inProgress, done);
                        });
                    }
                };
            }
            function BAMSlicingButton($log, UserService, $uibModal) {
                var hasAccess = function (files) { return files.every(function (f) { return UserService.isUserProject(f); }); };
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        files: "=",
                        copy: "@",
                        dlcopy: "@",
                        classes: "@",
                        icon: "@"
                    },
                    template: "<a ng-class=\"[classes || 'btn btn-primary']\" data-downloader>" +
                        "<i class=\"fa {{icon || 'fa-download'}}\" ng-class=\"{'fa-spinner': active, 'fa-pulse': active}\"></i>" +
                        "<span ng-if=\"copy\"><span ng-if=\"!active\">&nbsp;{{copy}}</span><span ng-if=\"active\">&nbsp;{{dlcopy}}</span></span></a>",
                    link: function ($scope, $element, $attrs) {
                        $scope.active = false;
                        var inProgress = function () {
                            $scope.active = true;
                            $attrs.$set('disabled', 'disabled');
                        };
                        var done = function () {
                            $scope.active = false;
                            $element.removeAttr('disabled');
                        };
                        var bamSlice = function (files) {
                            var bamModal = $uibModal.open({
                                templateUrl: "files/templates/bam-slicing.html",
                                controller: "BAMSlicingController",
                                controllerAs: "bamc",
                                backdrop: true,
                                keyboard: true,
                                animation: false,
                                size: "lg",
                                resolve: {
                                    file: function () {
                                        return _.first(files);
                                    },
                                    completeCallback: function () { return done; },
                                    inProgress: function () { return inProgress; },
                                    downloader: function () { return $scope.download; }
                                }
                            });
                        };
                        var showModal = function (template) {
                            return $uibModal.open({
                                templateUrl: template,
                                controller: 'LoginToDownloadController',
                                controllerAs: 'wc',
                                backdrop: true,
                                keyboard: true,
                                animation: false,
                                size: 'lg'
                            });
                        };
                        $element.on("click", function (a) {
                            var files = [].concat($scope.files);
                            bamSlice(files);
                            if (hasControlledFiles(files)) {
                                if (UserService.currentUser) {
                                    // Makes sure the user session has not expired.
                                    UserService.loginPromise().then(function () {
                                        // Session is still active.
                                        if (hasAccess(files)) {
                                            bamSlice(files);
                                        }
                                        else {
                                            showModal('core/templates/request-access-to-download-single.html');
                                        }
                                    }, function (response) {
                                        $log.log('User session has expired.', response);
                                        showModal('core/templates/session-expired.html').result.then(function (a) {
                                            UserService.logout();
                                        });
                                    });
                                }
                                else {
                                    showModal('core/templates/login-to-download-single.html');
                                }
                            }
                            else {
                                bamSlice(files);
                            }
                        });
                    }
                };
            }
            angular
                .module("files.directives", [
                "restangular", "components.location", "user.services",
                "core.services", "ui.bootstrap", "files.controller", "files.services"
            ])
                .directive("downloadButton", DownloadButton)
                .directive("downloadMetadataButton", DownloadMetadataButton)
                .directive("downloadManifestButton", DownloadManifestButton)
                .directive("bamSlicingButton", BAMSlicingButton);
        })(directives = files_1.directives || (files_1.directives = {}));
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));



var ngApp;
(function (ngApp) {
    var files;
    (function (files) {
        var services;
        (function (services) {
            var FilesService = (function () {
                /* @ngInject */
                FilesService.$inject = ["Restangular", "LocationService", "UserService", "CoreService", "$uibModal", "$rootScope", "$q", "$filter", "$window", "RestFullResponse", "AuthRestangular", "config"];
                function FilesService(Restangular, LocationService, UserService, CoreService, $uibModal, $rootScope, $q, $filter, $window, RestFullResponse, AuthRestangular, config) {
                    this.Restangular = Restangular;
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.$uibModal = $uibModal;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.$filter = $filter;
                    this.$window = $window;
                    this.RestFullResponse = RestFullResponse;
                    this.AuthRestangular = AuthRestangular;
                    this.config = config;
                    this.ds = Restangular.all("files");
                }
                FilesService.prototype.getFile = function (id, params) {
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    return this.ds.get(id, params).then(function (response) {
                        return response["data"];
                    });
                };
                FilesService.prototype.downloadManifest = function (_ids, callback) {
                    this.download("/manifest", _ids, function (status) {
                        if (callback)
                            callback(status);
                    });
                };
                FilesService.prototype.downloadFiles = function (_ids, callback) {
                    this.download("/data", _ids, function (status) {
                        if (callback)
                            callback(status);
                    });
                };
                FilesService.prototype.download = function (endpoint, ids, callback) {
                    var _this = this;
                    var abort = this.$q.defer();
                    var params = { "ids": ids };
                    this.RestFullResponse.all(endpoint + "?annotations=true&related_files=true")
                        .withHttpConfig({
                        timeout: abort.promise,
                        responseType: "blob",
                        withCredentials: true
                    })
                        .post(params, undefined, { 'Content-Type': 'application/json' })
                        .then(function (response) {
                        var filename = response.headers['content-disposition'].match(/filename=(.*)/i)[1];
                        _this.$window.saveAs(response.data, filename);
                        if (callback)
                            callback(true);
                    }, function (response) {
                        //Download Failed
                        _this.$uibModal.open({
                            templateUrl: 'core/templates/download-failed.html',
                            controller: "LoginToDownloadController",
                            controllerAs: "wc",
                            backdrop: true,
                            keyboard: true,
                            animation: false,
                            size: "lg"
                        });
                        if (callback)
                            callback(false);
                    });
                };
                FilesService.prototype.processBED = function (bedTSV) {
                    if (bedTSV) {
                        var lines = bedTSV.split("\n");
                        return { "regions": _.map(lines, function (line) {
                                var region = line.split("\t");
                                var regionString = region[0];
                                if (region.length > 1) {
                                    regionString += ":" + region[1];
                                    if (region.length > 2) {
                                        regionString += "-" + region[2];
                                    }
                                }
                                return regionString;
                            }) };
                    }
                    return {};
                };
                FilesService.prototype.sliceBAM = function (fileID, bedTSV, completeCallback, inProgress, downloader) {
                    var params = this.processBED(bedTSV);
                    params.attachment = 'true';
                    var url = this.config.auth_api + "/v0/slicing/view/" + fileID;
                    var customMessages = {
                        warningHeader: 'BAM Slicing Failed',
                        warningPrefix: 'Invalid BED Format (refer to the examples described in the BAM Slicing pop-up): '
                    };
                    var checkProgress = downloader(params, url, null, 'POST', customMessages);
                    checkProgress(inProgress, completeCallback);
                };
                FilesService.prototype.getFiles = function (params, method) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    if (method === void 0) { method = 'GET'; }
                    var modifiedParams = _.extend({}, params, {
                        fields: params.fields && params.fields.join(),
                        expand: params.expand && params.expand.join(),
                        facets: params.facets && params.facets.join()
                    });
                    var paging = angular.fromJson(this.LocationService.pagination().files);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || "file_name:asc",
                        filters: this.LocationService.filters()
                    };
                    if (!params.raw) {
                        defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "cases.project.project_id");
                    }
                    this.CoreService.setSearchModelState(false);
                    var abort = this.$q.defer();
                    if (method === 'POST') {
                        var prom = this.ds.withHttpConfig({
                            timeout: abort.promise
                        }).post(angular.extend(defaults, modifiedParams), undefined, { 'Content-Type': 'application/json' }).then(function (response) {
                            _this.CoreService.setSearchModelState(true);
                            return response.data;
                        });
                    }
                    else {
                        var prom = this.ds.withHttpConfig({
                            timeout: abort.promise
                        }).get("", angular.extend(defaults, modifiedParams)).then(function (response) {
                            _this.CoreService.setSearchModelState(true);
                            return response.data;
                        });
                    }
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        console.log('aborted');
                        abort.resolve();
                        eventCancel();
                        _this.CoreService.setSearchModelState(true);
                    });
                    return prom;
                };
                return FilesService;
            }());
            angular
                .module("files.services", ["restangular", "components.location", "user.services", "core.services"])
                .service("FilesService", FilesService);
        })(services = files.services || (files.services = {}));
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var home;
    (function (home) {
        var controllers;
        (function (controllers) {
            var HomeController = (function () {
                /* @ngInject */
                HomeController.$inject = ["ProjectsTableService", "CoreService", "$filter", "ParticipantsService", "FilesService", "ProjectsService", "DATA_TYPES", "DATA_CATEGORIES"];
                function HomeController(ProjectsTableService, CoreService, $filter, ParticipantsService, FilesService, ProjectsService, DATA_TYPES, DATA_CATEGORIES) {
                    this.ProjectsTableService = ProjectsTableService;
                    this.CoreService = CoreService;
                    this.$filter = $filter;
                    this.ParticipantsService = ParticipantsService;
                    this.FilesService = FilesService;
                    this.ProjectsService = ProjectsService;
                    this.DATA_TYPES = DATA_TYPES;
                    this.DATA_CATEGORIES = DATA_CATEGORIES;
                    CoreService.setPageTitle("Welcome to The Genomic Data Commons Data Portal");
                    this.numberFilter = $filter("number");
                    this.tooltipFn = _.bind(function (d) {
                        var str = "";
                        if (arguments.length === 0) {
                            return str;
                        }
                        str = "<h4>" + d.projectID + " (" + d.primarySite + ")</h4>\n<p>" +
                            this.numberFilter(d.caseCount) + " cases (" + this.numberFilter(d.fileCount) + " files)\n" +
                            "</p>";
                        return str;
                    }, this);
                    var yearsToDays = function (year) { return year * 365.25; };
                    this.exampleSearchQueries = [
                        {
                            description: "Cases of kidney cancer diagnosed at the age of 20 and below",
                            filters: {
                                op: "and",
                                content: [
                                    {
                                        op: "<=",
                                        content: {
                                            field: "cases.diagnoses.age_at_diagnosis",
                                            value: [yearsToDays(20)]
                                        }
                                    },
                                    {
                                        op: "in",
                                        content: {
                                            field: "cases.project.primary_site",
                                            value: ["Kidney"]
                                        }
                                    }
                                ]
                            },
                            caseCount: null,
                            fileCount: null
                        },
                        {
                            description: "CNV data of female brain cancer cases",
                            filters: {
                                op: "and",
                                content: [
                                    {
                                        op: "in",
                                        content: {
                                            field: "files.data_category",
                                            value: [this.DATA_CATEGORIES.CNV.full]
                                        }
                                    },
                                    {
                                        op: "in",
                                        content: {
                                            field: "cases.project.primary_site",
                                            value: ["Brain"]
                                        }
                                    },
                                    {
                                        op: "in",
                                        content: {
                                            field: "cases.demographic.gender",
                                            value: ["female"]
                                        }
                                    }
                                ]
                            },
                            caseCount: null,
                            fileCount: null
                        },
                        {
                            description: "Gene expression quantification data in TCGA-GBM project",
                            filters: {
                                op: "and",
                                content: [
                                    {
                                        op: "in",
                                        content: {
                                            field: "files.data_type",
                                            value: [this.DATA_TYPES.GEQ.full]
                                        }
                                    },
                                    {
                                        op: "in",
                                        content: {
                                            field: "cases.project.project_id",
                                            value: ["TCGA-GBM"]
                                        }
                                    }
                                ]
                            },
                            caseCount: null,
                            fileCount: null
                        },
                    ];
                    this.defaultParams = {
                        size: 0
                    };
                    this.refresh();
                }
                HomeController.prototype.fetchExampleSearchQueryStats = function () {
                    var _this = this;
                    var exampleQueries = this.exampleSearchQueries;
                    var defaultParams = this.defaultParams;
                    exampleQueries.forEach(function (query) {
                        var params = _.cloneDeep(defaultParams);
                        params.filters = query.filters;
                        _this.ParticipantsService.getParticipants(params).then(function (projectData) { return query.caseCount = projectData.pagination.total; }).catch(function () { return query.fileCount = '--'; });
                        _this.FilesService.getFiles(params).then(function (projectData) { return query.fileCount = projectData.pagination.total; }).catch(function () { return query.fileCount = '--'; });
                    });
                };
                HomeController.prototype.getExampleSearchQueries = function () {
                    return this.exampleSearchQueries;
                };
                HomeController.prototype.transformProjectData = function (data) {
                    var _controller = this, hits = _.get(data, 'hits', false);
                    if (!hits) {
                        return;
                    }
                    // reduce the array keyed on projectID
                    var primarySites = _.reduce(hits, function (primarySiteData, project) {
                        var primarySite = project.primary_site;
                        if (primarySite) {
                            if (!_.isArray(primarySiteData[primarySite])) {
                                primarySiteData[primarySite] = [];
                            }
                            primarySiteData[primarySite].push(project);
                        }
                        return primarySiteData;
                    }, {});
                    var primarySiteIDs = _.keys(primarySites);
                    if (primarySiteIDs.length === 0) {
                        return;
                    }
                    var firstPassProjectData = _.filter(_.map(primarySiteIDs, function (pID) {
                        var primarySiteData = primarySites[pID], caseCount = 0, fileCount = 0;
                        for (var i = 0; i < primarySiteData.length; i++) {
                            caseCount += +(_.get(primarySiteData[i], 'summary.case_count', 0));
                            fileCount += +(_.get(primarySiteData[i], 'summary.file_count', 0));
                        }
                        /* _key and _count are required data properties for the marked bar chart */
                        return { _key: pID, values: primarySiteData, _count: caseCount, fileCount: fileCount };
                    }), function (d) { return d._count > 0; })
                        .sort(function (primarySiteA, primarySiteB) {
                        return primarySiteB._count - primarySiteA._count;
                    });
                    _controller.projectChartData = _.map(firstPassProjectData, function (primarySite) {
                        var dataStack = {};
                        var primarySiteTotal = 0;
                        _.assign(dataStack, primarySite);
                        var sortedProjects = primarySite.values.sort(function (a, b) { return a.summary.case_count - b.summary.case_count; });
                        dataStack.stacks = _.map(sortedProjects, function (project) {
                            // Make sure previous site y1 > y0
                            if (primarySiteTotal > 0) {
                                primarySiteTotal++;
                            }
                            var newPrimarySiteTotal = primarySiteTotal + project.summary.case_count;
                            var stack = {
                                _key: primarySite._key,
                                primarySite: primarySite._key,
                                y0: primarySiteTotal,
                                y1: newPrimarySiteTotal,
                                projectID: project.project_id,
                                caseCount: project.summary.case_count,
                                fileCount: project.summary.file_count
                            };
                            primarySiteTotal = newPrimarySiteTotal;
                            return stack;
                        });
                        dataStack._maxY = primarySiteTotal;
                        return dataStack;
                    });
                };
                HomeController.prototype.getChartFilteredData = function () {
                    return this.projectChartData;
                };
                HomeController.prototype.getChartTooltipFunction = function () {
                    return this.tooltipFn;
                };
                HomeController.prototype.setChartDataFilter = function () {
                };
                HomeController.prototype.getProjectStats = function () {
                    return this.projectStats;
                };
                HomeController.prototype.fetchAllStatsData = function () {
                    var _this = this;
                    var _controller = this;
                    this.FilesService.getFiles({ size: 0 }).then(function (d) {
                        _this.fileData = d;
                    });
                    this.ParticipantsService.getParticipants({ size: 0 }).then(function (d) {
                        _this.caseData = d;
                    });
                    this.ProjectsService.getProjects({
                        fields: ['primary_site', 'project_id', 'summary.case_count', 'summary.file_count'],
                        facets: ['primary_site'],
                        size: 1000
                    })
                        .then(function (projectData) {
                        _controller.projectData = projectData;
                        _controller.projectData.aggregations.primary_site.buckets = projectData.aggregations.primary_site.buckets.filter(function (x) { return !(x.key === '_missing'); });
                        _controller.chartData = _controller.transformProjectData(projectData);
                    });
                };
                HomeController.prototype.refresh = function () {
                    this.fetchExampleSearchQueryStats();
                    this.fetchAllStatsData();
                };
                return HomeController;
            }());
            angular
                .module("home.controller", [
                "ngApp.core",
                "participants.services",
                "files.services"
            ])
                .controller("HomeController", HomeController);
        })(controllers = home.controllers || (home.controllers = {}));
    })(home = ngApp.home || (ngApp.home = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var participants;
    (function (participants) {
        var controllers;
        (function (controllers) {
            var ParticipantController = (function () {
                /* @ngInject */
                ParticipantController.$inject = ["participant", "CoreService", "LocationService", "$filter", "ExperimentalStrategyNames", "DATA_CATEGORIES", "config"];
                function ParticipantController(participant, CoreService, LocationService, $filter, ExperimentalStrategyNames, DATA_CATEGORIES, config) {
                    var _this = this;
                    this.participant = participant;
                    this.CoreService = CoreService;
                    this.LocationService = LocationService;
                    this.$filter = $filter;
                    this.ExperimentalStrategyNames = ExperimentalStrategyNames;
                    this.DATA_CATEGORIES = DATA_CATEGORIES;
                    this.config = config;
                    CoreService.setPageTitle("Case", participant.case_id);
                    this.participant = participant;
                    this.pluck = function (array, property) { return array.map(function (x) { return x[property]; }); };
                    this.activeClinicalTab = 'demographic';
                    this.setClinicalTab = function (tab) {
                        _this.activeClinicalTab = tab;
                    };
                    this.annotationIds = _.map(this.participant.annotations, function (annotation) {
                        return annotation.annotation_id;
                    });
                    this.clinicalFile = _.find(this.participant.files, function (file) {
                        return (file.data_subtype || '').toLowerCase() === "clinical data";
                    });
                    this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function (result, name) {
                        var strat = _.find(participant.summary.experimental_strategies, function (item) {
                            return item.experimental_strategy.toLowerCase() === name.toLowerCase();
                        });
                        if (strat) {
                            result.push(strat);
                        }
                        return result;
                    }, []);
                    this.clinicalDataExportFilters = {
                        'cases.case_id': participant.case_id
                    };
                    this.clinicalDataExportExpands = ['demographic', 'diagnoses', 'diagnoses.treatments', 'family_histories', 'exposures'];
                    this.hasNoClinical = !this.clinicalDataExportExpands.some(function (field) { return (participant[field] || []).length > 0; });
                    this.clinicalDataExportFileName = 'clinical.case-' + participant.case_id;
                    this.dataCategories = Object.keys(this.DATA_CATEGORIES).reduce(function (acc, key) {
                        var type = _.find(participant.summary.data_categories, function (item) {
                            return item.data_category === _this.DATA_CATEGORIES[key].full;
                        });
                        return acc.concat(type || {
                            data_category: _this.DATA_CATEGORIES[key].full,
                            file_count: 0
                        });
                    }, []);
                    this.expStratConfig = {
                        sortKey: "file_count",
                        displayKey: "experimental_strategy",
                        defaultText: "experimental strategy",
                        pluralDefaultText: "experimental strategies",
                        hideFileSize: true,
                        noResultsText: "No files with Experimental Strategies",
                        state: {
                            name: "search.files"
                        },
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.case_id",
                                                value: [
                                                    participant.case_id
                                                ]
                                            },
                                            {
                                                field: "files.experimental_strategy",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.dataCategoriesConfig = {
                        sortKey: "file_count",
                        displayKey: "data_category",
                        defaultText: "data category",
                        hideFileSize: true,
                        pluralDefaultText: "data categories",
                        state: {
                            name: "search.files"
                        },
                        blacklist: ["structural rearrangement", "dna methylation"],
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.case_id",
                                                value: [
                                                    participant.case_id
                                                ]
                                            },
                                            {
                                                field: "files.data_category",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    // add project information to files for checking cart access
                    this.participant.files = this.participant.files.map(function (x) {
                        return _.extend(x, { cases: [{ project: _this.participant.project }] });
                    });
                }
                return ParticipantController;
            }());
            angular
                .module("participants.controller", [
                "participants.services",
                "core.services"
            ])
                .controller("ParticipantController", ParticipantController);
        })(controllers = participants.controllers || (participants.controllers = {}));
    })(participants = ngApp.participants || (ngApp.participants = {}));
})(ngApp || (ngApp = {}));



var ngApp;
(function (ngApp) {
    var participants;
    (function (participants) {
        var services;
        (function (services) {
            var ParticipantsService = (function () {
                /* @ngInject */
                ParticipantsService.$inject = ["Restangular", "LocationService", "UserService", "CoreService", "$rootScope", "$q"];
                function ParticipantsService(Restangular, LocationService, UserService, CoreService, $rootScope, $q) {
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.ds = Restangular.all("cases");
                }
                ParticipantsService.prototype.getParticipant = function (id, params) {
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    return this.ds.get(id, params).then(function (response) {
                        return response["data"];
                    });
                };
                ParticipantsService.prototype.getParticipants = function (params, method) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    if (method === void 0) { method = 'GET'; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    if (params.hasOwnProperty("facets")) {
                        params["facets"] = params["facets"].join();
                    }
                    var paging = angular.fromJson(this.LocationService.pagination()["cases"]);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || 'case_id:asc',
                        filters: this.LocationService.filters()
                    };
                    if (!params.hasOwnProperty("raw")) {
                        defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "cases.project.project_id");
                    }
                    this.CoreService.setSearchModelState(false);
                    var abort = this.$q.defer();
                    if (method === 'POST') {
                        var prom = this.ds.withHttpConfig({
                            timeout: abort.promise
                        })
                            .post(angular.extend(defaults, params), undefined, { 'Content-Type': 'application/json' }).then(function (response) {
                            _this.CoreService.setSearchModelState(true);
                            return response["data"];
                        });
                    }
                    else {
                        var prom = this.ds.withHttpConfig({
                            timeout: abort.promise
                        })
                            .get("", angular.extend(defaults, params)).then(function (response) {
                            _this.CoreService.setSearchModelState(true);
                            return response["data"];
                        });
                    }
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                        _this.CoreService.setSearchModelState(true);
                    });
                    return prom;
                };
                return ParticipantsService;
            }());
            angular
                .module("participants.services", ["restangular", "components.location", "user.services", "core.services"])
                .service("ParticipantsService", ParticipantsService);
        })(services = participants.services || (participants.services = {}));
    })(participants = ngApp.participants || (ngApp.participants = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var controllers;
        (function (controllers) {
            var ProjectsController = (function () {
                /* @ngInject */
                ProjectsController.$inject = ["$scope", "$rootScope", "ProjectsService", "CoreService", "ProjectsTableService", "$state", "ProjectsState", "LocationService", "$filter", "ProjectsGithutConfig", "ProjectsGithutColumns", "ProjectsGithut", "FacetService"];
                function ProjectsController($scope, $rootScope, ProjectsService, CoreService, ProjectsTableService, $state, ProjectsState, LocationService, $filter, ProjectsGithutConfig, ProjectsGithutColumns, ProjectsGithut, FacetService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.ProjectsService = ProjectsService;
                    this.CoreService = CoreService;
                    this.ProjectsTableService = ProjectsTableService;
                    this.$state = $state;
                    this.ProjectsState = ProjectsState;
                    this.LocationService = LocationService;
                    this.$filter = $filter;
                    this.ProjectsGithutConfig = ProjectsGithutConfig;
                    this.ProjectsGithutColumns = ProjectsGithutColumns;
                    this.ProjectsGithut = ProjectsGithut;
                    this.FacetService = FacetService;
                    this.tabSwitch = false;
                    this.numPrimarySites = 0;
                    this.loading = true;
                    CoreService.setPageTitle("Projects");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("projects/t") !== -1 || next.indexOf("projects/g") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState) {
                        if (toState.name.indexOf("projects") !== -1) {
                            _this.ProjectsState.setActive("tabs", toState.name.split(".")[1], "active");
                        }
                        if (fromState.name.indexOf("projects") === -1) {
                            document.body.scrollTop = 0;
                            document.documentElement.scrollTop = 0;
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    var data = $state.current.data || {};
                    this.ProjectsState.setActive("tabs", data.tab);
                    $scope.tableConfig = this.ProjectsTableService.model();
                    this.refresh();
                }
                ProjectsController.prototype.refresh = function () {
                    var _this = this;
                    this.loading = true;
                    this.$rootScope.$emit('ShowLoadingScreen');
                    var projectsTableModel = this.ProjectsTableService.model();
                    if (!this.tabSwitch) {
                        this.ProjectsService.getProjects({
                            fields: projectsTableModel.fields,
                            facets: this.FacetService.filterFacets(projectsTableModel.facets),
                            size: 100
                        }).then(function (data) {
                            _this.loading = false;
                            _this.$rootScope.$emit('ClearLoadingScreen');
                            _this.projects = data;
                            if (_this.ProjectsState.tabs.graph.active) {
                                _this.drawGraph(_this.projects);
                            }
                            else if (_this.ProjectsState.tabs.summary.active || _this.numPrimarySites === 0) {
                                _this.numPrimarySites = _.unique(_this.projects.hits, function (project) { return project.primary_site; }).length;
                            }
                        });
                    }
                    else {
                        this.loading = false;
                        this.$rootScope.$emit('ClearLoadingScreen');
                        this.tabSwitch = false;
                        if (this.ProjectsState.tabs.graph.active) {
                            this.drawGraph(this.projects);
                        }
                    }
                };
                ProjectsController.prototype.drawGraph = function (data) {
                    var githut = this.ProjectsGithut(data);
                    this.githutData = githut.data;
                    this.githutConfig = githut.config;
                };
                ProjectsController.prototype.select = function (section, tab) {
                    this.ProjectsState.setActive(section, tab);
                    this.setState(tab);
                };
                // TODO Load data lazily based on active tab
                ProjectsController.prototype.setState = function (tab) {
                    // Changing tabs and then navigating to another page
                    // will cause this to fire.
                    if (tab && (this.$state.current.name.match("projects."))) {
                        this.tabSwitch = true;
                        this.$state.go("projects." + tab, this.LocationService.search(), { inherit: false });
                    }
                };
                ProjectsController.prototype.gotoQuery = function () {
                    var stateParams = {};
                    var f = this.LocationService.filters();
                    var prefixed = {
                        "op": "and",
                        "content": _.map(f.content, function (x) { return ({
                            op: "in",
                            content: {
                                field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
                                value: x.content.value
                            }
                        }); })
                    };
                    if (f) {
                        stateParams = {
                            filters: angular.toJson(prefixed)
                        };
                    }
                    this.$state.go("search.participants", stateParams, { inherit: true });
                };
                return ProjectsController;
            }());
            var ProjectController = (function () {
                /* @ngInject */
                ProjectController.$inject = ["project", "CoreService", "AnnotationsService", "ParticipantsService", "ExperimentalStrategyNames", "DATA_CATEGORIES", "$state", "$filter"];
                function ProjectController(project, CoreService, AnnotationsService, ParticipantsService, ExperimentalStrategyNames, DATA_CATEGORIES, $state, $filter) {
                    var _this = this;
                    this.project = project;
                    this.CoreService = CoreService;
                    this.AnnotationsService = AnnotationsService;
                    this.ParticipantsService = ParticipantsService;
                    this.ExperimentalStrategyNames = ExperimentalStrategyNames;
                    this.DATA_CATEGORIES = DATA_CATEGORIES;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.biospecimenCount = 0;
                    this.clinicalCount = 0;
                    CoreService.setPageTitle("Project", project.project_id);
                    this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function (result, name) {
                        var strat = _.find(project.summary.experimental_strategies, function (item) {
                            return item.experimental_strategy.toLowerCase() === name.toLowerCase();
                        });
                        if (strat) {
                            result.push(strat);
                        }
                        return result;
                    }, []);
                    this.dataCategories = Object.keys(this.DATA_CATEGORIES).reduce(function (acc, key) {
                        var type = _.find(project.summary.data_categories, function (item) {
                            return item.data_category === _this.DATA_CATEGORIES[key].full;
                        });
                        return acc.concat(type || {
                            data_category: _this.DATA_CATEGORIES[key].full,
                            file_count: 0
                        });
                    }, []);
                    this.expStratConfig = {
                        sortKey: "file_count",
                        showParticipant: true,
                        displayKey: "experimental_strategy",
                        defaultText: "experimental strategy",
                        pluralDefaultText: "experimental strategies",
                        hideFileSize: true,
                        tableTitle: "Case and File Counts by Experimental Strategy",
                        noResultsText: "No files or cases with Experimental Strategies",
                        state: {
                            name: "search.files"
                        },
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.project.project_id",
                                                value: [
                                                    project.project_id
                                                ]
                                            },
                                            {
                                                field: "files.experimental_strategy",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.dataCategoriesConfig = {
                        sortKey: "file_count",
                        showParticipant: true,
                        displayKey: "data_category",
                        defaultText: "data category",
                        hideFileSize: true,
                        tableTitle: "Case and File Counts by Data Category",
                        pluralDefaultText: "data categories",
                        noResultsText: "No files or cases with Data Categories",
                        state: {
                            name: "search.files"
                        },
                        blacklist: ["structural rearrangement", "dna methylation"],
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.project.project_id",
                                                value: [
                                                    project.project_id
                                                ]
                                            },
                                            {
                                                field: "files.data_category",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    var projectId = project.project_id;
                    this.clinicalDataExportFilters = this.biospecimenDataExportFilters = {
                        'project.project_id': projectId
                    };
                    this.clinicalDataExportExpands = ['demographic', 'diagnoses', 'family_histories', 'exposures'];
                    this.clinicalDataExportFileName = 'clinical.project-' + projectId;
                    this.biospecimenDataExportExpands =
                        ['samples', 'samples.portions', 'samples.portions.analytes', 'samples.portions.analytes.aliquots',
                            'samples.portions.analytes.aliquots.annotations', 'samples.portions.analytes.annotations',
                            'samples.portions.submitter_id', 'samples.portions.slides', 'samples.portions.annotations',
                            'samples.portions.center'];
                    this.biospecimenDataExportFileName = 'biospecimen.project-' + projectId;
                    AnnotationsService.getAnnotations({
                        filters: {
                            content: [
                                {
                                    content: {
                                        field: "project.project_id",
                                        value: project.project_id
                                    },
                                    op: "in"
                                }
                            ],
                            op: "and"
                        },
                        size: 0
                    }).then(function (data) {
                        _this.project.annotations = data;
                    });
                    var missingBiospecFilter = {
                        content: [
                            {
                                content: {
                                    field: "project.project_id",
                                    value: project.project_id
                                },
                                op: "="
                            },
                            {
                                content: {
                                    field: "samples.sample_id",
                                    value: "MISSING"
                                },
                                op: "NOT"
                            }
                        ],
                        op: "AND"
                    };
                    ParticipantsService.getParticipants({
                        filters: missingBiospecFilter,
                        size: 0
                    }).then(function (data) { return _this.biospecimenCount = data.pagination.total; });
                    var missingClinicalFilter = {
                        content: [
                            {
                                content: {
                                    field: "project.project_id",
                                    value: project.project_id
                                },
                                op: "="
                            },
                            {
                                content: [
                                    {
                                        content: {
                                            field: "demographic.demographic_id",
                                            value: "MISSING"
                                        },
                                        op: "NOT"
                                    }, {
                                        content: {
                                            field: "diagnoses.diagnosis_id",
                                            value: "MISSING"
                                        },
                                        op: "NOT"
                                    }, {
                                        content: {
                                            field: "family_histories.family_history_id",
                                            value: "MISSING"
                                        },
                                        op: "NOT"
                                    }, {
                                        content: {
                                            field: "exposures.exposure_id",
                                            value: "MISSING"
                                        },
                                        op: "NOT"
                                    }
                                ],
                                op: "OR"
                            }
                        ],
                        op: "AND"
                    };
                    ParticipantsService.getParticipants({
                        filters: missingClinicalFilter,
                        size: 0
                    }).then(function (data) { return _this.clinicalCount = data.pagination.total; });
                }
                return ProjectController;
            }());
            angular
                .module("projects.controller", [
                "projects.services",
                "core.services",
                "projects.table.service",
                "projects.githut.config",
                "annotations.services"
            ])
                .controller("ProjectsController", ProjectsController)
                .controller("ProjectController", ProjectController);
        })(controllers = projects.controllers || (projects.controllers = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));

angular.module('projects.githut.config', ['ngApp.core'])
    .factory("ProjectsGithut", ["ProjectsGithutConfig", "ProjectsGithutColumns", function (ProjectsGithutConfig, ProjectsGithutColumns) {
    return function (data) {
        var hits = filterData(data.hits);
        var primary_sites = [];
        function findTheThing(array, data_type, propname) {
            var normalize = function (str) {
                return str.toLowerCase().replace(/\s+/g, '');
            };
            var normalizedDataType = normalize(data_type);
            return _.find(array, function (type) { return normalize(type[propname]) === normalizedDataType; });
        }
        // Gracefully handle bad data if present
        function filterData(data) {
            var filteredData = [], DEFAULT_UNKNOWN_VAL = 'Unknown';
            if (!_.isArray(data)) {
                return filteredData;
            }
            filteredData = _.reduce(data, function (projectList, project) {
                // If the Project doesn't have a name then it's invalid for use in the graph
                // but for now we will be nice and show it robustly so the problem can
                // be identified and fixed on the backend where the fix belongs...
                if (!_.isObject(project)) {
                    return projectList;
                }
                _.map(['name', 'project_id', 'primary_site'], function (key) {
                    if (!_.has(project, key)) {
                        project[key] = DEFAULT_UNKNOWN_VAL;
                    }
                });
                projectList.push(project);
                return projectList;
            }, []);
            return filteredData;
        }
        var project_ids = hits.reduce(function (a, b) {
            a[b.project_id] = b;
            return a;
        }, {});
        var aggregations = d3.keys(project_ids).reduce(function (a, key) {
            var group = project_ids[key];
            var types = group.summary.data_categories;
            if (!_.contains(primary_sites, group.primary_site)) {
                primary_sites.push(group.primary_site);
            }
            var the_returned = {
                project_id: key,
                name: group.name,
                primary_site: group.primary_site,
                file_count: group.summary.file_count,
                file_size: group.summary.file_size,
                case_count: group.summary.case_count
            };
            ProjectsGithutColumns
                .filter(function (c) { return c.is_subtype; })
                .forEach(function (s) {
                var thing = findTheThing(types, s.id, "data_category");
                the_returned[s.id] = thing ? thing.case_count : 0;
            });
            a[key] = the_returned;
            return a;
        }, {});
        return {
            data: d3.values(aggregations),
            config: ProjectsGithutConfig
        };
    };
}])
    .service("ProjectsGithutColumns", ["$state", "$filter", "DATA_CATEGORIES", function ($state, $filter, DATA_CATEGORIES) {
    function projectSref(d) {
        var filter = $filter("makeFilter")([{
                field: 'cases.project.project_id',
                value: d.lang
            }]);
        $state.go("search.participants", { filters: JSON.parse(filter) });
    }
    function dataTypeSref(d) {
        var filter = $filter("makeFilter")([{
                field: 'cases.project.project_id',
                value: d.lang
            }, { field: 'files.data_category', value: d.column }]);
        $state.go("search.participants", { filters: JSON.parse(filter) });
    }
    var results = [
        {
            id: 'project_id',
            display_name: ["Project", "ID"],
            scale: 'ordinal',
            dimensional: true,
            href: function (d) {
                $state.go('project', { projectId: d.value });
            }
        },
        {
            id: 'case_count',
            display_name: ["Case", "Count"],
            scale: 'ordinal',
            dimensional: true,
            colorgroup: 'case_count',
            href: projectSref
        },
    ];
    results = results.concat(Object.keys(DATA_CATEGORIES).map(function (key) { return ({
        id: DATA_CATEGORIES[key].full,
        display_name: [DATA_CATEGORIES[key].abbr],
        scale: 'ordinal',
        is_subtype: true,
        dimensional: true,
        colorgroup: 'case_count',
        href: dataTypeSref
    }); }));
    results = results.concat([
        {
            id: 'file_count',
            display_name: ["File", "Count"],
            scale: 'ordinal',
            dimensional: true,
            colorgroup: 'file_count',
            href: function (d) {
                var filter = $filter("makeFilter")([{ field: 'cases.project.project_id', value: d.lang }], true);
                $state.go("search.files", { filters: filter });
            }
        },
        {
            id: 'file_size',
            display_name: ["File", "Size"],
            scale: 'ordinal',
            dimensional: true,
            colorgroup: 'file_size'
        },
        {
            id: 'primary_site',
            display_name: ["Primary", "Site"],
            scale: 'linear',
            dimensional: true
        }
    ]);
    return results;
}])
    .service("ProjectsGithutConfig", ["ProjectsService", "ProjectsGithutColumns", "$filter", function (ProjectsService, ProjectsGithutColumns, $filter) {
    var color = d3.scale.category10();
    var columns = ProjectsGithutColumns;
    return {
        /* the id of the tag the table will be generated into */
        container: "#pc",
        // Used for unique styling per githut graph
        containerClass: "projects",
        /* default scale value, not useful */
        scale: "ordinal",
        /* Ordered list of columns. Only titles appearing here appear in the table */
        columns: columns.map(function (c) { return c.id; }),
        config: columns,
        /* ???
         * The value that all the other values are divided by?
         * Has something to do with dimensions?
         **/
        ref: "lang_usage",
        /**
         * No idea what title_column does.
        **/
        title_column: "project_id",
        /**
         * Not really a scale map, more a map of what kind of column it will be.
         * Ordinal is the more geometry-oriented choice
         */
        scale_map: columns.reduce(function (a, b) {
            a[b.id] = b.scale || 'ordinal';
            return a;
        }, {}),
        /**
         * Interconnected with ref and dimension, possibly.
         * No idea what this does, really.
         */
        use: {
            "project_id": "project_id"
        },
        sorter: {
            "project_id": "case_count"
        },
        color_group_map: columns.reduce(function (a, b) {
            a[b.id] = b.colorgroup;
            return a;
        }, {}),
        color_groups: {
            'file_count': color(0),
            'file_size': color(1),
            'case_count': color(2)
        },
        /**
         * The order each column will appear in.
         * Don't know how well this is implemented.
         */
        sorting: {
            "project_id": d3.ascending,
            "primary_site": d3.ascending
        },
        superhead: {
            start: 'Clinical',
            end: 'Biospecimen',
            text: ProjectsService.getTableHeading() //Case count per data type
        },
        /**
         *  Don't know what "d" is here.
         *  If defined for a column, formats the labels.
         *  Might not be implemented anywhere.
         */
        formats: {
            "primary_site": "d"
        },
        filters: {
            "file_size": $filter("size")
        },
        /**
         *  Not known what this is. Any values in columns that are not in dimensions causes an error.
         */
        dimensions: columns.filter(function (c) { return c.dimensional; }).map(function (c) { return c.id; }),
        urlMap: columns.reduce(function (a, b) {
            a[b.id] = b.href;
            return a;
        }, {}),
        /**
         * Related to animation
         */
        duration: 1000
    };
}]);



var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var services;
        (function (services) {
            var ProjectsService = (function () {
                /* @ngInject */
                ProjectsService.$inject = ["Restangular", "LocationService", "UserService", "CoreService", "$rootScope", "$q"];
                function ProjectsService(Restangular, LocationService, UserService, CoreService, $rootScope, $q) {
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.ds = Restangular.all("projects");
                }
                ProjectsService.prototype.getProject = function (id, params) {
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    return this.ds.get(id, params).then(function (response) {
                        return response["data"];
                    });
                };
                ProjectsService.prototype.getTableHeading = function () {
                    return "Case count per Data Category";
                };
                ProjectsService.prototype.getProjects = function (params) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    if (params.hasOwnProperty("facets")) {
                        params["facets"] = params["facets"].join();
                    }
                    var paging = angular.fromJson(this.LocationService.pagination()["projects"]);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size || 20,
                        from: paging.from || 1,
                        sort: paging.sort || "summary.case_count:desc",
                        filters: this.LocationService.filters()
                    };
                    defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "project_id");
                    this.CoreService.setSearchModelState(false);
                    var abort = this.$q.defer();
                    var prom = this.ds.withHttpConfig({
                        timeout: abort.promise
                    })
                        .get("", angular.extend(defaults, params)).then(function (response) {
                        _this.CoreService.setSearchModelState(true);
                        return response["data"];
                    });
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                        _this.CoreService.setSearchModelState(true);
                    });
                    return prom;
                };
                return ProjectsService;
            }());
            var State = (function () {
                function State() {
                    this.tabs = {
                        summary: {
                            active: false
                        },
                        table: {
                            active: false
                        },
                        graph: {
                            active: false
                        }
                    };
                }
                State.prototype.setActive = function (section, tab) {
                    if (section && tab) {
                        _.each(this[section], function (section) {
                            section.active = false;
                        });
                        this[section][tab].active = true;
                    }
                };
                return State;
            }());
            angular
                .module("projects.services", [
                "restangular",
                "components.location",
                "user.services"
            ])
                .service("ProjectsState", State)
                .service("ProjectsService", ProjectsService);
        })(services = projects.services || (projects.services = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var table;
        (function (table) {
            var service;
            (function (service) {
                var ProjectsTableService = (function () {
                    /* @ngInject */
                    ProjectsTableService.$inject = ["DATA_CATEGORIES"];
                    function ProjectsTableService(DATA_CATEGORIES) {
                        this.DATA_CATEGORIES = DATA_CATEGORIES;
                        this.withFilterF = this.filterFactory("search/f");
                        this.withFilter = this.filterFactory("search/c");
                    }
                    ProjectsTableService.prototype.filterFactory = function (url) {
                        return function (value, filters, $filter) {
                            var filterString = _.isObject(filters) ? $filter("makeFilter")(filters, true) : null;
                            var href = url + (filterString ? "?filters=" + filterString : "");
                            var val = $filter("number")(value);
                            return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
                        };
                    };
                    ProjectsTableService.prototype.getdataCategory = function (dataCategories, dataCategory) {
                        var data = _.find(dataCategories, { data_category: dataCategory });
                        return data ? data.case_count : 0;
                    };
                    ProjectsTableService.prototype.dataCategoryWithFilters = function (dataCategory, row, $filter) {
                        var fs = [{ field: 'cases.project.project_id', value: row.project_id },
                            { field: 'files.data_category', value: dataCategory }];
                        return this.withFilter(this.getdataCategory(row.summary.data_categories, dataCategory), fs, $filter);
                    };
                    ProjectsTableService.prototype.dataCategoryTotalWithFilters = function (dataCategory, data, $filter) {
                        var _this = this;
                        var fs = [{ field: 'files.data_category', value: [dataCategory] },
                            { field: 'cases.project.project_id', value: data.map(function (d) { return d.project_id; }) }];
                        return this.withFilter(_.sum(_.map(data, function (row) { return _this.getdataCategory(row.summary.data_categories, dataCategory); })), fs, $filter);
                    };
                    ProjectsTableService.prototype.withCurrentFilters = function (value, $filter, LocationService) {
                        var fs = _.map(LocationService.filters().content, function (x) { return ({
                            field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
                            value: x.content.value
                        }); });
                        return this.withFilter(value, fs, $filter);
                    };
                    ProjectsTableService.prototype.hasFilters = function (LocationService) {
                        var filters = _.get(LocationService.filters(), 'content', null), hasFiltersFlag = false;
                        if (!filters) {
                            return hasFiltersFlag;
                        }
                        for (var i = 0; i < filters.length; i++) {
                            var field = _.get(filters[i], 'content.field', false);
                            if (!field) {
                                continue;
                            }
                            hasFiltersFlag = true;
                            break;
                        }
                        return hasFiltersFlag;
                    };
                    ProjectsTableService.prototype.withProjectFilters = function (data, $filter, LocationService, withFilterFn) {
                        var wFilterFn = withFilterFn || this.withFilter;
                        var projectIDs = data.map(function (d) { return d.project_id; });
                        var countKey = withFilterFn !== this.withFilter ? 'file_count' : 'case_count';
                        var fs = this.hasFilters(LocationService) && projectIDs.length
                            ? [{ field: 'cases.project.project_id', value: projectIDs }]
                            : [];
                        var totalCount = data.reduce(function (acc, val) { return acc + val.summary[countKey]; }, 0);
                        return wFilterFn(totalCount, fs, $filter);
                    };
                    ProjectsTableService.prototype.model = function () {
                        var _this = this;
                        return {
                            title: 'Projects',
                            rowId: 'project_id',
                            headings: [
                                {
                                    name: "ID",
                                    id: "project_id",
                                    td: function (row) { return '<a href="projects/' + row.project_id +
                                        '" data-uib-tooltip="' + row.name +
                                        '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' +
                                        row.project_id +
                                        '</a>'; },
                                    sortable: true,
                                    hidden: false,
                                    draggable: true,
                                    total: function (data) { return '<strong>Total</strong>'; },
                                    colSpan: 4
                                }, {
                                    name: "Disease Type",
                                    id: "disease_type",
                                    tdClassName: 'truncated-cell',
                                    td: function (row) { return row.disease_type; },
                                    toolTipText: function (row) { return row.disease_type; },
                                    sortable: true,
                                    hidden: false,
                                    draggable: true
                                }, {
                                    name: "Primary Site",
                                    id: "primary_site",
                                    tdClassName: 'truncated-cell',
                                    td: function (row) { return row.primary_site; },
                                    sortable: true,
                                    hidden: false,
                                    canReorder: true,
                                    enabled: true
                                }, {
                                    name: "Program",
                                    id: "program.name",
                                    td: function (row) { return row.program && row.program.name; },
                                    sortable: true,
                                    hidden: false
                                }, {
                                    name: "Cases",
                                    id: "summary.case_count",
                                    td: function (row, $scope) {
                                        var fs = [{ field: 'cases.project.project_id', value: row.project_id }];
                                        return _this.withFilter(row.summary.case_count, fs, $scope.$filter);
                                    },
                                    sortable: true,
                                    hidden: false,
                                    thClassName: 'text-right',
                                    tdClassName: 'text-right',
                                    total: function (data, $scope) { return _this.withProjectFilters(data, $scope.$filter, $scope.LocationService, _this.withFilter); }
                                }, {
                                    name: "Available Cases per Data Category",
                                    id: "summary.data_categories",
                                    thClassName: 'text-center',
                                    hidden: false,
                                    children: Object.keys(this.DATA_CATEGORIES).map(function (key) { return ({
                                        name: _this.DATA_CATEGORIES[key].abbr,
                                        th: '<abbr data-uib-tooltip="' + _this.DATA_CATEGORIES[key].full + '">'
                                            + _this.DATA_CATEGORIES[key].abbr + '</abbr>',
                                        id: _this.DATA_CATEGORIES[key].abbr,
                                        td: function (row, $scope) { return _this.dataCategoryWithFilters(_this.DATA_CATEGORIES[key].full, row, $scope.$filter); },
                                        thClassName: 'text-right',
                                        tdClassName: 'text-right',
                                        total: function (data, $scope) { return _this.dataCategoryTotalWithFilters(_this.DATA_CATEGORIES[key].full, data, $scope.$filter); }
                                    }); })
                                }, {
                                    name: "Files",
                                    id: "summary.file_count",
                                    td: function (row, $scope) {
                                        var fs = [{ field: 'cases.project.project_id', value: row.project_id }];
                                        return _this.withFilterF(row.summary.file_count, fs, $scope.$filter);
                                    },
                                    sortable: true,
                                    thClassName: 'text-right',
                                    tdClassName: 'text-right',
                                    total: function (data, $scope) { return _this.withProjectFilters(data, $scope.$filter, $scope.LocationService, _this.withFilterF); }
                                }, {
                                    name: "File Size",
                                    id: "file_size",
                                    td: function (row, $scope) { return row.summary && $scope.$filter("size")(row.summary.file_size); },
                                    sortable: true,
                                    thClassName: 'text-right',
                                    tdClassName: 'text-right',
                                    hidden: true,
                                    total: function (data, $scope) { return $scope.$filter("size")(_.sum(_.pluck(data, "summary.file_size"))); }
                                }
                            ],
                            fields: [
                                "disease_type",
                                "state",
                                "primary_site",
                                "project_id",
                                "name",
                                "program.name",
                                "summary.case_count",
                                "summary.file_count",
                                "summary.file_size",
                                "summary.data_categories.data_category",
                                "summary.data_categories.case_count",
                            ],
                            facets: [
                                {
                                    name: 'project_id',
                                    facetType: 'free-text'
                                }, {
                                    name: 'disease_type',
                                    facetType: 'terms'
                                }, {
                                    name: 'program.name',
                                    facetType: 'terms'
                                }, {
                                    name: 'primary_site',
                                    facetType: 'terms'
                                }, {
                                    name: 'summary.experimental_strategies.experimental_strategy',
                                    facetType: 'terms'
                                }, {
                                    name: 'summary.data_categories.data_category',
                                    facetType: 'terms'
                                }]
                        };
                    };
                    return ProjectsTableService;
                }());
                angular.module("projects.table.service", [])
                    .service("ProjectsTableService", ProjectsTableService);
            })(service = table.service || (table.service = {}));
        })(table = projects.table || (projects.table = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var query;
    (function (query) {
        var controllers;
        (function (controllers) {
            var QueryController = (function () {
                /* @ngInject */
                QueryController.$inject = ["$scope", "$rootScope", "$state", "QState", "CartService", "SearchService", "FilesService", "ParticipantsService", "LocationService", "UserService", "CoreService", "SearchTableFilesModel", "SearchCasesTableService", "SearchChartConfigs"];
                function QueryController($scope, $rootScope, $state, QState, CartService, SearchService, FilesService, ParticipantsService, LocationService, UserService, CoreService, SearchTableFilesModel, SearchCasesTableService, SearchChartConfigs) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$state = $state;
                    this.QState = QState;
                    this.CartService = CartService;
                    this.SearchService = SearchService;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.SearchTableFilesModel = SearchTableFilesModel;
                    this.SearchCasesTableService = SearchCasesTableService;
                    this.participantsLoading = true;
                    this.filesLoading = true;
                    this.query = "";
                    this.tabSwitch = false;
                    var data = $state.current.data || {};
                    this.QState.setActive(data.tab, "active");
                    CoreService.setPageTitle("Query");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("query") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState) {
                        if (fromState.name.indexOf("query") === -1) {
                            document.body.scrollTop = 0;
                            document.documentElement.scrollTop = 0;
                        }
                    });
                    $scope.fileTableConfig = this.SearchTableFilesModel;
                    $scope.participantTableConfig = this.SearchCasesTableService.model();
                    this.refresh();
                    this.chartConfigs = SearchChartConfigs;
                }
                QueryController.prototype.refresh = function () {
                    var _this = this;
                    if (this.tabSwitch) {
                        if (this.QState.tabs.participants.active) {
                            this.QState.setActive("participants", "hasLoadedOnce");
                        }
                        if (this.QState.tabs.files.active) {
                            this.QState.setActive("files", "hasLoadedOnce");
                        }
                        this.tabSwitch = false;
                        return;
                    }
                    this.$rootScope.$emit('ShowLoadingScreen');
                    this.participantsLoading = true;
                    this.filesLoading = true;
                    this.SearchService.getSummary().then(function (data) {
                        _this.summary = data;
                    });
                    var casesTableModel = this.SearchCasesTableService.model();
                    var fileOptions = {
                        fields: this.SearchTableFilesModel.fields
                    };
                    var participantOptions = {
                        fields: casesTableModel.fields,
                        expand: casesTableModel.expand
                    };
                    this.FilesService.getFiles(fileOptions).then(function (data) {
                        _this.filesLoading = false;
                        if (!_this.participantsLoading && !_this.filesLoading) {
                            _this.$rootScope.$emit('ClearLoadingScreen');
                        }
                        _this.files = _this.files || {};
                        _this.files.aggregations = data.aggregations;
                        _this.files.pagination = data.pagination;
                        if (!_.isEqual(_this.files.hits, data.hits)) {
                            _this.files.hits = data.hits;
                            _this.tabSwitch = false;
                            if (_this.QState.tabs.files.active) {
                                _this.QState.setActive("files", "hasLoadedOnce");
                            }
                            for (var i = 0; i < _this.files.hits.length; i++) {
                                _this.files.hits[i].related_ids = _.pluck(_this.files.hits[i].related_files, "file_id");
                            }
                        }
                    });
                    this.ParticipantsService.getParticipants(participantOptions).then(function (data) {
                        _this.participantsLoading = false;
                        if (!_this.participantsLoading && !_this.filesLoading) {
                            _this.$rootScope.$emit('ClearLoadingScreen');
                        }
                        _this.participants = _this.participants || {};
                        _this.participants.aggregations = data.aggregations;
                        _this.participants.pagination = data.pagination;
                        if (!_.isEqual(_this.participants.hits, data.hits)) {
                            _this.participants.hits = data.hits;
                            _this.tabSwitch = false;
                            if (_this.QState.tabs.participants.active) {
                                _this.QState.setActive("participants", "hasLoadedOnce");
                            }
                        }
                    });
                };
                // TODO Load data lazily based on active tab
                QueryController.prototype.setState = function (tab) {
                    // Changing tabs and then navigating to another page
                    // will cause this to fire.
                    if (tab && (this.$state.current.name.match("query."))) {
                        this.tabSwitch = true;
                        this.$state.go('query.' + tab, this.LocationService.search(), { inherit: false });
                    }
                };
                QueryController.prototype.isUserProject = function (file) {
                    return this.UserService.isUserProject(file);
                };
                QueryController.prototype.select = function (tab) {
                    this.QState.setActive(tab, "active");
                    this.setState(tab);
                };
                QueryController.prototype.addFilesKeyPress = function (event, type) {
                    if (event.which === 13) {
                        if (type === "all") {
                            // TODO add filtered list of files
                            this.CartService.addFiles(this.files.hits);
                        }
                        else {
                            this.CartService.addFiles(this.files.hits);
                        }
                    }
                };
                QueryController.prototype.addToCart = function (files) {
                    this.CartService.addFiles(files);
                };
                QueryController.prototype.removeFiles = function (files) {
                    this.CartService.remove(files);
                };
                return QueryController;
            }());
            angular
                .module("query.controller", [
                "query.services",
                "search.services",
                "location.services",
                "cart.services",
                "core.services",
                "participants.services",
                "search.table.files.model",
                "search.cases.table.service",
                "files.services"
            ])
                .controller("QueryController", QueryController);
        })(controllers = query.controllers || (query.controllers = {}));
    })(query = ngApp.query || (ngApp.query = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var query;
    (function (query) {
        var services;
        (function (services) {
            var QState = (function () {
                function QState() {
                    this.tabs = {
                        summary: {
                            active: false,
                            hasLoadedOnce: false
                        },
                        participants: {
                            active: false,
                            hasLoadedOnce: false
                        },
                        files: {
                            active: false,
                            hasLoadedOnce: false
                        }
                    };
                }
                QState.prototype.setActive = function (tab, key) {
                    if (tab) {
                        if (key === "active") {
                            _.each(this.tabs, function (t) {
                                t.active = false;
                            });
                            this.tabs[tab].active = true;
                        }
                        else {
                            this.tabs[tab].hasLoadedOnce = true;
                        }
                    }
                };
                return QState;
            }());
            angular
                .module("query.services", [])
                .service("QState", QState);
        })(services = query.services || (query.services = {}));
    })(query = ngApp.query || (ngApp.query = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var reports;
    (function (reports_1) {
        var controllers;
        (function (controllers) {
            var ReportsController = (function () {
                /* @ngInject */
                ReportsController.$inject = ["reports", "CoreService", "$scope", "$timeout", "ReportsGithutColumns", "ReportsGithut", "reportServiceExpand"];
                function ReportsController(reports, CoreService, $scope, $timeout, ReportsGithutColumns, ReportsGithut, reportServiceExpand) {
                    this.reports = reports;
                    this.CoreService = CoreService;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.ReportsGithutColumns = ReportsGithutColumns;
                    this.ReportsGithut = ReportsGithut;
                    this.reportServiceExpand = reportServiceExpand;
                    CoreService.setPageTitle("Reports");
                    if (reports.hits.length) {
                        var dataNoZeros = reports.hits.filter(function (hit) { return hit.count && hit.size; });
                        this.byProject = this.dataNest("project_id").entries(dataNoZeros);
                        this.byDisease = this.dataNest("disease_type").entries(dataNoZeros);
                        this.byProgram = this.dataNest("program").entries(dataNoZeros);
                        this.byDataCategory = this.dataNest("data_category").entries(this.reduceBy(dataNoZeros, "data_categories"));
                        this.byDataType = this.dataNest("data_type").entries(this.reduceBy(dataNoZeros, "data_types"));
                        this.byStrat = this.dataNest("experimental_strategy").entries(this.reduceBy(dataNoZeros, "experimental_strategies"));
                        this.byDataAccess = this.dataNest("access").entries(this.reduceBy(dataNoZeros, "data_access"));
                        this.byUserType = this.dataNest("user_access_type").entries(this.reduceBy(dataNoZeros, "user_access_types"));
                        this.byLocation = this.dataNest("country").entries(this.reduceBy(dataNoZeros, "countries"));
                        $timeout(function () {
                            var githut = ReportsGithut(dataNoZeros);
                            $scope.githutData = githut.data;
                            $scope.githutConfig = githut.config;
                        }, 500);
                    }
                }
                ReportsController.prototype.dataNest = function (key) {
                    return d3.nest()
                        .key(function (d) { return d[key]; })
                        .rollup(function (d) {
                        return {
                            file_count: d3.sum(d.map(function (x) { return x.count; })),
                            file_size: d3.sum(d.map(function (x) { return x.size; })),
                            project_name: d[0].disease_type
                        };
                    })
                        .sortValues(function (a, b) { return a.file_count - b.file_count; });
                };
                ReportsController.prototype.reduceBy = function (data, key) {
                    return _.reduce(data, function (result, datum) {
                        return datum[key] ? result.concat(datum[key]) : result;
                    }, []);
                };
                return ReportsController;
            }());
            angular
                .module("reports.controller", [
                "reports.services",
                "core.services",
                "reports.githut.config"
            ])
                .controller("ReportsController", ReportsController);
        })(controllers = reports_1.controllers || (reports_1.controllers = {}));
    })(reports = ngApp.reports || (ngApp.reports = {}));
})(ngApp || (ngApp = {}));

angular.module("reports.githut.config", [])
    .factory("ReportsGithut", ["ReportsGithutColumns", "ReportsGithutConfig", function (ReportsGithutColumns, ReportsGithutConfig) {
    return function (data) {
        var columns = ReportsGithutColumns, config = ReportsGithutConfig, order = ["Clinical", "Array", "Seq", "SNV", "CNV", "SV", "Exp", "PExp", "Meth", "Other"], dataTypesMap = {
            "Clinical": "Clinical",
            "Raw microarray data": "Array",
            "Sequencing Reads": "Seq",
            "Simple nucleotide variation": "SNV",
            "Copy number variation": "CNV",
            "Structural rearrangement": "SV",
            "Gene expression": "Exp",
            "Protein expression": "PExp",
            "DNA methylation": "Meth",
            "Other": "Other"
        }, primary_sites = [];
        var aggregations = data.reduce(function (a, b) {
            if (!_.contains(primary_sites, b.primary_site)) {
                primary_sites.push(b.primary_site);
            }
            if (a[b.project_id]) {
                var c = a[b.project_id];
                c.file_size += b.size_in_mb;
                c.file_count += b.count;
                b.data_types.forEach(function (d) {
                    c[d.data_type] += d.count;
                });
            }
            else {
                a[b.project_id] = {
                    file_size: b.size,
                    project_id: b.project_id,
                    name: b.disease_type,
                    primary_site: b.primary_site,
                    file_count: b.count,
                    colorgroup: "file_count"
                };
                if (b.data_types) {
                    b.data_types.forEach(function (d) {
                        a[b.project_id][d.data_type] = d.count;
                    });
                }
            }
            return a;
        }, {});
        var data_types = data.reduce(function (result, datum) {
            if (datum.data_types) {
                result = result.concat(datum.data_types);
            }
            return result;
        }, []);
        var nest = d3.nest().key(function (a) {
            if (a) {
                return a.data_type;
            }
        }).entries(data_types);
        var types = nest.map(function (a) {
            return {
                id: a.key,
                tool_tip_text: a.key,
                display_name: [dataTypesMap[a.key]],
                colorgroup: "file_count",
                scale: "ordinal",
                dimensional: true,
                is_subtype: true
            };
        });
        types = _.sortBy(types, function (type) { return 0 - _.indexOf(order, type.id); });
        types.forEach(function (a) {
            ReportsGithutColumns.splice(2, 0, a);
        });
        ReportsGithutConfig.superhead = {
            start: types[types.length - 1].id,
            end: types[0].id,
            text: "# Requests per data type"
        };
        ReportsGithutConfig.columns = columns.map(function (c) { return c.id; });
        ReportsGithutConfig.scale_map = columns.reduce(function (a, b) {
            a[b.id] = b.scale || "ordinal";
            return a;
        }, {});
        ReportsGithutConfig.color_group_map = columns.reduce(function (a, b) {
            a[b.id] = b.colorgroup;
            return a;
        }, {});
        ReportsGithutConfig.column_map = columns.reduce(function (a, b) {
            a[b.id] = b.display_name || ["Untitled"];
            return a;
        }, {});
        ReportsGithutConfig.dimensions = _.map(_.filter(columns, function (column) { return column.dimensional; }), function (column) { return column.id; });
        return {
            data: d3.values(aggregations),
            config: ReportsGithutConfig
        };
    };
}])
    .value("ReportsGithutColumns", [
    {
        id: "project_id",
        display_name: ["Project", "ID"],
        scale: "ordinal",
        dimensional: true
    },
    {
        id: "file_count",
        display_name: ["# Requests"],
        scale: "ordinal",
        dimensional: true,
        colorgroup: "file_count"
    },
    {
        id: "file_size",
        display_name: ["File", "Size"],
        scale: "ordinal",
        dimensional: true,
        colorgroup: "file_size"
    },
    {
        id: "primary_site",
        display_name: ["Primary", "Site"],
        scale: "linear",
        dimensional: true
    }
])
    .service("ReportsGithutConfig", ["ReportsGithutColumns", "$filter", function (ReportsGithutColumns, $filter) {
    var color = d3.scale.category10();
    var columns = ReportsGithutColumns;
    return {
        container: "#pc",
        scale: "ordinal",
        config: columns,
        ref: "lang_usage",
        title_column: "project_id",
        scale_map: undefined,
        use: {
            "project_id": "project_id"
        },
        sorter: {
            "project_id": "file_count"
        },
        sorting: {
            "project_id": d3.ascending,
            "primary_site": d3.ascending
        },
        formats: {
            "primary_site": "d"
        },
        color_group_map: undefined,
        color_groups: {
            "file_count": color(0),
            "file_size": color(1),
            "case_count": color(2)
        },
        dimensions: undefined,
        duration: 1000,
        filters: {
            file_size: $filter("size")
        }
    };
}]);



var ngApp;
(function (ngApp) {
    var reports;
    (function (reports) {
        var services;
        (function (services) {
            var ReportsService = (function () {
                /* @ngInject */
                ReportsService.$inject = ["Restangular", "$q", "ProjectsService"];
                function ReportsService(Restangular, $q, ProjectsService) {
                    this.$q = $q;
                    this.ProjectsService = ProjectsService;
                    this.ds = Restangular.all("reports/data-download-statistics");
                }
                ReportsService.prototype.getReports = function (params) {
                    if (params === void 0) { params = {}; }
                    if (params.fields) {
                        params.fields = params.fields.join();
                    }
                    if (params.expand) {
                        params.expand = params.expand.join();
                    }
                    if (params.facets) {
                        params.facets = params.facets.join();
                    }
                    var size = 999999;
                    if (this.ProjectsService.projectIdMapping) {
                        size = _.size(this.ProjectsService.projectIdMapping);
                    }
                    var defaults = {
                        size: size,
                        from: 0
                    };
                    var abort = this.$q.defer();
                    var prom = this.ds.withHttpConfig({
                        timeout: abort.promise
                    })
                        .get("", angular.extend(defaults, params)).then(function (response) {
                        return response.data;
                    });
                    return prom;
                };
                return ReportsService;
            }());
            angular
                .module("reports.services", ["restangular"])
                .service("ReportsService", ReportsService);
        })(services = reports.services || (reports.services = {}));
    })(reports = ngApp.reports || (ngApp.reports = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        var cases;
        (function (cases) {
            var table;
            (function (table) {
                var service;
                (function (service) {
                    var SearchCasesTableService = (function () {
                        /* @ngInject */
                        SearchCasesTableService.$inject = ["DATA_CATEGORIES"];
                        function SearchCasesTableService(DATA_CATEGORIES) {
                            this.DATA_CATEGORIES = DATA_CATEGORIES;
                        }
                        SearchCasesTableService.prototype.withAnnotationFilter = function (value, filters, $filter) {
                            var filterString = $filter("makeFilter")(filters, true);
                            var href = 'annotations?filters=' + filterString;
                            var val = '{{' + value + '|number:0}}';
                            return "<a href='" + href + "'>" + val + '</a>';
                        };
                        SearchCasesTableService.prototype.withFilter = function (value, filters, $filter) {
                            var filterString = $filter("makeFilter")(filters, true);
                            var href = 'search/f?filters=' + filterString;
                            var val = '{{' + value + '|number:0}}';
                            return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
                        };
                        SearchCasesTableService.prototype.getDataCategory = function (dataCategories, dataCategory) {
                            var data = _.find(dataCategories, { data_category: dataCategory });
                            return data ? data.file_count : 0;
                        };
                        SearchCasesTableService.prototype.dataCategoryWithFilters = function (dataCategory, row, $filter) {
                            var fs = [
                                { field: 'cases.case_id', value: row.case_id },
                                { field: 'files.data_category', value: dataCategory }
                            ];
                            return this.withFilter(this.getDataCategory(row.summary ? row.summary.data_categories : [], dataCategory), fs, $filter);
                        };
                        SearchCasesTableService.prototype.youngestDiagnosis = function (p, c) {
                            return c.age_at_diagnosis < p.age_at_diagnosis ? c : p;
                        };
                        SearchCasesTableService.prototype.model = function () {
                            var _this = this;
                            return {
                                title: 'Cases',
                                rowId: 'case_id',
                                headings: [{
                                        name: "Cart",
                                        id: "add_to_cart_filtered",
                                        td: function (row) { return '<add-to-cart-filtered row="row"></add-to-cart-filtered>'; },
                                        tdClassName: 'text-center'
                                    }, {
                                        name: "Case UUID",
                                        id: "case_id",
                                        toolTipText: function (row) { return row.case_id; },
                                        td: function (row) { return '<a href="cases/' + row.case_id + '">' + row.case_id + '</a>'; },
                                        tdClassName: 'id-cell'
                                    }, {
                                        name: "Project",
                                        id: "project.project_id",
                                        toolTipText: function (row) { return row.project.name; },
                                        td: function (row) { return '<a href="projects/' + row.project.project_id + '">' + row.project.project_id + '</a>'; },
                                        sortable: true
                                    }, {
                                        name: "Primary Site",
                                        id: "project.primary_site",
                                        td: function (row) { return row.project && row.project.primary_site; },
                                        sortable: true
                                    }, {
                                        name: "Gender",
                                        id: "demographic.gender",
                                        td: function (row, $scope) { return row.demographic && $scope.$filter("humanify")(row.demographic.gender) || '--'; },
                                        sortable: true
                                    }, {
                                        name: "Files",
                                        id: "files",
                                        td: function (row, $scope) {
                                            var fs = [{ field: 'cases.case_id', value: row.case_id }];
                                            var sum = _.sum(_.pluck(row.summary ? row.summary.data_categories : [], 'file_count'));
                                            return _this.withFilter(sum, fs, $scope.$filter);
                                        },
                                        thClassName: 'text-right',
                                        tdClassName: 'text-right'
                                    }, {
                                        name: "Available Files per Data Category",
                                        id: "summary.data_categories",
                                        thClassName: 'text-center',
                                        children: Object.keys(this.DATA_CATEGORIES).map(function (key) { return ({
                                            name: _this.DATA_CATEGORIES[key].abbr,
                                            th: '<abbr data-uib-tooltip="' + _this.DATA_CATEGORIES[key].full + '">'
                                                + _this.DATA_CATEGORIES[key].abbr + '</abbr>',
                                            id: _this.DATA_CATEGORIES[key].abbr,
                                            td: function (row, $scope) { return _this.dataCategoryWithFilters(_this.DATA_CATEGORIES[key].full, row, $scope.$filter); },
                                            thClassName: 'text-right',
                                            tdClassName: 'text-right'
                                        }); })
                                    }, {
                                        name: "Annotations",
                                        id: "annotations.annotation_id",
                                        td: function (row, $scope) {
                                            var getAnnotations = function (row, $filter) {
                                                return row.annotations.length === 1
                                                    ? '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>'
                                                    : _this.withAnnotationFilter(row.annotations.length, [{ field: "annotation_id", value: _.pluck(row.annotations, 'annotation_id') }], $filter);
                                            };
                                            return (row.annotations || []).length && getAnnotations(row, $scope.$filter);
                                        },
                                        thClassName: 'text-right',
                                        tdClassName: 'text-right'
                                    }, {
                                        name: 'Program',
                                        id: 'project.program.name',
                                        td: function (row, $scope) { return row.project && $scope.$filter("humanify")(row.project.program.name); },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Disease Type',
                                        id: 'project.disease_type',
                                        td: function (row, $scope) { return row.project && $scope.$filter("humanify")(row.project.disease_type); },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Age at diagnosis',
                                        id: 'diagnoses.age_at_diagnosis',
                                        td: function (row, $scope) {
                                            // Use diagnosis with minimum age
                                            var age = (row.diagnoses || []).reduce(function (p, c) { return c.age_at_diagnosis < p ? c.age_at_diagnosis : p; }, Infinity);
                                            return age !== Infinity && row.diagnoses ? $scope.$filter("ageDisplay")(age) : "--";
                                        },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Days to death',
                                        id: 'diagnoses.days_to_death',
                                        td: function (row, $scope) {
                                            var primaryDiagnosis = (row.diagnoses || [])
                                                .reduce(_this.youngestDiagnosis, { age_at_diagnosis: Infinity });
                                            return (row.diagnoses && $scope.$filter("number")(primaryDiagnosis.days_to_death, 0)) || "--";
                                        },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Vital Status',
                                        id: 'diagnoses.vital_status',
                                        td: function (row, $scope) {
                                            var primaryDiagnosis = (row.diagnoses || [])
                                                .reduce(_this.youngestDiagnosis, { age_at_diagnosis: Infinity });
                                            return $scope.$filter("humanify")(primaryDiagnosis.vital_status);
                                        },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Primary Diagnosis',
                                        id: 'diagnoses.primary_diagnosis',
                                        td: function (row, $scope) {
                                            console.log(_this.DATA_CATEGORIES);
                                            var primaryDiagnosis = (row.diagnoses || [])
                                                .reduce(_this.youngestDiagnosis, { age_at_diagnosis: Infinity });
                                            return (row.diagnoses && primaryDiagnosis.primary_diagnosis) || "--";
                                        },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Ethnicity',
                                        id: 'demographic.ethnicity',
                                        td: function (row, $scope) { return row.demographic && $scope.$filter("humanify")(row.demographic.ethnicity) || '--'; },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Race',
                                        id: 'demographic.race',
                                        td: function (row, $scope) { return row.demographic && $scope.$filter("humanify")(row.demographic.race) || '--'; },
                                        sortable: false,
                                        hidden: true
                                    }, {
                                        name: 'Submitter ID',
                                        id: 'submitter_id',
                                        td: function (row, $scope) { return row.submitter_id; },
                                        sortable: false,
                                        hidden: true
                                    }],
                                fields: [
                                    "case_id",
                                    "annotations.annotation_id",
                                    "project.project_id",
                                    "project.name",
                                    "project.primary_site",
                                    "project.program.name",
                                    "project.disease_type",
                                    "submitter_id",
                                    "demographic.gender",
                                    "demographic.race",
                                    "demographic.ethnicity",
                                    "diagnoses.primary_diagnosis",
                                    "diagnoses.vital_status",
                                    "diagnoses.days_to_death",
                                    "diagnoses.age_at_diagnosis"
                                ],
                                expand: [
                                    "summary.data_categories",
                                ],
                                facets: [
                                    { name: "case_id", title: "Case", collapsed: false, facetType: "free-text", placeholder: "UUID, Submitter ID", removable: false },
                                    { name: "submitter_id", title: "Case Submitter ID Prefix", collapsed: false, facetType: "prefix", placeholder: "e.g. TCGA-DD*", removable: false },
                                    { name: "project.primary_site", title: "Primary Site", collapsed: false, facetType: "terms", removable: false, hasValueSearch: true },
                                    { name: "project.program.name", title: "Cancer Program", collapsed: false, facetType: "terms", removable: false },
                                    { name: "project.project_id", title: "Project", collapsed: false, facetType: "terms", removable: false, hasValueSearch: true },
                                    { name: "project.disease_type", title: "Disease Type", collapsed: false, facetType: "terms", removable: false, showTooltip: true, hasValueSearch: true },
                                    { name: "demographic.gender", title: "Gender", collapsed: false, facetType: "terms", removable: false },
                                    { name: "diagnoses.age_at_diagnosis", title: "Age at diagnosis", collapsed: false, facetType: "range", convertDays: true, removable: false },
                                    { name: "diagnoses.vital_status", title: "Vital Status", collapsed: false, facetType: "terms", removable: false },
                                    { name: "diagnoses.days_to_death", title: "Days to Death", collapsed: false, facetType: "range", hasGraph: true, removable: false },
                                    { name: "demographic.race", title: "Race", collapsed: false, facetType: "terms", removable: false },
                                    { name: "demographic.ethnicity", title: "Ethnicity", collapsed: false, facetType: "terms", removable: false }
                                ]
                            };
                        };
                        return SearchCasesTableService;
                    }());
                    angular.module("search.cases.table.service", ["ngApp.core"])
                        .service("SearchCasesTableService", SearchCasesTableService);
                })(service = table.service || (table.service = {}));
            })(table = cases.table || (cases.table = {}));
        })(cases = search.cases || (search.cases = {}));
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        var controllers;
        (function (controllers) {
            var SearchController = (function () {
                /* @ngInject */
                SearchController.$inject = ["$scope", "$rootScope", "$state", "$stateParams", "$location", "SearchState", "CartService", "SearchService", "FilesService", "ParticipantsService", "LocationService", "UserService", "CoreService", "SearchTableFilesModel", "SearchCasesTableService", "FacetsConfigService", "FacetService", "SearchChartConfigs"];
                function SearchController($scope, $rootScope, $state, $stateParams, $location, SearchState, CartService, SearchService, FilesService, ParticipantsService, LocationService, UserService, CoreService, SearchTableFilesModel, SearchCasesTableService, FacetsConfigService, FacetService, SearchChartConfigs) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.$location = $location;
                    this.SearchState = SearchState;
                    this.CartService = CartService;
                    this.SearchService = SearchService;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.SearchTableFilesModel = SearchTableFilesModel;
                    this.SearchCasesTableService = SearchCasesTableService;
                    this.FacetsConfigService = FacetsConfigService;
                    this.FacetService = FacetService;
                    this.participantsLoading = true;
                    this.filesLoading = true;
                    this.tabSwitch = false;
                    this.facetsCollapsed = false;
                    this.firstLoad = true;
                    // ui-bootstrap calls the tab select callback on page load
                    // and we don't want that, so we're using a flag to track the first load
                    this.firstLoad = true;
                    if (!this.$stateParams.facetTab) {
                        this.$location.search("facetTab", "cases");
                    }
                    this.facetTab = this.$stateParams.facetTab === "files" ? 1 : 0;
                    var data = $state.current.data || {};
                    this.SearchState.setActive("tabs", data.tab, "active");
                    this.SearchState.setActive("facets", data.tab, "active");
                    CoreService.setPageTitle("Search");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("search") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState) {
                        if (toState.name.indexOf("search") !== -1) {
                            _this.SearchState.setActive("tabs", toState.name.split(".")[1], "active");
                        }
                        if (fromState.name.indexOf("search") === -1) {
                            document.body.scrollTop = 0;
                            document.documentElement.scrollTop = 0;
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    $scope.fileTableConfig = this.SearchTableFilesModel;
                    $scope.participantTableConfig = this.SearchCasesTableService.model();
                    this.FacetsConfigService.setFields('files', this.SearchTableFilesModel.facets);
                    this.FacetsConfigService.setFields('cases', this.SearchCasesTableService.model().facets);
                    this.refresh();
                    this.chartConfigs = SearchChartConfigs;
                }
                SearchController.prototype.refresh = function () {
                    var _this = this;
                    if (this.tabSwitch) {
                        if (this.SearchState.tabs.participants.active) {
                            this.SearchState.setActive("tabs", "participants", "hasLoadedOnce");
                        }
                        if (this.SearchState.tabs.files.active) {
                            this.SearchState.setActive("tabs", "files", "hasLoadedOnce");
                        }
                        this.tabSwitch = false;
                        return;
                    }
                    var casesTableModel = this.SearchCasesTableService.model();
                    this.$rootScope.$emit('ShowLoadingScreen');
                    this.filesLoading = true;
                    this.participantsLoading = true;
                    this.SearchService.getSummary().then(function (data) {
                        _this.summary = data;
                        _this.tabSwitch = false;
                    });
                    var fileOptions = {
                        fields: this.SearchTableFilesModel.fields,
                        facets: this.FacetService.filterFacets(this.FacetsConfigService.fieldsMap['files'])
                    };
                    var participantOptions = {
                        fields: casesTableModel.fields,
                        expand: casesTableModel.expand,
                        facets: this.FacetService.filterFacets(this.FacetsConfigService.fieldsMap['cases'])
                    };
                    this.FilesService.getFiles(fileOptions).then(function (data) {
                        _this.filesLoading = false;
                        if (!_this.participantsLoading && !_this.filesLoading) {
                            _this.$rootScope.$emit('ClearLoadingScreen');
                        }
                        _this.files = _this.files || {};
                        _this.files.aggregations = data.aggregations;
                        _this.files.pagination = data.pagination;
                        if (!_.isEqual(_this.files.hits, data.hits)) {
                            _this.files.hits = data.hits;
                            _this.tabSwitch = false;
                            if (_this.SearchState.tabs.files.active) {
                                _this.SearchState.setActive("tabs", "files", "hasLoadedOnce");
                            }
                            for (var i = 0; i < _this.files.hits.length; i++) {
                                _this.files.hits[i].related_ids = _.pluck(_this.files.hits[i].related_files, "file_id");
                            }
                        }
                    });
                    this.ParticipantsService.getParticipants(participantOptions).then(function (data) {
                        _this.participantsLoading = false;
                        if (!_this.participantsLoading && !_this.filesLoading) {
                            _this.$rootScope.$emit('ClearLoadingScreen');
                        }
                        _this.participants = _this.participants || {};
                        _this.participants.aggregations = data.aggregations;
                        _this.participants.pagination = data.pagination;
                        if (!_.isEqual(_this.participants.hits, data.hits)) {
                            _this.participants.hits = data.hits;
                            _this.tabSwitch = false;
                            if (_this.SearchState.tabs.participants.active) {
                                _this.SearchState.setActive("tabs", "participants", "hasLoadedOnce");
                            }
                        }
                    });
                };
                SearchController.prototype.setFacetTab = function (tab) {
                    // only change tab if user selects, not when the controller boots up
                    if (!this.firstLoad) {
                        this.$location.search("facetTab", tab);
                    }
                    else {
                        this.firstLoad = false;
                    }
                };
                SearchController.prototype.setState = function (tab) {
                    // Changing tabs and then navigating to another page
                    // will cause this to fire.
                    if (tab && (this.$state.current.name.match("search."))) {
                        this.tabSwitch = true;
                        this.$state.go("search." + tab, this.LocationService.search(), { inherit: false });
                    }
                };
                SearchController.prototype.select = function (section, tab) {
                    this.SearchState.setActive(section, tab, "active");
                    this.setState(tab);
                };
                SearchController.prototype.addFilesKeyPress = function (event, type) {
                    if (event.which === 13) {
                        if (type === "all") {
                            // TODO add filtered list of files
                            this.CartService.addFiles(this.files.hits);
                        }
                        else {
                            this.CartService.addFiles(this.files.hits);
                        }
                    }
                };
                SearchController.prototype.addToCart = function (files) {
                    this.CartService.addFiles(files);
                };
                SearchController.prototype.removeFiles = function (files) {
                    this.CartService.remove(files);
                };
                SearchController.prototype.gotoQuery = function () {
                    var stateParams = {};
                    var f = this.LocationService.filters();
                    var q = this.LocationService.filter2query(f);
                    var toTab = this.$state.current.name.split(".")[1];
                    if (q) {
                        stateParams = {
                            query: q,
                            filters: angular.toJson(f)
                        };
                    }
                    this.$state.go("query." + toTab, stateParams, { inherit: true });
                };
                SearchController.prototype.toggleFacets = function (shouldCollapse) {
                    this.facetsCollapsed = shouldCollapse;
                    this.$rootScope.$emit("toggleFacets");
                };
                return SearchController;
            }());
            angular
                .module("search.controller", [
                "search.services",
                "location.services",
                "cart.services",
                "core.services",
                "participants.services",
                "search.table.files.model",
                "search.cases.table.service",
                "files.services",
                "facets.services"
            ])
                .controller("SearchController", SearchController);
        })(controllers = search.controllers || (search.controllers = {}));
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        var models;
        (function (models) {
            function withAnnotationFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = 'annotations?filters=' + filterString;
                var val = $filter("number")(value);
                return "<a href='" + href + "'>" + val + '</a>';
            }
            function withFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = 'search/c?filters=' + filterString;
                var val = $filter("number")(value);
                return "<a href='" + href + "'>" + val + '</a>';
            }
            var searchTableFilesModel = {
                title: 'Files',
                rowId: 'file_id',
                headings: [
                    {
                        th: '<add-to-cart-all-dropdown data-files="data" data-size="{{paging.total}}" />',
                        name: 'Add to Cart',
                        id: "file_actions",
                        td: function (row) { return '<add-to-cart-single-icon file="row" style="margin-right:5px"></add-to-cart-single-icon>'; }
                    }, {
                        name: "File UUID",
                        id: "file_id",
                        toolTipText: function (row) { return row.file_id; },
                        td: function (row) { return '<a href="files/' + row.file_id + '">' + row.file_id + '</a>'; },
                        sortable: true,
                        hidden: true,
                        tdClassName: 'id-cell'
                    }, {
                        name: "File Submitter ID",
                        id: "submitter_id",
                        toolTipText: function (row) { return row.submitter_id; },
                        td: function (row) { return row.submitter_id || '--'; },
                        sortable: true,
                        hidden: true,
                        tdClassName: 'id-cell'
                    }, {
                        name: "Access",
                        id: "access",
                        td: function (row, $scope) {
                            var val = $scope.$filter("humanify")(row.access);
                            return '<i class="fa fa-' + (row.access === 'controlled' ? 'lock' : 'unlock-alt') + '"></i> ' + val;
                        },
                        sortable: true
                    }, {
                        name: "File Name",
                        id: "file_name",
                        toolTipText: function (row) { return row.file_name; },
                        td: function (row) { return '<a href="files/' + row.file_id + '">' + row.file_name + '</a>'; },
                        sortable: true,
                        tdClassName: 'id-cell'
                    }, {
                        name: "Cases",
                        id: "cases.case_id",
                        td: function (row, $scope) {
                            function getParticipants(row, $filter) {
                                return row.cases.length == 1 ?
                                    '<a href="cases/' + row.cases[0].case_id + '">1</a>' :
                                    withFilter(row.cases.length, [{ field: "files.file_id", value: row.file_id }], $filter);
                            }
                            return row.cases && row.cases.length ? getParticipants(row, $scope.$filter) : 0;
                        },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    }, {
                        name: "Project",
                        id: "cases.project.project_id",
                        toolTipText: function (row) { return _.unique(_.map(row.cases, function (p) { return p.project.name; })).join(', '); },
                        td: function (row) {
                            return _.unique(_.map(row.cases, function (p) {
                                return '<a href="projects/' + p.project.project_id +
                                    '">' + p.project.project_id + '</a>';
                            })).join('<br>');
                        },
                        sortable: true
                    }, {
                        name: "Data Category",
                        id: "data_category",
                        td: function (row) { return row.data_category || '--'; },
                        sortable: true
                    }, {
                        name: "Data Format",
                        id: "data_format",
                        td: function (row) { return row.data_format || '--'; },
                        sortable: true
                    }, {
                        name: "Size",
                        id: "file_size",
                        td: function (row, $scope) { return $scope.$filter("size")(row.file_size); },
                        sortable: true,
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    }, {
                        name: "Annotations",
                        id: "annotations.annotation_id",
                        td: function (row, $scope) {
                            function getAnnotations(row, $scope) {
                                return row.annotations.length == 1 ?
                                    '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' :
                                    withAnnotationFilter(row.annotations.length, [{ field: "annotation_id", value: _.pluck(row.annotations, 'annotation_id') }], $scope.$filter);
                            }
                            return row.annotations && row.annotations.length ? getAnnotations(row, $scope) : 0;
                        },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    }, {
                        name: "Data Type",
                        id: "data_type",
                        td: function (row, $scope) { return $scope.$filter("humanify")(row.data_type); },
                        sortable: false,
                        hidden: true
                    }, {
                        name: "Experimental Strategy",
                        id: "experimental_strategy",
                        td: function (row, $scope) { return $scope.$filter("humanify")(row.experimental_strategy); },
                        sortable: false,
                        hidden: true
                    }, {
                        name: "Platform",
                        id: "platform",
                        td: function (row, $scope) { return row.platform || '--'; },
                        sortable: false,
                        hidden: true
                    }],
                fields: [
                    "access",
                    "state",
                    "file_name",
                    "data_type",
                    "data_category",
                    "data_format",
                    "file_size",
                    "file_id",
                    "platform",
                    "annotations.annotation_id",
                    "related_files.file_id",
                    "archive.archive_id",
                    "experimental_strategy",
                    "center.name",
                    "submitter_id",
                    "cases.case_id",
                    "cases.project.project_id",
                    "cases.project.name"
                ],
                facets: [
                    { name: "file_id", title: "File", collapsed: false, facetType: "free-text", placeholder: "File name or ID", removable: false },
                    { name: "data_category", title: "Data Category", collapsed: false, facetType: "terms", removable: false },
                    { name: "data_type", title: "Data Type", collapsed: false, facetType: "terms", removable: false },
                    { name: "experimental_strategy", title: "Experimental Strategy", collapsed: false, facetType: "terms", removable: false },
                    { name: "analysis.workflow_type", title: "Workflow Type", collapsed: false, facetType: "terms", removable: false, hasValueSearch: true },
                    { name: "data_format", title: "Data Format", collapsed: false, facetType: "terms", removable: false },
                    { name: "platform", title: "Platform", collapsed: false, facetType: "terms", removable: false },
                    { name: "access", title: "Access Level", collapsed: false, facetType: "terms", removable: false },
                ]
            };
            angular.module("search.table.files.model", [])
                .value("SearchTableFilesModel", searchTableFilesModel);
        })(models = search.models || (search.models = {}));
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        var services;
        (function (services) {
            var State = (function () {
                function State() {
                    this.tabs = {
                        summary: {
                            active: false,
                            hasLoadedOnce: false
                        },
                        participants: {
                            active: false,
                            hasLoadedOnce: false
                        },
                        files: {
                            active: false,
                            hasLoadedOnce: false
                        }
                    };
                    this.facets = {
                        participants: {
                            active: false
                        },
                        files: {
                            active: false
                        }
                    };
                }
                State.prototype.setActive = function (section, tab, key) {
                    if (section && tab) {
                        if (key === "active") {
                            _.each(this[section], function (section) {
                                section.active = false;
                            });
                            if (!(section === "facets" && tab === "summary")) {
                                this[section][tab].active = true;
                            }
                        }
                        else {
                            this[section][tab].hasLoadedOnce = true;
                        }
                    }
                };
                return State;
            }());
            var SearchService = (function () {
                /* @ngInject */
                SearchService.$inject = ["Restangular", "LocationService", "UserService"];
                function SearchService(Restangular, LocationService, UserService) {
                    this.Restangular = Restangular;
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                }
                SearchService.prototype.getSummary = function (filters, ignoreUserProjects) {
                    if (filters === void 0) { filters = this.LocationService.filters(); }
                    if (ignoreUserProjects === void 0) { ignoreUserProjects = false; }
                    if (!ignoreUserProjects) {
                        filters = this.UserService.addMyProjectsFilter(filters, "cases.project.project_id");
                    }
                    return this.Restangular.all("ui/search/summary")
                        .post({ filters: filters }, undefined, { 'Content-Type': 'application/json' })
                        .then(function (response) {
                        return response;
                    });
                };
                return SearchService;
            }());
            var SearchChartConfigs = (function () {
                /* @ngInject */
                SearchChartConfigs.$inject = ["$filter"];
                function SearchChartConfigs($filter) {
                    this.projectIdChartConfig = {
                        filterKey: "cases.project.project_id",
                        sortKey: "doc_count",
                        displayKey: "key",
                        defaultText: "project",
                        pluralDefaultText: "projects",
                        sortData: true,
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.project.project_id",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.primarySiteChartConfig = {
                        filterKey: "cases.project.primary_site",
                        sortKey: "doc_count",
                        displayKey: "key",
                        defaultText: "primary site",
                        pluralDefaultText: "primary sites",
                        sortData: true,
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.project.primary_site",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.accessChartConfig = {
                        filterKey: "files.access",
                        sortKey: "doc_count",
                        displayKey: "key",
                        defaultText: "access level",
                        pluralDefaultText: "access levels",
                        sortData: true,
                        filters: {
                            open: {
                                params: {
                                    filters: $filter("makeFilter")([
                                        {
                                            field: "files.access",
                                            value: "open"
                                        }
                                    ], true)
                                }
                            },
                            "controlled": {
                                params: {
                                    filters: $filter("makeFilter")([
                                        {
                                            field: "files.access",
                                            value: "controlled"
                                        }
                                    ], true)
                                }
                            }
                        }
                    };
                    this.dataTypeChartConfig = {
                        filterKey: "files.data_type",
                        sortKey: "doc_count",
                        displayKey: "key",
                        defaultText: "data type",
                        pluralDefaultText: "data types",
                        sortData: true,
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "files.data_type",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.dataFormatChartConfig = {
                        filterKey: "files.data_format",
                        sortKey: "doc_count",
                        displayKey: "key",
                        defaultText: "data format",
                        pluralDefaultText: "data formats",
                        sortData: true,
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "files.data_format",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.expStratChartConfig = {
                        filterKey: "files.experimental_strategy",
                        sortKey: "doc_count",
                        displayKey: "key",
                        defaultText: "experimental strategy",
                        pluralDefaultText: "experimental strategies",
                        sortData: true,
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "files.experimental_strategy",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                }
                return SearchChartConfigs;
            }());
            angular
                .module("search.services", [])
                .service("SearchState", State)
                .service("SearchChartConfigs", SearchChartConfigs)
                .service("SearchService", SearchService);
        })(services = search.services || (search.services = {}));
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var downloader;
        (function (downloader) {
            var directive;
            (function (directive) {
                /* @ngInject */
                Downloader.$inject = ["$window", "$timeout", "$cookies", "$uibModal", "notify", "$rootScope", "$log"];
                function Downloader($window, $timeout, $cookies, $uibModal, notify, $rootScope, $log) {
                    var cookiePath = document.querySelector('base').getAttribute('href');
                    var iFrameIdPrefix = '__downloader_iframe__';
                    var formIdPrefix = '__downloader_form__';
                    var getIframeResponse = function (iFrame) {
                        return JSON.parse(iFrame.contents().find('body pre').text());
                    };
                    var showErrorModal = function (error, options) {
                        var warning = error.warning || error.message;
                        $uibModal.open({
                            templateUrl: 'core/templates/' + (warning ? 'generic-warning' : 'internal-server-error') + '.html',
                            controller: 'WarningController',
                            controllerAs: 'wc',
                            backdrop: 'static',
                            keyboard: false,
                            backdropClass: 'warning-backdrop',
                            animation: false,
                            size: 'lg',
                            resolve: {
                                header: function () { return options.warningHeader; },
                                warning: function () { return (options.warningPrefix || '') + warning; }
                            }
                        });
                    };
                    notify.config({ duration: 20000 });
                    var progressChecker = function (iFrame, cookieKey, downloadToken, options, inProgress, done, altMessage) {
                        inProgress();
                        var waitTime = 1000; // 1 second
                        var timeoutInterval = 10;
                        var attempts = 0;
                        var timeoutPromise = null;
                        var cookieStillThere = function () { return downloadToken === $cookies.get(cookieKey); };
                        var handleError = function () {
                            var error = _.flow(_.attempt, function (e) { return _.isError(e)
                                ? { message: 'GDC download service is currently experiencing issues.' }
                                : e; })(_.partial(getIframeResponse, iFrame));
                            $log.error('Download failed: ', error);
                            return error;
                        };
                        var notifyScope = $rootScope.$new();
                        var finished = function () {
                            $log.info('Download check count & wait interval (in milliseconds):', attempts, waitTime);
                            timeoutPromise = null;
                            iFrame.remove();
                            notify.closeAll();
                            notifyScope.$destroy();
                            done();
                        };
                        notifyScope.cancelDownload = function () {
                            if (timeoutPromise) {
                                $timeout.cancel(timeoutPromise);
                            }
                            finished();
                        };
                        var simpleMessage = "<span>Download preparation in progress. Please wait\u2026</span>\n        <br /><br />\n        <a data-ng-click=\"cancelDownload()\">\n          <i class=\"fa fa-times-circle-o\"></i> Cancel Download\n        </a>";
                        var detailedMessage = "<span>\n          The download preparation can take time due to different factors\n          (total file size, number of files, or number of concurrent users).\n          We recommend that you use the\n          <a href=\"https://gdc.nci.nih.gov/access-data/gdc-data-transfer-tool\" target=\"_blank\">\n            GDC Data Transfer Tool\n          </a>\n          or cancel the download and try again later.\n        </span>\n        <br /><br />\n        <a data-ng-click=\"cancelDownload()\">\n          <i class=\"fa fa-times-circle-o\"></i> Cancel Download\n        </a>";
                        var checker = function () {
                            if (iFrame[0].__frame__loaded) {
                                // The downloadToken cookie is removed before the server sends the response
                                if (cookieStillThere()) {
                                    var error = handleError();
                                    $cookies.remove(cookieKey);
                                    finished();
                                    showErrorModal(error, options);
                                }
                                else {
                                    // A download should be now initiated.
                                    finished();
                                }
                            }
                            else if (cookieStillThere()) {
                                if (++attempts % timeoutInterval === 0) {
                                    notify.closeAll();
                                    notify({
                                        message: null,
                                        messageTemplate: (altMessage && attempts > timeoutInterval * 2) ? detailedMessage : simpleMessage,
                                        container: '#notification',
                                        classes: 'alert-warning',
                                        scope: notifyScope
                                    });
                                }
                                timeoutPromise = $timeout(checker, waitTime);
                            }
                            else {
                                // In case the download is initiated without triggering the iFrame to reload
                                finished();
                            }
                        };
                        timeoutPromise = $timeout(checker, waitTime);
                    };
                    var cookielessChecker = function (iFrame, options, inProgress, // not used but obligated to the interface
                        done) {
                        var waitTime = 5000; // 5 seconds
                        var finished = function () {
                            iFrame.remove();
                            done();
                        };
                        var attempts = 30;
                        var checker = function () {
                            // Here we simply try to read the error message if the iFrame DOM is reloaded; for a successful download,
                            // the error message is not in the DOM therefore #getIframeResponse will return a JS error.
                            var error = _.attempt(_.partial(getIframeResponse, iFrame));
                            if (_.isError(error)) {
                                // Keep waiting until we exhaust `attempts` then we do the cleanup.
                                if (--attempts < 0) {
                                    finished();
                                }
                                else {
                                    $timeout(checker, waitTime);
                                }
                            }
                            else {
                                finished();
                                showErrorModal(error, options);
                            }
                        };
                        $timeout(checker, waitTime);
                    };
                    var hashString = function (s) { return s.split('').reduce(function (acc, c) {
                        return ((acc << 5) - acc) + c.charCodeAt(0);
                    }, 0); };
                    var toHtml = function (key, value) {
                        return ("<input\n        type=\"hidden\"\n        name=\"" + key + "\"\n        value=\"" + (_.isPlainObject(value) ? JSON.stringify(value).replace(/"/g, '&quot;') : value) + "\"\n      />");
                    };
                    // TODO: this should probably be factored out.
                    var arrayToStringFields = ['expand', 'fields', 'facets'];
                    var arrayToStringOnFields = function (key, value, fields) { return _.includes(fields, key)
                        ? [].concat(value).join()
                        : value; };
                    return {
                        restrict: 'A',
                        link: function (scope, element) {
                            scope.download = function (params, apiEndpoint, target, method, options) {
                                if (target === void 0) { target = function () { return element; }; }
                                if (method === void 0) { method = 'GET'; }
                                if (options === void 0) { options = {}; }
                                var downloadToken = _.uniqueId('' + (+new Date()) + '-');
                                var iFrameId = iFrameIdPrefix + downloadToken;
                                var formId = formIdPrefix + downloadToken;
                                // a cookie value that the server will remove as a download-ready indicator
                                var cookieKey = navigator.cookieEnabled ?
                                    Math.abs(hashString(JSON.stringify(params) + downloadToken)).toString(16) : null;
                                if (cookieKey) {
                                    $cookies.put(cookieKey, downloadToken);
                                    _.assign(params, {
                                        downloadCookieKey: cookieKey,
                                        downloadCookiePath: cookiePath
                                    });
                                }
                                var fields = _.reduce(params, function (result, value, key) {
                                    var paramValue = arrayToStringOnFields(key, value, arrayToStringFields);
                                    return result + [].concat(paramValue).reduce(function (acc, v) { return acc + toHtml(key, v); }, '');
                                }, '');
                                var formHtml = "<form\n              method=\"" + method.toUpperCase() + "\"\n              id=\"" + formId + "\"\n              action=\"" + apiEndpoint + "\"\n              style=\"display: none\"\n            >\n              " + fields + "\n            </form>";
                                $("<iframe\n              id=\"" + iFrameId + "\"\n              style=\"display: none\"\n              src=\"about:blank\"\n              onload=\"this.__frame__loaded = true;\">\n            </iframe>")
                                    .appendTo('body');
                                var iFrame = $('#' + iFrameId);
                                iFrame[0].__frame__loaded = false;
                                iFrame.ready(function () {
                                    var iFrameBody = iFrame.contents().find('body');
                                    iFrameBody.append(formHtml);
                                    var form = iFrameBody.find('#' + formId);
                                    form.submit();
                                });
                                return cookieKey
                                    ? _.partial(progressChecker, iFrame, cookieKey, downloadToken, options)
                                    : _.partial(cookielessChecker, iFrame, options);
                            };
                        }
                    };
                }
                angular.module('downloader.directive', ["cgNotify"])
                    .directive('downloader', Downloader);
            })(directive = downloader.directive || (downloader.directive = {}));
        })(downloader = components.downloader || (components.downloader = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var downloader;
        (function (downloader) {
            angular.module("components.downloader", [
                "downloader.directive"
            ]);
        })(downloader = components.downloader || (components.downloader = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets) {
            var controllers;
            (function (controllers) {
                (function (KeyCode) {
                    KeyCode[KeyCode["Space"] = 32] = "Space";
                    KeyCode[KeyCode["Enter"] = 13] = "Enter";
                    KeyCode[KeyCode["Esc"] = 27] = "Esc";
                    KeyCode[KeyCode["Left"] = 37] = "Left";
                    KeyCode[KeyCode["Right"] = 39] = "Right";
                    KeyCode[KeyCode["Up"] = 38] = "Up";
                    KeyCode[KeyCode["Down"] = 40] = "Down";
                    KeyCode[KeyCode["Tab"] = 9] = "Tab";
                })(controllers.KeyCode || (controllers.KeyCode = {}));
                var KeyCode = controllers.KeyCode;
                var Cycle;
                (function (Cycle) {
                    Cycle[Cycle["Up"] = -1] = "Up";
                    Cycle[Cycle["Down"] = 1] = "Down";
                })(Cycle || (Cycle = {}));
                var FacetsHeadingCtrl = (function () {
                    FacetsHeadingCtrl.$inject = ["$scope"];
                    function FacetsHeadingCtrl($scope) {
                        this.$scope = $scope;
                    }
                    FacetsHeadingCtrl.prototype.toggle = function (event, property) {
                        if (event.which === 1 || event.which === 13) {
                            this.$scope.$parent.collapsed = !this.$scope.$parent.collapsed;
                        }
                        if (property === "collapsed") {
                            angular.element(event.target).attr("aria-collapsed", this.$scope.$parent.collapsed.toString());
                        }
                    };
                    return FacetsHeadingCtrl;
                }());
                var TermsController = (function () {
                    /* @ngInject */
                    TermsController.$inject = ["$scope", "FacetService", "UserService"];
                    function TermsController($scope, FacetService, UserService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.FacetService = FacetService;
                        this.UserService = UserService;
                        this.title = "";
                        this.name = "";
                        this.displayCount = 5;
                        this.originalDisplayCount = 5;
                        this.expanded = false;
                        this.actives = [];
                        this.inactives = [];
                        this.error = undefined;
                        this.expanded = !!$scope.expanded;
                        this.displayCount = this.originalDisplayCount = $scope.displayCount || 5;
                        this.title = $scope.title;
                        // TODO api should re-format the facets
                        this.name = $scope.name;
                        if ($scope.facet) {
                            if ($scope.facet.buckets) {
                                this.refresh($scope.facet.buckets);
                            }
                            else {
                                this.error = $scope.facet;
                            }
                        }
                        $scope.$watch("facet", function (n, o) {
                            if (n === o) {
                                return;
                            }
                            if (n.buckets) {
                                _this.refresh(n.buckets);
                            }
                            else {
                                _this.error = n;
                            }
                        });
                    }
                    TermsController.prototype.add = function (facet, term) {
                        this.FacetService.addTerm(facet, term);
                    };
                    TermsController.prototype.remove = function (facet, term) {
                        this.FacetService.removeTerm(facet, term);
                    };
                    TermsController.prototype.refresh = function (terms) {
                        var projectCodeKeys = [
                            "project_id",
                            "cases.project.project_id",
                            "annotations.project.project_id",
                            "project.project_id"
                        ];
                        if (projectCodeKeys.indexOf(this.name) !== -1) {
                            terms = this.UserService.setUserProjectsTerms(terms);
                        }
                        this.terms = terms;
                        if (this.terms.length >= 20) {
                            this.$scope.hasValueSearch = true;
                        }
                        this.actives = this.FacetService.getActives(this.name, terms);
                        // TODO: Currently there is some complication supporting _missing properly thereby we're hiding
                        // _missing in facets. Once we fully support _missing, #reject should be removed.
                        this.inactives = _.reject(_.difference(terms, this.actives), function (term) { return term.key === '_missing'; });
                    };
                    TermsController.prototype.toggle = function (event, property) {
                        if (event.which === 1 || event.which === 13) {
                            this[property] = !this[property];
                        }
                        if (property === "expanded") {
                            this.displayCount = this.expanded ? this.inactives.length : this.originalDisplayCount;
                        }
                    };
                    return TermsController;
                }());
                var CurrentFiltersController = (function () {
                    /* @ngInject */
                    CurrentFiltersController.$inject = ["$scope", "LocationService", "FacetService", "UserService"];
                    function CurrentFiltersController($scope, LocationService, FacetService, UserService) {
                        var _this = this;
                        this.LocationService = LocationService;
                        this.FacetService = FacetService;
                        this.UserService = UserService;
                        this.currentFilters = [];
                        this.build();
                        $scope.$on("$locationChangeSuccess", function () { return _this.build(); });
                    }
                    CurrentFiltersController.prototype.removeTerm = function (facet, term, event, op) {
                        if (event.which === 1 || event.which === 13) {
                            this.FacetService.removeTerm(facet, term, op);
                        }
                    };
                    CurrentFiltersController.prototype.isInMyProjects = function (filter) {
                        var validCodes = [
                            "project_id",
                            "cases.project.project_id"
                        ];
                        return validCodes.indexOf(filter.content.field) !== -1 && this.UserService.currentUser &&
                            this.UserService.currentUser.isFiltered;
                    };
                    CurrentFiltersController.prototype.resetQuery = function () {
                        this.LocationService.clear();
                    };
                    CurrentFiltersController.prototype.expandTerms = function (event, filter) {
                        if (event.which === 1 || event.which === 13) {
                            filter.expanded = !filter.expanded;
                        }
                    };
                    CurrentFiltersController.prototype.build = function () {
                        this.currentFilters = _.sortBy(this.LocationService.filters().content, function (item) {
                            return item.content.field;
                        });
                    };
                    return CurrentFiltersController;
                }());
                var FreeTextController = (function () {
                    /* @ngInject */
                    FreeTextController.$inject = ["$scope", "LocationService", "FacetService"];
                    function FreeTextController($scope, LocationService, FacetService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.FacetService = FacetService;
                        this.searchTerm = "";
                        this.actives = [];
                        this.autocomplete = true;
                        this.lastInput = "";
                        this.autocomplete = $scope.autocomplete !== 'false';
                        this.refresh();
                        $scope.$watch("searchTerm", function (n, o) {
                            if (n === o) {
                                return;
                            }
                            _this.refresh();
                        });
                        $scope.$on("$locationChangeSuccess", function () { return _this.refresh(); });
                    }
                    FreeTextController.prototype.saveInput = function () {
                        this.searchTerm = this.searchTerm.replace(/[^a-zA-Z0-9-_.]/g, '');
                        this.lastInput = this.searchTerm;
                    };
                    FreeTextController.prototype.termSelected = function (addTerm) {
                        if (addTerm === void 0) { addTerm = true; }
                        if (!addTerm) {
                            this.searchTerm = this.lastInput;
                            return;
                        }
                        var parts = this.$scope.field.split(".");
                        var field = parts.length > 1 ? parts[parts.length - 1] : parts[0];
                        if (this.actives.indexOf(this.searchTerm[field]) === -1) {
                            var term = this.searchTerm;
                            term = term[field];
                            if (!term) {
                                this.searchTerm = this.lastInput;
                                return;
                            }
                            this.FacetService.addTerm(this.$scope.field, term);
                            this.actives.push(this.searchTerm);
                            this.searchTerm = "";
                        }
                        else {
                            this.searchTerm = "";
                        }
                    };
                    FreeTextController.prototype.setTerm = function () {
                        if (this.searchTerm === "") {
                            return;
                        }
                        this.FacetService.addTerm(this.$scope.field, this.searchTerm);
                        this.actives.push(this.searchTerm);
                        this.searchTerm = "";
                    };
                    FreeTextController.prototype.autoComplete = function (query) {
                        return this.FacetService.autoComplete(this.$scope.entity, query, this.$scope.field);
                    };
                    FreeTextController.prototype.prefixValue = function (query) {
                        term = query.replace(/\*/g, '') + '*';
                        var model = { term: term };
                        model[this.$scope.field.split('.').pop()] = term;
                        return [model];
                    };
                    FreeTextController.prototype.remove = function (term) {
                        this.FacetService.removeTerm(this.$scope.field, term);
                        this.refresh();
                    };
                    FreeTextController.prototype.refresh = function () {
                        this.actives = this.FacetService.getActiveIDs(this.$scope.field);
                    };
                    FreeTextController.prototype.clear = function () {
                        var _this = this;
                        this.actives.forEach(function (term) { return _this.FacetService.removeTerm(_this.$scope.field, term); });
                    };
                    return FreeTextController;
                }());
                var RangeFacetController = (function () {
                    /* @ngInject */
                    RangeFacetController.$inject = ["$scope", "$filter", "LocationService", "FacetService"];
                    function RangeFacetController($scope, $filter, LocationService, FacetService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.$filter = $filter;
                        this.LocationService = LocationService;
                        this.FacetService = FacetService;
                        this.error = undefined;
                        this.lowerBound = null;
                        this.upperBound = null;
                        this.conversionFactor = 365.25;
                        this.selectedUnit = 'years';
                        this.displayedMax = 0;
                        this.displayedMin = 0;
                        this.warningDays = Math.floor(90 * this.conversionFactor);
                        $scope.lowerBoundFinal = null;
                        $scope.upperBoundFinal = null;
                        $scope.data = $scope.facet || { count: '0',
                            max: '0',
                            min: '0'
                        };
                        this.refresh();
                        $scope.$on("$locationChangeSuccess", function () { return _this.refresh(); });
                        $scope.$watch("facet", function (n, o) {
                            if (n === o || n === undefined) {
                                return;
                            }
                            if (n) {
                                $scope.data = n;
                                _this.convertMaxMin();
                            }
                            else {
                                _this.error = n;
                            }
                        });
                    }
                    // when textboxes change convert to days right away and store
                    // when conversions are done after, it's always from days.
                    RangeFacetController.prototype.inputChanged = function () {
                        if (!this.$scope.convertDays || this.selectedUnit === 'days') {
                            this.$scope.upperBoundFinal = this.upperBound;
                            this.$scope.lowerBoundFinal = this.lowerBound;
                        }
                        else if (this.selectedUnit === 'years') {
                            this.$scope.upperBoundFinal = this.upperBound ? Math.floor(this.upperBound * this.conversionFactor + this.conversionFactor - 1) : null;
                            this.$scope.lowerBoundFinal = this.lowerBound ? Math.floor(this.lowerBound * this.conversionFactor) : null;
                        }
                    };
                    RangeFacetController.prototype.unitClicked = function () {
                        this.convertUserInputs();
                        this.convertMaxMin();
                    };
                    RangeFacetController.prototype.convertUserInputs = function () {
                        if (!this.$scope.convertDays || this.selectedUnit === 'days') {
                            this.lowerBound = this.$scope.lowerBoundFinal;
                            this.upperBound = this.$scope.upperBoundFinal;
                        }
                        else if (this.selectedUnit === 'years') {
                            this.lowerBound = this.$scope.lowerBoundFinal ? Math.ceil(this.$scope.lowerBoundFinal / this.conversionFactor) : null;
                            this.upperBound = this.$scope.upperBoundFinal ? Math.ceil((this.$scope.upperBoundFinal + 1 - this.conversionFactor) / this.conversionFactor) : null;
                        }
                    };
                    RangeFacetController.prototype.convertMaxMin = function () {
                        if (!this.$scope.convertDays || this.selectedUnit === 'days') {
                            this.displayedMin = this.$scope.data.min;
                            this.displayedMax = this.$scope.data.max;
                        }
                        else if (this.selectedUnit === 'years') {
                            this.displayedMax = this.$filter("ageDisplay")(this.$scope.data.max, true, 0);
                            this.displayedMin = this.$filter("ageDisplay")(this.$scope.data.min, true, 0);
                        }
                    };
                    RangeFacetController.prototype.refresh = function () {
                        this.activesWithOperator = this.FacetService.getActivesWithOperator(this.$scope.field);
                        this.$scope.lowerBoundFinal = this.lowerFacetAdded = this.activesWithOperator['>='] || null;
                        this.$scope.upperBoundFinal = this.upperFacetAdded = this.activesWithOperator['<='] || null;
                        this.convertMaxMin();
                        this.convertUserInputs();
                    };
                    RangeFacetController.prototype.setBounds = function () {
                        if (this.lowerBound) {
                            if (_.has(this.activesWithOperator, '>=')) {
                                this.FacetService.removeTerm(this.$scope.field, null, ">=");
                            }
                            this.FacetService.addTerm(this.$scope.field, this.$scope.lowerBoundFinal, ">=");
                        }
                        else {
                            this.FacetService.removeTerm(this.$scope.field, null, ">=");
                        }
                        if (this.upperBound) {
                            if (_.has(this.activesWithOperator, '<=')) {
                                this.FacetService.removeTerm(this.$scope.field, null, "<=");
                            }
                            this.FacetService.addTerm(this.$scope.field, this.$scope.upperBoundFinal, "<=");
                        }
                        else {
                            this.FacetService.removeTerm(this.$scope.field, null, "<=");
                        }
                    };
                    return RangeFacetController;
                }());
                var DateFacetController = (function () {
                    /* @ngInject */
                    DateFacetController.$inject = ["$scope", "$window", "FacetService", "uibDateParser"];
                    function DateFacetController($scope, $window, FacetService, uibDateParser) {
                        var _this = this;
                        this.$scope = $scope;
                        this.$window = $window;
                        this.FacetService = FacetService;
                        this.uibDateParser = uibDateParser;
                        this.active = false;
                        this.name = "";
                        this.$scope.date = new Date();
                        this.refresh();
                        $scope.$on("$locationChangeSuccess", function () { return _this.refresh(); });
                        this.$scope.opened = false;
                        this.$scope.dateOptions = {
                            showWeeks: false,
                            startingDay: 1
                        };
                        this.name = $scope.name;
                    }
                    DateFacetController.prototype.refresh = function () {
                        var actives = this.FacetService.getActivesWithValue(this.$scope.name);
                        if (_.size(actives) > 0) {
                            this.$scope.date = this.$window.moment(actives[this.$scope.name]).toDate();
                            this.facetAdded = true;
                        }
                    };
                    DateFacetController.prototype.open = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        this.$scope.opened = true;
                    };
                    DateFacetController.prototype.search = function () {
                        var actives = this.FacetService.getActivesWithValue(this.$scope.name);
                        if (_.size(actives) > 0) {
                            this.FacetService.removeTerm(this.name, undefined, '>=');
                        }
                        this.FacetService.addTerm(this.name, this.$window.moment(this.$scope.date).format('YYYY-MM-DD'), '>=');
                    };
                    return DateFacetController;
                }());
                var CustomFacetsModalController = (function () {
                    /* @ngInject */
                    CustomFacetsModalController.$inject = ["facetFields", "$scope", "$rootScope", "$uibModalInstance", "$window", "Restangular", "FilesService", "ParticipantsService", "$filter", "facetsConfig", "LocationService", "FacetsConfigService", "CustomFacetsService", "aggregations", "docType", "title"];
                    function CustomFacetsModalController(facetFields, $scope, $rootScope, $uibModalInstance, $window, Restangular, FilesService, ParticipantsService, $filter, facetsConfig, LocationService, FacetsConfigService, CustomFacetsService, aggregations, docType, title) {
                        this.facetFields = facetFields;
                        this.$scope = $scope;
                        this.$rootScope = $rootScope;
                        this.$uibModalInstance = $uibModalInstance;
                        this.$window = $window;
                        this.Restangular = Restangular;
                        this.FilesService = FilesService;
                        this.ParticipantsService = ParticipantsService;
                        this.$filter = $filter;
                        this.facetsConfig = facetsConfig;
                        this.LocationService = LocationService;
                        this.FacetsConfigService = FacetsConfigService;
                        this.CustomFacetsService = CustomFacetsService;
                        this.aggregations = aggregations;
                        this.docType = docType;
                        this.title = title;
                        this.selectedIndex = 0;
                        var _this = this;
                        $scope.keyboardListener = function (e) {
                            var key = e.which || e.keyCode;
                            switch (key) {
                                case KeyCode.Enter:
                                    e.preventDefault();
                                    _this.addFacet();
                                    break;
                                case KeyCode.Up:
                                    e.preventDefault();
                                    _this.setSelectedIndex(Cycle.Up);
                                    break;
                                case KeyCode.Down:
                                    e.preventDefault();
                                    _this.setSelectedIndex(Cycle.Down);
                                    break;
                                case KeyCode.Esc:
                                    if (_this.$uibModalStack)
                                        _this.$uibModalStack.dismissAll();
                                    break;
                                case KeyCode.Tab:
                                    var activeId = document.activeElement.id;
                                    if (activeId !== 'show-fields-checkbox' && activeId !== 'quick-search-input') {
                                        _this.setSelectedIndex(Cycle.Down);
                                    }
                                    break;
                            }
                        };
                        $scope.itemHover = function (index) {
                            _this.selectedIndex = index;
                        };
                    }
                    CustomFacetsModalController.prototype.closeModal = function () {
                        this.$uibModalInstance.dismiss('cancel');
                    };
                    CustomFacetsModalController.prototype.addFacet = function () {
                        var _this = this;
                        var selectedField = this.$scope.filteredFields[this.selectedIndex];
                        if (!selectedField)
                            return;
                        var fileOptions = {
                            fields: [],
                            expand: [],
                            facets: [selectedField['field']],
                            filters: this.LocationService.filters()
                        };
                        if (selectedField['doc_type'] === "files") {
                            this.FilesService.getFiles(fileOptions).then(function (data) {
                                _.assign(_this.aggregations, data.aggregations);
                            }, function (response) {
                                _this.aggregations[selectedField['field']] = 'error';
                                return _this.aggregations;
                            });
                        }
                        else if (selectedField['doc_type'] === "cases") {
                            this.ParticipantsService.getParticipants(fileOptions).then(function (data) {
                                _.assign(_this.aggregations, data.aggregations);
                            }, function (response) {
                                _this.aggregations[selectedField['field']] = 'error';
                                return _this.aggregations;
                            });
                        }
                        this.FacetsConfigService.addField(selectedField['doc_type'], selectedField['field'], selectedField['type']);
                        this.$uibModalInstance.dismiss('added facet');
                    };
                    CustomFacetsModalController.prototype.setSelectedIndex = function (direction) {
                        if (direction == Cycle.Up) {
                            if (this.selectedIndex === 0) {
                                this.selectedIndex = (this.$scope.filteredFields.length - 1);
                                document.getElementById('add-facets-modal').scrollTop = document.getElementById(this.$filter('dotReplace')(this.$scope.filteredFields[this.selectedIndex].field, '-')).offsetTop;
                            }
                            else {
                                this.selectedIndex--;
                                this.scrollToSelected(Cycle.Up);
                            }
                        }
                        if (direction == Cycle.Down) {
                            if (this.selectedIndex === (this.$scope.filteredFields.length - 1)) {
                                this.selectedIndex = 0;
                                document.getElementById('add-facets-modal').scrollTop = 0;
                            }
                            else {
                                this.selectedIndex++;
                                this.scrollToSelected(Cycle.Down);
                            }
                        }
                    };
                    CustomFacetsModalController.prototype.scrollToSelected = function (direction) {
                        var modalElement = document.getElementById('add-facets-modal');
                        var selectedElement = document.getElementById(this.$filter('dotReplace')(this.$scope.filteredFields[this.selectedIndex].field, '-'));
                        var styles = window.getComputedStyle(document.getElementById('facets-list'));
                        var marginHeight = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']) || 10;
                        if (direction === Cycle.Up) {
                            if (selectedElement.offsetTop < modalElement.scrollTop) {
                                modalElement.scrollTop = modalElement.scrollTop - selectedElement.offsetHeight - marginHeight;
                            }
                        }
                        else if (direction === Cycle.Down) {
                            if (selectedElement.offsetTop + selectedElement.offsetHeight > modalElement.scrollTop + modalElement.clientHeight) {
                                modalElement.scrollTop = modalElement.scrollTop + selectedElement.offsetHeight + marginHeight;
                            }
                        }
                    };
                    CustomFacetsModalController.prototype.inputChanged = function () {
                        if (this.$scope.filteredFields.length < this.selectedIndex) {
                            this.selectedIndex = 0;
                        }
                    };
                    CustomFacetsModalController.prototype.toggleEmpty = function () {
                        var _this = this;
                        if (!this.CustomFacetsService.nonEmptyOnlyDisplayed) {
                            this.$rootScope.$emit('ShowLoadingScreen');
                            this.CustomFacetsService.getNonEmptyFacetFields(this.docType, this.facetFields)
                                .then(function (data) {
                                _this.CustomFacetsService.nonEmptyOnlyDisplayed = true;
                                _this.facetFields = _this.CustomFacetsService.filterFields(_this.docType, data);
                            }).finally(function () { return _this.$rootScope.$emit('ClearLoadingScreen'); });
                        }
                        else {
                            this.$rootScope.$emit('ShowLoadingScreen');
                            this.CustomFacetsService.getFacetFields(this.$scope.docType)
                                .then(function (data) {
                                _this.CustomFacetsService.nonEmptyOnlyDisplayed = false;
                                _this.facetFields = _this.CustomFacetsService.filterFields(_this.docType, data);
                            })
                                .finally(function () { return _this.$rootScope.$emit('ClearLoadingScreen'); });
                        }
                    };
                    return CustomFacetsModalController;
                }());
                var AddCustomFacetsPanelController = (function () {
                    /* @ngInject */
                    AddCustomFacetsPanelController.$inject = ["$scope", "$uibModalStack", "$uibModal", "FacetsConfigService", "LocationService"];
                    function AddCustomFacetsPanelController($scope, $uibModalStack, $uibModal, FacetsConfigService, LocationService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.$uibModalStack = $uibModalStack;
                        this.$uibModal = $uibModal;
                        this.FacetsConfigService = FacetsConfigService;
                        this.LocationService = LocationService;
                        $scope.$on("$stateChangeStart", function () {
                            if (_this.modalInstance) {
                                _this.modalInstance.close();
                            }
                        });
                    }
                    AddCustomFacetsPanelController.prototype.openModal = function () {
                        var _this = this;
                        // Modal stack is a helper service. Used to figure out if one is currently
                        // open already.
                        if (this.$uibModalStack.getTop()) {
                            return;
                        }
                        this.modalInstance = this.$uibModal.open({
                            templateUrl: "components/facets/templates/add-facets-modal.html",
                            backdrop: true,
                            controller: "customFacetsModalController as cufc",
                            keyboard: true,
                            animation: false,
                            size: "lg",
                            resolve: {
                                /** @ngInject */
                                facetFields: ["CustomFacetsService", "$rootScope", function (CustomFacetsService, $rootScope) {
                                    $rootScope.$emit('ShowLoadingScreen');
                                    return CustomFacetsService.getFacetFields(_this.$scope.docType)
                                        .then(function (data) {
                                        if (CustomFacetsService.nonEmptyOnlyDisplayed) {
                                            return CustomFacetsService.getNonEmptyFacetFields(_this.$scope.docType, _.map(data, function (v, k) { return v; }));
                                        }
                                        return data;
                                    }).then(function (data) { return CustomFacetsService.filterFields(_this.$scope.docType, data); })
                                        .finally(function () { return $rootScope.$emit('ClearLoadingScreen'); });
                                }],
                                facetsConfig: function () { return _this.$scope.facetsConfig; },
                                aggregations: function () { return _this.$scope.aggregations; },
                                docType: function () { return _this.$scope.docType; },
                                title: function () { return _this.$scope.title; }
                            }
                        });
                    };
                    AddCustomFacetsPanelController.prototype.reset = function () {
                        this.LocationService.clear();
                        this.$scope.facetsConfig = _.clone(this.defaultConfig, true);
                        this.FacetService.addTerm(this.name, this.$window.moment(this.$scope.date), '>=');
                    };
                    return AddCustomFacetsPanelController;
                }());
                angular.module("facets.controllers", ["facets.services", "user.services", "files.services"])
                    .controller("facetsHeadingCtrl", FacetsHeadingCtrl)
                    .controller("currentFiltersCtrl", CurrentFiltersController)
                    .controller("freeTextCtrl", FreeTextController)
                    .controller("rangeFacetCtrl", RangeFacetController)
                    .controller("dateFacetCtrl", DateFacetController)
                    .controller("customFacetsModalController", CustomFacetsModalController)
                    .controller("addCustomFacetsPanelController", AddCustomFacetsPanelController)
                    .controller("termsCtrl", TermsController);
            })(controllers = facets.controllers || (facets.controllers = {}));
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets) {
            var directives;
            (function (directives) {
                /* @ngInject */
                Terms.$inject = ["ProjectsService", "$timeout", "$compile"];
                AddCustomFacetsPanel.$inject = ["$uibModal", "$uibModalStack"];
                FacetsSection.$inject = ["FacetService", "FacetsConfigService"];
                typeaheadClickOpen.$inject = ["$timeout"];
                function FacetsHeading() {
                    return {
                        restrict: "E",
                        scope: {
                            hasActives: '=',
                            removeFunction: '&',
                            clearFunction: '&'
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facet-heading.html",
                        controller: 'facetsHeadingCtrl as fhc'
                    };
                }
                /* @ngInject */
                function Terms(ProjectsService, $timeout, $compile) {
                    return {
                        restrict: "E",
                        scope: {
                            facet: "=",
                            collapsed: "=?",
                            expanded: "@",
                            displayCount: "@",
                            title: "@",
                            name: "@",
                            removeFunction: "&",
                            removable: "=",
                            showTooltip: "@",
                            hasValueSearch: "=?"
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facet.html",
                        controller: "termsCtrl as tc",
                        link: function ($scope, elem, attr, ctrl) {
                            $scope.collapsed = angular.isDefined($scope.collapsed) ? $scope.collapsed : false;
                            $scope.hasValueSearch = angular.isDefined($scope.hasValueSearch) ? $scope.hasValueSearch : false;
                            $scope.valueSearchActive = false;
                            //after directive has been rendered, check if text overflowed then add tooltip
                            $timeout(function () {
                                var label = document.getElementById($scope.title.toLowerCase().replace(/\s+/g, '-') + "-facet-label");
                                if (label && label.offsetWidth < label.scrollWidth) {
                                    label.setAttribute('uib-tooltip', $scope.title);
                                    $compile(label)($scope);
                                }
                            });
                            $scope.clear = function (facet) {
                                ctrl.terms.forEach(function (term) { return ctrl.FacetService.removeTerm(facet, term); });
                            };
                            $scope.ProjectsService = ProjectsService;
                            $scope.add = function (facet, term, event) {
                                if (event.which === 13) {
                                    elem.closest(".list-group").focus();
                                    ctrl.add(facet, term);
                                }
                            };
                            $scope.remove = function (facet, term, event) {
                                if (event.which === 13) {
                                    elem.closest(".list-group").focus();
                                    ctrl.remove(facet, term);
                                }
                            };
                        }
                    };
                }
                /* @ngInject */
                function FacetsFreeText() {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            placeholder: "@",
                            field: "@",
                            entity: "@",
                            template: "@",
                            autocomplete: "@",
                            removeFunction: "&",
                            removable: "="
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facets-free-text.html",
                        controller: "freeTextCtrl as ftc",
                        link: function ($scope, elem, attr, ctrl) {
                            $scope.clear = function () {
                                ctrl.actives.forEach(function (term) { return ctrl.FacetService.removeTerm($scope.field, term); });
                            };
                        }
                    };
                }
                /* @ngInject */
                function FacetsPrefix() {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            placeholder: "@",
                            field: "@",
                            entity: "@",
                            template: "@",
                            autocomplete: "@"
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facets-prefix.html",
                        controller: "freeTextCtrl as ftc",
                        link: function ($scope, elem, attr, ctrl) {
                            $scope.clear = function () {
                                ctrl.actives.forEach(function (term) { return ctrl.FacetService.removeTerm($scope.field, term); });
                            };
                        }
                    };
                }
                /* @ngInject */
                function DateFacet() {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            name: "@",
                            collapsed: '=?',
                            removable: '=',
                            removeFunction: '&'
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facets-date.html",
                        controller: "dateFacetCtrl as dfc",
                        link: function ($scope, elem, attr, ctrl) {
                            $scope.collapsed = angular.isDefined($scope.collapsed) ? $scope.collapsed : false;
                            $scope.clear = function () {
                                ctrl.FacetService.removeTerm(ctrl.name, ctrl.$window.moment($scope.date).format('YYYY-MM-DD'));
                                ctrl.facetAdded = false;
                            };
                        }
                    };
                }
                /* @ngInject */
                function RangeFacet() {
                    return {
                        restrict: "E",
                        scope: {
                            collapsed: '=?',
                            facet: "=",
                            title: "@",
                            field: "@",
                            convertDays: "@",
                            removable: "=",
                            removeFunction: "&"
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/range-facet.html",
                        controller: "rangeFacetCtrl as rfc",
                        link: function ($scope, elem, attr, ctrl) {
                            $scope.collapsed = angular.isDefined($scope.collapsed) ? $scope.collapsed : false;
                            $scope.clear = function () {
                                ctrl.FacetService.removeTerm($scope.field, null, ">=");
                                ctrl.FacetService.removeTerm($scope.field, null, "<=");
                                ctrl.upperFacetAdded = ctrl.lowerFacetAdded = false;
                            };
                        }
                    };
                }
                /* @ngInject */
                function AddCustomFacetsPanel($uibModal, $uibModalStack) {
                    return {
                        restrict: "E",
                        scope: {
                            docType: "@",
                            aggregations: "=",
                            title: "@"
                        },
                        templateUrl: "components/facets/templates/add-custom-facets-panel.html",
                        controller: "addCustomFacetsPanelController as acfc"
                    };
                }
                /* @ngInject */
                function CurrentFilters() {
                    return {
                        restrict: "E",
                        controller: "currentFiltersCtrl as cfc",
                        templateUrl: "components/facets/templates/current.html"
                    };
                }
                /* @ngInject */
                function FacetsSection(FacetService, FacetsConfigService) {
                    return {
                        restrict: "E",
                        templateUrl: "components/facets/templates/facets-section.html",
                        scope: {
                            doctype: "@",
                            aggregations: "="
                        },
                        link: function ($scope) {
                            $scope.$watch(function () { return FacetsConfigService.fieldsMap[$scope.doctype]; }, function (config) {
                                $scope.facetsConfig = config;
                            });
                            $scope.facetsConfig = FacetsConfigService.fieldsMap[$scope.doctype];
                            $scope.removeFacet = function (name) {
                                FacetsConfigService.removeField($scope.doctype, name);
                                FacetService.removeTerm($scope.doctype + "." + name);
                            };
                        }
                    };
                }
                // This directive is used to re-trigger the typeahead suggestions
                // when user clicks on input field
                function typeaheadClickOpen($timeout) {
                    return {
                        restrict: 'A',
                        require: 'ngModel',
                        link: function ($scope, elem, attrs) {
                            elem.bind('click', function () {
                                var ctrl = elem.controller('ngModel');
                                var prev = ctrl.$modelValue || '';
                                if (prev) {
                                    ctrl.$setViewValue('');
                                    $timeout(function () { return ctrl.$setViewValue(prev); });
                                }
                                else {
                                    ctrl.$setViewValue(' ');
                                }
                            });
                        }
                    };
                }
                angular.module("facets.directives", ["facets.controllers", "facets.services"])
                    .directive("terms", Terms)
                    .directive("currentFilters", CurrentFilters)
                    .directive("rangeFacet", RangeFacet)
                    .directive("dateFacet", DateFacet)
                    .directive("addCustomFacetsPanel", AddCustomFacetsPanel)
                    .directive("facetsSection", FacetsSection)
                    .directive("facetsFreeText", FacetsFreeText)
                    .directive("typeaheadClickOpen", typeaheadClickOpen)
                    .directive("facetsHeading", FacetsHeading)
                    .directive("facetsPrefix", FacetsPrefix);
            })(directives = facets.directives || (facets.directives = {}));
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));



var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets_1) {
            var services;
            (function (services) {
                var FacetService = (function () {
                    /* @ngInject */
                    FacetService.$inject = ["LocationService", "Restangular", "UserService", "$q"];
                    function FacetService(LocationService, Restangular, UserService, $q) {
                        this.LocationService = LocationService;
                        this.Restangular = Restangular;
                        this.UserService = UserService;
                        this.$q = $q;
                    }
                    FacetService.prototype.autoComplete = function (entity, query, field) {
                        var projectsKeys = {
                            "files": "cases.project.project_id",
                            "cases": "project.project_id",
                            "projects": "project_id"
                        };
                        var options = {
                            query: query
                        };
                        var filters = this.LocationService.filters();
                        _.remove(filters.content, function (filter) {
                            return filter.content.field === field;
                        });
                        if (filters.content && filters.content.length > 0) {
                            filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[entity]);
                            options.filters = filters;
                        }
                        return this.Restangular.all(entity + "/ids").get("", options).then(function (data) {
                            return data.data.hits.length ? data.data.hits : [{ warning: "No results found" }];
                        });
                    };
                    FacetService.prototype.searchAll = function (params) {
                        if (params.hasOwnProperty("fields")) {
                            params["fields"] = params["fields"].join();
                        }
                        if (params.hasOwnProperty("expand")) {
                            params["expand"] = params["expand"].join();
                        }
                        var abort = this.$q.defer();
                        var prom = this.Restangular.all("all")
                            .withHttpConfig({
                            timeout: abort.promise
                        })
                            .get("", params).then(function (data) {
                            return data;
                        });
                        return prom;
                    };
                    FacetService.prototype.getActives = function (facet, terms) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = [];
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    terms.forEach(function (t) {
                                        if (t.key === v) {
                                            xs.push(t);
                                        }
                                    });
                                });
                                break;
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.getActiveIDs = function (facet) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = [];
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    xs.push(v);
                                });
                                break;
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.getActivesWithOperator = function (facet) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = {};
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    xs[cs[i]["op"]] = v;
                                });
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.getActivesWithValue = function (facet) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = {};
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    xs[facet] = v;
                                });
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.ensurePath = function (filters) {
                        return filters.content ? filters : { op: "and", content: [] };
                    };
                    FacetService.prototype.addTerm = function (facet, term, op) {
                        if (op === void 0) { op = 'in'; }
                        var filters = this.ensurePath(this.LocationService.filters());
                        // TODO - not like this
                        var found = false;
                        var cs = filters.content;
                        for (var i = 0; i < cs.length; i++) {
                            var c = cs[i].content;
                            if (c.field === facet && cs[i].op === op) {
                                found = true;
                                if (c.value.indexOf(term) === -1) {
                                    c.value.push(term);
                                }
                                else {
                                    return;
                                }
                                break;
                            }
                        }
                        if (!found) {
                            cs.push({
                                op: op,
                                content: {
                                    field: facet,
                                    value: [term]
                                }
                            });
                        }
                        this.LocationService.setFilters(filters);
                    };
                    FacetService.prototype.removeTerm = function (facet, term, op) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var cs = filters["content"];
                        for (var i = 0; i < cs.length; i++) {
                            var c = cs[i]["content"];
                            if (c["field"] === facet && (!op || cs[i]["op"] === op)) {
                                if (!term) {
                                    cs.splice(i, 1);
                                }
                                else {
                                    var vs = c["value"];
                                    vs.splice(vs.indexOf(term), 1);
                                    if (vs.length === 0) {
                                        cs.splice(i, 1);
                                    }
                                }
                                if (cs.length === 0) {
                                    filters = null;
                                }
                                break;
                            }
                        }
                        if (_.get(filters, "content", []).length === 0) {
                            this.LocationService.clear();
                        }
                        else {
                            this.LocationService.setFilters(filters);
                        }
                    };
                    FacetService.prototype.filterFacets = function (facets) {
                        return _.filter(facets || [], function (f) { return _.includes(['terms', 'range'], f.facetType); })
                            .map(function (f) { return f.name; });
                    };
                    return FacetService;
                }());
                var CustomFacetsService = (function () {
                    /* @ngInject */
                    CustomFacetsService.$inject = ["Restangular", "SearchTableFilesModel", "SearchCasesTableService", "FilesService", "ParticipantsService", "LocationService", "FacetsConfigService"];
                    function CustomFacetsService(Restangular, SearchTableFilesModel, SearchCasesTableService, FilesService, ParticipantsService, LocationService, FacetsConfigService) {
                        this.Restangular = Restangular;
                        this.SearchTableFilesModel = SearchTableFilesModel;
                        this.SearchCasesTableService = SearchCasesTableService;
                        this.FilesService = FilesService;
                        this.ParticipantsService = ParticipantsService;
                        this.LocationService = LocationService;
                        this.FacetsConfigService = FacetsConfigService;
                        this.nonEmptyOnlyDisplayed = false;
                        this.ds = Restangular.all("gql/_mapping");
                    }
                    // getFacetFields and getNonEmptyFacetFields do not call this to keep the facet fields sent the same in
                    // subsequent calls so Restangular/browser uses the cached version. Call this in the controller.
                    CustomFacetsService.prototype.filterFields = function (docType, data) {
                        var _this = this;
                        var current = _.pluck(this.FacetsConfigService.fieldsMap[docType], "name");
                        return _.map(_.filter(data, function (datum) {
                            return datum.doc_type === docType &&
                                datum.field !== 'archive.revision' &&
                                !_.includes(current, datum.field) &&
                                !_.includes(docType === 'files'
                                    ? _.pluck(_this.SearchTableFilesModel.facets, "name")
                                    : _.pluck(_this.SearchCasesTableService.model().facets, "name"), datum.field);
                        }), function (f) { return f; });
                    };
                    CustomFacetsService.prototype.getFacetFields = function (docType) {
                        return this.ds.getList().then(function (data) { return data; });
                    };
                    CustomFacetsService.prototype.getNonEmptyFacetFields = function (docType, fields) {
                        var facets = fields.reduce(function (acc, f) {
                            if (f.doc_type === docType) {
                                acc.push(f.field);
                            }
                            return acc;
                        }, []);
                        var options = { facets: facets,
                            filters: this.LocationService.filters(),
                            size: 0
                        };
                        var getNonEmpty = function (data) {
                            return _.reduce(data.aggregations, function (acc, agg, key) {
                                var field = _.find(fields, function (f) { return f.field === key; });
                                var filteredBuckets = _.reject(agg.buckets || [], function (b) { return b.key === '_missing'; });
                                if (filteredBuckets.length !== 0) {
                                    acc = acc.concat(field);
                                }
                                if (agg.max) {
                                    acc = acc.concat(field);
                                }
                                return acc;
                            }, []);
                        };
                        if (docType === 'files') {
                            return this.FilesService.getFiles(options).then(function (data) { return getNonEmpty(data); });
                        }
                        else if (docType === 'cases') {
                            return this.ParticipantsService.getParticipants(options).then(function (data) { return getNonEmpty(data); });
                        }
                    };
                    return CustomFacetsService;
                }());
                var FacetsConfigService = (function () {
                    /* @ngInject */
                    FacetsConfigService.$inject = ["$window", "LocalStorageService"];
                    function FacetsConfigService($window, LocalStorageService) {
                        this.$window = $window;
                        this.LocalStorageService = LocalStorageService;
                        this.fieldsMap = {};
                        this.defaultFieldsMap = {};
                        this.FACET_CONFIG_KEY = "gdc-facet-config";
                    }
                    FacetsConfigService.prototype.setFields = function (docType, fields) {
                        var saved = _.get(this.LocalStorageService.getItem(this.FACET_CONFIG_KEY), docType, null);
                        if (!saved) {
                            this.fieldsMap[docType] = fields;
                            this.save();
                        }
                        else {
                            this.fieldsMap[docType] = saved;
                        }
                        this.defaultFieldsMap[docType] = _.clone(fields, true);
                    };
                    FacetsConfigService.prototype.addField = function (docType, fieldName, fieldType) {
                        var facetType = 'terms';
                        if (_.includes(fieldName, 'datetime')) {
                            facetType = 'datetime';
                        }
                        else if (_.some(['_id', '_uuid', 'md5sum', 'file_name'], function (a) { return _.includes(fieldName, a); })) {
                            facetType = 'id';
                        }
                        else if (fieldType === 'long') {
                            facetType = 'range';
                        }
                        this.fieldsMap[docType].unshift({
                            name: fieldName,
                            title: fieldName,
                            collapsed: false,
                            facetType: facetType,
                            removable: true
                        });
                        this.save();
                    };
                    FacetsConfigService.prototype.removeField = function (docType, fieldName) {
                        this.fieldsMap[docType] = _.reject(this.fieldsMap[docType], function (facet) {
                            return facet.name === fieldName;
                        });
                        this.save();
                    };
                    FacetsConfigService.prototype.reset = function (docType) {
                        this.fieldsMap[docType] = _.clone(this.defaultFieldsMap[docType], true);
                        this.save();
                    };
                    FacetsConfigService.prototype.isDefault = function (docType) {
                        return this.fieldsMap[docType].length === this.defaultFieldsMap[docType].length;
                    };
                    FacetsConfigService.prototype.save = function () {
                        this.LocalStorageService.setItem(this.FACET_CONFIG_KEY, this.fieldsMap);
                    };
                    return FacetsConfigService;
                }());
                angular.
                    module("facets.services", ["location.services", "restangular", "user.services", "ngApp.core"])
                    .service("CustomFacetsService", CustomFacetsService)
                    .service("FacetsConfigService", FacetsConfigService)
                    .service("FacetService", FacetService);
            })(services = facets_1.services || (facets_1.services = {}));
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var githut;
        (function (githut) {
            var controllers;
            (function (controllers) {
                var GitHutController = (function () {
                    /* @ngInject */
                    GitHutController.$inject = ["$scope", "$window", "$filter"];
                    function GitHutController($scope, $window, $filter) {
                        var _this = this;
                        this.$scope = $scope;
                        this.$window = $window;
                        this.$filter = $filter;
                        this.draw();
                        $scope.$watch("data", function () {
                            _this.draw();
                        });
                    }
                    GitHutController.prototype.draw = function () {
                        var _this = this;
                        var data = this.$scope.data, options = this.$scope.config;
                        var LHR = this.$window.$(options.container);
                        LHR.addClass(options.containerClass);
                        LHR.empty();
                        var WIDTH = LHR.width(), HEIGHT = 80 + data.length * 15;
                        var margins = {
                            left: 0,
                            right: 30,
                            top: 40,
                            bottom: 30
                        };
                        var padding = {
                            left: 100,
                            right: 115,
                            top: 20,
                            bottom: 0
                        };
                        var self = this;
                        var scale_type = options.scale || "linear";
                        var nested_data = d3.nest()
                            .key(function (d) {
                            return d.project_id;
                        })
                            .rollup(function (leaves) {
                            var r = {};
                            options.columns.forEach(function (col) {
                                r[col] = d3.sum(leaves, function (o) {
                                    return o[col];
                                });
                                r.project_id = leaves[0]["project_id"];
                                r.file_count = leaves[0]["file_count"];
                                r.case_count = leaves[0]["case_count"];
                                r.primary_site = leaves[0]["primary_site"];
                                r.file_size = leaves[0]["file_size"];
                                r.name = leaves[0]["name"];
                            });
                            return r;
                        })
                            .entries(data)
                            .filter(function (d) {
                            return d.key !== "null";
                        })
                            .sort(function (a, b) {
                            return d3.descending(a.values["file_count"], b.values["file_count"]);
                        })
                            .slice(0, 100);
                        var marker_max_width = (WIDTH - d3.sum([
                            margins.left,
                            margins.right,
                            padding.left,
                            padding.right
                        ])) / options.columns.length;
                        var marker_width = [2, marker_max_width];
                        var svg = d3.select(options.container)
                            .append("svg")
                            .attr("width", WIDTH)
                            .attr("height", HEIGHT);
                        var defs = svg.append("defs")
                            .append("pattern")
                            .attr({
                            id: "diagonalHatch",
                            width: 3,
                            height: 3,
                            patternTransform: "rotate(-45 0 0)",
                            patternUnits: "userSpaceOnUse"
                        });
                        defs.append("rect")
                            .attr({
                            x: 0,
                            y: 0,
                            width: 3,
                            height: 3
                        })
                            .style({
                            stroke: "none",
                            fill: "#fff"
                        });
                        defs.append("line")
                            .attr({
                            x0: 0,
                            y1: 0,
                            x2: 0,
                            y2: 3
                        })
                            .style({
                            stroke: "#A06535",
                            "stroke-opacity": 1,
                            "stroke-width": 1
                        });
                        var xscale = d3.scale.ordinal()
                            .domain(options.columns)
                            .rangePoints([
                            0,
                            WIDTH - (margins.left + margins.right + padding.left + padding.right)
                        ]);
                        var yscales = {}, width_scales = {}, extents = {}, yAxes = {};
                        var languages_group = svg.append("g")
                            .attr("id", "languages")
                            .attr("transform", "translate(" + (margins.left + padding.left) + "," +
                            (margins.top + padding.top) + ")");
                        var labels_group = svg.append("g")
                            .attr("id", "labels")
                            .attr("transform", "translate(" + (margins.left + padding.left) + "," +
                            (margins.top + padding.top) + ")");
                        var columns = svg.append("g")
                            .attr("id", "columns")
                            .attr("transform", "translate(" + (margins.left + padding.left) + "," +
                            (margins.top + padding.top) + ")");
                        var labels = labels_group.selectAll("g.labels")
                            .data(nested_data, function (d) {
                            return d.key;
                        })
                            .enter()
                            .append("g")
                            .attr("class", "labels")
                            .attr("rel", function (d) {
                            return d.key;
                        })
                            .on("mouseover", function (d) {
                            d3.select(this)
                                .classed("hover", true);
                            languages_group
                                .selectAll("g.lang[rel='" + d.key + "']")
                                .classed("hover", true);
                        })
                            .on("mouseout", function (d) {
                            svg.selectAll("g.hover,g.primary_site")
                                .classed("hover", false)
                                .classed("primary_site", false);
                        });
                        var language = languages_group.selectAll("g.lang")
                            .data(nested_data, function (d) {
                            return d.key;
                        })
                            .enter()
                            .append("g")
                            .attr("class", "lang")
                            .attr("rel", function (d) {
                            return d.key;
                        });
                        var line = d3.svg.line()
                            .x(function (d, i) { return d.x; })
                            .y(function (d, i) {
                            if (d.y === 0) {
                                return yscales[options.use[d.col] || d.col].range()[0];
                            }
                            else {
                                return yscales[options.use[d.col] || d.col](d.y);
                            }
                        });
                        var drawn_primary_sites = [];
                        this.$window.$(this.$window).off("resize");
                        this.$window.$(this.$window).on("resize", _.debounce(function () {
                            _this.draw();
                        }, 150));
                        function updateScales() {
                            // what in the seven kingdoms does this do?
                            extents = (function () {
                                var extents = {};
                                options.columns.forEach(function (d, i) {
                                    extents[d] = d3.extent(nested_data, function (o) {
                                        return o.values[d];
                                        // the following code block is unreachable
                                        if (options.dimensions.indexOf(d) > -1) {
                                            return o.values[d];
                                        }
                                        else {
                                            return o.values[d] / o.values[options.ref];
                                        }
                                    });
                                });
                                return extents;
                            }());
                            var scales = {}, wscales = {};
                            options.columns.forEach(function (d) {
                                var use = options.use[d] || d;
                                var sorter = options.sorter[d] || d;
                                if (options.scale_map[d] === "ordinal") {
                                    var inc = 0.001;
                                    var domain = nested_data
                                        .filter(function () { return true; })
                                        .sort(function (a, b) {
                                        var sorting = options.sorting[use] || d3.ascending;
                                        var __a = (a.values[sorter]), __b = (b.values[sorter]);
                                        if (options.dimensions.indexOf(d) === -1) {
                                            __a = (a.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : a.values[options.ref]));
                                            __b = (b.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : b.values[options.ref]));
                                        }
                                        return sorting(__a, __b);
                                    })
                                        .map(function (o) {
                                        if (options.dimensions.indexOf(use) > -1) {
                                            return o.values[use];
                                        }
                                        else {
                                            return o.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : o.values[options.ref]);
                                        }
                                    });
                                    scales[d] = d3.scale.ordinal()
                                        .domain(domain)
                                        .rangePoints([HEIGHT - (margins.top + margins.bottom + padding.top + padding.bottom), 0]);
                                }
                                else if (options.scale_map[d] == "linear") {
                                    if (extents[d][0] === 0) {
                                        extents[d][0] = 0.01;
                                    }
                                    var primary_sites = _.map(data, function (item) {
                                        return item.primary_site;
                                    });
                                    var type = options.scale_map[d] ? options.scale_map[d] : scale_type;
                                    var yRange = HEIGHT - (margins.top + margins.bottom + padding.top + padding.bottom);
                                    var sites = primary_sites.sort(options.sorting[use] || d3.ascending);
                                    var indices = primary_sites.map(function (d, i) { return i * 50; });
                                    var indices = primary_sites.map(function (d, i) { return i * yRange / (indices ? indices.length : 1); });
                                    scales[d] = d3.scale.ordinal().domain(sites).range(indices);
                                }
                                wscales[d] = d3.scale.linear().domain([0, extents[d][1]]).range(marker_width).nice();
                            });
                            yscales = scales;
                            width_scales = wscales;
                        }
                        var $filter = this.$filter;
                        function addAxes() {
                            var column = columns.selectAll("g.column")
                                .data(options.config)
                                .enter()
                                .append("g")
                                .attr("class", "column")
                                .attr("transform", function (d) {
                                var x = xscale(d.id);
                                return "translate(" + x + "," + 0 + ")";
                            });
                            var title = column.append("text")
                                .attr("class", "title")
                                .attr("x", 0)
                                .attr("y", 0);
                            var tip = d3.tip()
                                .attr("class", "tooltip")
                                .offset([-5, 0])
                                .html(function (d) {
                                return $filter("humanify")(d.tool_tip_text || d.id);
                            });
                            title.filter(function (d) { return d.is_subtype; })
                                .call(tip)
                                .on('mouseover', tip.show)
                                .on('mouseout', tip.hide);
                            title.filter(function (d) {
                                return d.id === options.title_column;
                            })
                                .classed("first", true)
                                .attr("transform", "translate(-10,0)");
                            title.selectAll("tspan")
                                .data(function (d) {
                                return d.display_name;
                            })
                                .enter()
                                .append("tspan")
                                .attr("x", 0)
                                .attr("y", function (d, i) {
                                // Magic numbers
                                return i * 15 + (-5 - padding.top);
                            })
                                .text(function (d) {
                                return d;
                            });
                            if (options.superhead) {
                                svg.append("g")
                                    .attr("height", 100)
                                    .attr("transform", function (d) {
                                    var x = xscale(options.superhead.start) +
                                        (0.5 * (xscale(options.superhead.end) - xscale(options.superhead.start))) +
                                        padding.left + margins.left, y = 10;
                                    return "translate(" + x + "," + y + ")";
                                })
                                    .append("text")
                                    .text(options.superhead.text)
                                    .style("text-anchor", "middle")
                                    .attr("class", "title");
                                svg.append("rect")
                                    .attr("width", function () {
                                    var width = xscale(options.superhead.end) - xscale(options.superhead.start);
                                    // no neg widths
                                    return Math.max(0, width);
                                })
                                    .attr("height", 1)
                                    .attr("y", 15)
                                    .attr("x", xscale(options.superhead.start) + padding.left + margins.left);
                            }
                            var axis = column
                                .filter(function (col) {
                                return options.scale_map[col] == "ordinal" && col != options.title_column;
                            })
                                .append("g")
                                .attr("class", "axis")
                                .attr("transform", function (d) {
                                var x = 0, y = HEIGHT - (margins.bottom + margins.top + padding.bottom + 5);
                                return "translate(" + x + "," + y + ")";
                            });
                            axis.append("line")
                                .attr("x1", function (d) {
                                return -(width_scales[d].range()[1] / 2);
                            })
                                .attr("y1", 0)
                                .attr("x2", function (d) {
                                return width_scales[d].range()[1] / 2;
                            })
                                .attr("y2", 0);
                            var ticks = axis
                                .selectAll("g.tick")
                                .data(function (d) {
                                var ticks = [
                                    width_scales[d].domain()[1]
                                ].map(function (v, i) {
                                    return {
                                        value: v,
                                        x: (i === 0 ? 0 : width_scales[d](v) / 2),
                                        domain: width_scales[d].domain(),
                                        range: width_scales[d].range()
                                    };
                                });
                                return ticks;
                            })
                                .enter()
                                .append("g")
                                .attr("class", "tick")
                                .classed("start", function (d) {
                                return d.x < 0;
                            })
                                .classed("end", function (d) {
                                return d.x > 0;
                            })
                                .attr("transform", function (d) {
                                return "translate(" + d.x + ",0)";
                            });
                            // Magic Numbers
                            ticks.append("line")
                                .attr("x1", 0)
                                .attr("y1", -3)
                                .attr("x2", 0)
                                .attr("y2", 3);
                            ticks.append("text")
                                .attr("x", 0)
                                .attr("y", 12)
                                .text(function (d) {
                                return d3.format("s")(d.value);
                            });
                        }
                        function updateAxes() {
                            columns.selectAll("g.axis")
                                .selectAll("g.tick")
                                .data(function (d) {
                                var ticks = [0, width_scales[d].domain()[1]]
                                    .map(function (v, i) {
                                    return {
                                        value: i === 0 ? 0 : v,
                                        x: (i === 0 ? 0 : width_scales[d](v) / 2),
                                        domain: width_scales[d].domain(),
                                        range: width_scales[d].range()
                                    };
                                });
                                return ticks.concat(ticks.map(function (d) {
                                    return {
                                        value: d.value,
                                        x: -d.x
                                    };
                                }));
                            })
                                .select("text")
                                .text(function (d) {
                                return d3.format("s")(d.value);
                            });
                        }
                        function createLanguages(languages) {
                            languages.append("g")
                                .attr("class", "connections");
                            languages.append("g")
                                .attr("class", "markers");
                            languages.append("g")
                                .attr("class", "lang-label")
                                .call(createLangLabel);
                        }
                        function updateMarkers(duration) {
                            var marker = languages_group
                                .selectAll(".lang").select("g.markers")
                                .selectAll("g.marker")
                                .data(function (d) {
                                return options.columns.filter(function (col) {
                                    return col != options.title_column;
                                }).map(function (col) {
                                    return {
                                        lang: d.key,
                                        column: col,
                                        value: d.values[col],
                                        ref: d.values[options.ref],
                                        href: options.urlMap ? options.urlMap[col] : undefined
                                    };
                                });
                            }, function (d) {
                                return d.lang + "_" + d.column;
                            });
                            marker.exit().remove();
                            var new_markers = marker.enter()
                                .append("g")
                                .attr("class", "marker")
                                .classed("ordinal", function (d) {
                                return options.scale_map[d.column] == "ordinal";
                            })
                                .attr("transform", function (d) {
                                var x = xscale(d.column), y = yscales[d.column](d.value);
                                return "translate(" + x + "," + y + ")";
                            });
                            new_markers
                                .filter(function (d) {
                                return options.scale_map[d.column] == "ordinal";
                            })
                                .append("rect")
                                .attr("x", function (d) {
                                return 0;
                            })
                                .attr("y", -4)
                                .attr("width", 0)
                                .attr("height", 8)
                                .style("fill", function (d) {
                                return options.color_groups[options.color_group_map[d.column]];
                            });
                            marker
                                .transition()
                                .duration(duration || options.duration)
                                .attr("transform", function (d) {
                                var x = xscale(d.column), y = yscales[d.column](d.value / d.ref);
                                if (d[d.column] === 0) {
                                    y = yscales[d.column].range()[0];
                                }
                                if (options.dimensions.indexOf(d.column) > -1) {
                                    y = yscales[d.column](d.value);
                                }
                                return "translate(" + x + "," + y + ")";
                            });
                            marker
                                .select("rect")
                                .transition()
                                .duration(options.duration)
                                .attr("x", function (d) {
                                var value = d.value / ((options.dimensions.indexOf(d.column) > -1) ? 1 : d.ref || 1);
                                var x = -width_scales[d.column](value) / 2;
                                return isNaN(x) ? 0 : x;
                            })
                                .attr("width", function (d) {
                                var width = width_scales[d.column](d.value /
                                    ((options.dimensions.indexOf(d.column) > -1) ? 1 : d.ref || 1));
                                // no neg widths
                                return isNaN(width) ? 0 : Math.max(0, width);
                            });
                        }
                        function updateConnections(duration) {
                            var connection = languages_group.selectAll(".lang")
                                .select("g.connections")
                                .selectAll("g.connection")
                                .data(function (d) {
                                var flattened = options.columns.map(function (col, i) {
                                    var use = options.use[col] || col;
                                    var val = {
                                        x: xscale(col),
                                        col: col
                                    };
                                    var val2 = {
                                        x: xscale(col),
                                        col: col
                                    };
                                    var delta = 5;
                                    if (options.dimensions.indexOf(col) > -1) {
                                        var y = d.values[use];
                                        if (typeof y == "number") {
                                            val.x -= (i == 0 ? 0 : (width_scales[use](y)) / 2 + delta);
                                            val2.x += ((i == options.columns.length - 1) ? 0 : (width_scales[use](y)) / 2 + delta);
                                        }
                                        else {
                                            val.x -= delta;
                                            val2.x += delta;
                                        }
                                        val.y = d.values[use];
                                        val2.y = d.values[use];
                                        return [val, val2];
                                    }
                                    else {
                                        var y = d.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : d.values[options.ref]);
                                        val.y = y;
                                        val2.y = y;
                                        val.x -= (i == 0 ? 0 : (width_scales[use](y)) / 2 + delta);
                                        val2.x += ((i == options.columns.length - 1) ? 0 : (width_scales[use](y)) / 2 + delta);
                                        return [val, val2];
                                    }
                                })
                                    .reduce(function (a, b) {
                                    return a.concat(b);
                                });
                                return [{
                                        lang: d.key,
                                        path: flattened
                                    }];
                            }, function (d) {
                                return d.lang;
                            });
                            connection.exit().remove();
                            var new_connection = connection.enter()
                                .append("g")
                                .attr("class", "connection");
                            new_connection
                                .append("path")
                                .attr("class", "hover");
                            new_connection
                                .append("path")
                                .attr("class", "line");
                            var paths = ["line", "hover"];
                            paths.forEach(function (p) {
                                connection.select("path." + p)
                                    .transition()
                                    .duration(duration || options.duration)
                                    .attr("d", function (d) {
                                    return line(d.path);
                                });
                            });
                        }
                        function updateLabels(duration) {
                            var labelAdjust = 25;
                            var labels = labels_group
                                .selectAll(".labels")
                                .selectAll("g.label")
                                .data(function (d) {
                                return options.columns.map(function (col) {
                                    var use = options.use[col] || col;
                                    return {
                                        lang: d.key,
                                        column: col,
                                        value: d.values[use],
                                        ref: d.values[options.ref],
                                        text_width: 0,
                                        marker_width: 0,
                                        href: options.urlMap ? options.urlMap[col] : undefined
                                    };
                                });
                            });
                            var new_label = labels.enter()
                                .append("g")
                                .attr("class", "label")
                                .classed("primary_site", function (d) {
                                return d.column === "primary_site";
                            });
                            new_label
                                .filter(function (d) {
                                return d.column !== "primary_site" && d.column !== options.title_column;
                            })
                                .append("path");
                            new_label
                                .filter(function (d) {
                                return d.column !== "primary_site" && d.column !== options.title_column;
                            })
                                .append("text")
                                .attr("x", 0)
                                .attr("y", 4);
                            new_label
                                .filter(function (d) {
                                return d.column === "primary_site";
                            })
                                .append("text")
                                .attr("x", -10)
                                .attr("y", 3)
                                .attr("class", "visible-always");
                            new_label.append("rect")
                                .attr("class", "ix")
                                .attr("y", -8)
                                .attr("height", 15)
                                .on("click", function (z, i, m) {
                                if (z.href && z.value) {
                                    z.href(z);
                                }
                            });
                            labels
                                .selectAll("path.label")
                                .attr("d", "M0,0L0,0");
                            labels
                                .selectAll("rect.ix")
                                .attr("width", 0)
                                .attr("x", 0);
                            labels
                                .select("text")
                                .attr("x", function (d) {
                                if (d.column === "primary_site") {
                                    return -10;
                                }
                                else {
                                    return 0;
                                }
                            })
                                .attr("transform", "translate(" + labelAdjust + ",0)")
                                .style("text-anchor", function (d) {
                                if (d.column === "primary_site") {
                                    return "start";
                                }
                                else {
                                    return "middle";
                                }
                            })
                                .text(function (d) {
                                function id(a) {
                                    return a;
                                }
                                options.filters = options.filters || {};
                                var filter = options.filters[d.column] || undefined;
                                if (d.column === "primary_site" && _.contains(drawn_primary_sites, d.value)) {
                                    return "";
                                }
                                if (d.column === "primary_site") {
                                    drawn_primary_sites.push(d.value);
                                }
                                if (_.isNumber(d.value)) {
                                    var commify = d3.format(",");
                                    if (filter) {
                                        return filter(parseInt(d.value));
                                    }
                                    else {
                                        return commify(d.value);
                                    }
                                }
                                else {
                                    var t = d.value || "";
                                    if (t.length > 18) {
                                        t = t.slice(0, 15).concat("...");
                                    }
                                    filter = filter || id;
                                    return filter(t);
                                }
                                // the following code block is unreachable
                                if (d.column === "primary_site") {
                                    return d.value;
                                }
                                else if (d.column === "Simple nucleotide variation") {
                                    return d.value;
                                }
                                else if (options.formats[d.column]) {
                                    return d3.format(options.formats[d.column])(d.value);
                                }
                                else if (options.dimensions.indexOf(d.column) > -1) {
                                    return d3.format(d.value > 100 ? ",.0f" : ",.2f")(d.value);
                                }
                                else {
                                    var y = d.valuefd.ref;
                                    return d3.format(y > 100 ? ",.0f" : ",.2f")(y);
                                }
                            })
                                .each(function (d) {
                                if (d.column === "primary_site") {
                                    d.marker_width = 10;
                                }
                                else {
                                    d.marker_width = width_scales[d.column](d.value /
                                        ((options.dimensions.indexOf(d.column) > -1) ? 1 : d.ref));
                                }
                                d.text_width = this.getBBox().width;
                            });
                            labels
                                .select("path")
                                .attr("class", "label")
                                .attr("d", function (d) {
                                var dw = 10, w = d.text_width + dw;
                                return "M" + (w / 2 + dw / 2) + ",0l-" + dw / 2 + ",-10l-" + w + ",0l0,20l" + w + ",0z";
                            })
                                .attr("x", 50)
                                .attr("transform", "translate(" + labelAdjust + ",0)");
                            labels
                                .select("rect.ix")
                                .attr("x", function (d) {
                                if (d.column == options.title_column) {
                                    return -(padding.left + margins.left);
                                }
                                if (d.column == "primary_site") {
                                    return -40;
                                }
                                else {
                                    return d.text_width / 2;
                                }
                            })
                                .attr("width", function (d) {
                                if (d.column === options.title_column) {
                                    return (padding.left + margins.left);
                                }
                                else {
                                    return isNaN(d.marker_width) ? 20 : d.marker_width + 20;
                                }
                            });
                            labels
                                .attr("transform", function (d) {
                                var x = xscale(d.column), y = yscales[d.column](d.value);
                                if (d.column === "primary_site") {
                                    return "translate(" + (x + 20) + "," + y + ")";
                                }
                                if (d[d.column] === 0) {
                                    y = yscales[d.column].range()[0];
                                }
                                if (options.dimensions.indexOf(d.column) === -1) {
                                    y = yscales[d.column](d.value / d.ref);
                                }
                                return "translate(" + (x - (isNaN(d.marker_width) ? 20 : d.marker_width) / 2 - d.text_width / 2 - 10) + "," + y + ")";
                            });
                            labels
                                .filter(function (d) {
                                return d.column === "primary_site";
                            })
                                .on("mouseover", function (d) {
                                labels_group
                                    .selectAll(".labels")
                                    .classed("hover", function (l) {
                                    return l.values.primary_site == d.value;
                                });
                                languages_group
                                    .selectAll(".lang")
                                    .classed("hover", function (l) {
                                    return l.values.primary_site == d.value;
                                });
                            });
                            var projectTip = d3.tip()
                                .attr("class", "tooltip")
                                .offset([-5, 0])
                                .html(function (d) {
                                return _.find(nested_data, { key: d.lang }).values.name;
                            });
                            labels.filter(function (d) {
                                return d.column === "project_id";
                            })
                                .call(projectTip)
                                .on("mouseover", projectTip.show)
                                .on("click", projectTip.hide)
                                .on("mouseout", projectTip.hide);
                            // Mouseover trigger for highlighting all paths that cross through
                            // a label that isn't primary site or project id
                            labels
                                .filter(function (d) {
                                return d.column !== "primary_site" && d.column !== "project_id";
                            })
                                .on("mouseover", function (d) {
                                labels_group
                                    .selectAll(".labels")
                                    .classed("hover", function (l) {
                                    var ret = l.values[d.column] === d.value;
                                    // Don't forget to ensure the connecting lines themselves
                                    // are highlighted
                                    if (ret) {
                                        languages_group
                                            .selectAll("g.lang[rel='" + l.key + "']")
                                            .classed("hover", true);
                                    }
                                    return ret;
                                });
                            });
                        }
                        function createLangLabel(lang_label) {
                            lang_label
                                .attr("transform", function (d) {
                                var x = xscale(options.title_column), y = yscales[options.title_column].range()[0];
                                return "translate(" + x + "," + y + ")";
                            });
                            var rect = lang_label.append("rect")
                                .attr("x", -(padding.left + margins.left))
                                .attr("width", padding.left + margins.left)
                                .attr("y", -9)
                                .attr("height", 16);
                            lang_label.append("text")
                                .attr("x", -10)
                                .attr("y", 3)
                                .text(function (d) {
                                return d.values[options.title_column];
                            });
                        }
                        function updateLangLabels(duration) {
                            languages_group.selectAll(".lang")
                                .select("g.lang-label")
                                .transition()
                                .duration(duration || options.duration)
                                .attr("transform", function (d) {
                                var use = options.use[options.title_column] || options.title_column;
                                var x = xscale(options.title_column), y = yscales[options.title_column](d.values[use]);
                                y = yscales[use](d.values[use]);
                                return "translate(" + x + "," + y + ")";
                            });
                        }
                        updateScales();
                        addAxes();
                        createLanguages(language);
                        updateConnections(-1);
                        updateMarkers(-1);
                        updateLabels(-1);
                        updateLangLabels(-1);
                    };
                    return GitHutController;
                }());
                angular
                    .module("githut.controllers", [])
                    .controller("GitHutController", GitHutController);
            })(controllers = githut.controllers || (githut.controllers = {}));
        })(githut = components.githut || (components.githut = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var gql;
        (function (gql) {
            var filters;
            (function (filters) {
                var GqlHighlight = (function () {
                    function GqlHighlight() {
                        return function (value, query) {
                            return (value || '').replace(query, '<strong>' + query + '</strong>');
                        };
                    }
                    return GqlHighlight;
                }());
                angular.module("gql.filters", [])
                    .filter("gqlHighlight", GqlHighlight);
            })(filters = gql.filters || (gql.filters = {}));
        })(gql = components.gql || (components.gql = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var header;
        (function (header) {
            var controllers;
            (function (controllers) {
                var HeaderController = (function () {
                    /* @ngInject */
                    HeaderController.$inject = ["gettextCatalog", "CartService", "$state", "UserService", "$uibModal", "$window", "$rootScope", "$uibModalStack", "Restangular"];
                    function HeaderController(gettextCatalog, CartService, $state, UserService, $uibModal, $window, $rootScope, $uibModalStack, Restangular) {
                        this.gettextCatalog = gettextCatalog;
                        this.CartService = CartService;
                        this.$state = $state;
                        this.UserService = UserService;
                        this.$uibModal = $uibModal;
                        this.$window = $window;
                        this.$rootScope = $rootScope;
                        this.$uibModalStack = $uibModalStack;
                        this.Restangular = Restangular;
                        this.isCollapsed = true;
                        this.currentLang = "en";
                        this.addedLanguages = false;
                        this.languages = {
                            "en": "English",
                            "fr": "French",
                            "es": "Spanish"
                        };
                        this.notifications = [];
                        this.addedLanguages = !!_.keys(gettextCatalog.strings).length;
                        this.cookieEnabled = navigator.cookieEnabled;
                        this.bannerDismissed = false;
                    }
                    HeaderController.prototype.getToken = function () {
                        this.UserService.getToken();
                    };
                    HeaderController.prototype.collapse = function (event) {
                        if (event.which === 1 || event.which === 13) {
                            this.isCollapsed = true;
                        }
                    };
                    HeaderController.prototype.toggleCollapsed = function () {
                        this.isCollapsed = !this.isCollapsed;
                    };
                    HeaderController.prototype.setLanguage = function () {
                        this.gettextCatalog.setCurrentLanguage(this.currentLang);
                    };
                    HeaderController.prototype.shouldShowOption = function (option) {
                        var showOption = true, currentState = _.get(this.$state, 'current.name', '').toLowerCase();
                        switch (option.toLowerCase()) {
                            case 'quick-search':
                                if (currentState === 'home') {
                                    showOption = false;
                                }
                                break;
                            default:
                                break;
                        }
                        return showOption;
                    };
                    HeaderController.prototype.dismissBanner = function () {
                        this.bannerDismissed = true;
                        this.$rootScope.$emit('hideBanner');
                    };
                    HeaderController.prototype.showBannerModal = function () {
                        if (!this.$uibModalStack.getTop()) {
                            this.$uibModal.open({
                                templateUrl: "core/templates/modal.html",
                                controller: "WarningController",
                                controllerAs: "wc",
                                backdrop: "static",
                                keyboard: false,
                                backdropClass: "warning-backdrop",
                                animation: false,
                                size: "lg",
                                windowClass: "banner-modal",
                                resolve: {
                                    warning: function () { return "\n              <div>\n                <h2 class=\"banner-title\">\n                  Can't find your data?\n                  <span class=\"banner-title-link\">\n                    You may be looking for the\n                    <a href=\"https://gdc-portal.nci.nih.gov/legacy-archive/search/f\" target=\"_blank\">GDC Legacy Archive</a>.\n                  </span>\n                </h2>\n                <div>\n                  Data in the GDC Data Portal\n                  has been harmonized using GDC Bioinformatics Pipelines whereas data in the\n                  GDC Legacy Archive is an unmodified copy of data that was previously stored\n                  in CGHub and in the TCGA Data Portal hosted by the TCGA Data Coordinating Center (DCC).\n                  Certain previously available data types and formats are not currently supported by\n                  the GDC Data Portal and are only distributed via the GDC Legacy Archive.\n                  <br>\n                  <br>\n                  Check the <a href=\"https://gdc-docs.nci.nih.gov/Data/Release_Notes/Data_Release_Notes/\" target=\"_blank\">Data Release Notes</a> for additional details.\n                </div>\n              </div>\n            "; },
                                    header: null
                                }
                            });
                        }
                    };
                    return HeaderController;
                }());
                angular
                    .module("header.controller", ["cart.services", "user.services"])
                    .controller("HeaderController", HeaderController);
            })(controllers = header.controllers || (header.controllers = {}));
        })(header = components.header || (components.header = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var header;
        (function (header_1) {
            var directives;
            (function (directives) {
                /* @ngInject */
                header.$inject = ["CartService", "$rootScope"];
                function header(CartService, $rootScope) {
                    return {
                        restrict: "E",
                        templateUrl: "components/header/templates/header.html",
                        controller: "HeaderController as hc",
                        scope: {
                            notifications: '='
                        },
                        link: function ($scope) {
                            $scope.cartSize = CartService.files.length;
                            $rootScope.$on('cart-update', function () {
                                $scope.cartSize = CartService.files.length;
                                $scope.$evalAsync();
                            });
                        }
                    };
                }
                /* @ngInject */
                function banner() {
                    return {
                        restrict: "E",
                        replace: true,
                        templateUrl: "components/header/templates/banner.html",
                        scope: {
                            notificationId: '@',
                            level: '@',
                            message: '@',
                            dismissible: '='
                        },
                        link: function ($scope) {
                            if (angular.isUndefined($scope.dismissible) || $scope.dismissible === null) {
                                $scope.dismissible = true;
                            }
                            $scope.dismissed = false;
                            $scope.dismiss = function () {
                                $scope.dismissed = true;
                                $scope.$emit('hideBanner');
                            };
                        }
                    };
                }
                angular
                    .module("header.directives", ["ngAnimate"])
                    .directive("banner", banner)
                    .directive("ngaHeader", header);
            })(directives = header_1.directives || (header_1.directives = {}));
        })(header = components.header || (components.header = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var location;
        (function (location) {
            var services;
            (function (services) {
                var LocationService = (function () {
                    /* @ngInject */
                    LocationService.$inject = ["$location", "$window"];
                    function LocationService($location, $window) {
                        this.$location = $location;
                        this.$window = $window;
                    }
                    LocationService.prototype.path = function () {
                        return this.$location.path();
                    };
                    LocationService.prototype.search = function () {
                        return this.$location.search();
                    };
                    LocationService.prototype.setSearch = function (search) {
                        var propsWithValues = _.pick(search, function (v) {
                            return !_.isEmpty(v) && v !== "{}";
                        });
                        return this.$location.search(propsWithValues);
                    };
                    LocationService.prototype.clear = function () {
                        return this.$location.search({});
                    };
                    LocationService.prototype.filters = function () {
                        // TODO error handling
                        var f = this.search().filters;
                        return f ? angular.fromJson(f) : {};
                    };
                    LocationService.prototype.setFilters = function (filters) {
                        var search = this.search();
                        if (filters) {
                            search.filters = angular.toJson(filters);
                        }
                        else {
                            delete search.filters;
                        }
                        //move the user back to pg1
                        var paging = this.pagination();
                        if (paging) {
                            _.each(paging, function (page) {
                                page.from = 0;
                            });
                            search['pagination'] = angular.toJson(paging);
                        }
                        return this.setSearch(search);
                    };
                    LocationService.prototype.query = function () {
                        // TODO error handling
                        var q = this.search().query;
                        return q ? q : "";
                    };
                    LocationService.prototype.setQuery = function (query) {
                        var search = this.search();
                        if (query) {
                            search.query = query;
                        }
                        else {
                            delete search.query;
                        }
                        return this.setSearch(search);
                    };
                    LocationService.prototype.pagination = function () {
                        var f = _.get(this.search(), "pagination", "{}");
                        return angular.fromJson(f);
                    };
                    LocationService.prototype.setPaging = function (pagination) {
                        var search = this.search();
                        if (pagination) {
                            search.pagination = angular.toJson(pagination);
                        }
                        else if (_.isEmpty(search.pagination)) {
                            delete search.pagination;
                        }
                        return this.setSearch(search);
                    };
                    LocationService.prototype.setHref = function (href) {
                        this.$window.location.href = href;
                    };
                    LocationService.prototype.getHref = function () {
                        return this.$window.location.href;
                    };
                    LocationService.prototype.filter2query = function (f) {
                        var q = _.map(f.content, function (ftr) {
                            var c = ftr.content;
                            var o = ftr.op;
                            var v = ftr.op === "in" ? angular.toJson(c.value) : c.value;
                            return [c.field, o, v].join(" ");
                        });
                        return q.join(" and ");
                    };
                    return LocationService;
                }());
                angular
                    .module("location.services", [])
                    .service("LocationService", LocationService);
            })(services = location.services || (location.services = {}));
        })(location = components.location || (components.location = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var overrides;
        (function (overrides) {
            var directives;
            (function (directives) {
                /* @ngInject */
                AnchorOverride.$inject = ["CoreService"];
                function AnchorOverride(CoreService) {
                    return {
                        restrict: "E",
                        link: function ($scope, element, attrs) {
                            element.on("keyup", function (event) {
                                if (event.which !== 13) {
                                    return;
                                }
                                if (attrs.href && attrs.href.charAt(0) === "#") {
                                    element[0].blur();
                                    document.querySelector(attrs.href).focus();
                                }
                            });
                        }
                    };
                }
                angular.module("overrides.directives", [])
                    .directive("a", AnchorOverride);
            })(directives = overrides.directives || (overrides.directives = {}));
        })(overrides = components.overrides || (components.overrides = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var string;
            (function (string) {
                var Highlight = (function () {
                    Highlight.$inject = ["$rootScope"];
                    function Highlight($rootScope) {
                        return function (value, query) {
                            if (query === void 0) { query = ""; }
                            if (!value) {
                                return "";
                            }
                            var regex = new RegExp("[" + query.replace(/\-/g, "\\-") + "]{" + query.length + "}", "i");
                            if (!_.isArray(value)) {
                                value = [value];
                            }
                            var html = "";
                            // Only ever show the top matched term in the arrays returned.
                            var term = value.filter(function (item) {
                                var matchedText = item.match(regex);
                                return matchedText && matchedText[0] &&
                                    matchedText[0].toLowerCase() === query.toLowerCase();
                            }).sort(function (a, b) { return a.match(regex).length - b.match(regex).length; })[0];
                            if (term) {
                                var matchedText = term.match(regex);
                                matchedText = matchedText[0];
                                var boldedQuery = "<span class='bolded'>" + matchedText + "</span>";
                                html = term.replace(regex, boldedQuery);
                            }
                            else {
                                html = value[0]; // if nothing matches, take first value
                            }
                            return html;
                        };
                    }
                    return Highlight;
                }());
                angular
                    .module("quickSearch.filters", [])
                    .filter("highlight", Highlight);
            })(string = ui.string || (ui.string = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var quickSearch;
        (function (quickSearch) {
            angular.module("components.quickSearch", [
                "quickSearch.directives",
                "quickSearch.filters",
            ]);
        })(quickSearch = components.quickSearch || (components.quickSearch = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var quickSearch;
        (function (quickSearch) {
            var directives;
            (function (directives) {
                QuickSearch.$inject = ["$uibModal", "$window", "$uibModalStack"];
                QuickSearchInput.$inject = ["QuickSearchService", "FacetService", "$compile", "$uibModalStack"];
                QuickSearchInputHome.$inject = ["QuickSearchService", "FacetService"];
                var KeyCode = ngApp.components.facets.controllers.KeyCode;
                /* @ngInject */
                function QuickSearch($uibModal, $window, $uibModalStack) {
                    return {
                        restrict: "A",
                        controller: ["$scope", function ($scope) {
                            var modalInstance;
                            $scope.$on("$stateChangeStart", function () {
                                if (modalInstance) {
                                    modalInstance.close();
                                }
                            });
                            this.openModal = function () {
                                // Modal stack is a helper service. Used to figure out if one is currently
                                // open already.
                                if ($uibModalStack.getTop()) {
                                    return;
                                }
                                modalInstance = $uibModal.open({
                                    templateUrl: "components/quick-search/templates/quick-search-modal.html",
                                    backdrop: true,
                                    keyboard: true,
                                    animation: false,
                                    size: "lg",
                                    controller: ["$uibModalInstance", "$scope", function ($uibModalInstance, $scope) {
                                        $scope.close = function () { return $uibModalInstance.close(); };
                                    }]
                                });
                            };
                        }],
                        link: function ($scope, $element, attrs, ctrl) {
                            var openAndBlur = function () {
                                ctrl.openModal();
                                $element.blur();
                            };
                            $element.on('click', openAndBlur);
                            $element.on('keypress', function (e) {
                                if (e.keyCode === KeyCode.Enter) {
                                    openAndBlur();
                                }
                            });
                        }
                    };
                }
                /* @ngInject */
                function QuickSearchDropdown() {
                    return {
                        restrict: "E",
                        templateUrl: "components/quick-search/templates/quick-search-dropdown.html",
                        scope: true
                    };
                }
                function QuickSearchInputBaseLogicFn($scope, element, QuickSearchService, FacetService, $uibModalStack) {
                    $scope.results = [];
                    function setBioSpecimen(result) {
                        if (result._type !== "case") {
                            return;
                        }
                        function findMatch(obj) {
                            for (var key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    if (_.isString(obj[key])) {
                                        if (obj[key].toLowerCase().indexOf($scope.searchQuery.toLowerCase()) === 0) {
                                            result.bioSpecimen = obj;
                                            return;
                                        }
                                    }
                                    else if (_.isArray(obj[key])) {
                                        _.forEach(obj[key], function (item) {
                                            findMatch(item);
                                        });
                                    }
                                }
                            }
                        }
                        _.forEach(result.samples, function (sample) {
                            if (!result.bioSpecimen) {
                                findMatch(sample);
                            }
                        });
                    }
                    $scope.keyboardListener = function (e) {
                        function selectItem(dir) {
                            var newIndex;
                            _.forEach($scope.results.hits, function (elem, index) {
                                if (_.isEqual(elem, $scope.selectedItem)) {
                                    if (dir === "down" && index + 1 < $scope.results.hits.length) {
                                        newIndex = index + 1;
                                    }
                                    else if (dir === "up" && index - 1 >= 0) {
                                        newIndex = index - 1;
                                    }
                                    else {
                                        newIndex = index;
                                    }
                                }
                            });
                            $scope.selectedItem.selected = false;
                            $scope.results.hits[newIndex].selected = true;
                            $scope.selectedItem = $scope.results.hits[newIndex];
                        }
                        var key = e.which || e.keyCode;
                        switch (key) {
                            case KeyCode.Enter:
                                e.preventDefault();
                                if (!$scope.selectedItem) {
                                    return;
                                }
                                QuickSearchService.goTo($scope.selectedItem._type, $scope.selectedItem._id);
                                break;
                            case KeyCode.Up:
                                e.preventDefault();
                                selectItem("up");
                                break;
                            case KeyCode.Down:
                                e.preventDefault();
                                selectItem("down");
                                break;
                            case KeyCode.Esc:
                                if ($uibModalStack) {
                                    $uibModalStack.dismissAll();
                                }
                                $scope.results = [];
                                $scope.searchQuery = '';
                                break;
                            case KeyCode.Tab:
                                e.preventDefault();
                                break;
                        }
                    };
                    $scope.itemHover = function (item) {
                        $scope.selectedItem.selected = false;
                        item.selected = true;
                        $scope.selectedItem = item;
                    };
                    $scope.goTo = function (entity, id) {
                        QuickSearchService.goTo(entity, id);
                    };
                    $scope.search = function () {
                        $scope.searchQuery = $scope.searchQuery.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
                        if (!$scope.searchQuery || $scope.searchQuery.length < 2) {
                            $scope.results = [];
                            $scope.selectedItem = null;
                            $scope.displayItem = null;
                            return;
                        }
                        var params = {
                            query: $scope.searchQuery,
                            fields: [
                                "project_id",
                                "name",
                                "disease_type",
                                "primary_site",
                                "project.project_id",
                                "project.name",
                                "project.disease_type",
                                "project.primary_site",
                                "aliquot_ids",
                                "submitter_aliquot_ids",
                                "analyte_ids",
                                "submitter_analyte_ids",
                                "case_id",
                                "submitter_id",
                                "portion_ids",
                                "submitter_portion_ids",
                                "sample_ids",
                                "submitter_sample_ids",
                                "file_id",
                                "file_name",
                                "file_size",
                                "data_type",
                                "clinical.gender",
                                "samples.sample_id",
                                "samples.submitter_id",
                                "samples.sample_type",
                                "samples.portions.portion_id",
                                "samples.portions.submitter_id",
                                "samples.portions.analytes.analyte_id",
                                "samples.portions.analytes.submitter_id",
                                "samples.portions.analytes.analyte_type",
                                "samples.portions.analytes.aliquots.aliquot_id",
                                "samples.portions.analytes.aliquots.submitter_id",
                                "annotation_id",
                                "entity_id",
                                "entity_submitter_id"
                            ]
                        };
                        $scope.activeQuery = true;
                        FacetService.searchAll(params)
                            .then(function (res) {
                            $scope.activeQuery = false;
                            var data = res.data;
                            data.hits = _.map(data.hits, function (hit) {
                                setBioSpecimen(hit);
                                return hit;
                            });
                            $scope.results = _.assign({}, data);
                            if (!$scope.results.hits.length) {
                                $scope.selectedItem = null;
                                return;
                            }
                            $scope.results.hits[0].selected = true;
                            $scope.selectedItem = $scope.results.hits[0];
                        });
                    };
                }
                /* @ngInject */
                function QuickSearchInput(QuickSearchService, FacetService, $compile, $uibModalStack) {
                    return {
                        restrict: "E",
                        replace: true,
                        templateUrl: "components/quick-search/templates/quick-search-input.html",
                        link: function ($scope, element) {
                            QuickSearchInputBaseLogicFn.call(this, $scope, element, QuickSearchService, FacetService, $uibModalStack);
                            element.after($compile("<quick-search-dropdown></quick-search-dropdown>")($scope));
                        }
                    };
                }
                function QuickSearchInputHome(QuickSearchService, FacetService) {
                    return {
                        restrict: "EA",
                        replace: true,
                        templateUrl: "components/quick-search/templates/quick-search-input-home.html",
                        link: function ($scope, element) {
                            QuickSearchInputBaseLogicFn.call(this, $scope, element, QuickSearchService, FacetService, null);
                        }
                    };
                }
                angular
                    .module("quickSearch.directives", [
                    "ui.bootstrap.modal",
                    "facets.services",
                    "quickSearch.services"
                ])
                    .directive("quickSearchDropdown", QuickSearchDropdown)
                    .directive("quickSearchInput", QuickSearchInput)
                    .directive("quickSearchInputHome", QuickSearchInputHome)
                    .directive("quickSearch", QuickSearch);
            })(directives = quickSearch.directives || (quickSearch.directives = {}));
        })(quickSearch = components.quickSearch || (components.quickSearch = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var quickSearch;
        (function (quickSearch) {
            var services;
            (function (services) {
                var QuickSearchService = (function () {
                    /* @ngInject */
                    QuickSearchService.$inject = ["$state", "$uibModalStack"];
                    function QuickSearchService($state, $uibModalStack) {
                        this.$state = $state;
                        this.$uibModalStack = $uibModalStack;
                    }
                    QuickSearchService.prototype.goTo = function (entity, id) {
                        if (this.$state.params[entity + "Id"] === id) {
                            this.$uibModalStack.dismissAll();
                            return;
                        }
                        var options = {};
                        options[entity + "Id"] = id;
                        this.$state.go(entity, options, { inherit: false });
                    };
                    return QuickSearchService;
                }());
                angular
                    .module("quickSearch.services", [
                    "ui.bootstrap.modal"
                ])
                    .service("QuickSearchService", QuickSearchService);
            })(services = quickSearch.services || (quickSearch.services = {}));
        })(quickSearch = components.quickSearch || (components.quickSearch = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var summaryCard;
        (function (summaryCard) {
            angular.module("components.summaryCard", [
                "summaryCard.controller",
                "summaryCard.directives"
            ]);
        })(summaryCard = components.summaryCard || (components.summaryCard = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var summaryCard;
        (function (summaryCard) {
            var controllers;
            (function (controllers) {
                var SummaryCardController = (function () {
                    /* @ngInject */
                    SummaryCardController.$inject = ["$scope", "LocationService", "FacetService"];
                    function SummaryCardController($scope, LocationService, FacetService) {
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.FacetService = FacetService;
                    }
                    SummaryCardController.prototype.addFilters = function (item) {
                        var config = this.$scope.config;
                        var filters = this.FacetService.ensurePath(this.LocationService.filters());
                        if (!config.filters ||
                            (!config.filters[item[config.displayKey]] && !config.filters.default)) {
                            return;
                        }
                        var params = config.filters[item[config.displayKey]]
                            ? config.filters[item[config.displayKey]].params
                            : { filters: config.filters.default.params.filters(item[config.displayKey]) };
                        var newFilter = JSON.parse(params.filters).content[0]; // there is always just one
                        filters.content = (filters.content || []).some(function (filter) { return _.isEqual(filter, newFilter); })
                            ? filters.content
                            : filters.content.concat(newFilter);
                        this.LocationService.setFilters(filters.content.length ? filters : null);
                    };
                    SummaryCardController.prototype.clearFilters = function () {
                        var _this = this;
                        var filters = this.LocationService.filters();
                        filters.content = _.reject(filters.content, function (filter) {
                            return filter.content.field === _this.$scope.config.filterKey;
                        });
                        if (filters.content.length) {
                            this.LocationService.setFilters(filters);
                            return;
                        }
                        this.LocationService.clear();
                    };
                    return SummaryCardController;
                }());
                angular
                    .module("summaryCard.controller", [
                    "location.services"
                ])
                    .controller("SummaryCardController", SummaryCardController);
            })(controllers = summaryCard.controllers || (summaryCard.controllers = {}));
        })(summaryCard = components.summaryCard || (components.summaryCard = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var summaryCard;
        (function (summaryCard) {
            var directives;
            (function (directives) {
                SummaryCard.$inject = ["LocationService", "ProjectsService"];
                CaseSummaryCard.$inject = ["LocationService"];
                ProjectSummaryCard.$inject = ["LocationService"];
                function SummaryCard(LocationService, ProjectsService) {
                    return {
                        restrict: "E",
                        templateUrl: "components/summary-card/templates/summary-card.html",
                        controller: "SummaryCardController as sc",
                        replace: true,
                        scope: {
                            data: "=",
                            height: "@",
                            config: "=",
                            title: "@",
                            mode: "@",
                            tableId: "@",
                            groupingTitle: "@",
                            showCases: "="
                        },
                        link: function ($scope) {
                            $scope.ProjectsService = ProjectsService;
                            var config = $scope.config;
                            $scope.mode = $scope.mode || "graph";
                            function checkFilters() {
                                if (LocationService.path().indexOf('/query') === 0) {
                                    return;
                                }
                                var filters = LocationService.filters();
                                $scope.activeFilters = _.some(filters.content, function (filter) {
                                    return filter.content && filter.content.field === config.filterKey;
                                });
                            }
                            checkFilters();
                            $scope.$on("$locationChangeSuccess", function () {
                                checkFilters();
                            });
                            $scope.$watch("data", function (newVal) {
                                if (newVal) {
                                    // Ensure pie chart data is always sorted highest to lowest
                                    // for tables
                                    if (config.sortData) {
                                        newVal.sort(function (a, b) {
                                            if (a[config.sortKey] > b[config.sortKey]) {
                                                return -1;
                                            }
                                            if (b[config.sortKey] > a[config.sortKey]) {
                                                return 1;
                                            }
                                            return 0;
                                        });
                                    }
                                    var color = d3.scale.category20();
                                    _.forEach(newVal, function (item, index) {
                                        item.color = color(index);
                                    });
                                    $scope.tableData = newVal;
                                }
                            });
                        }
                    };
                }
                function CaseSummaryCard(LocationService) {
                    return {
                        restrict: "E",
                        templateUrl: "components/summary-card/templates/case-summary-card.html",
                        controller: "SummaryCardController as sc",
                        replace: true,
                        scope: {
                            data: "=",
                            height: "@",
                            config: "=",
                            title: "@",
                            mode: "@",
                            tableId: "@",
                            groupingTitle: "@",
                            showCases: "="
                        },
                        link: function ($scope) {
                            var config = $scope.config;
                            $scope.mode = $scope.mode || "graph";
                            function checkFilters() {
                                if (LocationService.path().indexOf('/query') === 0) {
                                    return;
                                }
                                var filters = LocationService.filters();
                                $scope.activeFilters = _.some(filters.content, function (filter) {
                                    return filter.content && filter.content.field === config.filterKey;
                                });
                            }
                            checkFilters();
                            $scope.$on("$locationChangeSuccess", function () {
                                checkFilters();
                            });
                            $scope.$watch("data", function (newVal) {
                                if (newVal) {
                                    // Ensure pie chart data is always sorted highest to lowest
                                    // for tables
                                    if (config.sortData) {
                                        newVal.sort(function (a, b) {
                                            if (a[config.sortKey] > b[config.sortKey]) {
                                                return -1;
                                            }
                                            if (b[config.sortKey] > a[config.sortKey]) {
                                                return 1;
                                            }
                                            return 0;
                                        });
                                    }
                                    var color = d3.scale.category20();
                                    _.forEach(newVal, function (item, index) {
                                        item.color = color(index);
                                    });
                                    $scope.tableData = config.blacklist
                                        ? newVal.filter(function (x) {
                                            return !config.blacklist.some(function (y) {
                                                return y.toLowerCase() === x.data_category.toLowerCase();
                                            });
                                        })
                                        : newVal;
                                }
                            });
                        }
                    };
                }
                function ProjectSummaryCard(LocationService) {
                    return {
                        restrict: "E",
                        templateUrl: "components/summary-card/templates/project-summary-card.html",
                        controller: "SummaryCardController as sc",
                        replace: true,
                        scope: {
                            data: "=",
                            height: "@",
                            config: "=",
                            title: "@",
                            mode: "@",
                            tableId: "@",
                            groupingTitle: "@",
                            showCases: "="
                        },
                        link: function ($scope) {
                            var config = $scope.config;
                            $scope.mode = $scope.mode || "graph";
                            function checkFilters() {
                                if (LocationService.path().indexOf('/query') === 0) {
                                    return;
                                }
                                var filters = LocationService.filters();
                                $scope.activeFilters = _.some(filters.content, function (filter) {
                                    return filter.content && filter.content.field === config.filterKey;
                                });
                            }
                            checkFilters();
                            $scope.$on("$locationChangeSuccess", function () {
                                checkFilters();
                            });
                            $scope.$watch("data", function (newVal) {
                                if (newVal) {
                                    // Ensure pie chart data is always sorted highest to lowest
                                    // for tables
                                    if (config.sortData) {
                                        newVal.sort(function (a, b) {
                                            if (a[config.sortKey] > b[config.sortKey]) {
                                                return -1;
                                            }
                                            if (b[config.sortKey] > a[config.sortKey]) {
                                                return 1;
                                            }
                                            return 0;
                                        });
                                    }
                                    var color = d3.scale.category20();
                                    _.forEach(newVal, function (item, index) {
                                        item.color = color(index);
                                    });
                                    $scope.tableData = config.blacklist
                                        ? newVal.filter(function (x) {
                                            return !config.blacklist.some(function (y) {
                                                return y.toLowerCase() === x.data_category.toLowerCase();
                                            });
                                        })
                                        : newVal;
                                }
                            });
                        }
                    };
                }
                angular
                    .module("summaryCard.directives", [
                    "location.services"
                ])
                    .directive("summaryCard", SummaryCard)
                    .directive("caseSummaryCard", CaseSummaryCard)
                    .directive("projectSummaryCard", ProjectSummaryCard);
            })(directives = summaryCard.directives || (summaryCard.directives = {}));
        })(summaryCard = components.summaryCard || (components.summaryCard = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var pagination;
            (function (pagination_1) {
                var controllers;
                (function (controllers) {
                    var PagingController = (function () {
                        /* @ngInject */
                        PagingController.$inject = ["$scope", "LocationService"];
                        function PagingController($scope, LocationService) {
                            this.$scope = $scope;
                            this.LocationService = LocationService;
                        }
                        PagingController.prototype.setCount = function (event, size) {
                            this.$scope.paging.size = size;
                            this.refresh();
                        };
                        PagingController.prototype.refresh = function () {
                            var pagination = this.LocationService.pagination(), current = this.$scope.paging;
                            current.size = isNaN(current.size) || current.size <= 10 ? 10 : current.size;
                            current.from = (current.size * (current.page - 1)) + 1;
                            var obj = {
                                from: current.from,
                                size: current.size,
                                sort: current.sort
                            };
                            pagination[this.$scope.page] = obj;
                            if (!this.$scope.update) {
                                return this.LocationService.setPaging(pagination);
                            }
                        };
                        return PagingController;
                    }());
                    angular.module("pagination.controllers", ["location.services"])
                        .controller("PagingController", PagingController);
                })(controllers = pagination_1.controllers || (pagination_1.controllers = {}));
            })(pagination = tables.pagination || (tables.pagination = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var pagination;
            (function (pagination) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    function PaginationControls() {
                        return {
                            restrict: "E",
                            scope: {
                                page: "@",
                                paging: "=",
                                update: "="
                            },
                            templateUrl: "components/tables/templates/pagination.html",
                            controller: "PagingController as pc"
                        };
                    }
                    /* @ngInject */
                    function PaginationHeading() {
                        return {
                            restrict: "E",
                            scope: {
                                page: "@",
                                paging: "=",
                                update: "=",
                                title: "@"
                            },
                            templateUrl: "components/tables/templates/pagination-heading.html",
                            controller: "PagingController as pc"
                        };
                    }
                    angular.module("pagination.directives", ["pagination.controllers"])
                        .directive("paginationControls", PaginationControls)
                        .directive("paginationHeading", PaginationHeading);
                })(directives = pagination.directives || (pagination.directives = {}));
            })(pagination = tables.pagination || (tables.pagination = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));



var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var directives;
            (function (directives) {
                var tableicious;
                (function (tableicious) {
                    /* @ngInject */
                    Tableicious.$inject = ["$filter", "LocationService", "UserService", "$window"];
                    Cell.$inject = ["$compile"];
                    function Tableicious($filter, LocationService, UserService, $window) {
                        return {
                            restrict: "E",
                            scope: {
                                rowId: "@",
                                data: "=",
                                paging: "=",
                                headings: "=",
                                title: "@",
                                saved: "="
                            },
                            replace: true,
                            templateUrl: "components/tables/templates/tableicious.html",
                            link: function ($scope) {
                                $scope.$filter = $filter;
                                $scope.UserService = UserService;
                                $scope.LocationService = LocationService;
                                $scope.getCell = function (h, d) {
                                    return h.td(d, $scope);
                                };
                                $scope.getToolTipText = function (h, d) {
                                    return h.toolTipText ? h.toolTipText(d, $scope) : '';
                                };
                                function hasChildren(h) {
                                    return h.children && h.children.length > 0;
                                }
                                function refresh(hs) {
                                    $scope.enabledHeadings = _.reject(hs, function (h) {
                                        return h.hidden; // || (h.inactive && h.inactive($scope))
                                    });
                                    $scope.subHeaders = _.flatten(_.pluck(_.filter($scope.enabledHeadings, function (h) {
                                        return hasChildren(h);
                                    }), 'children'));
                                    $scope.dataCols = _.flatten(_.map($scope.enabledHeadings, function (h) {
                                        return hasChildren(h) ? h.children : h;
                                    }));
                                }
                                $scope.$watch('headings', function (n, o) {
                                    if (_.isEqual(n, o))
                                        return;
                                    refresh(n);
                                }, true);
                                var loadedHeadings = ($scope.saved || []).length ?
                                    _.map($scope.saved, function (s) { return _.merge(_.find($scope.headings, { id: s.id }), s); }) :
                                    _.cloneDeep($scope.headings);
                                refresh(loadedHeadings);
                            }
                        };
                    }
                    /* @ngInject */
                    function Cell($compile) {
                        return {
                            restrict: "A",
                            scope: {
                                cell: "=",
                                row: "=",
                                data: "=",
                                paging: "="
                            },
                            link: function ($scope, element) {
                                $scope.$watch('cell', function (value) {
                                    element.html(value);
                                    $compile(element.contents())($scope);
                                });
                            }
                        };
                    }
                    angular.module("tableicious.directive", [])
                        .directive("tableicious", Tableicious)
                        .directive("cell", Cell);
                })(tableicious = directives.tableicious || (directives.tableicious = {}));
            })(directives = tables.directives || (tables.directives = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var controllers;
            (function (controllers) {
                var TableSortController = (function () {
                    /* @ngInject */
                    TableSortController.$inject = ["$scope", "LocationService", "$window", "LocalStorageService"];
                    function TableSortController($scope, LocationService, $window, LocalStorageService) {
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.$window = $window;
                        this.LocalStorageService = LocalStorageService;
                        this.paging = $scope.paging || { size: 20 };
                        var currentSorting = this.paging.sort || '';
                        $scope.sortColumns = _.reduce($scope.headings, function (cols, col) {
                            if (col.sortable) {
                                var obj = {
                                    id: col.id,
                                    name: col.name,
                                    sort: false
                                };
                                if (col.sortMethod) {
                                    obj.sortMethod = col.sortMethod;
                                }
                                cols.push(obj);
                            }
                            return cols;
                        }, []);
                        // We need to manually check the URL and parse any active sorting down
                        if (currentSorting) {
                            currentSorting = currentSorting.split(",");
                            _.each(currentSorting, function (sort) {
                                var sortField = sort.split(":");
                                var sortObj = _.find($scope.sortColumns, function (col) { return col.id === sortField[0]; });
                                // Update the internal sorting object to have sorting from URL values applied
                                if (sortObj) {
                                    sortObj.sort = true;
                                    sortObj.order = sortField[1];
                                }
                            });
                            if ($scope.update) {
                                this.clientSorting();
                            }
                        }
                    }
                    TableSortController.prototype.clientSorting = function () {
                        var _this = this;
                        function defaultSort(a, b, order) {
                            if (order === "asc") {
                                if (isNaN(a)) {
                                    if (a < b)
                                        return -1;
                                    if (a > b)
                                        return 1;
                                    return 0;
                                }
                                else {
                                    return a - b;
                                }
                            }
                            if (order === "desc") {
                                if (isNaN(a)) {
                                    if (a > b)
                                        return -1;
                                    if (a < b)
                                        return 1;
                                    return 0;
                                }
                                else {
                                    return b - a;
                                }
                            }
                        }
                        _.forEach(this.$scope.sortColumns, function (sortValue, sortIndex) {
                            if (sortValue.sort) {
                                var order = sortValue.order || "asc";
                                _this.$scope.data.sort(function (a, b) {
                                    if (sortValue.sortMethod) {
                                        return sortValue.sortMethod(a[sortValue.id], b[sortValue.id], order);
                                    }
                                    return defaultSort(a[sortValue.id], b[sortValue.id], order);
                                });
                            }
                        });
                    };
                    TableSortController.prototype.toggleSorting = function (item) {
                        if (!item.sort) {
                            item.sort = true;
                            item.order = "asc";
                        }
                        else {
                            item.sort = false;
                            item.order = null;
                        }
                        this.updateSorting();
                    };
                    TableSortController.prototype.updateSorting = function (event, item, order) {
                        var _this = this;
                        if (event)
                            event.stopPropagation();
                        // Toggle sort when selecting direction as well
                        if (item && order) {
                            item.sort = true;
                            item.order = order;
                        }
                        if (this.$scope.update) {
                            this.clientSorting();
                            return;
                        }
                        var pagination = this.LocationService.pagination();
                        var sortString = "";
                        _.each(this.$scope.sortColumns, function (col, index) {
                            if (col.sort) {
                                if (!col.order) {
                                    col.order = "asc";
                                }
                                sortString += col.id + ":" + col.order;
                                if (index < (_this.$scope.sortColumns.length - 1)) {
                                    sortString += ",";
                                }
                            }
                        });
                        this.paging.sort = sortString;
                        pagination[this.$scope.page] = this.paging;
                        this.LocationService.setPaging(pagination);
                    };
                    return TableSortController;
                }());
                var GDCTableController = (function () {
                    /* @ngInject */
                    GDCTableController.$inject = ["$scope", "LocalStorageService"];
                    function GDCTableController($scope, LocalStorageService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.LocalStorageService = LocalStorageService;
                        this.sortingHeadings = [];
                        this.defaultHeadings = [];
                        this.displayedHeadings = [];
                        this.displayedHeadings = _.cloneDeep($scope.config.headings);
                        this.defaultHeadings = _.cloneDeep($scope.config.headings);
                        this.sortingHeadings = _.filter(this.displayedHeadings, function (heading) {
                            return heading && heading.sortable;
                        });
                        $scope.$watch("data", function () {
                            _this.setDisplayedData();
                        }, true);
                        this.setDisplayedData();
                        $scope.saved = this.LocalStorageService.getItem($scope.config.title + '-col', []);
                    }
                    GDCTableController.prototype.setDisplayedData = function (newPaging) {
                        if (newPaging === void 0) { newPaging = this.$scope.paging; }
                        if (this.$scope.clientSide) {
                            this.$scope.paging.from = newPaging.from;
                            this.$scope.paging.size = newPaging.size;
                            this.$scope.paging.pages = Math.ceil(this.$scope.data.length /
                                this.$scope.paging.size);
                            this.$scope.paging.total = this.$scope.data.length;
                            // Used to check if files are deleted and the overall count can't reach the page
                            // we are on.
                            while (this.$scope.paging.from > this.$scope.paging.total) {
                                this.$scope.paging.page--;
                                this.$scope.paging.from -= this.$scope.paging.size;
                            }
                            // Safe fallback
                            if (this.$scope.paging.page < 0 || this.$scope.paging.from < 1) {
                                this.$scope.paging.page = 1;
                                this.$scope.paging.from = 1;
                            }
                            this.displayedData = _.assign([], this.$scope.data)
                                .splice(this.$scope.paging.from - 1, this.$scope.paging.size);
                        }
                        else {
                            this.displayedData = this.$scope.data;
                        }
                        if (this.$scope.paging) {
                            this.$scope.paging.count = this.displayedData && this.displayedData.length;
                        }
                    };
                    return GDCTableController;
                }());
                var ExportTableController = (function () {
                    /* @ngInject */
                    ExportTableController.$inject = ["$scope", "LocationService", "config", "$uibModal", "$q", "Restangular", "$window", "UserService", "$timeout"];
                    function ExportTableController($scope, LocationService, config, $uibModal, $q, Restangular, $window, UserService, $timeout) {
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.config = config;
                        this.$uibModal = $uibModal;
                        this.$q = $q;
                        this.Restangular = Restangular;
                        this.$window = $window;
                        this.UserService = UserService;
                        this.$timeout = $timeout;
                        $scope.downloadInProgress = false;
                    }
                    ExportTableController.prototype.exportTable = function (fileType, download) {
                        var _this = this;
                        var projectsKeys = {
                            "files": "cases.project.project_id",
                            "cases": "project.project_id",
                            "projects": "project_id"
                        };
                        var filters = this.LocationService.filters();
                        var fieldsAndExpand = _.reduce(this.$scope.headings, function (result, field) {
                            if (!_.get(field, 'hidden', false)) {
                                if (_.get(field, 'children')) {
                                    result.expand.push(field.id);
                                }
                                else {
                                    result.fields.push(field.id);
                                }
                            }
                            return result;
                        }, { 'fields': [], 'expand': [] });
                        var url = this.LocationService.getHref();
                        var abort = this.$q.defer();
                        var modalInstance;
                        if (projectsKeys[this.$scope.endpoint]) {
                            filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[this.$scope.endpoint]);
                        }
                        var params = {
                            filters: filters,
                            fields: fieldsAndExpand.fields.concat(this.$scope.fields || []).join(),
                            expand: fieldsAndExpand.expand.concat(this.$scope.expand || []).join(),
                            attachment: true,
                            format: fileType,
                            flatten: true,
                            pretty: true,
                            size: this.$scope.size
                        };
                        var inProgress = function (state) { return (function () { _this.$scope.downloadInProgress = state; }).bind(_this); };
                        var checkProgress = download(params, '' + this.config.auth_api + '/' + this.$scope.endpoint, function (e) { return e.parent(); });
                        checkProgress(inProgress(true), inProgress(false));
                    };
                    return ExportTableController;
                }());
                var ExportTableModalController = (function () {
                    /* @ngInject */
                    ExportTableModalController.$inject = ["$uibModalInstance"];
                    function ExportTableModalController($uibModalInstance) {
                        this.$uibModalInstance = $uibModalInstance;
                    }
                    ExportTableModalController.prototype.cancel = function () {
                        this.$uibModalInstance.close({
                            cancel: true
                        });
                    };
                    return ExportTableModalController;
                }());
                angular.module("tables.controllers", ["location.services", "user.services", "ngApp.core"])
                    .controller("TableSortController", TableSortController)
                    .controller("GDCTableController", GDCTableController)
                    .controller("ExportTableModalController", ExportTableModalController)
                    .controller("ExportTableController", ExportTableController);
            })(controllers = tables.controllers || (tables.controllers = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var directives;
            (function (directives) {
                /* @ngInject */
                ArrangeColumns.$inject = ["$window", "UserService"];
                function ArrangeColumns($window, UserService) {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            headings: "=",
                            defaultHeadings: "=",
                            saved: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/arrange-columns.html",
                        link: function ($scope) {
                            $scope.UserService = UserService;
                            function saveSettings() {
                                var save = _.map($scope.headings, function (h) { return _.pick(h, 'id', 'hidden', 'sort', 'order'); });
                                $window.localStorage.setItem($scope.title + '-col', angular.toJson(save));
                            }
                            var defaults = $scope.defaultHeadings;
                            $scope.headings = ($scope.saved || []).length ?
                                _.map($scope.saved, function (s) { return _.merge(_.find($scope.headings, { id: s.id }), s); }) :
                                $scope.headings;
                            $scope.restoreDefaults = function () {
                                $scope.headings = _.cloneDeep(defaults);
                                saveSettings();
                            };
                            $scope.toggleVisibility = function (item) {
                                item.hidden = !item.hidden;
                                saveSettings();
                            };
                            $scope.sortOptions = {
                                orderChanged: saveSettings
                            };
                        }
                    };
                }
                function ExportTable() {
                    return {
                        restrict: "EA",
                        scope: {
                            text: "@",
                            size: "@",
                            headings: "=",
                            endpoint: "@",
                            expand: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/export-table.html",
                        controller: "ExportTableController as etc"
                    };
                }
                function ReportsExportTable() {
                    return {
                        restrict: "EA",
                        scope: {
                            text: "@",
                            size: "@",
                            headings: "=",
                            endpoint: "@",
                            expand: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/reports-export-table.html",
                        controller: "ExportTableController as etc"
                    };
                }
                function SortTable() {
                    return {
                        restrict: "EA",
                        scope: {
                            paging: "=",
                            page: "@",
                            headings: "=",
                            title: "@",
                            update: "=",
                            data: "=",
                            saved: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/sort-table.html",
                        controller: "TableSortController as tsc"
                    };
                }
                function GDCTable() {
                    return {
                        restrict: "E",
                        scope: {
                            heading: "@",
                            data: "=",
                            config: "=",
                            paging: "=",
                            page: "@",
                            sortColumns: "=",
                            id: "@",
                            endpoint: "@",
                            clientSide: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/gdc-table.html",
                        controller: "GDCTableController as gtc"
                    };
                }
                angular.module("tables.directives", ["tables.controllers"])
                    .directive("exportTable", ExportTable)
                    .directive("reportsExportTable", ReportsExportTable)
                    .directive("sortTable", SortTable)
                    .directive("gdcTable", GDCTable)
                    .directive("arrangeColumns", ArrangeColumns);
            })(directives = tables.directives || (tables.directives = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));



var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var services;
            (function (services) {
                var TableService = (function () {
                    function TableService() {
                    }
                    /**
                     * If, in a given array, there is a member and that member has a property called ID and that property is equal to @id, return true if that member also has a truthy enabled property.
                     * @param array
                     * The array to search for the enabled member.
                     * @param id
                     * The ID of the member whose enabled property will be returned.
                     * @returns enabled:boolean
                     * If the member is enabled or not.
                     */
                    TableService.prototype.objectWithMatchingIdInArrayIsEnabled = function (array, id) {
                        var column = _.find(array, function (_column) {
                            return _column.id === id;
                        });
                        return column && column.enabled;
                    };
                    /**
                     * Takes an object that may have another object nested inside it at index @key.
                     * If there is, extend the original object with values from that key and return it.
                     * @param object
                     * An object to be extended if its property at index @key is an object.
                     * @param key
                     * The index of the object to check for a possible object
                     * @returns {Object}
                     * The new object with properties (if any) added.
                     */
                    TableService.prototype.flattenObjectAtKey = function (object, key) {
                        return _.extend(object, object[key]);
                    };
                    /**
                     * Takes an object and converts it into an array of objects.
                     * Arrays are easier to ng-repeat through than objects.
                     *
                     * Each object has an ID and a value property.
                     * i.e, {a:1,b:2} -> [{id:'a',val:1},{id:'b',val:2}]
                     * @param object
                     * The object to turn into an array
                     * @returns {any[]}
                     * The object as an array.
                     */
                    TableService.prototype.objectToArray = function (object) {
                        return _.keys(object).map(function (key) {
                            return {
                                id: key,
                                val: object[key]
                            };
                        });
                    };
                    /**
                     * Takes an array of values that are possibly objects and flattens each one with @flattenObjectAtKey.
                     * @param array
                     * The array containing elements to be flattened.
                     * @param key
                     * The key where the entries that need expanding are.
                     * @returns {any}
                     * The flattened array.
                     */
                    TableService.prototype.flattenArrayAtKey = function (array, key) {
                        var _this = this;
                        return array.map(function (elem) {
                            return _this.flattenObjectAtKey(elem, key);
                        });
                    };
                    /**
                     * Goes through an array of Tableicious column definitions.
                     * If any columns are nested in other columns as children, promote those to the top level of the collection.
                     * @param headings
                     * @returns {any}
                     */
                    TableService.prototype.expandHeadings = function (headings) {
                        if (!headings) {
                            throw new Error("You have not defined any headings.");
                        }
                        return headings.reduce(function (a, b) {
                            function addChildrenOfNode(node) {
                                a.push(node);
                                if (node.parent) {
                                    node.nestingLevel = node.parent.nestingLevel + 1;
                                }
                                else {
                                    node.nestingLevel = 0;
                                }
                                if (node.children) {
                                    node.children.forEach(function (heading) {
                                        heading.parent = node;
                                        addChildrenOfNode(heading);
                                    });
                                }
                            }
                            if (b) {
                                addChildrenOfNode(b);
                            }
                            return a;
                        }, []).map(function (heading) {
                            heading.parent = undefined;
                            return heading;
                        });
                    };
                    /**
                     * Returns the appropriate width for a heading in columns.
                     */
                    TableService.prototype.getHeadingRowSpan = function (heading) {
                        return heading.children ? 1 : 2;
                    };
                    /**
                     * Returns the appropriate height for a heading in rows.
                     */
                    TableService.prototype.getHeadingColSpan = function (heading) {
                        return heading.children ? heading.children.length : 1;
                    };
                    /**
                     * Given an array of objects each having a "val" and an "id" property, returns the
                     * val of an object whose ID matches `valueId`
                     */
                    TableService.prototype.getValueFromRow = function (row, valueId) {
                        var tuple = _.find(row, function (x) {
                            return x.id === valueId;
                        });
                        return tuple && tuple.val;
                    };
                    /**
                     * Finds a nested value in an array of tuples.
                     * @param str
                     * The string representing the path into the data.
                     * @param row
                     * An array representing one entry in a table.
                     * @param delimiter
                     */
                    TableService.prototype.delimitedStringToValue = function (str, row, delimiter) {
                        if (delimiter === void 0) { delimiter = '.'; }
                        var result = undefined;
                        var split = str.split(delimiter);
                        var getValueFromRow = this.getValueFromRow;
                        split.forEach(function (pathSeg) {
                            if (result) {
                                result = result[pathSeg];
                            }
                            else {
                                result = getValueFromRow(row, pathSeg);
                            }
                        });
                        return result;
                    };
                    /**
                     * Returns the ultimate text value for an entry in a table based on the heading defintion and the whole row.
                     */
                    TableService.prototype.getTemplate = function (scope, $filter) {
                        var result;
                        var heading = scope.heading;
                        var id = heading.id;
                        var row = scope.$parent.datum;
                        var field = {
                            val: this.getValueFromRow(row, heading.id),
                            id: heading.id
                        };
                        var template = heading.template;
                        if (heading.template) {
                            try {
                                result = heading.template(field, row, scope, $filter);
                            }
                            catch (e) {
                                result = '--';
                            }
                        }
                        else {
                            result = this.delimitedStringToValue(id, row);
                        }
                        return result;
                    };
                    /**
                 * Returns the ultimate text value for an entry in a table based on the heading defintion and the whole row.
                 */
                    TableService.prototype.getIcon = function (scope, $filter) {
                        var heading = scope.heading;
                        var row = scope.$parent.datum;
                        var field = {
                            val: this.getValueFromRow(row, heading.id),
                            id: heading.id
                        };
                        var result;
                        var id = heading.id;
                        if (heading.icon) {
                            try {
                                result = heading.icon(field, row, scope, $filter);
                            }
                            catch (e) {
                                result = '--';
                            }
                        }
                        else {
                            result = '--';
                        }
                        return result;
                    };
                    /**
                     * Given a heading, determines if that heading should be displayed or not.
                     * Gets passed $scope since usually you will want a reference to UserService or
                     * another service for this function.
                     */
                    TableService.prototype.getHeadingEnabled = function (heading, $scope) {
                        if (_.isFunction(heading.enabled)) {
                            return heading.enabled($scope);
                        }
                        else {
                            return true;
                        }
                    };
                    TableService.prototype.getSref = function (scope, $filter) {
                        var heading = scope.heading;
                        var row = scope.$parent.datum;
                        var field = {
                            val: this.getValueFromRow(row, heading.id),
                            id: heading.id
                        };
                        var result = undefined;
                        try {
                            result = heading.sref ? heading.sref(field, row, scope, $filter) : field.val;
                            if (result.filters) {
                                result = result.state + "?filters=" + angular.fromJson(result.filters);
                            }
                            else {
                                result = result.state;
                            }
                        }
                        catch (e) {
                            result = '--';
                        }
                        return result;
                    };
                    TableService.prototype.getFieldClass = function (elem, row, scope, heading) {
                        if (heading.fieldClass) {
                            if (_.isFunction(heading.fieldClass)) {
                                return heading.fieldClass(elem, row, scope);
                            }
                            else {
                                return heading.fieldClass;
                            }
                        }
                    };
                    TableService.prototype.getHeadingClass = function (heading) {
                        if (heading.headingClass) {
                            if (_.isFunction(heading.headingClass)) {
                                return heading.headingClass();
                            }
                            else {
                                return heading.headingClass;
                            }
                        }
                    };
                    return TableService;
                }());
                angular
                    .module("tables.services", [])
                    .service("TableService", TableService);
            })(services = tables.services || (tables.services = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));



var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var user;
        (function (user_1) {
            var services;
            (function (services) {
                var broadcastReset = function (context) {
                    context.$rootScope.$broadcast("gdc-user-reset");
                };
                var UserService = (function () {
                    /* @ngInject */
                    UserService.$inject = ["AuthRestangular", "$rootScope", "LocationService", "$cookies", "$window", "$uibModal", "notify", "config", "$log"];
                    function UserService(AuthRestangular, $rootScope, LocationService, $cookies, $window, $uibModal, notify, config, $log) {
                        this.AuthRestangular = AuthRestangular;
                        this.$rootScope = $rootScope;
                        this.LocationService = LocationService;
                        this.$cookies = $cookies;
                        this.$window = $window;
                        this.$uibModal = $uibModal;
                        this.notify = notify;
                        this.config = config;
                        this.$log = $log;
                        this.isFetching = false;
                        if (config.fake_auth) {
                            this.setUser({
                                username: "DEV_USER",
                                projects: {
                                    phs_ids: {
                                        phs000178: ["_member_", "read", "delete"]
                                    },
                                    gdc_ids: {
                                        "TCGA-LAML": ["read", "delete", "read_report", "_member_"],
                                        "CGCI-BLGSP": ["read_report"],
                                        "TCGA-DEV1": ["read", "delete", "_member_"]
                                    }
                                }
                            });
                        }
                    }
                    UserService.prototype.login = function () {
                        var _this = this;
                        if (!this.isFetching) {
                            this.isFetching = true;
                            this.AuthRestangular.all("user")
                                .withHttpConfig({
                                withCredentials: true
                            })
                                .post({}, {})
                                .then(function (data) {
                                _this.setUser(data);
                            }, function (response) {
                                if (response && response.status === 401) {
                                    if (_this.currentUser) {
                                        _this.currentUser = undefined;
                                        _this.notify({
                                            message: "",
                                            messageTemplate: "<span data-translate>Session expired or unauthorized.</span>",
                                            container: "#notification",
                                            classes: "alert-warning"
                                        });
                                    }
                                }
                                else {
                                    var status_1 = (response || { status: undefined }).status;
                                    _this.$log.error("Error logging in, response status " + status_1);
                                }
                            })
                                .finally(function () { return _this.isFetching = false; });
                        }
                    };
                    UserService.prototype.loginPromise = function () {
                        return this.AuthRestangular.all("user")
                            .withHttpConfig({
                            withCredentials: true
                        })
                            .post({}, {});
                    };
                    UserService.prototype.logout = function () {
                        broadcastReset(this);
                        this.currentUser = undefined;
                    };
                    UserService.prototype.getToken = function () {
                        var _this = this;
                        // TODO: We need to come up with a solution for exporting/downloading
                        // that will work with IE9 when auth tokens are required.
                        // TODO: Make this code reusable.
                        if (this.$window.URL && this.$window.URL.createObjectURL) {
                            this.AuthRestangular.all("token/refresh")
                                .withHttpConfig({
                                responseType: "blob",
                                withCredentials: true
                            })
                                .get("", {})
                                .then(function (file) {
                                // This endpoint receives the header 'content-disposition' which our Restangular
                                // setup alters the data.
                                _this.$window.saveAs(file.data, "gdc-user-token." + _this.$window.moment().format() + ".txt");
                            }, function (response) {
                                console.log('User session has expired.', response);
                                var modalInstance = _this.$uibModal.open({
                                    templateUrl: "core/templates/session-expired.html",
                                    controller: "LoginToDownloadController",
                                    controllerAs: "wc",
                                    backdrop: true,
                                    keyboard: true,
                                    size: "lg",
                                    animation: false
                                });
                                modalInstance.result.then(function () { return _this.logout(); });
                            });
                        }
                    };
                    UserService.prototype.setUser = function (user) {
                        this.currentUser = {
                            username: user.username,
                            isFiltered: _.get(this, 'currentUser.isFiltered', false),
                            projects: {
                                gdc_ids: _.reduce(user.projects.gdc_ids || {}, function (acc, p, key) {
                                    if (p.indexOf("_member_") !== -1) {
                                        acc.push(key);
                                    }
                                    return acc;
                                }, [])
                            }
                        };
                        broadcastReset(this);
                    };
                    UserService.prototype.toggleFilter = function () {
                        broadcastReset(this);
                    };
                    UserService.prototype.hasProjects = function () {
                        if (!this.currentUser) {
                            return false;
                        }
                        var projects = _.get(this.currentUser.projects, 'gdc_ids', []);
                        return projects.length > 0;
                    };
                    UserService.prototype.isUserProject = function (file) {
                        if (!this.currentUser) {
                            return false;
                        }
                        var projectIds;
                        // Support multiple use cases
                        if (file.projects) {
                            projectIds = _.unique(_.map(file.projects, function (p) { return p.project_id || p; }));
                        }
                        else {
                            projectIds = _.unique(_.map(file.cases, function (participant) {
                                return participant.project.project_id;
                            }));
                        }
                        return !!_.intersection(projectIds, this.currentUser.projects.gdc_ids).length;
                    };
                    UserService.prototype.setUserProjectsTerms = function (terms) {
                        var _this = this;
                        if (!this.currentUser || !this.currentUser.isFiltered) {
                            return terms;
                        }
                        return _.filter(terms, function (term) {
                            return _this.isUserProject({
                                cases: [
                                    {
                                        project: {
                                            project_id: term.key
                                        }
                                    }
                                ]
                            });
                        });
                    };
                    UserService.prototype.userCanDownloadFile = function (file) {
                        return this.userCanDownloadFiles([file]);
                    };
                    UserService.prototype.userCanDownloadFiles = function (files) {
                        var _this = this;
                        return _.every(files, function (file) {
                            if (file.access === "open") {
                                return true;
                            }
                            if (file.access !== "open" && !_this.currentUser) {
                                return false;
                            }
                            if (_this.isUserProject(file)) {
                                return true;
                            }
                        });
                    };
                    UserService.prototype.addMyProjectsFilter = function (filters, key) {
                        if (this.currentUser && this.currentUser.isFiltered &&
                            _.get(this.currentUser.projects, "gdc_ids", []).length) {
                            var userProjects = {
                                content: {
                                    field: key,
                                    value: this.currentUser.projects.gdc_ids
                                },
                                op: "in"
                            };
                            if (!filters.content) {
                                filters.content = [userProjects];
                                filters.op = "and";
                            }
                            else {
                                var projectFilter = _.find(filters.content, function (filter) {
                                    if (filter.content.field === key) {
                                        return filter;
                                    }
                                    return null;
                                });
                                if (!projectFilter) {
                                    filters.content.push(userProjects);
                                }
                                else {
                                    var projects = this.currentUser.projects.gdc_ids;
                                    var sharedValues = _.intersection(projectFilter.content.value, projects);
                                    // If any of the projects selected belong to the user, stick with those rather then defaulting
                                    // to all of the users projects.
                                    if (sharedValues.length) {
                                        projectFilter.content.value = sharedValues;
                                    }
                                    else {
                                        // User is trying to search on only projects that aren't in their list.
                                        projectFilter.content.value = [""];
                                    }
                                }
                            }
                        }
                        return filters;
                    };
                    return UserService;
                }());
                angular
                    .module("user.services", ["restangular", "location.services", "ngCookies", "ui.bootstrap"])
                    .service("UserService", UserService);
            })(services = user_1.services || (user_1.services = {}));
        })(user = components.user || (components.user = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                var controllers;
                (function (controllers) {
                    var BiospecimenController = (function () {
                        /* @ngInject */
                        BiospecimenController.$inject = ["LocationService", "config", "BiospecimenService", "$scope"];
                        function BiospecimenController(LocationService, config, BiospecimenService, $scope) {
                            var _this = this;
                            this.LocationService = LocationService;
                            this.config = config;
                            this.BiospecimenService = BiospecimenService;
                            if ($scope.participant.samples) {
                                $scope.participant.samples.expanded = true;
                                this.activeBioSpecimenDoc = $scope.participant.samples[0];
                                this.activeBioSpecimenDocType = "sample";
                                BiospecimenService.stitchPlaceholderChildrenToParents($scope.participant.samples);
                            }
                            this.bioSpecimenFile = _.find($scope.participant.files, function (file) {
                                return (file.data_subtype || '').toLowerCase() === "biospecimen data";
                            });
                            var participant = $scope.participant;
                            this.hasNoBiospecimen = _.size(participant.samples) < 1;
                            this.biospecimenDataExportFilters = {
                                'cases.case_id': participant.case_id
                            };
                            this.biospecimenDataExportExpands =
                                ['samples', 'samples.portions', 'samples.portions.analytes', 'samples.portions.analytes.aliquots',
                                    'samples.portions.analytes.aliquots.annotations', 'samples.portions.analytes.annotations',
                                    'samples.portions.submitter_id', 'samples.portions.slides', 'samples.portions.annotations',
                                    'samples.portions.center'];
                            this.biospecimenDataExportFileName = "biospecimen.case-" + participant.case_id;
                            $scope.$on('displayBioSpecimenDocument', function (event, data) {
                                _this.activeBioSpecimenDocType = data.type;
                                _this.activeBioSpecimenDoc = data.doc;
                            });
                        }
                        BiospecimenController.prototype.displayBioSpecimenDocumentRow = function (key, value) {
                            if (key.toLowerCase() === "expanded") {
                                return false;
                            }
                            if (key.toLowerCase() === "submitter_id") {
                                return false;
                            }
                            if (key === this.activeBioSpecimenDocType + "_id") {
                                return false;
                            }
                            return true;
                        };
                        BiospecimenController.prototype.displayBioSpecimenDocumentRowValue = function (key, value) {
                            if (_.isArray(value)) {
                                return value.length;
                            }
                            if (_.isObject(value)) {
                                return value.name;
                            }
                            if (!value && (!isNaN(value) && value !== 0)) {
                                return "--";
                            }
                            return value;
                        };
                        return BiospecimenController;
                    }());
                    angular.module("biospecimen.controllers", [])
                        .controller("BiospecimenController", BiospecimenController);
                })(controllers = biospecimen.controllers || (biospecimen.controllers = {}));
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    Biospecimen.$inject = ["BiospecimenService", "$stateParams"];
                    TreeItem.$inject = ["$compile"];
                    function Biospecimen(BiospecimenService, $stateParams) {
                        return {
                            restrict: "E",
                            replace: true,
                            scope: {
                                participant: "=",
                                expanded: "="
                            },
                            templateUrl: "components/ui/biospecimen/templates/biospecimen.html",
                            controller: "BiospecimenController as bc",
                            link: function ($scope, elem, attr, ctrl) {
                                $scope.searchTerm = "";
                                $scope.expandTree = function (event, doc) {
                                    if (event.which === 1 || event.which === 13) {
                                        doc.expanded = !doc.expanded;
                                        event.target.focus();
                                    }
                                };
                                $scope.expandAll = function (event, participant, expand) {
                                    BiospecimenService.expandAll(event, participant, expand);
                                };
                                var idFields = [
                                    'submitter_id', 'sample_id', 'portion_id',
                                    'analyte_id', 'slide_id', 'aliquot_id'
                                ];
                                $scope.search = function (searchTerm, participant) {
                                    if (searchTerm) {
                                        $scope.found = BiospecimenService.search(searchTerm, participant, idFields);
                                        if ($scope.found.length) {
                                            $scope.$emit('displayBioSpecimenDocument', {
                                                doc: $scope.found[0].entity,
                                                type: $scope.found[0].type
                                            });
                                            participant.biospecimenTreeExpanded = BiospecimenService.allExpanded(participant);
                                        }
                                    }
                                    else
                                        $scope.found = [];
                                };
                                if ($stateParams.bioId) {
                                    $scope.search($stateParams.bioId, $scope.participant);
                                    $scope.searchTerm = $stateParams.bioId;
                                }
                            }
                        };
                    }
                    function Tree() {
                        return {
                            restrict: 'E',
                            replace: true,
                            templateUrl: 'components/ui/biospecimen/templates/tree.html',
                            scope: {
                                entities: '=',
                                type: '=',
                                depth: '=',
                                searchTerm: '=',
                                activeDoc: '='
                            },
                            link: function (scope) {
                                scope.expandTree = function (event, doc) {
                                    if (event.which === 1 || event.which === 13) {
                                        doc.expanded = !doc.expanded;
                                        event.target.focus();
                                    }
                                };
                                scope.hasEntities = function (entities, type) { return entities.some(function (x) { return x[type.s + '_id']; }); };
                            }
                        };
                    }
                    function TreeItem($compile) {
                        return {
                            restrict: 'E',
                            replace: true,
                            templateUrl: 'components/ui/biospecimen/templates/tree-item.html',
                            scope: {
                                entity: '=',
                                type: '=',
                                depth: '=',
                                searchTerm: '=',
                                activeDoc: '='
                            },
                            link: function (scope, el, attrs) {
                                scope.expandTree = function (event, doc) {
                                    if (event.which === 1 || event.which === 13) {
                                        doc.expanded = !doc.expanded;
                                        event.target.focus();
                                    }
                                };
                                scope.displayBioSpecimenDocument = function (event, doc, type) {
                                    if (event.which === 1 || event.which === 13) {
                                        scope.$emit('displayBioSpecimenDocument', { doc: doc, type: type });
                                    }
                                };
                                el.append($compile([
                                    '<tree',
                                    'depth="depth + 1"',
                                    'data-ng-repeat="childType in ',
                                    '[',
                                    '{ p: \'portions\', s: \'portion\' },',
                                    '{ p: \'aliquots\', s: \'aliquot\' },',
                                    '{ p: \'analytes\', s: \'analyte\' },',
                                    '{ p: \'slides\', s: \'slide\' }',
                                    ']"',
                                    'entities="entity[childType.p]"',
                                    'data-ng-if="entity[childType.p]"',
                                    'type="childType"',
                                    'search-term="searchTerm"',
                                    'active-doc="activeDoc"',
                                    '></tree>'
                                ].join(' '))(scope));
                            }
                        };
                    }
                    angular.module("biospecimen.directives", ["biospecimen.controllers", "biospecimen.services"])
                        .directive("biospecimen", Biospecimen)
                        .directive("tree", Tree)
                        .directive("treeItem", TreeItem);
                })(directives = biospecimen.directives || (biospecimen.directives = {}));
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                var services;
                (function (services) {
                    /*
                     *  The BiospecimenService has several utility functions for working with the
                     *  the biospecimen tree, which is represented by a single node (the participant / case),
                     *  with an array of nodes, called entities, each with their own array of nested entities and so on.
                     *
                     *  It is important to note that although each entity may have children, it is
                     *  possible that it itself does not represent an actual file in Elasticsearch
                     *  and is simply acting as a placeholder for a child further down the tree.
                     */
                    var BiospecimenService = (function () {
                        function BiospecimenService() {
                            this.entityTypes = [
                                { s: "sample", p: "samples" },
                                { s: "portion", p: "portions" },
                                { s: "slide", p: "slides" },
                                { s: "analyte", p: "analytes" },
                                { s: "aliquot", p: "aliquots" }
                            ];
                        }
                        /*  expandAll()
                         *  ===========
                         *
                         *  Expand every node in the tree.
                         */
                        BiospecimenService.prototype.expandAll = function (event, participant, expand) {
                            var self = this;
                            participant.biospecimenTreeExpanded = expand;
                            if (event.which === 1 || event.which === 13) {
                                (function expandAll(entity) {
                                    self.entityTypes.forEach(function (type) {
                                        (entity[type.p] || []).expanded = entity.expanded = expand;
                                        (entity[type.p] || []).forEach(function (entity) { return expandAll(entity); });
                                    });
                                })(participant);
                            }
                            return participant;
                        };
                        /*  allExpanded()
                         *  ============
                         *
                         *  Returns `true` if every node is expanded.
                         *  Used to determine the state of the expand all / collapse all button.
                         */
                        BiospecimenService.prototype.allExpanded = function (participant) {
                            var self = this;
                            return (function allExpanded(entity) {
                                return self.entityTypes.every(function (type) {
                                    if (entity[type.p]) {
                                        return (entity[type.p] || []).expanded && entity.expanded &&
                                            (entity[type.p] || []).every(function (entity) { return allExpanded(entity); });
                                    }
                                    else
                                        return entity.expanded;
                                });
                            })(participant);
                        };
                        /*  search()
                         *  ========
                         *
                         *  Recurse through the tree and check whether the given search term matches
                         *  the value of any of the node's keys which are specified in the `fields` array.
                         *
                         *  If there is a match, expand that node and all of its parents, and add the
                         *  node to the `found` array, which is returned at the end of the function.
                         */
                        BiospecimenService.prototype.search = function (searchTerm, participant, fields) {
                            var self = this;
                            var found = [];
                            var loweredSearchTerm = searchTerm.toLowerCase();
                            function search(entity, type, parents) {
                                if ((fields || []).some(function (f) { return (entity[f] || '').toLowerCase().indexOf(loweredSearchTerm) > -1; })) {
                                    parents.forEach(function (p) { return p.expanded = true; });
                                    var sampleType = parents.reduce(function (s, p) {
                                        if (p.hasOwnProperty('sample_type')) {
                                            return p.sample_type;
                                        }
                                        return s;
                                    });
                                    entity.expanded = true;
                                    found.push({ entity: entity, type: type, sample_type: sampleType });
                                }
                                (self.entityTypes || []).forEach(function (type) {
                                    (entity[type.p] || []).forEach(function (child) {
                                        search(child, type.s, [entity[type.p], entity].concat(parents));
                                    });
                                });
                            }
                            (participant.samples || []).forEach(function (sample) {
                                return search(sample, 'sample', [participant.samples]);
                            });
                            return found;
                        };
                        /*  stitchPlaceholderChildrenToParents()
                         *  ====================================
                         *
                         *  Recurse through the nodes looking for the first placeholder with children
                         *  and shift the children to the placeholders nearest parent with actual files.
                         */
                        BiospecimenService.prototype.stitchPlaceholderChildrenToParents = function (parents) {
                            var self = this;
                            function hasFiles(xs, childTypeSingular) {
                                return (xs || []).some(function (x) { return x[(childTypeSingular + "_id")] || x.submitter_id; });
                            }
                            (parents || []).forEach(function (parent) {
                                self.entityTypes.forEach(function (childType) {
                                    if (!hasFiles(parent[childType.p], childType.s)) {
                                        stitchPlaceholderChildrenToParents(parent[childType.p]);
                                    }
                                });
                                function stitchPlaceholderChildrenToParents(entities) {
                                    (entities || []).forEach(function (entity, i) {
                                        self.entityTypes.forEach(function (childType) {
                                            if (hasFiles(entity[childType.p], childType.s)) {
                                                parent[childType.p] = parent[childType.p]
                                                    ? parent[childType.p].concat(entity[childType.p].splice(0, Infinity))
                                                    : entity[childType.p].splice(0, Infinity).slice();
                                            }
                                            else {
                                                stitchPlaceholderChildrenToParents(entity[childType.p]);
                                            }
                                        });
                                    });
                                }
                            });
                        };
                        return BiospecimenService;
                    }());
                    angular
                        .module("biospecimen.services", [])
                        .service("BiospecimenService", BiospecimenService);
                })(services = biospecimen.services || (biospecimen.services = {}));
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                angular.module("ui.biospecimen", [
                    "biospecimen.directives",
                    "biospecimen.controllers",
                    "biospecimen.services"
                ]);
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var control;
            (function (control) {
                var directives;
                (function (directives) {
                    function SplitControl() {
                        return {
                            restrict: "EA",
                            scope: true,
                            replace: true,
                            transclude: true,
                            templateUrl: "components/ui/controls/templates/split-control-button.html",
                            controller: function () {
                                // Included for extensibility
                            },
                            link: function ($scope, $element, $attrs) {
                                var loadingState = false;
                                var childStates = {};
                                function _initListeners() {
                                    $element.keydown(function (e) {
                                        if (e.which == 13) {
                                            $element.find('#' + $scope.uiControl.id).click();
                                        }
                                    });
                                    $scope.$watch(function () { return loadingState; }, function (isLoading) {
                                        $scope.uiControl.isLoading = isLoading;
                                    });
                                }
                                function _init() {
                                    $scope.uiControl = {
                                        id: 'split-control-' + (new Date().getTime()),
                                        isLoading: false,
                                        controlLabelText: $attrs.controlLabelText || 'Action Label',
                                        srLabel: $attrs.srLabel || 'Split Control',
                                        shouldSplitControl: $attrs.noSplit === 'true' ? false : true,
                                        iconClasses: $attrs.iconClasses || false,
                                        btnType: $attrs.btnType || 'primary'
                                    };
                                    $scope.reportStatus = function (id, status) {
                                        _.set(childStates, [id], status);
                                        loadingState = _.some(_.values(childStates), function (s) { return s; });
                                    };
                                    _initListeners();
                                }
                                _init();
                            }
                        };
                    }
                    function SplitControlOption() {
                        return {
                            restrict: "AE",
                            replace: true,
                            scope: true,
                            transclude: true,
                            require: "^splitControl",
                            templateUrl: "components/ui/controls/templates/split-control-option.html",
                            link: function (scope, element, attributes, controller, transclude) {
                                var myId = scope.id;
                                var loadingState = false;
                                var childStates = {};
                                scope.reportStatus = function (id, status) {
                                    _.set(childStates, [id], status);
                                    loadingState = _.some(_.values(childStates), function (s) { return s; });
                                };
                                scope.$watch(function () { return loadingState; }, function (isLoading) {
                                    scope.$parent.$parent.reportStatus(myId, isLoading);
                                });
                                transclude(scope.$new(), function (clone) {
                                    element.append(clone);
                                });
                            }
                        };
                    }
                    angular.module("ui.control.directives", [])
                        .directive("splitControl", SplitControl)
                        .directive("splitControlOption", SplitControlOption);
                })(directives = control.directives || (control.directives = {}));
            })(control = ui.control || (ui.control = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var control;
            (function (control) {
                angular.module("ui.control", [
                    "ui.control.directives"
                ]);
            })(control = ui.control || (ui.control = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var countCard;
            (function (countCard) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    CountCard.$inject = ["$filter"];
                    function CountCard($filter) {
                        return {
                            restrict: "E",
                            replace: true,
                            templateUrl: "components/ui/countCard/templates/card.html",
                            scope: {
                                title: "@",
                                icon: "@",
                                data: "=",
                                sref: "@"
                            }
                        };
                    }
                    angular.module("count-card.directives", [])
                        .directive("countCard", CountCard);
                })(directives = countCard.directives || (countCard.directives = {}));
            })(countCard = ui.countCard || (ui.countCard = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var countCard;
            (function (countCard) {
                angular.module("ui.count-card", [
                    "count-card.directives"
                ]);
            })(countCard = ui.countCard || (ui.countCard = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var file;
            (function (file) {
                var FileSize = (function () {
                    function FileSize() {
                        return function (val) {
                            var formattedVal = "0 B";
                            if (val >= FileSize.BYTES_TB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_PB).toFixed(2) + " PB";
                            }
                            else if (val >= FileSize.BYTES_GB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_TB).toFixed(2) + " TB";
                            }
                            else if (val >= FileSize.BYTES_MB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_GB).toFixed(2) + " GB";
                            }
                            else if (val >= FileSize.BYTES_KB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_MB).toFixed(2) + " MB";
                            }
                            else if (val >= FileSize.BYTES_KB) {
                                formattedVal = (val / FileSize.BYTES_KB).toFixed(0) + " KB";
                            }
                            else if (val) {
                                formattedVal = val + " B";
                            }
                            return formattedVal;
                        };
                    }
                    FileSize.BYTES_PB = 1000000000000000;
                    FileSize.BYTES_TB_LIMIT = 999999500000000;
                    FileSize.BYTES_TB = 1000000000000;
                    FileSize.BYTES_GB_LIMIT = 999999500000;
                    FileSize.BYTES_GB = 1000000000;
                    FileSize.BYTES_MB_LIMIT = 999500000;
                    FileSize.BYTES_MB = 1000000;
                    FileSize.BYTES_KB_LIMIT = 999500;
                    FileSize.BYTES_KB = 1000;
                    return FileSize;
                }());
                angular.module("file.filters", [])
                    .filter("size", FileSize);
            })(file = ui.file || (ui.file = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var file;
            (function (file) {
                angular.module("ui.file", [
                    "file.filters"
                ]);
            })(file = ui.file || (ui.file = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scroll;
            (function (scroll) {
                angular.module("ui.scroll", [
                    "ui.scroll.scrollSpy",
                    "ui.scroll.scrollTo",
                    "ui.scroll.scrollFix"
                ]);
            })(scroll = ui.scroll || (ui.scroll = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scrollFix;
            (function (scrollFix) {
                /* @ngInject */
                ScrollFix.$inject = ["$window"];
                ScrollFixTarget.$inject = ["$window"];
                function ScrollFix($window) {
                    return {
                        require: "^?scrollfixTarget",
                        link: function ($scope, elm, attrs, scrollfixTarget) {
                            var top = elm[0].offsetTop, $target = scrollfixTarget && scrollfixTarget.$element || angular.element($window), entityBody = angular.element(document.querySelector(".entity-body"));
                            if (!attrs.scrollFix) {
                                attrs.scrollFix = top;
                            }
                            else if (typeof (attrs.scrollFix) === "string") {
                                // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
                                if (attrs.scrollFix.charAt(0) === "-") {
                                    attrs.scrollFix = top - parseFloat(attrs.scrollFix.substr(1));
                                }
                                else if (attrs.scrollFix.charAt(0) === "+") {
                                    attrs.scrollFix = top + parseFloat(attrs.scrollFix.substr(1));
                                }
                            }
                            function onScroll() {
                                // if pageYOffset is defined use it, otherwise use other crap for IE
                                var offset;
                                if (angular.isDefined($window.pageYOffset)) {
                                    offset = $window.pageYOffset;
                                }
                                else {
                                    var iebody = (document.compatMode && document.compatMode !== "BackCompat") ? document.documentElement : document.body;
                                    offset = iebody.scrollTop;
                                }
                                if (!elm.hasClass("ui-scroll-fix") && offset > attrs.scrollFix) {
                                    elm.addClass("ui-scroll-fix");
                                    entityBody.addClass("scroll-fix-margin");
                                }
                                else if (elm.hasClass("ui-scroll-fix") && offset < attrs.scrollFix) {
                                    elm.removeClass("ui-scroll-fix");
                                    entityBody.removeClass("scroll-fix-margin");
                                }
                            }
                            $target.on("scroll", onScroll);
                            // Unbind scroll event handler when directive is removed
                            $scope.$on("$destroy", function () {
                                $target.off("scroll", onScroll);
                            });
                        }
                    };
                }
                /* @ngInject */
                function ScrollFixTarget($window) {
                    return {
                        controller: ["$element", function ($element) {
                                this.$element = $element;
                            }]
                    };
                }
                angular.module("ui.scroll.scrollFix", [])
                    .directive("scrollFix", ScrollFix)
                    .directive("scrollFixTarget", ScrollFixTarget);
            })(scrollFix = ui.scrollFix || (ui.scrollFix = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scrollSpy;
            (function (scrollSpy) {
                /* @ngInject */
                ScrollSpy.$inject = ["$window"];
                function ScrollSpy($window) {
                    return {
                        restrict: "A",
                        controller: ["$scope", function ($scope) {
                            $scope.spies = [];
                            this.addSpy = function (spyObj) {
                                return $scope.spies.push(spyObj);
                            };
                        }],
                        link: function ($scope, elem) {
                            var w;
                            w = $window.jQuery($window);
                            function scrl() {
                                var highlightSpy, pos, spy, _i, _len, _ref;
                                highlightSpy = null;
                                _ref = $scope.spies;
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    spy = _ref[_i];
                                    spy.out();
                                    pos = pos = elem.find("#" + spy.id).offset().top + 100;
                                    if (((pos - $window.scrollY) <= 65) ||
                                        (pos > $window.scrollY && pos < ($window.innerHeight + $window.scrollY))) {
                                        spy.pos = pos;
                                        if (!highlightSpy) {
                                            highlightSpy = spy;
                                        }
                                        if (highlightSpy.pos < spy.pos) {
                                            highlightSpy = spy;
                                        }
                                    }
                                    else if (!$window.scrollY) {
                                        highlightSpy = null;
                                    }
                                }
                                return highlightSpy ? highlightSpy["in"]() : $scope.spies[0]["in"]();
                            }
                            w.on("scroll", scrl);
                            $scope.$on("$destroy", function () {
                                w.off("scroll", scrl);
                            });
                        }
                    };
                }
                /* @ngInject */
                function Spy() {
                    return {
                        restrict: "A",
                        require: "^scrollSpy",
                        link: function ($scope, elem, attrs, affix) {
                            return affix.addSpy({
                                id: attrs.spy,
                                "in": function () {
                                    return elem.addClass("current");
                                },
                                out: function () {
                                    return elem.removeClass("current");
                                }
                            });
                        }
                    };
                }
                angular.module("ui.scroll.scrollSpy", [])
                    .directive("scrollSpy", ScrollSpy)
                    .directive("spy", Spy);
            })(scrollSpy = ui.scrollSpy || (ui.scrollSpy = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scrollTo;
            (function (scrollTo) {
                /* @ngInject */
                ScrollTo.$inject = ["$window"];
                function ScrollTo($window) {
                    return function ($scope, elm, attrs) {
                        elm.bind("click", function (e) {
                            var top;
                            e.preventDefault();
                            if (attrs.href) {
                                attrs.scrollto = attrs.href;
                            }
                            top = $window.jQuery(attrs.scrollto).offset().top - 60;
                            $window.jQuery("body,html").animate({ scrollTop: top }, 800);
                        });
                    };
                }
                angular.module("ui.scroll.scrollTo", [])
                    .directive("scrollTo", ScrollTo);
            })(scrollTo = ui.scrollTo || (ui.scrollTo = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var search;
            (function (search) {
                angular.module("ui.search", [
                    "ui.search.directives",
                    "ui.search.controllers",
                    "components.gql"
                ]);
            })(search = ui.search || (ui.search = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var search;
            (function (search) {
                var controllers;
                (function (controllers) {
                    var SearchBarController = (function () {
                        /* @ngInject */
                        SearchBarController.$inject = ["$scope", "LocationService", "$state"];
                        function SearchBarController($scope, LocationService, $state) {
                            var _this = this;
                            this.$scope = $scope;
                            this.LocationService = LocationService;
                            this.$state = $state;
                            this.gql = null;
                            this.query = "";
                            this.Error = null;
                            $scope.$watch("query", function () {
                                if (!_this.query) {
                                    _this.LocationService.setQuery();
                                }
                            });
                            this.setQuery();
                        }
                        SearchBarController.prototype.sendQuery = function () {
                            if (this.query.length) {
                                this.LocationService.setSearch({
                                    query: this.query,
                                    filters: angular.toJson({ "op": "and", "content": [this.gql.filters] })
                                });
                            }
                            else {
                                this.LocationService.setSearch({});
                            }
                        };
                        SearchBarController.prototype.setQuery = function () {
                            var currentQuery = this.LocationService.query();
                            if (typeof currentQuery === "string") {
                                this.query = currentQuery;
                            }
                        };
                        SearchBarController.prototype.resetQuery = function () {
                            this.LocationService.clear();
                            this.query = "";
                            this.gql = null;
                            this.Error = null;
                        };
                        return SearchBarController;
                    }());
                    angular.module("ui.search.controllers", [])
                        .controller("SearchBarController", SearchBarController);
                })(controllers = search.controllers || (search.controllers = {}));
            })(search = ui.search || (ui.search = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var search;
            (function (search) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    function SearchBar() {
                        return {
                            restrict: "E",
                            scope: true,
                            templateUrl: "components/ui/search/templates/search-bar.html",
                            controller: "SearchBarController as sb"
                        };
                    }
                    angular.module("ui.search.directives", ["ui.search.controllers"])
                        .directive("searchBar", SearchBar);
                })(directives = search.directives || (search.directives = {}));
            })(search = ui.search || (ui.search = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var string;
            (function (string) {
                angular.module("ui.string", [
                    "string.filters"
                ]);
            })(string = ui.string || (ui.string = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));

var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var string;
            (function (string) {
                var Ellipsicate = (function () {
                    function Ellipsicate() {
                        return function (fullstring, length) {
                            if (length === void 0) { length = 50; }
                            if (fullstring) {
                                return (fullstring.length <= length) ? fullstring : fullstring.substring(0, length) + "â€¦";
                            }
                            else {
                                return '';
                            }
                        };
                    }
                    return Ellipsicate;
                }());
                var Humanify = (function () {
                    function Humanify() {
                        return function (original, capitalize, facetTerm) {
                            if (capitalize === void 0) { capitalize = true; }
                            if (facetTerm === void 0) { facetTerm = false; }
                            // use `--` for null, undefined and empty string
                            if (original === null || original === undefined || (angular.isString(original) && original.length === 0)) {
                                return '--';
                            }
                            else if (!angular.isString(original))
                                return original;
                            var humanified = "";
                            if (facetTerm) {
                                // Splits on capital letters followed by lowercase letters to find
                                // words squished together in a string.
                                original = original.split(/(?=[A-Z][a-z])/).join(" ");
                                humanified = original.replace(/\./g, " ").replace(/_/g, " ").trim();
                            }
                            else {
                                var split = original.split(".");
                                humanified = split[split.length - 1].replace(/_/g, " ").trim();
                                // Special case 'name' to include any parent nested for sake of
                                // specificity in the UI
                                if (humanified === "name" && split.length > 1) {
                                    humanified = split[split.length - 2] + " " + humanified;
                                }
                            }
                            return capitalize
                                ? Capitalize()(humanified) : humanified;
                        };
                    }
                    return Humanify;
                }());
                var FacetTitlefy = (function () {
                    function FacetTitlefy() {
                        return function (original) {
                            // chop string until last biospec entity
                            var biospecEntities = ['samples', 'portions', 'slides', 'analytes', 'aliquots'];
                            var startAt = biospecEntities.reduce(function (lastIndex, b) {
                                var indexOf = original.indexOf(b);
                                return indexOf > lastIndex ? indexOf : lastIndex;
                            }, 0);
                            var chopped = original.substring(startAt);
                            // Splits on capital letters followed by lowercase letters to find
                            // words squished together in a string.
                            return Capitalize()(chopped.split(/(?=[A-Z][a-z])/)
                                .join(" ")
                                .replace(/\./g, ' ')
                                .replace(/_/g, ' ')
                                .trim());
                        };
                    }
                    return FacetTitlefy;
                }());
                // differs from angular's uppercase by not uppering miRNA
                function Capitalize() {
                    return function (original) {
                        return original.split(' ').map(function (word) {
                            return word.indexOf("miRNA") === -1
                                ? word.charAt(0).toUpperCase() + word.slice(1)
                                : word;
                        }).join(' ');
                    };
                }
                var Titlefy = (function () {
                    function Titlefy() {
                        return function (s) {
                            s = (s === undefined || s === null) ? '' : s;
                            return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
                                return ch.toUpperCase();
                            });
                        };
                    }
                    return Titlefy;
                }());
                var SpaceReplace = (function () {
                    function SpaceReplace() {
                        return function (s, replaceWith) {
                            return s.toString().replace(/\s+/g, replaceWith || '');
                        };
                    }
                    return SpaceReplace;
                }());
                var DotReplace = (function () {
                    function DotReplace() {
                        return function (s, replaceWith) {
                            return s.toString().replace(/\.+/g, replaceWith || '');
                        };
                    }
                    return DotReplace;
                }());
                var Replace = (function () {
                    function Replace() {
                        return function (s, substr, newSubstr) {
                            return s.toString().replace(substr, newSubstr);
                        };
                    }
                    return Replace;
                }());
                var AgeDisplay = (function () {
                    AgeDisplay.$inject = ["gettextCatalog"];
                    function AgeDisplay(gettextCatalog) {
                        var oneYear = 365.25;
                        var leapThenPair = function (years, days) { return (days === 365) ? [years + 1, 0] : [years, days]; };
                        var timeString = function (number, singular, plural) {
                            return ('' + number + ' ' + gettextCatalog.getPlural(number, singular, plural || singular + 's'));
                        };
                        // if ES6 is ever used, use `...` instead.
                        var _timeString = _.spread(timeString);
                        return function (ageInDays, yearsOnly, defaultValue) {
                            if (yearsOnly === void 0) { yearsOnly = false; }
                            if (defaultValue === void 0) { defaultValue = '--'; }
                            if (!ageInDays) {
                                return defaultValue;
                            }
                            return _.zip(leapThenPair(Math.floor(ageInDays / oneYear), Math.ceil(ageInDays % oneYear)), ['year', 'day'])
                                .filter(function (p) { return yearsOnly ? p[1] === 'year' : p[0] > 0; })
                                .map(function (p) { return !yearsOnly ? _timeString(p) : p[0]; })
                                .join(' ')
                                .trim();
                        };
                    }
                    return AgeDisplay;
                }());
                function Superscript() {
                    return function (original) { return original.replace(/\^(\d*)/, '<sup>$1</sup>'); };
                }
                angular.module("string.filters", [])
                    .filter("ellipsicate", Ellipsicate)
                    .filter("titlefy", Titlefy)
                    .filter("spaceReplace", SpaceReplace)
                    .filter("dotReplace", DotReplace)
                    .filter("replace", Replace)
                    .filter("humanify", Humanify)
                    .filter("facetTitlefy", FacetTitlefy)
                    .filter("capitalize", Capitalize)
                    .filter("ageDisplay", AgeDisplay)
                    .filter("superscript", Superscript);
            })(string = ui.string || (ui.string = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
}());
