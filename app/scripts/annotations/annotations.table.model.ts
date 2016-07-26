module ngApp.projects.models {
    var AnnotationsTableModel = {
        title: "Annotations",
        rowId: 'annotation_id',
        headings: [
          {
            name: "ID",
            id: "annotation_id",
            td: row => '<a href="annotations/'+row.annotation_id+'">' + row.annotation_id + '</a>',
            sortable: true,
            tdClassName: 'id-cell',
            toolTipText: row => row.annotation_id
          },
          {
              name: "Case UUID",
              id: "case_id",
              td: row => '<a href="cases/'+row.case_id+'">' + row.case_id + '</a>',
              sortable: true,
              tdClassName: 'id-cell',
              toolTipText: row => row.case_id
          },
          {
              name: "Program",
              id: "project.program.name",
              td: row => row.project && row.project.program && row.project.program.name,
              sortable: true,
              hidden: true
          },
          {
              name: "Project",
              id: "project.project_id",
              td: row => row.project && '<a href="projects/'+row.project.project_id +
                         '">' + row.project.project_id + '</a>',
              sortable: true,
              toolTipText: row => row.project.name
          },
          {
              name: "Entity Type",
              id: "entity_type",
              td: (row, $scope) => $scope.$filter("humanify")(row.entity_type),
              sortable: true
          },
          {
              name: "Entity ID",
              id: "entity_id",
              td: row =>
                '<a data-ui-sref="case({ caseId: row.case_id, bioId: row.entity_id, \'#\': \'biospecimen\' })">'
              + row.entity_id
              + '</a>',
              sortable: true,
              tdClassName: 'id-cell',
              toolTipText: row => row.entity_id
          },
          {
              name: "Entity Barcode",
              id: "entity_submitter_id",
              td: row => row.entity_submitter_id,
              sortable: true,
              hidden: true
          },
          {
              name: "Category",
              id: "category",
              td: row => row.category,
              sortable: true
          },
          {
              name: "Classification",
              id: "classification",
              td: row => row.classification,
              sortable: true
          },
          {
              name: "Created Date",
              id: "created_datetime",
              td: (row, $scope) => row.created_datetime && $scope.$filter('date')(row.created_datetime, 'yyyy-MM-dd'),
          },
          {
              name: "Status",
              id: "status",
              td: row => row.status,
              sortable: true,
              hidden: true
          },
          {
              name: "Notes",
              id: "notes",
              td: row => row.notes,
              sortable: false,
              hidden: true
          }
        ],
        fields: [
          "annotation_id",
          "category",
          "created_datetime",
          "status",
          "entity_type",
          "entity_id",
          "entity_submitter_id",
          "notes",
          "classification",
          "case_id",
          "notes",
          "project.program.name",
          "project.project_id",
          "project.name",
        ],
        facets: [
          {
            name: 'annotation_id',
            facetType: 'free-text'
          }, {
            name: 'classification',
            facetType: 'terms'
          }, {
            name: 'category',
            facetType: 'terms'
          }, {
            name: 'created_datetime',
            facetType: 'range'
          }, {
            name: 'status',
            facetType: 'terms'
          }, {
            name: 'entity_type',
            facetType: 'terms'
          }, {
            name: 'project.primary_site',
            facetType: 'terms'
          }, {
            name: 'project.program.name',
            facetType: 'terms'
          }, {
            name: 'project.project_id',
            facetType: 'terms'
        }]
    };
    angular.module("annotations.table.model", [])
        .value("AnnotationsTableModel", AnnotationsTableModel);
}
