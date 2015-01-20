module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    function getFileSref(data_type:string) {
        return function fileSref (field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
            var projectCode = _.find(row,function(elem){
                return elem.id === 'project_code';
            }).val;

            var filter = $filter("makeFilter")([{name: 'participants.admin.disease_code', value: projectCode},{name: 'files.data_type', value: data_type}]);
            return "search.participants({ 'filters':"+filter+"})";

        }
    }



    var projectTableModel:TableiciousConfig = {
        title: 'Projects',
        order: ['project_code', 'disease_type', 'program', 'participants', 'project_name', 'availableData', 'status', 'last_update'],
        headings: [{
            displayName: "Code",
            id: "project_code",
            enabled: true,
            sref: function (field) {
                return "project({projectId:'" + field.val + "'})"
            }
        }, {
            displayName: "Disease Type",
            id: "disease_type",
            enabled: true
        }, {
            displayName: "Program",
            id: "program",
            enabled: true
        },
        {
            displayName: "Participants",
            id: "participants",
            enabled: true,
            template: function (field) {
                return field && field.val || 321;
            },
            sref: function (field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {

                var projectCode = _.find(row,function(elem){
                    return elem.id === 'project_code';
                }).val;

                var filter = $filter("makeFilter")([{name: 'participants.admin.disease_code', value: projectCode }]);
                return "search.participants({ 'filters':"+filter+"})";

            }
        }, {
            displayName: "Project",
            id: "project_name",
            enabled: false
        }, {
            displayName: "Available Data Files per Data Type",
            id: "availableData",
            headingClass:'text-center',
            enabled: true,
            children: [{
                displayName: 'Clinical',
                id: 'clinical',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === '_summary';
                    });
                    var data:any = summary.val._analyzed_data['Clinical data'];
                    return data['file_count'];
                },
                sref: getFileSref('Clinical data')
            }, {
                displayName: 'SNV',
                id: 'snv',
                enabled: true,
                sref: getFileSref('Simple nucleotide variant')
            }, {
                displayName: 'mrnA',
                id: 'mrna',
                enabled: true,
                sref: getFileSref('mRNA expression')
            }, {
                displayName: 'miRNA',
                id: 'mirna',
                enabled: true,
                sref: getFileSref('miRNA expression')
            }, {
                displayName: 'CNV',
                id: 'cnv',
                enabled: true,
                sref: getFileSref('Copy number variant')
            }, {
                displayName: 'Meth',
                id: 'meth',
                enabled: true,
                sref: getFileSref('DNA methylation')
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
    angular.module("projects.table.model", [])
        .value("ProjectTableModel", projectTableModel);
}