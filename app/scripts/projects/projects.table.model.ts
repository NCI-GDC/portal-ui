module ngApp.projects.models {
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

  function getParticipantSref(data_type: string) {
    return function fileSref(field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
      var projectId = _.find(row, function (elem) {
        return elem.id === 'project_id';
      }).val;

      var data = _.find(_.find(row, function (x: TableiciousEntryDefinition) {
        return x.id === 'summary';
      }).val.data_types, function (x: any) {
        return x.data_type === data_type;
      });

      if (!data || !data.participant_count) {
        return;
      }

      var filter = $filter("makeFilter")([{
        name: 'participants.project.project_id',
        value: projectId
      }, {name: 'files.data_type', value: data_type}]);
      return {
        state: "/search/p",
        filters: filter
      };
    }
  }

  var projectTableModel: TableiciousConfig = {
    title: 'Projects',
    order: ['project_id', 'disease_type', 'primary_site', 'program.name', 'summary.participant_count', 'data_types', 'summary.file_count', 'file_size'],
    rowId: 'project_id',
    headings: [
      {
        displayName: "ID",
        id: "project_id",
        render: (row) => {
          return '<a data-ui-sref="project({projectId:\''+row.project_id+'\'})' + 
                    '" data-tooltip="' + row.name +
                    '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' + 
                    row.project_id + 
                  '</a>';
        },
        sortable: true,
        hidden: false,
        enabled: true,
        canReorder: true
      }, {
        displayName: "Disease Type",
        id: "disease_type",
        fieldClass: 'truncated-cell',
        render: row => row.disease_type,
        sortable: true,
        hidden: false,
        canReorder: true,
        enabled: true
      }, {
        displayName: "Primary Site",
        id: "primary_site",
        fieldClass: 'truncated-cell',
        render: row => row.primary_site,
        sortable: true,
        hidden: false,
        canReorder: true,
        enabled: true
      }, {
        displayName: "Program",
        id: "program.name",
        render: row => row.program.name,
        sortable: true,
        hidden: false
      },
      {
        displayName: "Cases",
        id: "summary.participant_count",
        render: (row, $filter) => {
          const filters = $filter("makeFilter")([{name: 'participants.project.project_id', value: row.project_id}], true);
          const href = 'search/p?filters=' + filters;
          const val = '{{' + row.summary.participant_count + '|number:0}}'; 
          return "<a href=" + href + ">" + val + '</a>';
        },
        sortable: true,
        hidden: false,
        fieldClass: 'text-right'
      }, {
        displayName: "Available Cases per Data Type",
        id: "data_types",
        headingClass: 'text-center',
        hidden: false,
        children: [
          {
            displayName: 'Clinical',
            id: 'clinical',
            render: (row) => {
              const a = _.find(row.summary.data_types, {data_type: "Clinical"})

              return 'A'
            },
          }, {
            displayName: 'Array',
            toolTipText: 'Raw microarray data',
            id: 'Array',
            render: row => "A",
          }, {
            displayName: 'Seq',
            id: 'Seq',
            render: row => "A",
          }, {
            displayName: "SNV",
            toolTipText: "Simple nucleotide variation",
            id: "SNV",
            render: row => "A",
          }, {
            displayName: 'CNV',
            toolTipText: 'Copy number variation',
            id: 'cnv',
            render: row => "A",
          }, {
            displayName: 'SV',
            toolTipText: 'Structural rearrangement',
            id: 'sv',
            render: row => "A",
          }, {
            displayName: 'Exp',
            toolTipText: 'Gene expression',
            id: 'Exp',
            render: row => "A",
          }, {
            displayName: 'PExp',
            toolTipText: 'Protein expression',
            id: 'pexp',
            render: row => "A",
          }, {
            displayName: 'Meth',
            toolTipText: 'DNA methylation',
            id: 'meth',
            render: row => "A",
          }, {
            displayName: 'Other',
            id: 'other',
            render: row => "A",
          }
        ]
      }, {
        displayName: "Files",
        id: "summary.file_count",
        render: (row, $filter) => {
          const filters = $filter("makeFilter")([{name: 'participants.project.project_id', value: row.project_id}], true);
          const href = 'search/f?filters=' + filters;
          const val = '{{' + row.summary.file_count + '|number:0}}'; 
          return '<a href=' + href + '>' + val + '</a>';
        },
        sortable: true,
        fieldClass: 'text-right'
      }, {
        displayName: "File Size",
        id: "file_size",
        render: row => '{{' + row.summary.file_size + '|size}}',
        sortable: true,
        fieldClass: 'text-right'
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
