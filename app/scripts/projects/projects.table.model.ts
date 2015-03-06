module ngApp.projects.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    function getParticipantSref(data_type:string) {
        return function fileSref (field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
            var projectId = _.find(row, function(elem) {
                return elem.id === 'project_id';
            }).val;

            var filter = $filter("makeFilter")([{name: 'participants.project.project_id', value: projectId},{name: 'files.data_type', value: data_type}]);
            return {
                state: "search.participants",
                filters: { 
                    filters: filter
                }
            };
        }
    }

    var projectTableModel:TableiciousConfig = {
        title: 'Projects',
        order: ['project_id', 'primary_site', 'program', 'participants', 'disease_type', 'file_size', 'files', 'last_update'],
        headings: [
            {
                displayName: "ID",
                id: "project_id",
                enabled: true,
                sref: function (field, scope) {
                    var project_id = _.result(_.findWhere(scope, { 'id': 'project_id' }), 'val');
                    return {
                        state: "project",
                        filters: {
                            projectId: project_id
                        }
                    };
                }
            },{
                displayName: "Disease Type",
                id: "disease_type",
                enabled: true
            },{
                displayName: "Primary Site",
                id: "primary_site",
                enabled: true
            }, {
                displayName: "Program",
                id: "program.name",
                enabled: true
            },
            {
                displayName: "Participants",
                id: "summary.participant_count",
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    }).val;

                    return $filter("number")(summary && summary.participant_count ? summary.participant_count : 0);
                },
                sref: function (field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
                    var project_id = _.find(row,function(elem){
                        return elem.id === 'project_id';
                    }).val;

                    var filter = $filter("makeFilter")([{name: 'participants.project.project_id', value: project_id }]);

                    return {
                        state: "search.participants",
                        filters: {
                            filters: filter
                        }
                    };

                },
                fieldClass: 'text-right',
            },  {
                displayName: "Available Participants per Data Type",
                id: "data_types",
                headingClass:'text-center',
                enabled: true,
                children: [
                    {
                        displayName: 'Clinical',
                        id: 'clinical',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x:any){
                                return x.data_type === 'Clinical';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Clinical')
                    },  {
                        displayName: 'Array',
                        id: 'Array',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'Raw microarray data';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Raw microarray data')
                    }, {
                        displayName: 'Seq',
                        id: 'Seq',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'Raw sequencing data';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Raw sequencing data')
                    }, {
                        displayName: "SNV",
                        id: "SNV",
                        enabled: true,
                        fieldClass: "text-right",
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === "Simple nucleotide variation";
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        sref: getParticipantSref("Simple nucleotide variation")
                    }, {
                        displayName: 'CNV',
                        id: 'cnv',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'Copy number variation';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Copy number variation')
                    }, {
                        displayName: 'SV',
                        id: 'sv',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'Structural rearrangement';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Structural rearrangement')
                    }, {
                        displayName: 'Exp',
                        id: 'Exp',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'Gene expression';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Gene expression')
                    }, {
                        displayName: 'PExp',
                        id: 'pexp',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'Protein expression';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Protein expression')
                    }, {
                        displayName: 'Meth',
                        id: 'meth',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'DNA methylation';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('DNA methylation')
                    }, {
                        displayName: 'Other',
                        id: 'other',
                        enabled: true,
                        template: function (field:TableiciousEntryDefinition,row,scope, $filter) {
                            var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                                return x.id === 'summary';
                            });

                            var data = _.find(summary.val.data_types, function(x){
                                return x.data_type === 'Other';
                            });

                            return $filter("number")(data && data.participant_count ? data.participant_count : 0);
                        },
                        fieldClass: 'text-right',
                        sref: getParticipantSref('Other')
                    }
                ]
            }, {
                displayName: "Files",
                id: "summary.file_count",
                enabled: true,
                template: function(field, row, scope, $filter) {
                    var summary = _.find(row, function(elem) {
                        return elem.id === "summary";
                    });

                    return $filter("number")(summary.val.file_count || 0); 
                },
                sref: function (field:TableiciousEntryDefinition,row:TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
                    var projectId = _.find(row,function(elem){
                        return elem.id === 'project_id';
                    }).val;

                    var filter = $filter("makeFilter")([{name: 'participants.project.project_id', value: projectId }]);
                    return {
                        state: "search.files",
                        filters: {
                            filters: filter
                        }
                    };
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
        ],
        fields: [
            "disease_type",
            "summary.data_types.file_count",
            "summary.data_types.data_type",
            "summary.data_types.participant_count",
            "summary.experimental_strategies.file_count",
            "summary.experimental_strategies.participant_count",
            "summary.experimental_strategies.experimental_strategy",
            "summary.participant_count",
            "summary.file_size",
            "summary.file_count",
            "state",
            "program.project_id",
            "program.name",
            "primary_site",
            "project_id"
        ]
    };
    angular.module("projects.table.model", [])
        .value("ProjectTableModel", projectTableModel);
}
