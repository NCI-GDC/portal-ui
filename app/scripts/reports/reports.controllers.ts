module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;

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
        
        ReportsService.getReports().then(function(reports){
          CoreService.setSearchModelState(true);
//         debugger;
     
   
          
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
          

              
        var dummymap = reports.hits.hits.map(function(z){
          return z._source;
        })
              
              
        var dummy_aggregations = dummymap.reduce(function(a,b){
  
            if (!_.contains(primary_sites,b.primary_site)){
                  primary_sites.push(b.primary_site);    
              } 
            if (a[b.project_code]) {
              var c = a[b.project_code];
              c.file_size += b.size_in_mb;
              c.file_count += b.count;
                
            
            } else {
              a[b.project_code] = {
                file_size:b.size_in_mb,
                project_code:b.project_code,
                primary_site:b.primary_site,
                file_count:b.count
              
              } 
            }
            
            return a;    
          },{})
  
          
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
              var proj1 = dummy_aggregations[a];
              var proj2 = dummy_aggregations[b];
              
              
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
        $scope.githutData = d3.values(dummy_aggregations);
          },500);
          
  

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
      .controller("ReportsController", ReportsController);
}


//debugger;