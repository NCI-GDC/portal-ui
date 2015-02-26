module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;
        import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

  export interface IReportsController {
    reports: IReports;
  }
  export interface IReportController {
    report: IReport;
  }

  class ReportsController implements IReportsController {

    /* @ngInject */
    constructor(private CoreService: ICoreService, $scope,ReportsService, $q,ProjectsService,$timeout) {   

      CoreService.setPageTitle("Reports");
        
        ReportsService.getReports().then(function(a){
          CoreService.setSearchModelState(true);
          
            ProjectsService.getProjects({
        fields: [
          "disease_type",
          "project_name",
          "status",
          "program",
          "project_code",
          "primary_site",
          "summary.file_size",
          "summary.participant_count",
          "summary.data_file_count",
          "summary.data_types.data_type",
          "summary.data_types.participant_count",
          "summary.data_types.file_count",
          "summary.experimental_strategies.participant_count",
          "summary.experimental_strategies.file_count",
          "summary.experimental_strategies.experimental_strategy"
        ],
        facets: [
          "program",
          "disease_type",
          "primary_site",
          "summary.experimental_strategies.experimental_strategy",
          "summary.data_types.data_type"
        ],
        size: 100
      }).then((projects) => {
    
          
         
     
   
          
           var columns = [{
          id:'project_code',
          display_name:["Project","Code"],
          scale:'ordinal',
          dimensional:true
        },
        {
          id:'file_count',
          display_name:["File","Count"],
          scale:'ordinal',
          dimensional:true
        },
                          {
          id:'Clinical',
          display_name:['Clinical'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },
                          {
          id:'Raw microarray data',
          display_name:['Array'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },
                            {
          id:'Raw sequencing data',
          display_name:['Seq'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'Simple nucleotide variation',
          display_name:['SNV'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },
                          {
          id:'Copy number variation',
          display_name:['CNV'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'Structural rearrangement',
          display_name:['SV'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'Gene expression',
          display_name:['Exp'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'Protein expression',
          display_name:['PExp'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'Other',
          display_name:['Other'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'DNA methylation',
          display_name:['Meth'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },
        {
          id:'file_size',
          display_name:["File","Size"],
          scale:'ordinal',
          dimensional:true
        },
        {
          id:'primary_site',
          display_name:["Primary","Site"],
          scale:'linear',
          dimensional:true
        }
                         ];
          
          var aggregations = a.reduce(function(a,b){

            if (a[b.archive.disease_code]) {
              var record = a[b.archive.disease_code];
              record.file_size += b.file_size;
              record.file_count+=1;
              if (record[b.data_type]) {
                record[b.data_type] += 1;
              } else {
                record[b.data_type] = 1;
              }
            
            } else {


              var project = projects.hits[projects.hits.map(function(a){return a.project_code}).indexOf(b.archive.disease_code)]
                if (!_.contains(primary_sites,project.primary_site)){
                  primary_sites.push(project.primary_site);    
              } 
              a[b.archive.disease_code] = {
                file_size:b.file_size,
                project_code:b.archive.disease_code,
                primary_site:project.primary_site,
                file_count:1
              };
              
              a[b.archive.disease_code][b.data_type] = 1;
           
            }
            return a;
          },{});
          
  
          
        var config = {

          /* the id of the tag the table will be generated into */
          container:"#pc",

          /* default scale value, not useful */
          scale:"ordinal",

          /* Ordered list of columns. Only titles appearing here appear in the table */
          columns:columns.map(function(c){return c.id}),

          /* ???
         * The value that all the other values are divided by?
         * Has something to do with dimensions?
         **/
          ref:"lang_usage",

          /**
         * No idea what title_column does.
        **/
          title_column:"project_code",

          /**
         * Not really a scale map, more a map of what kind of column it will be.
         * Ordinal is the more geometry-oriented choice
         */
          scale_map:columns.reduce(function(a,b){
            a[b.id] = b.scale || 'ordinal';
            return a;
          },{}),

          /**
         * Interconnected with ref and dimension, possibly.
         * No idea what this does, really.
         */
          use:{
            "project_code":"project_code"
          },
          sorting:{
            "project_code":function(a,b){
              var proj1 = aggregations[a];
              var proj2 = aggregations[b];
              
              
              if (proj1.file_count > proj2.file_count) {
                return 1;
              } else {
                return -1;
              }
              
            }
          },

          /**
         *  Don't know what "d" is here.
         *  If defined for a column, formats the labels.
         *  Might not be implemented anywhere.
         */
          formats:{
            "primary_site":"d"
          },

          /**
         *  Not known what this is. Any values in columns that are not in dimensions causes an error.
         */
          dimensions:columns.filter(function(c){return c.dimensional}).map(function(c){return c.id}),

          /**
         *  Name for each column.
         **/
          column_map:columns.reduce(function(a,b){
            a[b.id] = b.display_name || ['Untitled'];
            return a;
          },{}),

          /**
         * Related to animation
         */
          duration:1000,
        };
        
        $timeout(function(){
        
        
        $scope.githutConfig = config;
        $scope.githutData = d3.values(aggregations);
          },500);
          
        var dummymap = __reports_dummy_data__.hits.hits.map(function(z){
          return z._source;
        })

        $scope.byProject = dataNest('project_code').entries(dummymap);
        $scope.byDisease = dataNest('disease_type').entries(dummymap);
        $scope.byProgram = dataNest('program').entries(dummymap);
              
        $scope.byDataType = dataNest('data_type').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.data_types);
          return a;
        },[]));
              
        $scope.byStrat = dataNest('experimental_strategy').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.experimental_strategies);
          return a;
        },[]));
              
        $scope.byUserType = dataNest('user_type').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.user_types);
          return a;
        },[]));
              
        $scope.byLocation = dataNest('country').entries(dummymap.reduce(function(a,b){
          a = a.concat(b.countries);
          return a;
        },[]));
              
   
        function dataNest(key){
          return d3.nest()
            .key(function(d){return d[key]})
            .rollup(function(d){
              return {
                file_count:d3.sum(d.map(function(x){return x.count})),
                file_size:d3.sum(d.map(function(x){return x.size_in_mb})),
              }
            })
           .sortValues(function(a,b){return a.file_count - b.file_count});

         }
            
         console.log("The goods.",dummymap, $scope);
          
          
            
          
        });
      
      });
    }
                               
  
  }

  class ReportController implements IReportController {

    /* @ngInject */
    constructor(public report: IReport, private CoreService: ICoreService, $timeout) {
      CoreService.setPageTitle("Report", report.id);

    }
  }

  angular
      .module("reports.controller", [
        "reports.services",
        "core.services"
      ])
      .controller("ReportController", ReportController)
      .directive("reportsBarChart",function(){
          return {
            restrict:"AE",
            scope:{
              data:'=',
                rotateAxisText:'='
            },
            controller:function($scope,$element){
                
          // charts
          // chart1
          var margin = {top: 20, right: 30, bottom: $scope.rotateAxisText ? 90 : 30, left: 40},
                width = 450 - margin.left - margin.right,
                height = ($scope.rotateAxisText ? 310 : 210) - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var chart = d3.select($element[0]).append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            
            var data = $scope.data;
            
              x.domain(data.map(function(d) { return d.name; }));
              y.domain([0, d3.max(data, function(d) { return d.value; })]);
            
            var colors = d3.scale.category20();

            var xAxis = chart.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
            
            if ($scope.rotateAxisText){
            xAxis
            .selectAll("text")  
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function(d) {
                        return "rotate(-45)" 
                        });

            }
                   
              chart.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);

              chart.selectAll(".bar")
                  .data(data)
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d.name); })
                  .attr("y", function(d) { return y(d.value); })
                  .attr("height", function(d) { return height - y(d.value); })
                  .attr('fill',function(d,i){return colors(i)})
                  .attr("width", x.rangeBand());

            }
          }
       })
      .directive("reportsPieChart",function(){
          return {
            restrict:"A",
              scope: {
                data:'='
              },
              controller:function($scope, $element){
             var width = 450,
                height = 250,
                radius = Math.min(width, height) / 2;

            var color = d3.scale.ordinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.population; });

            var svg = d3.select($element[0]).append("svg")
                .attr("width", width)
                .attr("height", height)
              .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//            d3.csv("data.csv", function(error, data) {
//            debugger;
//              var data = $scope.data;
//              var data = [{
//                age:25,
//                population: 100000
//              },{
//                age:45,
//                population: 76000
//              }];
                  
                  var data = $scope.data.map(function(a){return {age:a.data_type,population:a.count}})

              data.forEach(function(d) {
                d.population = +d.population;
              });

              var g = svg.selectAll(".arc")
                  .data(pie(data))
                .enter().append("g")
                  .attr("class", "arc");

              g.append("path")
                  .attr("d", arc)
                  .style("fill", function(d) { return color(d.data.age); });

              g.append("text")
                  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                  .attr("dy", ".35em")
                  .attr('class','pie-text')
                  .style("text-anchor", "middle")
                  .text(function(d) { return d.data.age; });

//            });
              }
          }
       })
      .controller("ReportsController", ReportsController);
}

