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
    constructor(private CoreService: ICoreService, $scope,ReportsService, $q,ProjectsService,$timeout,private LocationService: ILocationService, private config: IGDCConfig,  private $modal: any, private $q: ng.IQService, private Restangular: restangular.IProvider,
                private $window: ng.IWindowService, private UserService: IUserService,$timeout,$filter) {

      CoreService.setPageTitle("Reports");
      
      /**
      * TODO: refactor with app/scripts/components/tables/tables.controllers.ts#L119
      */
      $scope.reportExport = function a(){  

        var url = LocationService.getHref();
        var abort = $q.defer();
        var modalInstance = $modal.open({
          templateUrl: "components/tables/templates/export-modal.html",
          controller: "ExportTableModalController as etmc",
          backdrop: 'static'
        });
        
        var fileType = 'JSON';
        var endpoint = 'reports/data-download-statistics';

        if ($window.URL && $window.URL.createObjectURL) {
          var params = {
            attachment: true,
            format: fileType,
            size: 20
          };

        Restangular.all(endpoint)
        .withHttpConfig({
          timeout: abort.promise,
          responseType: "blob"
        })
        .get('', params).then((file) => {
          var url = $window.URL.createObjectURL(file);
          var a = $window.document.createElement("a");
          a.setAttribute("href", url);
          a.setAttribute("download", endpoint + "." +
            $window.moment().format() + "." +
            fileType.toLowerCase());
            $window.document.body.appendChild(a);

            $timeout(() => {
              a.click();
              modalInstance.close({cancel: true});
              $window.document.body.removeChild(a);
            },777);
        });
      } else {
        this.LocationService.setHref(this.config.api + "/" +
             this.$scope.endpoint +
             "?attachment=true&format=" + fileType +
             "&fields=" + this.$scope.fields.join() +
             "&size=" + this.$scope.size +
             "&filters=" + JSON.stringify(filters));
      }
        
      modalInstance.result.then((data) => {
        if (data.cancel) {
          if (abort) {
            abort.resolve();
          } else {
            this.LocationService.setHref(url);
          }
        }
      });
      }

      ReportsService.getReports().then(function(reports){
        CoreService.setSearchModelState(true);





        var dummymap = reports.hits.hits.map(function(z){
          return z._source;
        });

        var x = ['ACC','AGG','LUAD','LUSC','BCC',"COAD","CESC","PRAD",'READ','SKCM','STAD'];
        var t = ['Ovary','Skin','Brain','Heart','Lung'];

        x.forEach(function(g){
          var n = _.clone(dummymap[0]);
          n.project_id = g;
          n.count += Math.floor(Math.random() * 1000);
          n.primary_site = _.sample(t);
          n.size_in_mb += Math.floor(Math.random() * 1000);
          dummymap.push(n);
        })



        var dummy_aggregations = dummymap.reduce(function(a,b){

          if (!_.contains(primary_sites,b.primary_site)){
            primary_sites.push(b.primary_site);
          }
          if (a[b.project_id]) {
            var c = a[b.project_id];
            c.file_size += b.size_in_mb;
            c.file_count += b.count;

            b.data_types.forEach(function(d){
              c[d.data_type] += d.count;
            })


          } else {
            a[b.project_id] = {
              file_size:b.size_in_mb,
              project_id:b.project_id,
              primary_site:b.primary_site,
              file_count:b.count,
              colorgroup:'file_count'

            }

            b.data_types.forEach(function(d){
              a[b.project_id][d.data_type] = d.count;
            })
          }



          return a;
        },{});
        
          var color = d3.scale.category10()

        var columns = [{
          id:'project_id',
          display_name:["Project","project_id"],
          scale:'ordinal',
          dimensional:true
        },
          {
            id:'file_count',
            display_name:["File","Count"],
            scale:'ordinal',
            dimensional:true,
            colorgroup:'file_count'
          },

          {
            id:'file_size',
            display_name:["File","Size"],
            scale:'ordinal',
            dimensional:true,
            colorgroup:'file_size'
          },
          {
            id:'primary_site',
            display_name:["Primary","Site"],
            scale:'linear',
            dimensional:true
          }];
        
        var order = ["Clinical", "Raw microarray data", "Raw sequencing data", "Simple nucleotide variation", "Copy number variation", "Structural rearrangement", "Gene expression", "Protein expression", "DNA methylation", "Other"];

        var data_types = dummymap.reduce(function(a,b){return a.concat(b.data_types)},[])
        var nest = d3.nest().key(function(a){return a.data_type}).entries(data_types);
        
        var types = nest.map(function(a){
          return {
            id:a.key,
            display_name:[a.key],
            colorgroup:'file_count',
            scale:'ordinal',
            dimensional:true
          };
        });
        
        types = types.sort(function(a,b){return order.indexOf(a) - order.indexOf(b)});

        types.forEach(function(a){
          columns.splice(2,0,a);
        });



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
          title_column:"project_id",

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
            "project_id":"project_id"
          },
          sorter:{
            "project_id":'file_count'
          },
           sorting:{
            "project_id":d3.ascending,
            "primary_site":d3.ascending
          },

          /**
           *  Don't know what "d" is here.
           *  If defined for a column, formats the labels.
           *  Might not be implemented anywhere.
           */
          formats:{
            "primary_site":"d"
          },
            color_group_map:columns.reduce(function(a,b){
       a[b.id] = b.colorgroup;
       return a;
    },{}),
        color_groups:{
          'file_count':color(0),
          'file_size':color(1),
          'participant_count':color(2)

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
          filters:{
            file_size: $filter('size')
          }
        };

        $timeout(function(){






          $scope.githutConfig = config;
          $scope.githutData = d3.values(dummy_aggregations);
          
              pc=new ParallelCoordinates(d3.values(dummy_aggregations),config);
        },500);



        $scope.byProject = dataNest('project_id').entries(dummymap);
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