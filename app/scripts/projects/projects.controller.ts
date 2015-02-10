module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface IProjectsController {
    projects: IProjects;
  }

  export interface IProjectScope extends ng.IScope {
    tableConfig:TableiciousConfig ;
  }


  class ProjectsController implements IProjectsController {
    projects: IProjects;
    projectColumns: any[];

    /* @ngInject */
    constructor(private $scope: IProjectScope, private ProjectsService: IProjectsService, private CoreService: ICoreService, ProjectTableModel) {
      CoreService.setPageTitle("Projects");
      $scope.$on("$locationChangeSuccess", (event, next) => {
        if (next.indexOf("projects") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });


      $scope.tableConfig = ProjectTableModel;

      this.refresh();
    }

    refresh() {
      this.ProjectsService.getProjects({
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
          githutTable(data);
        });
    }
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject, private CoreService: ICoreService) {
      CoreService.setPageTitle("Project " + project.project_code);
    }
  }

  angular
      .module("projects.controller", [
        "projects.services",
        "core.services",
        "projects.table.model"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}


var chartDrawn = false;
var primary_sites = [];

function githutTable(data){
    var hits = data.hits;

    d3.select("svg")
       .remove();
    
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
        id:'participant_count',
        display_name:["Part.","Count"],
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
    
    console.log("Data:", aggregations);
    
//    aggregations = {
//        'ACC':aggregations['ACC']
//    };

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
    

    pc=new ParallelCoordinates(d3.values(aggregations),config);
}