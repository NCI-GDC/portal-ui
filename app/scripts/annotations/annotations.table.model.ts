module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

    var AnnotationsTableModel:TableiciousConfig = {
        title: "Annotations",
        order: ['annotation_id', 'participant_id', 'project.program.name', 'project.project_id', 'entity_type', 'entity_id', 'entity_submitter_id', 'category', 'classification', 'created_datetime', 'creator', 'status', 'notes'],
        rowId: 'annotation_id',
        headings: [
          {
            th: "ID",
            id: "annotation_id",
            td: row => '<a href="annotations/'+row.annotation_id+'">' + row.annotation_id + '</a>',
            sortable: true,
            tdClassName: 'truncated-cell'
          },
        {
            th: "Case ID",
            id: "participant_id",
            td: row => '<a href="participants/'+row.participant_id+'">' + row.participant_id + '</a>',
            sortable: true,
            tdClassName: 'truncated-cell'
        },
        {
            th: "Program",
            id: "project.program.name",
            td: row => row.program.name,
            sortable: true,
            hidden:true
        },
        {
            th: "Project",
            id: "project.project_id",
            td: row => '<a href="projects/'+row.project.project_id + 
                         '" data-tooltip="' + row.project.name +
                         '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' + 
                         row.project.project_id + 
                       '</a>',
            sortable: true
        },
        {
            th: "Entity Type",
            id: "entity_type",
            td: row => row.entity_type,
            sortable: true
        },
        {
            th: "Entity ID",
            id: "entity_id",
            td: row => row.entity_id,
            sortable: true,
            tdClassName: 'truncated-cell'
        },
        {
            th: "Entity Barcode",
            id: "entity_submitter_id",
            sortable: true,
            td: row => row.entity_submitter_id,
            hidden:true
        },
        {
            th: "Category",
            id: "category",
            td: row => row.category,
            sortable: true
        },
        {
            th: "Classification",
            id: "classification",
            td: row => row.classification,
            sortable: true
        },
        {
            th: "Created Date",
            id: "created_datetime",
            td: row => '{{'+row.created_datetime*1000+'|date}}'
        },
        {
            th: "Annotator",
            id: "creator",
            td: row => row.creator,
            sortable: true,
            hidden: true
        },
        {
            th: "Status",
            id: "status",
            td: row => row.creator,
            sortable: true
        },
        {
            th: "Notes",
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
          "creator",
          "status",
          "entity_type",
          "entity_id",
          "entity_submitter_id",
          "notes",
          "classification",
          "participant_id",
          "notes"
        ],
        expand: [
          "project"
        ]
    }
    angular.module("annotations.table.model", [])
        .value("AnnotationsTableModel", AnnotationsTableModel);
}
