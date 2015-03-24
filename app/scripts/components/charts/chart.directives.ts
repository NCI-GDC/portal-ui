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
      scope: {
        data: "=",
        config:'='
      },
      link: function($scope: IPieChartScope, element: ng.IAugmentedJQuery) {
        var color = d3.scale.category20();

        var data = $scope.data;
        var config = $scope.config;

        var width = 450,
          height = 175,
          radius = Math.min(width, height) / 2;
        
       var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d.value; });
		  
		var svg = d3.select(element[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 3.5 + "," + height / 2 + ")");
          
          
		var arc = d3.svg.arc()
		  .outerRadius(radius - 10)
		  .innerRadius(0);

        
        $scope.$watch('data',function(a){
          updateChart();
        })
		
		var path = svg.datum(data).selectAll("path")
			.data(pie)
			.enter().append("path")
			.attr("fill", function(d, i) { return color(i); })
			.attr("d", arc)
			.each(function(d) { this._current = d; }); // store the initial angles
		  
		var legendX = 125;
		var legendStartY = -5;
		var legendSpaceEach = 55;

		var legendSquares = svg.selectAll('rect')
		.data(data,function(a){
		  return a.key;
		})
		.enter()
		  .append('rect')
		  .attr('width',25)
		  .attr('height',25)
		  .attr("transform", function(d,i) { return "translate(" + legendX +","+ (legendStartY + legendSpaceEach * (i - 1)) + ")"; })
		  .style("fill",function(d,i){return color(i)})

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
		
		
        
        function updateChart(){
			var data = $scope.data;
			
			path.datum(data);
          
			path = path.data(pie(data)); // compute the new angles
			path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
			
			legendText
			.data(data)
			  .text(function(d) { return config.legend[d.key].replace('%!%',d.value)})
			  .attr('y',0)
			  .attr('dy',0)
			  .call(wrap, 150)
			  .attr('class','pie-legend-text');

       
          
     
         
	    }
		  
		function arcTween(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) {
			return arc(i(t));
		  };
		}  

      }
    };
  }

  angular.module("components.charts", [])
      .directive("pieChart", PieChart);
}

