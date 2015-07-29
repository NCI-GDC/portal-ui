module ngApp.components.githut.controllers {

  export interface IGitHutController {
    draw(): void;
  }

  export interface IGitHutScope extends ng.IScope {
    data: any;
    config: any;
  }

  class GitHutController implements IGitHutController {

    /* @ngInject */
    constructor(private $scope: IGitHutScope, private $window: ng.IWindowService, private $filter: ng.IFilterService) {
      this.draw();

      $scope.$watch("data", () => {
        this.draw();
      });
    }

    draw() {
      var data = this.$scope.data,
          options = this.$scope.config;

      var LHR = this.$window.$(options.container);

      LHR.addClass(options.containerClass);
      LHR.empty();

      var WIDTH = LHR.width(),
          HEIGHT = 80 + data.length * 15;

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
          .key(function(d) {
            return d.project_id;
          })
          .rollup(function(leaves) {
            var r = {};
            options.columns.forEach(function(col) {
              r[col] = d3.sum(leaves, function(o) {
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
          .filter(function(d) {
            return d.key !== "null";
          })
          .sort(function(a,b) {
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
          stroke:"none",
          fill:"#fff"
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

      var yscales = {},
          width_scales = {},
          extents = {},
          yAxes = {};

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
          .data(nested_data,function(d) {
            return d.key;
          })
          .enter()
          .append("g")
          .attr("class", "labels")
          .attr("rel", function(d) {
            return d.key;
          })
          .on("mouseover",function(d){
            d3.select(this)
              .classed("hover", true);

            languages_group
              .selectAll("g.lang[rel='" + d.key + "']")
              .classed("hover",true);
          })
          .on("mouseout",function(d){
            svg.selectAll("g.hover,g.primary_site")
              .classed("hover", false)
              .classed("primary_site", false);
          });

      var language = languages_group.selectAll("g.lang")
          .data(nested_data,function(d) {
            return d.key;
          })
          .enter()
          .append("g")
          .attr("class", "lang")
          .attr("rel", function(d) {
            return d.key;
          });

      var line = d3.svg.line()
          .x(function(d, i) { return d.x; })
          .y(function(d, i) {
            if (d.y === 0) {
              return yscales[options.use[d.col] || d.col].range()[0];
            } else {
              return yscales[options.use[d.col] || d.col](d.y);
            }
          });

      var drawn_primary_sites = [];

      this.$window.$(this.$window).off("resize");

      this.$window.$(this.$window).on("resize", _.debounce(() => {
        this.draw();
      }, 150));

      function updateScales() {
        // what in the seven kingdoms does this do?
        extents = (function(){
          var extents = {};
          options.columns.forEach(function(d, i) {
            extents[d] = d3.extent(nested_data, function(o) {
              return o.values[d];

              // the following code block is unreachable
              if (options.dimensions.indexOf(d) > -1) {
                return o.values[d];
              } else {
                return o.values[d]/o.values[options.ref];
              }
            });
          });
          return extents;
        }());

        var scales = {},
            wscales = {};

        options.columns.forEach(function(d) {
          var use = options.use[d] || d;
          var sorter = options.sorter[d] || d;

          if (options.scale_map[d] === "ordinal") {
            var inc = 0.001;
            var domain = nested_data
              .filter(function(){ return true; })
              .sort(function(a, b) {
                var sorting = options.sorting[use] || d3.ascending;
                var __a = (a.values[sorter]),
                    __b = (b.values[sorter]);

                if (options.dimensions.indexOf(d) === -1) {
                  __a = (a.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : a.values[options.ref]));
                  __b = (b.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : b.values[options.ref]));
                }

                return sorting(__a, __b);
              })
              .map(function(o) {
                if (options.dimensions.indexOf(use) > -1) {
                  return o.values[use];
                } else {
                  return o.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : o.values[options.ref]);
                }
              });

            scales[d] = d3.scale.ordinal()
              .domain(domain)
              .rangePoints([HEIGHT - (margins.top + margins.bottom + padding.top + padding.bottom), 0]);

          } else if (options.scale_map[d] == "linear") {
            if (extents[d][0] === 0) {
              extents[d][0] = 0.01;
            }

            var primary_sites = _.map(data, (item) => {
              return item.primary_site;
            });

            var type = options.scale_map[d] ? options.scale_map[d] : scale_type;
            var yRange = HEIGHT - (margins.top + margins.bottom + padding.top + padding.bottom);
            var sites = primary_sites.sort(options.sorting[use] || d3.ascending);
            var indices = primary_sites.map(function(d,i){ return i  * 50; });
            var indices = primary_sites.map(function(d,i){ return i  * yRange / (indices ? indices.length : 1); });
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
          .attr("transform",function(d){
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
                    .html(function(d) {
                            return $filter("humanify")(d.tool_tip_text || d.id);
                          });

        title.filter((d) => { return d.is_subtype; })
          .call(tip)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        title.filter(function(d){
          return d.id===options.title_column;
        })
        .classed("first",true)
        .attr("transform","translate(-10,0)");

        title.selectAll("tspan")
        .data(function(d){
          return d.display_name;
        })
        .enter()
        .append("tspan")
        .attr("x", 0)
        .attr("y", function(d,i){
          // Magic numbers
          return i * 15 + (-5 - padding.top);
        })
        .text(function(d){
          return d;
        });

        if (options.superhead) {
          svg.append("g")
            .attr("height", 100)
            .attr("transform", function(d){
            var x = xscale(options.superhead.start) +
                    (0.5 * (xscale(options.superhead.end) - xscale(options.superhead.start))) +
                    padding.left + margins.left,
                y = 10;
              return "translate(" + x + "," + y + ")";
            })
            .append("text")
            .text(options.superhead.text)
            .style("text-anchor", "middle")
            .attr("class","title");

          svg.append("rect")
            .attr("width", () => {
              var width = xscale(options.superhead.end) - xscale(options.superhead.start);
              // no neg widths
              return width > 0 ? width : 0;
             } )
            .attr("height", 1)
            .attr("y", 15)
            .attr("x", xscale(options.superhead.start) + padding.left + margins.left);
        }

        var axis = column
          .filter(function(col){
            return options.scale_map[col] == "ordinal" && col != options.title_column;
          })
          .append("g")
          .attr("class", "axis")
          .attr("transform",function(d) {
            var x = 0,
                y = HEIGHT - (margins.bottom + margins.top + padding.bottom + 5);
            return "translate(" + x + "," + y + ")";
          });

        axis.append("line")
          .attr("x1", function(d) {
            return -(width_scales[d].range()[1] / 2);
          })
          .attr("y1", 0)
          .attr("x2", function(d) {
            return width_scales[d].range()[1] / 2;
          })
          .attr("y2", 0);

        var ticks = axis
          .selectAll("g.tick")
          .data(function(d){
            var ticks = [
              width_scales[d].domain()[1]
            ].map(function(v,i){
              return {
                value: v,
                x: (i===0?0:width_scales[d](v)/2),
                domain: width_scales[d].domain(),
                range: width_scales[d].range()
              }
            });

            return ticks;
          })
          .enter()
          .append("g")
          .attr("class", "tick")
          .classed("start",function(d){
            return d.x < 0;
          })
          .classed("end",function(d){
            return d.x>0;
          })
          .attr("transform",function(d){
            return "translate("+d.x+",0)";
          });

        // Magic Numbers
        ticks.append("line")
          .attr("x1", 0)
          .attr("y1", -3)
          .attr("x2", 0)
          .attr("y2", 3)

        ticks.append("text")
          .attr("x", 0)
          .attr("y", 12)
          .text(function(d) {
            return d3.format("s")(d.value);
          })
      }

      function updateAxes() {
        columns.selectAll("g.axis")
          .selectAll("g.tick")
          .data(function(d) {
            var ticks = [0, width_scales[d].domain()[1]]
                .map(function(v,i){
                  return {
                    value: i === 0 ? 0 : v,
                    x: (i === 0 ? 0 : width_scales[d](v) / 2),
                    domain: width_scales[d].domain(),
                    range: width_scales[d].range()
                  }
                });

            return ticks.concat(ticks.map(function(d) {
              return {
                value: d.value,
                x: -d.x
              };
            }));
          })
          .select("text")
          .text(function(d) {
            return d3.format("s")(d.value);
          })
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
          .data(function(d){
            return options.columns.filter(function(col) {
                return col != options.title_column;
            }).map(function(col){
              return {
                lang: d.key,
                column: col,
                value: d.values[col],
                ref: d.values[options.ref],
                href: options.urlMap ? options.urlMap[col] : undefined
              }
            });
          }, function(d) {
            return d.lang + "_" + d.column;
          });

        marker.exit().remove();

        var new_markers = marker.enter()
          .append("g")
          .attr("class", "marker")
          .classed("ordinal", function(d) {
            return options.scale_map[d.column] == "ordinal";
          })
          .attr("transform", function(d) {
            var x = xscale(d.column),
                y = yscales[d.column](d.value);

            return "translate(" + x + "," + y + ")";
          });

        new_markers
          .filter(function(d) {
            return options.scale_map[d.column] == "ordinal";
          })
          .append("rect")
          .attr("x", function(d){
            return 0;
          })
          .attr("y", -4)
          .attr("width", 0)
          .attr("height", 8)
          .style("fill", function(d){
            return options.color_groups[options.color_group_map[d.column]];
          });

        marker
          .transition()
          .duration(duration || options.duration)
          .attr("transform",function(d){
            var x = xscale(d.column),
                y = yscales[d.column](d.value/d.ref);

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
          .attr("x", (d) => {
            return -width_scales[d.column](d.value /
                   ((options.dimensions.indexOf(d.column) > -1) ? 1 : d.ref)) / 2;
          })
          .attr("width", (d) => {
            var width = width_scales[d.column](d.value /
                   ((options.dimensions.indexOf(d.column) > -1) ? 1 : d.ref));
            // no neg widths
            return width > 0 ? width : 0;
          });
      }

      function updateConnections(duration) {
        var connection = languages_group.selectAll(".lang")
          .select("g.connections")
            .selectAll("g.connection")
            .data(function(d) {
              var flattened = options.columns.map(function(col, i) {
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
                  } else {
                    val.x -= delta;
                    val2.x += delta;
                  }
                  val.y = d.values[use];
                  val2.y = d.values[use];

                  return [val, val2];
                } else {
                  var y = d.values[use] / ((options.dimensions.indexOf(use) > -1) ? 1 : d.values[options.ref]);
                  val.y = y;
                  val2.y = y;

                  val.x -= (i == 0 ? 0 : (width_scales[use](y)) / 2 + delta);
                  val2.x += ((i == options.columns.length - 1) ? 0 : (width_scales[use](y)) / 2 + delta);

                  return [val, val2];
                }
              })
              .reduce(function(a, b) {
                return a.concat(b);
              });

              return [{
                lang:d.key,
                path:flattened
              }];
            },function(d){
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
            .attr("class","line");

        var paths = ["line", "hover"];

        paths.forEach(function(p) {
          connection.select("path." + p)
          .transition()
          .duration(duration || options.duration)
          .attr("d",function(d) {
            return line(d.path);
          });
        });
      }

      function updateLabels(duration) {
        var labelAdjust = 25;
        var labels = labels_group
          .selectAll(".labels")
          .selectAll("g.label")
          .data(function(d){
            return options.columns.map(function(col) {
              var use = options.use[col] || col;
              return {
                lang: d.key,
                column: col,
                value: d.values[use],
                ref: d.values[options.ref],
                text_width: 0,
                marker_width: 0,
                href: options.urlMap ? options.urlMap[col] : undefined
              }
            })
          });

        var new_label = labels.enter()
          .append("g")
          .attr("class", "label")
          .classed("primary_site", function(d) {
            return d.column === "primary_site";
          });

        new_label
          .filter(function(d) {
            return d.column !== "primary_site" && d.column !== options.title_column;
          })
          .append("path");

        new_label
          .filter(function(d){
            return d.column !== "primary_site" && d.column !== options.title_column;
          })
          .append("text")
            .attr("x",0)
            .attr("y",4);

        new_label
          .filter(function(d){
            return d.column ==="primary_site";
          })
          .append("text")
          .attr("x", -10)
          .attr("y", 3)
          .attr("class", "visible-always");

        new_label.append("rect")
          .attr("class", "ix")
          .attr("y", -8)
          .attr("height", 15)
          .on("click", function(z, i, m) {
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
          .attr("x", function(d) {
            if (d.column === "primary_site") {
              return -10
            } else {
              return 0;
            }
          })
          .attr("transform","translate("+labelAdjust+",0)")
          .style("text-anchor",function(d){
            if (d.column === "primary_site") {
              return "start";
            } else {
              return "middle";
            }
          })
          .text(function(d){
            function id(a){
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
              } else {
                return commify(d.value);
              }
            } else {
              var t = d.value;
              if (t.length > 18) {
                t = t.slice(0,15).concat("...");
              }
              filter = filter || id;
              return filter(t);
            }

            // the following code block is unreachable
            if (d.column === "primary_site") {
              return d.value;
            } else if (d.column ==="Simple nucleotide variation") {
              return d.value;
            } else if(options.formats[d.column]) {
              return d3.format(options.formats[d.column])(d.value);
            } else if(options.dimensions.indexOf(d.column) > -1) {
              return d3.format(d.value>100?",.0f":",.2f")(d.value);
            } else {
              var y = d.valuefd.ref;
              return d3.format(y > 100 ? ",.0f" : ",.2f")(y);
            }
          })
          .each(function(d) {
            if (d.column === "primary_site") {
              d.marker_width = 10;
            } else {
              d.marker_width = width_scales[d.column](d.value /
                               ((options.dimensions.indexOf(d.column) > -1) ? 1 : d.ref));
            }

            d.text_width = this.getBBox().width;
          });


        labels
          .select("path")
          .attr("class", "label")
          .attr("d", function(d) {
            var dw = 10,
                w = d.text_width + dw;

            return "M" + (w / 2 + dw / 2) + ",0l-" + dw / 2 + ",-10l-" + w + ",0l0,20l" + w + ",0z";
          })
          .attr("x", 50)
          .attr("transform", "translate(" + labelAdjust + ",0)");

        labels
          .select("rect.ix")
            .attr("x", function(d) {
              if (d.column == options.title_column) {
                return -(padding.left + margins.left);
              }
              if (d.column == "primary_site") {
                return -40;
              } else {
                return d.text_width/2;
              }
            })
            .attr("width", function(d) {
              if (d.column == options.title_column) {
                return (padding.left + margins.left);
              } else {
                return d.marker_width + 20;
              }
            });

        labels
          .attr("transform", function(d) {

            var x = xscale(d.column),
                y = yscales[d.column](d.value);

            if (d.column === "primary_site") {
              return "translate(" + (x + 20) + "," + y + ")";
            }

            if (d[d.column] === 0) {
              y = yscales[d.column].range()[0];
            }

            if (options.dimensions.indexOf(d.column) === -1) {
              y = yscales[d.column](d.value / d.ref);
            }

            return "translate(" + (x - d.marker_width / 2 - d.text_width / 2 - 10) + "," + y + ")";
          });

        labels
          .filter(function(d) {
            return d.column === "primary_site";
          })
          .on("mouseover", function(d) {
            labels_group
            .selectAll(".labels")
            .classed("hover", function(l) {
              return l.values.primary_site == d.value;
            });

            languages_group
            .selectAll(".lang")
            .classed("hover", function(l) {
                return l.values.primary_site == d.value;
            });
          });

        var projectTip = d3.tip()
                    .attr("class", "tooltip")
                    .offset([-5, 0])
                    .html(function(d) {
                      return _.find(nested_data, {key: d.lang}).values.name;
                    });

          labels.filter((d) => {
              return d.column === "project_id";
          })
          .call(projectTip)
          .on("mouseover", projectTip.show)
          .on("click", projectTip.hide)
          .on("mouseout", projectTip.hide);

        // Mouseover trigger for highlighting all paths that cross through
        // a label that isn't primary site or project id
        labels
        .filter(function(d) {
          return d.column !== "primary_site" && d.column !== "project_id";
        })
        .on("mouseover", function(d) {
          labels_group
          .selectAll(".labels")
          .classed("hover", function(l) {
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
          .attr("transform", function(d) {
            var x = xscale(options.title_column),
                y = yscales[options.title_column].range()[0];

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
          .text(function(d) {
            return d.values[options.title_column];
          });
      }

      function updateLangLabels(duration) {
        languages_group.selectAll(".lang")
          .select("g.lang-label")
            .transition()
            .duration(duration || options.duration)
            .attr("transform", function(d) {
              var use = options.use[options.title_column] || options.title_column;
              var x = xscale(options.title_column),
                  y = yscales[options.title_column](d.values[use]);

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
    }
  }

  angular
      .module("githut.controllers", [])
      .controller("GitHutController", GitHutController);
}