var __reports_dummy_data__ = {
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "failed" : 0
  },
  "hits" : {
    "total" : 4,
    "max_score" : 1.0,
    "hits" : [ {
      "_index" : "test",
      "_type" : "report",
      "_id" : "3",
      "_score" : 1.0,
      "_source":{        "date": "2015-02-07T01:00:00-05:00",		"project_code": "OV",	    "program": "TCGA",	    "primary_site": "Ovary",	    "disease_type": "",	    "size_in_mb": 2875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 23454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
    }, {
      "_index" : "test",
      "_type" : "report",
      "_id" : "2",
      "_score" : 1.0,
      "_source":{        "date": "2015-02-06T01:00:00-05:00",		"project_code": "GBM",	    "program": "TCGA",	    "primary_site": "Brain",	    "disease_type": "",	    "size_in_mb": 3875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632643,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 23454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
    }, {
      "_index" : "test",
      "_type" : "report",
      "_id" : "1",
      "_score" : 1.0,
      "_source":{        "date": "2015-02-06T01:00:00-05:00",		"project_code": "OV",	    "program": "TCGA",	    "primary_site": "Ovary",	    "disease_type": "",	    "size_in_mb": 2875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632643,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
    }, {
      "_index" : "test",
      "_type" : "report",
      "_id" : "4",
      "_score" : 1.0,
      "_source":{        "date": "2015-02-07T01:00:00-05:00",		"project_code": "GBM",	    "program": "TCGA",	    "primary_site": "Brain",	    "disease_type": "",	    "size_in_mb": 3875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632643,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 23454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
    } ]
  }
}


//debugger;