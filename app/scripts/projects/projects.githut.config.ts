angular.module('projects.githut.config',[])
.factory("ProjectsGithut",function(ProjectsGithutConfig, ProjectsGithutColumns) {
  return function(data) {
    var hits = filterData(data.hits);
    var primary_sites = [];

    function findTheThing(array,data_type,propname){
      return _.find(array,function(type){return type[propname] === data_type});
    }

    // Gracefully handle bad data if present
    function filterData(data) {

      var filteredData = [],
          DEFAULT_UNKNOWN_VAL = 'Unknown';

      if (! _.isArray(data)) {
        return filteredData;
      }

      filteredData = _.reduce(data, function(projectList, project) {

        // If the Project doesn't have a name then it's invalid for use in the graph
        // but for now we will be nice and show it robustly so the problem can
        // be identified and fixed on the backend where the fix belongs...
        if (! _.isObject(project)) {
          return projectList;
        }

        _.map(['name', 'project_id', 'primary_site'], function(key) {
          if (! _.has(project, key)) {
            project[key] = DEFAULT_UNKNOWN_VAL;
          }
        });

        projectList.push(project);

        return projectList;
      }, []);

      return filteredData;
    }


    var project_ids = hits.reduce(function(a,b) {
      a[b.project_id] = b;
      return a;
    },{});

    var aggregations = d3.keys(project_ids).reduce(function(a,key){
      var group = project_ids[key];
      var types = group.summary.data_types;

      if (!_.contains(primary_sites,group.primary_site)){
        primary_sites.push(group.primary_site);
      }

      var the_returned = {
        project_id: key,
        name: group.name,
        primary_site: group.primary_site,
        file_count: group.summary.file_count,
        file_size: group.summary.file_size,
        case_count: group.summary.case_count
      };

      ProjectsGithutColumns
          .filter(function(c){return c.is_subtype})
          .forEach(function(s){
              var thing = findTheThing(types,s.id,"data_type");
              the_returned[s.id] = thing ? thing.case_count : 0;
          })

      a[key] = the_returned;
      return a;
    },{});

    return {
      data: d3.values(aggregations),
      config: ProjectsGithutConfig
    }
  }
})
.service("ProjectsGithutColumns",function($state, $filter){
  function projectSref(d) {
    var filter = $filter("makeFilter")([{
      field: 'cases.project.project_id',
      value: d.lang
    }]);

    $state.go("search.participants", { filters:JSON.parse(filter) });
  }

  function dataTypeSref(d) {
    var filter = $filter("makeFilter")([{
      field: 'cases.project.project_id',
      value: d.lang
    }, {field: 'files.data_type', value: d.column}]);

    $state.go("search.participants", { filters:JSON.parse(filter) });
  }

  return [
    {
      id: 'project_id',
      display_name: ["Project","ID"],
      scale: 'ordinal',
      dimensional: true,
      href:function(d) {
        $state.go('project',{projectId:d.value});
      }
    },
    {
      id:'case_count',
      display_name:["Case","Count"],
      scale:'ordinal',
      dimensional:true,
      colorgroup:'case_count',
      href: projectSref
    },
    {
      id:'Sequencing Data',
      display_name:['Seq'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'Transcriptome Profiling',
      display_name:['Exp'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'Simple Nucleotide Variation',
      display_name:['SNV'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'Copy Number Variation',
      display_name:['CNV'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'Structural Rearrangement',
      display_name:['SV'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'DNA Methylation',
      display_name:['Meth'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'Clinical',
      display_name:['Clin.'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'Biospecimen',
      display_name:['Bio.'],
      scale:'ordinal',
      is_subtype:true,
      dimensional:true,
      colorgroup:'case_count',
      href: dataTypeSref
    },
    {
      id:'file_count',
      display_name:["File","Count"],
      scale:'ordinal',
      dimensional:true,
      colorgroup:'file_count',
      href:function(d) {
          var filter = $filter("makeFilter")([{field: 'cases.project.project_id', value: d.lang}], true);
          $state.go("search.files", { filters:filter });
      }
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
    }
  ]
})
.service("ProjectsGithutConfig",function(ProjectsService,ProjectsGithutColumns, $filter){
    var color = d3.scale.category10();

    var columns = ProjectsGithutColumns;
    return {

      /* the id of the tag the table will be generated into */
      container: "#pc",

      // Used for unique styling per githut graph
      containerClass: "projects",

      /* default scale value, not useful */
      scale: "ordinal",

      /* Ordered list of columns. Only titles appearing here appear in the table */
      columns: columns.map(function(c){return c.id}),
      config: columns,

      /* ???
       * The value that all the other values are divided by?
       * Has something to do with dimensions?
       **/
      ref: "lang_usage",

      /**
       * No idea what title_column does.
      **/
      title_column: "project_id",

      /**
       * Not really a scale map, more a map of what kind of column it will be.
       * Ordinal is the more geometry-oriented choice
       */
      scale_map: columns.reduce(function(a,b){
         a[b.id] = b.scale || 'ordinal';
         return a;
      },{}),

      /**
       * Interconnected with ref and dimension, possibly.
       * No idea what this does, really.
       */
      use: {
        "project_id":"project_id"
      },
      sorter:{
        "project_id": "case_count"
      },
      color_group_map: columns.reduce(function(a,b){
         a[b.id] = b.colorgroup;
         return a;
      },{}),
      color_groups: {
        'file_count':color(0),
        'file_size':color(1),
        'case_count':color(2)
      },

      /**
       * The order each column will appear in.
       * Don't know how well this is implemented.
       */
      sorting:{
        "project_id": d3.ascending,
        "primary_site": d3.ascending
      },
      superhead:{
        start:'Clinical',
        end:'Other',
        text: ProjectsService.getTableHeading() //Case count per data type 
      },

      /**
       *  Don't know what "d" is here.
       *  If defined for a column, formats the labels.
       *  Might not be implemented anywhere.
       */
      formats: {
        "primary_site":"d"
      },
      filters:{
        "file_size": $filter("size")
      },

      /**
       *  Not known what this is. Any values in columns that are not in dimensions causes an error.
       */
      dimensions:columns.filter(function(c){return c.dimensional}).map(function(c){return c.id}),

      urlMap:columns.reduce(function(a,b){
        a[b.id] = b.href;
        return a;
      },{}),

      /**
       * Related to animation
       */
      duration:1000
    };
})
