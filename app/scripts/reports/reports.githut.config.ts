angular.module("reports.githut.config",[])
.factory("ReportsGithut",function(ReportsGithutColumns, ReportsGithutConfig) {
  return function(data) {
    var columns = ReportsGithutColumns,
        config = ReportsGithutConfig,
        order = ["Clinical", "Array", "Seq", "SNV", "CNV", "SV", "Exp", "PExp", "Meth", "Other"],
        dataTypesMap = {
                  "Clinical": "Clinical",
                  "Array": "Raw microarray data",
                  "Seq": "Raw sequencing data",
                  "SNV": "Simple nucleotide variation",
                  "CNV": "Copy number variation",
                  "SV": "Structural rearrangement",
                  "Exp": "Gene expression",
                  "PExp": "Protein expression",
                  "Meth": "DNA methylation",
                  "Other": "Other"
                  },
        primary_sites = [];

    var aggregations = data.reduce(function(a,b) {
      if (!_.contains(primary_sites, b.primary_site)) {
        primary_sites.push(b.primary_site);
      }

      if (a[b.project_id]) {
        var c = a[b.project_id];
        c.file_size += b.size_in_mb;
        c.file_count += b.count;

        b.data_types.forEach(function(d){
          c[d.data_type] += d.count;
        });
      } else {
        a[b.project_id] = {
          file_size:b.size,
          project_id:b.project_id,
          project_name:b.project_name,
          primary_site:b.primary_site,
          file_count:b.count,
          colorgroup:"file_count"
        };

        b.data_types.forEach(function(d){
          a[b.project_id][d.data_type] = d.count;
        });
      }

      return a;
    },{});

    var data_types = data.reduce(function(a,b){return a.concat(b.data_types)}, []);
    var nest = d3.nest().key(function(a){return a.data_type}).entries(data_types);

    var types = nest.map(function(a){
      return {
        id: a.key,
        tool_tip_text: dataTypesMap[a.key],
        display_name: [a.key],
        colorgroup: "file_count",
        scale: "ordinal",
        dimensional: true,
        is_subtype: true
      };
    });

    types = _.sortBy(types, (type) => { return 0 - _.indexOf(order, type.id); });

    types.forEach(function(a) {
      ReportsGithutColumns.splice(2, 0, a);
    });

    ReportsGithutConfig.superhead = {
      start: types[types.length - 1].id,
      end: types[0].id,
      text: "File count per data type"
    };

    ReportsGithutConfig.columns = columns.map(function(c){return c.id});
    ReportsGithutConfig.scale_map = columns.reduce(function(a, b) {
      a[b.id] = b.scale || "ordinal";
      return a;
    },{});

    ReportsGithutConfig.color_group_map = columns.reduce(function(a,b){
      a[b.id] = b.colorgroup;
      return a;
    },{});

    ReportsGithutConfig.column_map = columns.reduce(function(a,b){
      a[b.id] = b.display_name || ["Untitled"];
      return a;
    },{});

    ReportsGithutConfig.dimensions = columns.filter(function(c){return c.dimensional}).map(function(c){return c.id});

    return {
      data:d3.values(aggregations),
      config:ReportsGithutConfig
    }
  }
})
.value("ReportsGithutColumns", [
  {
    id:"project_id",
    display_name:["Project","ID"],
    scale:"ordinal",
    dimensional:true
  },
  {
    id:"file_count",
    display_name:["File","Count"],
    scale:"ordinal",
    dimensional:true,
    colorgroup:"file_count"
  },
  {
    id:"file_size",
    display_name:["File","Size"],
    scale:"ordinal",
    dimensional:true,
    colorgroup:"file_size"
  },
  {
    id:"primary_site",
    display_name:["Primary","Site"],
    scale:"linear",
    dimensional:true
  }
])
.service("ReportsGithutConfig",function(ReportsGithutColumns,$filter){

  var color = d3.scale.category10();
  var columns = ReportsGithutColumns;
  return {
    container:"#pc",
    scale:"ordinal",
    config: columns,
    ref:"lang_usage",
    title_column:"project_id",
    scale_map:undefined,
    use:{
      "project_id":"project_id"
    },
    sorter:{
      "project_id":"file_count"
    },
     sorting:{
      "project_id":d3.ascending,
      "primary_site":d3.ascending
    },
    formats:{
      "primary_site":"d"
    },
    color_group_map:undefined,
    color_groups:{
      "file_count":color(0),
      "file_size":color(1),
      "participant_count":color(2)
    },
    dimensions:undefined,
    duration:1000,
    filters:{
      file_size: $filter("size")
    }
  };

});
