import { isNumber, uniq } from 'lodash';

declare var d3: Object; // requires d3 v3

const padding = { left: 100, right: 300, top: 60, bottom: 30 };
const languageLabelAdjust = 25;

export default function(params) {
  const defaultDuration = params.duration || 1000;
  const titleColumn = params.titleColumn || 'project_id';
  const data = params.data;
  const columnMap = params.columns.reduce((m, c) => ({ ...m, [c.id]: c }), {});

  params.container.innerHTML = '';

  var totalWidth = params.container.offsetWidth;
  var innerWidth = totalWidth - padding.left - padding.right;

  const primary_sites = uniq(
    data.reduce((sites, project) => {
      return [...sites, ...project.primary_site];
    }, []),
  );

  var totalHeight = 80 + Math.max(data.length, primary_sites.length) * 15;
  var innerHeight = totalHeight - padding.top - padding.bottom;

  var markerMaxWidth = innerWidth / params.columns.length;

  var xScale = d3.scale
    .ordinal()
    .domain(
      params.columns.map(function(c) {
        return c.id;
      }),
    )
    .rangePoints([0, innerWidth]);

  var svg = d3
    .select(params.container)
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight)
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (padding.left + languageLabelAdjust) +
        ',' +
        padding.top +
        ')',
    );

  var languagesGroup = svg.append('g').attr('id', 'languages');
  var labelsGroup = svg.append('g').attr('id', 'labels');
  var columns = svg.append('g').attr('id', 'columns');

  labelsGroup
    .selectAll('g.labels')
    .data(
      data.reduce((acc, project) => {
        return [
          ...acc,
          ...project.primary_site.map(p => ({
            ...project,
            primary_site: [p],
          })),
        ];
      }, []),
      function(d) {
        return `${d[titleColumn]}${d.primary_site[0]}`;
      },
    )
    .enter()
    .append('g')
    .attr('class', 'labels')
    .attr('rel', function(d) {
      return d[titleColumn];
    })
    .on('mouseover', function(d) {
      d3.select(this).classed('hover', true);
      languagesGroup
        .selectAll("g.lang[rel='" + d[titleColumn] + "']")
        .classed('hover', true);
    })
    .on('mouseout', function() {
      svg
        .selectAll('g.hover,g.primary_site')
        .classed('hover', false)
        .classed('primary_site', false);
    });

  var language = languagesGroup
    .selectAll('g.lang')
    .data(data, function(d) {
      return d[titleColumn];
    })
    .enter()
    .append('g')
    .attr('class', 'lang')
    .attr('rel', function(d) {
      return d[titleColumn];
    });

  var line = d3.svg
    .line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      if (d.y === 0) {
        return columnMap[d.col].yScale.range()[0];
      } else {
        return columnMap[d.col].yScale(d.y);
      }
    });

  var drawn_primary_sites = [];

  function updateScales() {
    const sites = primary_sites.slice();

    params.columns.forEach(function(column) {
      var id = column.id;
      var sortKey = column.sortKey || id;
      var sorting = column.sorting || d3.ascending;
      var minMax = d3.extent(data, function(data) {
        return data[id];
      });

      if (column.scale === 'ordinal') {
        var domain = data
          .slice()
          .sort(function(a, b) {
            return sorting(a[sortKey], b[sortKey]);
          })
          .map(function(o) {
            return o[id];
          });
        column.yScale = d3.scale
          .ordinal()
          .domain(domain)
          .rangePoints([innerHeight, 0]);
      } else if (column.scale === 'linear') {
        sites.sort(column.sorting || d3.ascending);
        var indices = sites.map(function(d, i) {
          return i * innerHeight / sites.length;
        });
        column.yScale = d3.scale
          .ordinal()
          .domain(sites)
          .range(indices);
      }

      column.widthScale = d3.scale
        .linear()
        .domain([0, minMax[1]])
        .range([2, markerMaxWidth])
        .nice();
    });
  }

  function addAxes() {
    var column = columns
      .selectAll('g.column')
      .data(params.columns)
      .enter()
      .append('g')
      .attr('class', 'column')
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.id) + ',0)';
      });

    var title = column
      .append('text')
      .attr('class', 'title')
      .attr('x', 0)
      .attr('y', 0);

    var tip = d3
      .tip()
      .attr('class', 'tooltip')
      .offset([-5, 0])
      .html(function(d) {
        return d.tool_tip_text || d.id;
      });

    title
      .filter(d => {
        return d.isSubtype;
      })
      .call(tip)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    title
      .filter(function(d) {
        return d.id === titleColumn;
      })
      .classed('first', true)
      .attr('transform', 'translate(-10,0)');

    var fontHeight = 12;
    title
      .selectAll('tspan')
      .data(function(d) {
        return d.displayName.map(function(text, i, arr) {
          return { text: text, total: arr.length };
        });
      })
      .enter()
      .append('tspan')
      .attr('x', 0)
      .attr('y', function(d, i) {
        return -(d.total - i) * fontHeight;
      })
      .text(function(d) {
        return d.text;
      });

    var axis = column
      .filter(function(col) {
        return col.scale === 'ordinal' && col.id !== titleColumn;
      })
      .append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + (innerHeight + 8) + ')')
      .classed('start', function(d) {
        return d.x < 0;
      })
      .classed('end', function(d) {
        return d.x > 0;
      });

    var tickHeight = 6;
    axis
      .append('line')
      .attr('x1', function(d) {
        return -(d.widthScale.range()[1] / 2);
      })
      .attr('x2', function(d) {
        return d.widthScale.range()[1] / 2;
      })
      .attr('y1', tickHeight / 2)
      .attr('y2', tickHeight / 2);

    axis
      .append('line')
      .attr('y1', 0)
      .attr('y2', tickHeight);

    axis
      .append('text')
      .attr('y', tickHeight + fontHeight)
      .text(function(d) {
        return d3.format('s')(d.widthScale.domain()[1]);
      });
  }

  function createLanguages(languages) {
    languages.append('g').attr('class', 'connections');

    languages.append('g').attr('class', 'markers');

    var languageLabel = languages
      .append('g')
      .attr('class', 'lang-label')
      .attr('transform', function(d) {
        var x = xScale(titleColumn);
        var y = columnMap[titleColumn].yScale.range()[0];

        return 'translate(' + x + ',' + y + ')';
      });

    languageLabel
      .append('rect')
      .attr('x', -padding.left - languageLabelAdjust)
      .attr('width', padding.left + languageLabelAdjust)
      .attr('y', -9)
      .attr('height', 16);

    languageLabel
      .append('text')
      .attr('x', -10)
      .attr('y', 3)
      .text(function(d) {
        return d[titleColumn];
      });
  }

  function updateConnections(duration) {
    var connection = languagesGroup
      .selectAll('.lang')
      .select('g.connections')
      .selectAll('g.connection')
      .data(
        function(d) {
          return d.primary_site.map((site, i) => {
            const flattened = params.columns
              .slice(i && -2) // for primary sites after the first, we only need to render the last 2 segments.
              .map(function(column, i) {
                var key = column.id;
                var y = key === 'primary_site' ? [site] : d[key];

                var val = { x: xScale(key), col: key, y: y, test: 'true' };
                var val2 = {
                  x: xScale(key),
                  col: key,
                  y: y,
                  test: 'true1',
                };

                var delta = 5;

                if (typeof y === 'number') {
                  val.x -= i === 0 ? 0 : column.widthScale(y) / 2 + delta;
                  val2.x +=
                    i === params.columns.length - 1
                      ? 0
                      : column.widthScale(y) / 2 + delta;
                } else {
                  val.x -= delta;
                  val2.x += delta;
                }

                return [val, val2];
              })
              .reduce(function(a, b) {
                return a.concat(b);
              });
            return {
              key: `${d[titleColumn]}${site}`,
              path: flattened,
            };
          });
        },
        function(d) {
          return d.key;
        },
      );

    connection.exit().remove();

    var new_connection = connection
      .enter()
      .append('g')
      .attr('class', 'connection');

    var paths = ['line', 'hover'];

    paths.forEach(function(p) {
      new_connection.append('path').attr('class', p);
      connection
        .select('path.' + p)
        .transition()
        .duration(duration || defaultDuration)
        .attr('d', function(d) {
          return line(d.path);
        });
    });
  }

  function updateMarkers(duration) {
    var marker = languagesGroup
      .selectAll('.lang')
      .select('g.markers')
      .selectAll('g.marker')
      .data(
        function(d) {
          return params.columns
            .filter(function(col) {
              return col.id !== titleColumn;
            })
            .map(function(col) {
              return {
                projectId: d[titleColumn],
                columnId: col.id,
                value: d[col.id],
                onClick: col.onClick,
              };
            });
        },
        function(d) {
          return d.projectId + '_' + d.columnId;
        },
      );

    marker.exit().remove();

    var new_markers = marker
      .enter()
      .append('g')
      .attr('class', 'marker')
      .classed('ordinal', function(d) {
        return columnMap[d.columnId].scale === 'ordinal';
      })
      .attr('transform', function(d) {
        var x = xScale(d.columnId);
        var y = columnMap[d.columnId].yScale(d.value);

        return 'translate(' + x + ',' + y + ')';
      });

    new_markers
      .filter(function(d) {
        return columnMap[d.columnId].scale === 'ordinal';
      })
      .append('rect')
      .attr('x', function(d) {
        return 0;
      })
      .attr('y', -4)
      .attr('width', 0)
      .attr('height', 8)
      .style('fill', function(d) {
        return columnMap[d.columnId].color;
      });

    marker
      .transition()
      .duration(duration || defaultDuration)
      .attr('transform', function(d) {
        var x = xScale(d.columnId);
        var y = columnMap[d.columnId].yScale(d.value);

        return 'translate(' + x + ',' + y + ')';
      });

    marker
      .select('rect')
      .transition()
      .duration(defaultDuration)
      .attr('x', d => {
        var x = -columnMap[d.columnId].widthScale(d.value) / 2;
        return isNaN(x) ? 0 : x;
      })
      .attr('width', d => {
        var width = columnMap[d.columnId].widthScale(d.value);
        // no neg widths
        return isNaN(width) ? 0 : Math.max(0, width);
      });
  }

  function updateLabels(duration) {
    var labelAdjust = 25;
    var labels = labelsGroup
      .selectAll('.labels')
      .selectAll('g.label')
      .data(function(d) {
        return params.columns.map(function(column) {
          return {
            projectId: d[titleColumn],
            columnId: column.id,
            value: d[column.id],
            text_width: 0,
            marker_width: 0,
            onClick: column.onClick,
          };
        });
      });

    var newLabels = labels
      .enter()
      .append('g')
      .attr('class', 'label')
      .classed('primary_site', function(d) {
        return d.columnId === 'primary_site';
      });

    var newLabelDataColumns = newLabels.filter(function(d) {
      return d.columnId !== 'primary_site' && d.columnId !== titleColumn;
    });
    newLabelDataColumns.append('path');
    newLabelDataColumns
      .append('text')
      .attr('x', 0)
      .attr('y', 4);

    newLabels
      .filter(function(d) {
        return d.columnId === 'primary_site';
      })
      .append('text')
      .attr('x', -10)
      .attr('y', 3)
      .attr('class', 'visible-always');

    newLabels
      .append('rect')
      .attr('class', 'ix')
      .attr('y', -8)
      .attr('height', 15)
      .on('click', function(z) {
        if (z.onClick && z.value) {
          z.onClick(z);
        }
      });

    labels.selectAll('path.label').attr('d', 'M0,0L0,0');

    labels
      .selectAll('rect.ix')
      .attr('width', 0)
      .attr('x', 0);

    labels
      .select('text')
      .attr('x', function(d) {
        if (d.columnId === 'primary_site') {
          return -10;
        } else {
          return 0;
        }
      })
      .attr('transform', 'translate(' + labelAdjust + ',0)')
      .style('text-anchor', function(d) {
        return d.columnId === 'primary_site' ? 'start' : 'middle';
      })
      .text(function(d) {
        var filter =
          columnMap[d.columnId].format ||
          function(value) {
            return value;
          };

        // TODO: should support projects with multiple primary sites
        if (d.columnId === 'primary_site') {
          if (drawn_primary_sites.some(dps => d.value.includes(dps))) {
            return '';
          } else {
            drawn_primary_sites = drawn_primary_sites.concat(d.value);
          }
        }

        if (isNumber(d.value)) {
          return filter(parseInt(d.value, 10)).toLocaleString();
        } else {
          var t = d.value || '';
          if (t.length > 18) {
            t = t.slice(0, 15).concat('...');
          }
          return filter(t);
        }
      })
      .each(function(d) {
        if (d.columnId === 'primary_site') {
          d.marker_width = 10;
        } else {
          d.marker_width = columnMap[d.columnId].widthScale(d.value);
        }

        d.text_width = this.getBBox().width;
      });

    labels
      .select('path')
      .attr('class', 'label')
      .attr('d', function(d) {
        var dw = 10;
        var w = d.text_width + dw;

        return (
          'M' +
          (w / 2 + dw / 2) +
          ',0l-' +
          dw / 2 +
          ',-10l-' +
          w +
          ',0l0,20l' +
          w +
          ',0z'
        );
      })
      .attr('x', 50)
      .attr('transform', 'translate(' + labelAdjust + ',0)');

    labels
      .select('rect.ix')
      .attr('x', function(d) {
        if (d.columnId === titleColumn) {
          return -padding.left;
        }
        if (d.columnId === 'primary_site') {
          return -40;
        } else {
          return d.text_width / 2;
        }
      })
      .attr('width', function(d) {
        if (d.columnId === titleColumn) {
          return padding.left;
        } else {
          return isNaN(d.marker_width) ? 20 : d.marker_width + 20;
        }
      });

    labels.attr('transform', function(d) {
      var x = xScale(d.columnId);
      var y = columnMap[d.columnId].yScale(d.value);

      if (d.columnId === 'primary_site') {
        return 'translate(' + (x + 20) + ',' + y + ')';
      }

      if (d[d.columnId] === 0) {
        y = columnMap[d.columnId].yScale.range()[0];
      }

      return (
        'translate(' +
        (x -
          (isNaN(d.marker_width) ? 20 : d.marker_width) / 2 -
          d.text_width / 2 -
          10) +
        ',' +
        y +
        ')'
      );
    });

    labels
      .filter(function(d) {
        return d.columnId === 'primary_site';
      })
      .on('mouseover', function(d) {
        labelsGroup.selectAll('.labels').classed('hover', function(l) {
          return l.primary_site.some(p => d.value.includes(p));
        });

        languagesGroup.selectAll('.lang').classed('hover', function(l) {
          return l.primary_site.some(p => d.value.includes(p));
        });
      });

    var projectTip = d3
      .tip()
      .attr('class', 'tooltip')
      .offset([-5, 0])
      .html(function(d) {
        return data.find(nested => nested[titleColumn] === d.projectId).name;
      });

    labels
      .filter(d => {
        return d.columnId === 'project_id';
      })
      .call(projectTip)
      .on('mouseover', projectTip.show)
      .on('click', projectTip.hide)
      .on('mouseout', projectTip.hide);

    // Mouseover trigger for highlighting all paths that cross through
    // a label that isn't primary site or project id
    labels
      .filter(function(d) {
        return d.columnId !== 'primary_site' && d.columnId !== 'project_id';
      })
      .on('mouseover', function(d) {
        labelsGroup.selectAll('.labels').classed('hover', function(l) {
          var ret = l[d.columnId] === d.value;

          // Don't forget to ensure the connecting lines themselves
          // are highlighted
          if (ret) {
            languagesGroup
              .selectAll("g.lang[rel='" + l[titleColumn] + "']")
              .classed('hover', true);
          }

          return ret;
        });
      });
  }

  function updateLangLabels(duration) {
    languagesGroup
      .selectAll('.lang')
      .select('g.lang-label')
      .transition()
      .duration(duration || defaultDuration)
      .attr('transform', function(d) {
        var x = xScale(titleColumn);
        var y = columnMap[titleColumn].yScale(d[titleColumn]);
        return 'translate(' + x + ',' + y + ')';
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
