module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

    var AnnotationsTableModel:TableiciousConfig = {
        title: "Annotations",
        order: ['itemType', 'item', 'annotationClassificationName', 'categoryName', 'dateCreated', 'createdBy', 'status'],
        headings: [{
            displayName: "ID",
            id: "id",
            sref: function (field) {
                return "annotation({annotationId:'" + field.val + "'})";
            }
        }, {
            displayName: "Item Type",
            id: "itemType",
            template: function (x) {
                return x && x.val || "tbc";
            },
            sortable: true
        },
        {
            displayName: "Item Barcode",
            id: "item",
            sortable: true
        },
        {
            displayName: "Classification",
            id: "annotationClassificationName",
            sortable: true
        },
        {
            displayName: "Category",
            id: "categoryName",
        },
        {
            displayName: "Created Date",
            id: "dateCreated",
        },
        {
            displayName: "Annotator",
            id: "createdBy",
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