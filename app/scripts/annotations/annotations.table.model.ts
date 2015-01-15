module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

    var AnnotationsTableModel:TableiciousConfig = {
        title: "Annotations",
        order: ['id', 'participant_id', 'project', 'itemType', 'item_uuid', 'item', 'annotationClassificationName', 'categoryName', 'dateCreated', 'createdBy', 'status'],
        headings: [{
            displayName: "ID",
            id: "id",
            enabled: true,
            sref: function (field) {
                return "annotation({annotationId:'" + field.val + "'})";
            },
        }, {
            displayName: "Participant",
            id: "participant_id",
            enabled: true,
            template: function (x) {
                return "tbc";
            },
            sref: function () {
                return "#";
            },
        }, {
            displayName: "Project",
            id: "project",
            enabled: true,
            template: function (x) {
                return "tbc";
            },
            sref: function () {
                return "#";
            },
        }, {
            displayName: "Item Type",
            id: "itemType",
            enabled: true,
            template: function (x) {
                return x && x.val || "tbc";
            }
        },
        {
            displayName: "Item UUID",
            id: "item_uuid",
            enabled: true,
            template: function (x) {
                return "tbc";
            }
        },
        {
            displayName: "Item Barcode",
            id: "item",
            enabled: true
        },
        {
            displayName: "Classification",
            id: "annotationClassificationName",
            enabled: true
        },
        {
            displayName: "Category",
            id: "categoryName",
            enabled: true,
        },
        {
            displayName: "Created Date",
            id: "dateCreated",
            enabled: true,
        },
        {
            displayName: "Annotator",
            id: "createdBy",
            enabled: true,
        },
        {
            displayName: "Status",
            id: "status",
            enabled: true,
        }
        ]
    }
    angular.module("annotations.table.model", [])
        .value("AnnotationsTableModel", AnnotationsTableModel);
}