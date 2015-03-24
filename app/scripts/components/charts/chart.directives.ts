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
        
        function updateChart(){
			var data = $scope.data;
			
			path.datum(data);
          
			path = path.data(pie(data)); // compute the new angles
			path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

       
          
     
         
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

