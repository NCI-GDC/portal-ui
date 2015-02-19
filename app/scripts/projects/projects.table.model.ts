module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    function getParticipantSref(data_type:string) {
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
        order: ['disease_type', 'primary_site', 'program', 'participants', 'project_name', 'file_size', 'files', 'last_update'],
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
        },{
            displayName: "Primary Site",
            id: "primary_site",
            enabled: true
        }, {
            displayName: "Program",
            id: "program",
            enabled: true
        },
        {
            displayName: "Participants",
            id: "summary.participant_count",
            enabled: true,
            sref: function (field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
                console.log(row);
                var disease_code = _.find(row,function(elem){
                    return elem.id === 'project_code';
                }).val;

                var filter = $filter("makeFilter")([{name: 'participants.admin.disease_code', value: disease_code }]);

                return "search.participants({ 'filters':"+filter+"})";

            },
            fieldClass: 'text-right',
        }, {
            displayName: "Project",
            id: "project_name",
            enabled: false
        }, {
            displayName: "Available Participants per Data Type",
            id: "data_types",
            headingClass:'text-center',
            enabled: true,
            children: [{
                displayName: 'Clinical',
                id: 'clinical',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x:any){
                        return x.data_type === 'Clinical';
                    });

                    return data && data.participant_count ? data.participant_count : 0;
                },
                fieldClass: 'text-right',
                sref: getParticipantSref('Clinical')
            },  {
                displayName: 'Exp',
                id: 'Exp',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Gene expression';
                    });

                    return data && data.participant_count ? data.participant_count : 0;
                },
                fieldClass: 'text-right',
                sref: getParticipantSref('Gene expression')
            }, {
                displayName: 'Array',
                id: 'Array',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Raw microarray data';
                    });

                    return data && data.participant_count ? data.participant_count : 0;
                },
                fieldClass: 'text-right',
                sref: getParticipantSref('Raw microarray data')
            }, {
                displayName: 'Seq',
                id: 'Seq',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Raw sequencing data';
                    });

                    return data && data.participant_count ? data.participant_count : 0;
                },
                fieldClass: 'text-right',
                sref: getParticipantSref('Raw sequencing data')
            }, {
                displayName: 'CNV',
                id: 'cnv',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Copy number variation';
                    });

                    return data && data.participant_count ? data.participant_count : 0;
                },
                fieldClass: 'text-right',
                sref: getParticipantSref('Copy number variation')
            }, {
                displayName: 'Meth',
                id: 'meth',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'DNA methylation';
                    });

                    return data && data.participant_count ? data.participant_count : 0;
                },
                fieldClass: 'text-right',
                sref: getParticipantSref('DNA methylation')
                }]
            }, {
                displayName: "Files",
                id: "summary.data_file_count",
                enabled: true,
                sref: function (field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
                    var projectCode = _.find(row,function(elem){
                        return elem.id === 'project_code';
                    }).val;

                    var filter = $filter("makeFilter")([{name: 'participants.admin.disease_code', value: projectCode }]);
                    return "search.files({ 'filters':"+filter+"})";
                },
                fieldClass: 'text-right'
            }, {
                displayName: "File Size",
                id: "file_size",
                enabled: true,
                template: function (field, row, scope, filter) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });
                    return scope.$filter('size')(summary.val.file_size);
                },
                fieldClass: 'text-right'
            }
        ]
    };
    angular.module("projects.table.model", [])
        .value("ProjectTableModel", projectTableModel);
}
