angular.module('projects.githut.config',[])
.factory("ProjectsGithut",function(ProjectsGithutConfig,ProjectsGithutColumns){
  return function(data){
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

        ProjectsGithutColumns
            .filter(function(c){return c.is_subtype})
            .forEach(function(s){
                var thing = findTheThing(types,s.id,"data_type");
                the_returned[s.id] = thing ? thing.participant_count : 0;
            })

        a[key] = the_returned;
        return a;
      },{});
    return {
      data:d3.values(aggregations),
      config:ProjectsGithutConfig
    }
  }
})
.service("ProjectsGithutColumns",function(){return [
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
  ]})
.service("ProjectsGithutConfig",function(ProjectsService,ProjectsGithutColumns,$filter){

    var color = d3.scale.category10()

    var columns = ProjectsGithutColumns;
    return {

      /* the id of the tag the table will be generated into */
      container:"#pc",

      /* default scale value, not useful */
      scale:"ordinal",

      /* Ordered list of columns. Only titles appearing here appear in the table */
      columns:columns.map(function(c){return c.id}),
      config:columns,

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
        text:ProjectsService.getTableHeading() //Participant count per data type 
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
          "file_size":$filter("size")
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
})