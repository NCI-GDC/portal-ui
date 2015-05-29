module ngApp.projects.models {
  var projectTableModel = {
    title: 'Projects',
    order: ['project_id', 'disease_type', 'primary_site', 'program.name', 'summary.participant_count', 'data_types', 'summary.file_count', 'file_size'],
    rowId: 'project_id',
    headings: [
      {
        th: "ID",
        id: "project_id",
        td: (row) => {
          return '<a data-ui-sref="project({projectId:\''+row.project_id+'\'})' + 
                    '" data-tooltip="' + row.name +
                    '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' + 
                    row.project_id + 
                  '</a>';
        },
        sortable: true,
        hidden: false,
        draggable: true
      }, {
        th: "Disease Type",
        id: "disease_type",
        tdClassName: 'truncated-cell',
        td: row => row.disease_type,
        sortable: true,
        hidden: false,
        draggable: true
      }, {
        th: "Primary Site",
        id: "primary_site",
        tdClassName: 'truncated-cell',
        td: row => row.primary_site,
        sortable: true,
        hidden: false,
        canReorder: true,
        enabled: true
      }, {
        th: "Program",
        id: "program.name",
        td: row => row.program.name,
        sortable: true,
        hidden: false
      },
      {
        th: "Cases",
        id: "summary.participant_count",
        td: (row, $filter) => {
          const filters = $filter("makeFilter")([{name: 'participants.project.project_id', value: row.project_id}], true);
          const href = 'search/p?filters=' + filters;
          const val = '{{' + row.summary.participant_count + '|number:0}}'; 
          return "<a href=" + href + ">" + val + '</a>';
        },
        sortable: true,
        hidden: false,
        tdClassName: 'text-right'
      }, {
        th: "Available Cases per Data Type",
        id: "data_types",
        thClassName: 'text-center',
        hidden: false,
        children: [
          {
            th: 'Clinical',
            id: 'clinical',
            td: (row) => {
              const a = _.find(row.summary.data_types, {data_type: "Clinical"})

              return 'A'
            },
          }, {
            th: 'Array',
            toolTipText: 'Raw microarray data',
            id: 'Array',
            td: row => "A",
          }, {
            th: 'Seq',
            id: 'Seq',
            td: row => "A",
          }, {
            th: "SNV",
            toolTipText: "Simple nucleotide variation",
            id: "SNV",
            td: row => "A",
          }, {
            th: 'CNV',
            toolTipText: 'Copy number variation',
            id: 'cnv',
            td: row => "A",
          }, {
            th: 'SV',
            toolTipText: 'Structural rearrangement',
            id: 'sv',
            td: row => "A",
          }, {
            th: 'Exp',
            toolTipText: 'Gene expression',
            id: 'Exp',
            td: row => "A",
          }, {
            th: 'PExp',
            toolTipText: 'Protein expression',
            id: 'pexp',
            td: row => "A",
          }, {
            th: 'Meth',
            toolTipText: 'DNA methylation',
            id: 'meth',
            td: row => "A",
          }, {
            th: 'Other',
            id: 'other',
            td: row => "A",
          }
        ]
      }, {
        th: "Files",
        id: "summary.file_count",
        td: (row, $filter) => {
          const filters = $filter("makeFilter")([{name: 'participants.project.project_id', value: row.project_id}], true);
          const href = 'search/f?filters=' + filters;
          const val = '{{' + row.summary.file_count + '|number:0}}'; 
          return '<a href=' + href + '>' + val + '</a>';
        },
        sortable: true,
        tdClassName: 'text-right'
      }, {
        th: "File Size",
        id: "file_size",
        td: row => '{{' + row.summary.file_size + '|size}}',
        sortable: true,
        tdClassName: 'text-right'
      }
    ],
    fields: [
      "disease_type",
      "state",
      "primary_site",
      "project_id",
      "name"
    ],
    expand: [
      "summary",
      "summary.data_types",
      "summary.experimental_strategies",
      "program"
    ]
  };
  angular.module("projects.table.model", [])
      .value("ProjectTableModel", projectTableModel);
}
