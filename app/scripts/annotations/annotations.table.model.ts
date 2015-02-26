module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

    var AnnotationsTableModel:TableiciousConfig = {
        title: "Annotations",
        order: ['participant_id', 'project.program.name', 'project.code', 'barcode', 'item_type', 'category', 'classification', 'dateCreated', 'creator', 'status'],
        headings: [{
            displayName: "ID",
            id: "annotation_id",
            sref: function (field) {
                return "annotation({annotationId:'" + field.val + "'})";
            }
        },
        {
            displayName: "Participant ID",
            id: "participant_id",
            template: function () {
              return "tbd";
            }
        },
        {
            displayName: "Program",
            id: "project.program.name",
            sortable: true
        },
        {
            displayName: "Project",
            id: "project.code",
            sortable: true
        },
        {
            displayName: "Item Type",
            id: "item_type",
            template: function (x) {
                return x && x.val || "tbc";
            },
            sortable: true
        },
        {
            displayName: "Item Barcode",
            id: "barcode",
            sortable: true,
            template: function() {
              return "tbd";
            }
        },
        {
            displayName: "Category",
            id: "category",
        },
        {
            displayName: "Classification",
            id: "classification",
            sortable: true
        },
        {
            displayName: "Created Date",
            id: "dateCreated",
            template:function(field,row,scope){
                return "tbd";
                //return scope.$filter('date')(field.val);
            }
        },
        {
            displayName: "Annotator",
            id: "creator",
        },
        {
            displayName: "Status",
            id: "status",
            sortable: true
        }
        ]
    }
    angular.module("annotations.table.model", [])
        .value("AnnotationsTableModel", AnnotationsTableModel);
}
