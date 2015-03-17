module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IProjectsController {
    projects: IProjects;
    ProjectsState: IProjectsState;
    tabSwitch: boolean;
  }

  export interface IProjectScope extends ng.IScope {
    tableConfig:TableiciousConfig ;
  }

  class ProjectsController implements IProjectsController {
    projects: IProjects;
    projectColumns: any[];
    tabSwitch: boolean = false;

    /* @ngInject */
    constructor(private $scope: IProjectScope, private ProjectsService: IProjectsService,
                private CoreService: ICoreService, private ProjectTableModel: TableiciousConfig,
                private $state: ng.ui.IStateService, public ProjectsState: IProjectsState,
                private LocationService: ILocationService, private $filter) {

      CoreService.setPageTitle("Projects");
      $scope.$on("$locationChangeSuccess", (event, next) => {
        if (next.indexOf("projects") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      var data = $state.current.data || {};
      this.ProjectsState.setActive("tabs", data.tab);
      $scope.tableConfig = ProjectTableModel;

      this.refresh();
    }

    refresh() {
      if (!this.tabSwitch) {
        this.ProjectsService.getProjects({
          fields: this.ProjectTableModel.fields,
          facets: [
            "disease_type",
            "program.name",
            "project_id",
            "primary_site",
            "summary.experimental_strategies.experimental_strategy",
            "summary.data_types.data_type"
          ],
          size: 100
        }).then((data) => {
          this.projects = data;


          if (this.ProjectsState.tabs.graph.active) {
            githutTable(data,{filters:{file_size:this.$filter('size')},heading:this.ProjectsService.getTableHeading()});
          }
        });
      } else {
        this.tabSwitch = false;
        if (this.ProjectsState.tabs.graph.active) {
          githutTable(this.projects,{filters:{file_size:this.$filter('size')},heading:this.ProjectsService.getTableHeading()});
        }
      }
    }

    select(section: string, tab: string) {
      this.ProjectsState.setActive(section, tab);
      this.setState(tab);
    }

    // TODO Load data lazily based on active tab
    setState(tab: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("projects."))) {
        this.tabSwitch = true;
        this.$state.go("projects." + tab, this.LocationService.search(), {inherit: false});
      }
    }
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject, private CoreService: ICoreService) {
      CoreService.setPageTitle("Project " + project.project_id);
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

var primary_sites = [];

function githutTable(data,config){
  var hits = data.hits;
  primary_sites = [];

  d3.select(".githut > #pc svg")
    .remove();

  function findTheThing(array,data_type,propname){
    return _.find(array,function(type){return type[propname] === data_type})
  }

  var project_ids = hits.reduce(function(a,b){
      a[b.project_id] = b;
      return a;
  },{});

  var columns = [
    {
        id:'project_id',
        display_name:["Project","ID"],
        scale:'ordinal',
        dimensional:true
    },{
        id:'participant_count',
        display_name:["Participant","Count"],
        scale:'ordinal',
        dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Clinical',
        display_name:['Clinical'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Raw microarray data',
        display_name:['Array'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Raw sequencing data',
        display_name:['Seq'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Simple nucleotide variation',
        display_name:['SNV'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Copy number variation',
        display_name:['CNV'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Structural rearrangement',
        display_name:['SV'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Gene expression',
        display_name:['Exp'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Protein expression',
        display_name:['PExp'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'DNA methylation',
        display_name:['Meth'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'Other',
        display_name:['Other'],
        scale:'ordinal',
        is_subtype:true,
         dimensional:true,
        colorgroup:'participant_count'
    },{
        id:'file_count',
        display_name:["File","Count"],
        scale:'ordinal',
         dimensional:true,
        colorgroup:'file_count'
    },{
        id:'file_size',
        display_name:["File","Size"],
        scale:'ordinal',
        dimensional:true,
        colorgroup:'file_size'
    },{
        id:'primary_site',
        display_name:["Primary","Site"],
        scale:'linear',
         dimensional:true
    }
  ];

  var aggregations = d3.keys(project_ids).reduce(function(a,key){
    var group = project_ids[key];
    var types = group.summary.data_types;

    if (!_.contains(primary_sites,group.primary_site)){
      primary_sites.push(group.primary_site);
    }

    var the_returned = {
      project_id: key,
      primary_site: group.primary_site,
      file_count: group.summary.file_count,
      file_size: group.summary.file_size,
      participant_count: group.summary.participant_count
    };

    columns
        .filter(function(c){return c.is_subtype})
        .forEach(function(s){
            var thing = findTheThing(types,s.id,"data_type");
            the_returned[s.id] = thing ? thing.participant_count : 0;
        })

    a[key] = the_returned;
    return a;
  },{});

  var color = d3.scale.category10()

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
        "project_id":"participant_count"
    },
//    color_group_map:columns.map(function(c){return c.colorgroup}),
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
     * The order each column will appear in.
     * Don't know how well this is implemented.
     */
    sorting:{
      "project_id":d3.ascending,
      "primary_site":d3.ascending
    },
    superhead:{
      start:'Clinical',
      end:'Other',
      text:config.heading //Participant count per data type 
    },

    /**
     *  Don't know what "d" is here.
     *  If defined for a column, formats the labels.
     *  Might not be implemented anywhere.
     */
    formats:{
        "primary_site":"d"
    },
    filters:{
        "file_size":config.filters.file_size
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
    duration:1000
  };

  return new ParallelCoordinates(d3.values(aggregations), config);
}
