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
		
//		var g = svg.selectAll(".arc")
//		  .data(pie(data))
//		  .enter().append("g")
//		  .attr("class", "arc");
//
//		g.append("path")
//		  .attr("d", arc)
//		  .style("fill", function(d,i) { return color(i); });
		
		var path = svg.datum(data).selectAll("path")
			.data(pie)
			.enter().append("path")
			.attr("fill", function(d, i) { return color(i); })
			.attr("d", arc)
			.each(function(d) { this._current = d; }); // store the initial angles
        
        function updateChart(){
			console.log("update data.");
            var data = $scope.data;
			pie.value(function(d) { return d.value; }); // change the value function
//			path = path.data(pie); // compute the new angles
//			path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

       
          
     
         
	    }

      }
    };
  }

  angular.module("components.charts", [])
      .directive("pieChart", PieChart);
}

