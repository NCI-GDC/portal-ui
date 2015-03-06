module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

    var AnnotationsTableModel:TableiciousConfig = {
        title: "Annotations",
        order: ['annotation_id', 'participant_id', 'project.program.name', 'project.code', 'barcode', 'item_type', 'category', 'classification', 'dateCreated', 'creator', 'status'],
        headings: [{
            displayName: "ID",
            id: "annotation_id",
            sref: function (field) {
                return {
                    state: "annotation",
                    filters: {
                        annotationId: field.val
                    }
                };
            },
            sortable: true
        },
        {
            displayName: "Participant ID",
            id: "participant_id",
            template: function () {
              return "tbd";
            },
            sortable: true
        },
        {
            displayName: "Program",
            id: "project.program.name",
            sortable: true
        },
        {
            displayName: "Project",
            id: "project.project_id",
            sref: function (field, row) {
                var project = _.find(row, (a) => {
                    return a.id === "project";
                });
                return {
                    state: "project",
                    filters: {
                        projectId: project.val.project_id
                    }
                };
            },
            sortable: true
        },
        {
            displayName: "Item Type",
            id: "item_type",
            template: function (field, row, scope, $filter) {
                return $filter("humanify")(field && field.val || "tbc");
            },
            sortable: true
        },
        {
            displayName: "Item ID",
            id: "item_id",
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
            template: function(field,row,scope) {
              return scope.$filter('ellipsicate')(field.val, 30);
            },
            sortable: true
        },
        {
            displayName: "Classification",
            id: "classification",
            sortable: true
        },
        {
            displayName: "Created Date",
            id: "created_datetime",
            template:function(field,row,scope, $filter){
                // The value given appears to be in seconds rather than milliseconds
                return $filter('date')(field.val * 1000);
            }
        },
        {
            displayName: "Annotator",
            id: "creator",
            template: function(field, row, scope, $filter) {
                return $filter("humanify")(field.val);
            },
            sortable: true
        },
        {
            displayName: "Status",
            id: "status",
            sortable: true
        }
        ],
        fields: [
          "annotation_id",
          "category",
          "created_datetime",
          "creator",
          "status",
          "item_type",
          "item_id",
          "notes",
          "classification",
          "project.program.name",
          "project.project_id"
        ]
    }
    angular.module("annotations.table.model", [])
        .value("AnnotationsTableModel", AnnotationsTableModel);
}
