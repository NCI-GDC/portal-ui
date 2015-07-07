angular.module("reports.githut.config",[])
.factory("ReportsGithut",function(ReportsGithutColumns, ReportsGithutConfig) {
  return function(data) {
    var columns = ReportsGithutColumns,
        config = ReportsGithutConfig,
        order = ["Clinical", "Array", "Seq", "SNV", "CNV", "SV", "Exp", "PExp", "Meth", "Other"],
        dataTypesMap = {
                  "Clinical": "Clinical",
                  "Raw microarray data": "Array",
                  "Raw sequencing data": "Seq",
                  "Simple nucleotide variation": "SNV",
                  "Copy number variation": "CNV" ,
                  "Structural rearrangement": "SV",
                  "Gene expression": "Exp",
                  "Protein expression": "PExp",
                  "DNA methylation":  "Meth",
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
          file_size: b.size,
          project_id: b.project_id,
          name: b.disease_type,
          primary_site: b.primary_site,
          file_count: b.count,
          colorgroup: "file_count"
        };

        if(b.data_types) {
          b.data_types.forEach((d) => {
            a[b.project_id][d.data_type] = d.count;
          });
        }
      }
      return a;
    }, {});

    var data_types = data.reduce((result, datum) => {
                                                      if (datum.data_types) {
                                                        result = result.concat(datum.data_types);
                                                      }
                                                      return result;
                                                    }, []);
    var nest = d3.nest().key((a) => {
                  if (a) {
                    return a.data_type;
                  }
                }).entries(data_types);

    var types = nest.map((a) => {
      return {
        id: a.key,
        tool_tip_text: a.key,
        display_name: [dataTypesMap[a.key]],
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
      text: "# Requests per data type"
    };

    ReportsGithutConfig.columns = columns.map((c) => { return c.id; });
    ReportsGithutConfig.scale_map = columns.reduce((a, b) => {
      a[b.id] = b.scale || "ordinal";
      return a;
    }, {});

    ReportsGithutConfig.color_group_map = columns.reduce((a,b) => {
      a[b.id] = b.colorgroup;
      return a;
    }, {});

    ReportsGithutConfig.column_map = columns.reduce((a,b) => {
      a[b.id] = b.display_name || ["Untitled"];
      return a;
    }, {});

    ReportsGithutConfig.dimensions = _.map(_.filter(columns, (column) => { return column.dimensional; }), (column) => { return column.id; });

    return {
      data: d3.values(aggregations),
      config: ReportsGithutConfig
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
    display_name:["# Requests"],
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
      "case_count":color(2)
    },
    dimensions:undefined,
    duration:1000,
    filters:{
      file_size: $filter("size")
    }
  };

});
