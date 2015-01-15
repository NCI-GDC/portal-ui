module ngApp.search.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

    var searchTableFilesModel:TableiciousConfig = {
        title:"Files",
        order:['cart','access','fileName','fileType','participants','annotations','project','categoryName','status'],
        headings: [{
            displayName: "Code",
            id: "project_code",
            enabled: true,
            sref: function (field) {
                return "project({projectId:'" + field ? field.val : '?' + "'})"
            },
        }, {
            displayName: "Disease Type",
            id: "disease_type",
            enabled: true
        }, {
            displayName: "Program",
            id: "program",
            enabled: true,
        },
            {
                displayName: "Participants",
                id: "participants",
                enabled: true,
                template: function (field) {
                    return field && field.val || 321;
                },
                sref: function (field) {
                    return "search.participants"
                },
            }, {
                displayName: "Project",
                id: "project_name",
                enabled: false
            }, {
                displayName: "Available Data Files per Data Type",
                id: "availableData",
                enabled: true,
                children: [{
                    displayName: 'Clinical',
                    id: 'clinical',
                    enabled: true,
                    template: function (x) {
                        return 452;
                    },
                }, {
                    displayName: 'SNV',
                    id: 'snv',
                    enabled: true,
                    template: function (x) {
                        return '';
                    }
                }, {
                    displayName: 'mrnA',
                    id: 'mrna',
                    enabled: true,
                    template: function (x) {
                        return 58;
                    }
                }, {
                    displayName: 'miRNA',
                    id: 'mirna',
                    enabled: true,
                    template: function (x) {
                        return 3251;
                    }
                }, {
                    displayName: 'CNV',
                    id: 'cnv',
                    enabled: true,
                    template: function (x) {
                        return 68;
                    }
                }, {
                    displayName: 'Meth',
                    id: 'meth',
                    enabled: true,
                    template: function (x) {
                        return 3251;
                    }
                }]
            }, {
                displayName: "Status",
                id: "status",
                enabled: true,
                template: function (field) {
                    return field && field.val || 'legacy';
                }
            }, {
                displayName: "Last Update",
                id: "last_update",
                enabled: true,
                template: function (field) {
                    return field && field.val || '01/12/2015';
                }
            }
        ]
    };
    angular.module("search.table.files.model", [])
        .value("SearchTableFilesModel", searchTableFilesModel);
}