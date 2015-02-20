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
    constructor(private CoreService: ICoreService, $scope,ReportsService, $q,ProjectsService) {   

      CoreService.setPageTitle("Reports");
        
        ReportsService.getReports().then(function(a){
          CoreService.setSearchModelState(true);
          console.log("raw thing from reports",a);
          
         
     
   
          
           var columns = [{
          id:'project_code',
          display_name:["Project","Code"],
          scale:'ordinal',
          dimensional:true
        },{
          id:'file_size',
          display_name:["File","Size"],
          scale:'ordinal',
          dimensional:true
        },{
          id:'file_count',
          display_name:["File","Count"],
          scale:'ordinal',
          dimensional:true
        },{
          id:'Clinical',
          display_name:['Clinical'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'Raw microarray data',
          display_name:['Array'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
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
        },{
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
        },{
          id:'primary_site',
          display_name:["Primary","Site"],
          scale:'linear',
          dimensional:true
        }];
          
          var aggregations = a.reduce(function(a,b){
//            debugger;
            if (a[b.archive.disease_code]) {
              var record = a[b.archive.disease_code];
              record.file_size += b.file_size;
              if (record[b.data_type]) {
                record[b.data_type] += 1;
              } else {
                record[b.data_type] = 1;
              }
            
            } else {
              a[b.archive.disease_code] = {
                file_size:b.file_size,
              };
              
              a[b.archive.disease_code][b.data_type] = 1;
           
            }
            return a;
          },{});
          
          console.log("aggregationes?",aggregations);

          
          
//        var aggregations = d3.keys(project_codes).reduce(function(x,key){
////          debugger;
//          
////          var group = project_codes[key];
////          var types = group.summary.data_types;
////
////          if (!_.contains(primary_sites,group.primary_site)){
////            primary_sites.push(group.primary_site);    
////          } 
////
//          var the_returned = {
//
////            project_code:key,
////            primary_site:group.primary_site,
////            file_count:group.summary.data_file_count,
////            file_size:group.summary.file_size,
////            participant_count:group.summary.participant_count,
//
//          }
////
//          columns
//          .filter(function(c){return c.is_subtype})
//          .forEach(function(s){
////            var thing = findTheThing(types,s.id,"data_type");
////            the_returned[s.id] = thing ? thing.file_count : 0;
//          })   
////
////          a[key] = the_returned;
////          return a;
//        },{});    
//          
          console.log("Aggregations from reports...",aggregations);
          
//               debugger;
          
          $scope.filesByProject = a.reduce(function(a,b){
             var project = b.archive.disease_code;
             var k = {
               project:project,
               count: 1,
               file_size: b.file_size
             }
             var g = _.find(a,function(c){return c.project === project});
             if (g) {
               g.count ++;
               g.file_size += b.file_size;
             } else {
               a.push(k);
             }
              
             return a;
          },[]);
            
          $scope.projectChartData = $scope.filesByProject.map(function(x){
                return {
                    name: x.project,
                    value: x.count
                }
            });
            
          $scope.filesByType = a.reduce(function(a,b){
             var data_type = b.data_type;
             var k = {
               data_type:data_type,
               count: 1,
               file_size: b.file_size
             }
             var g = _.find(a,function(c){return c.data_type === data_type});
             if (g) {
               g.count ++;
               g.file_size += b.file_size;
             } else {
               a.push(k);
             }
              
             return a;
          },[]);
            
         $scope.filesBySubtype = a.reduce(function(a,b){
             var data_subtype = b.data_subtype;
             var k = {
               data_subtype:data_subtype,
               count: 1,
               file_size: b.file_size
             }
             var g = _.find(a,function(c){return c.data_subtype === data_subtype});
             if (g) {
               g.count ++;
               g.file_size += b.file_size;
             } else {
               a.push(k);
             }
              
             return a;
          },[]);
            
             $scope.subtypeChartData = $scope.filesBySubtype.map(function(x){
                return {
                    name: x.data_subtype,
                    value: x.count
                }
            });
            
            
            
        $scope.filesByDataLevel = a.reduce(function(a,b){
             var data_level = b.data_level;
             var k = {
               data_level:data_level,
               count: 1,
               file_size: b.file_size
             }
             var g = _.find(a,function(c){return c.data_level === data_level});
             if (g) {
               g.count ++;
               g.file_size += b.file_size;
             } else {
               a.push(k);
             }
              
             return a;
          },[]);
            
        $scope.filesByAccess = a.reduce(function(a,b){
             var data_access = b.data_access;
             var k = {
               data_access:data_access,
               count: 1,
               file_size: b.file_size
             }
             var g = _.find(a,function(c){return c.data_access === data_access});
             if (g) {
               g.count ++;
               g.file_size += b.file_size;
             } else {
               a.push(k);
             }
              
             return a;
          },[]);
            
            
         $scope.filesByStrategy = [{
            strategy:"unknown",
            count: 0,
            file_size: 0
         }];
         
         $scope.filesByLocation = [{
            location:"unknown",
            count: 0,
            file_size: 0
         }];
            
        $scope.filesByUserAccess = [{
            access:"unknown",
            count: 0,
            file_size: 0
         }];
            
            
            
            
          $scope.filesByProgram = [{
              program:'TCGA',
              count:395,
              file_size:129034893
          }]
          
          $scope.filesByPrimarySite = [{
              primary_site:'Lung',
              count:212,
              file_size:12903323
          },{
              primary_site:'Heart',
              count:19,
              file_size:3266746
          },{
              primary_site:'Skin',
              count:84,
              file_size:6293859
          }]
          
          
            
          
        });
      
      
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
      }).then((data) => {
        this.projects = data;
        //          githutTable(data);
         
           console.log("raw thing from projects",data.hits);

        d3.select("svg")
        .remove();

        var hits = data.hits;

        function findTheThing(array,data_type,propname){
          return _.find(array,function(type){return type[propname] === data_type})
        } 

        var project_codes = hits.reduce(function(a,b){
          a[b.project_code] = b;
          return a;
        },{});

        var columns = [{
          id:'project_code',
          display_name:["Project","Code"],
          scale:'ordinal',
          dimensional:true
        },{
          id:'file_size',
          display_name:["File","Size"],
          scale:'ordinal',
          dimensional:true
        },{
          id:'file_count',
          display_name:["File","Count"],
          scale:'ordinal',
          dimensional:true
        },{
          id:'Clinical',
          display_name:['Clinical'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
          id:'Raw microarray data',
          display_name:['Array'],
          scale:'ordinal',
          is_subtype:true,
          dimensional:true
        },{
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
        },{
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
        },{
          id:'primary_site',
          display_name:["Primary","Site"],
          scale:'linear',
          dimensional:true
        }];



        var aggregations = d3.keys(project_codes).reduce(function(a,key){
          var group = project_codes[key];
          var types = group.summary.data_types;

          if (!_.contains(primary_sites,group.primary_site)){
            primary_sites.push(group.primary_site);    
          } 

          var the_returned = {

            project_code:key,
            primary_site:group.primary_site,
            file_count:group.summary.data_file_count,
            file_size:group.summary.file_size,
            participant_count:group.summary.participant_count,

          }

          columns
          .filter(function(c){return c.is_subtype})
          .forEach(function(s){
            var thing = findTheThing(types,s.id,"data_type");
            the_returned[s.id] = thing ? thing.file_count : 0;
          })   

          a[key] = the_returned;
          return a;
        },{});    
         
         console.log('aggregations for projects...',aggregations);


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

          /**
         * The order each column will appear in.
         * Don't know how well this is implemented.
         */
          sorting:{
            "project_code":d3.descending
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
        
        $scope.githutConfig = config;
        $scope.githutData = d3.values(aggregations);


//        new ParallelCoordinates(d3.values(aggregations),config);
      });
//    }
      
    }  
  
  }

  class ReportController implements IReportController {

    /* @ngInject */
    constructor(public report: IReport, private CoreService: ICoreService, $timeout) {
      CoreService.setPageTitle("Report", report.id);
//      $timeout(function(){
//          console.log("Clear.");
//   
//      },1000);
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
