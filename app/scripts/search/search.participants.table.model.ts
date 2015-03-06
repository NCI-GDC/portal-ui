module ngApp.search.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    function arrayToObject(array){
        var obj = {};
        array.forEach(function(elem){
            obj[elem.id] = elem.val;
        })
        return obj;
    }

    function getFileSref(data_type:string) {
        return function fileSref (field: TableiciousEntryDefinition, row: TableiciousEntryDefinition[], scope, $filter: ng.IFilterService) {
            var uuid = _.find(row,function(elem){
                return elem.id === 'participant_id';
            }).val;

            var experimentalStrat = _.find(_.find(row, function(elem) {
                    return elem.id === "summary"
                }).val.data_types, function(type) {
                    return type.data_type === data_type;
                });

            if (!experimentalStrat.file_count) {
                return;
            }

            var filter = $filter("makeFilter")([{name: 'participants.participant_id', value: uuid},{name: 'files.data_type', value: data_type}]);
            return "search.files({ 'filters':"+filter+"})";
        }
    }

    var searchParticipantsModel:TableiciousConfig = {
        title: 'Participants',
        order: ['disease_type', 'gender', 'tumor_stage', 'files', 'last_update'],
        headings: [{
            displayName: "Add to Cart",
            id: "add_to_cart_filtered",
            noTitle: true,
            enabled: true,
            compile:function($scope){
                $scope.arrayRow = arrayToObject($scope.row);
                var files:TableiciousEntryDefinition = _.find($scope.row,function(elem:TableiciousEntryDefinition){
                    return elem.id === 'files';
                });

                $scope.files = files.val;
                var htm = '<div add-to-cart-filtered files="files" row="row"></div>';
                return htm;

            }
        },{
            displayName: "Participant ID",
            id: "participant_id",
            enabled: true,
            sref:function(elem,row,scope){
                var uuid:TableiciousEntryDefinition = _.find(row,function(elem:TableiciousEntryDefinition){
                    return elem.id === "participant_id";
                });

                return "participant({ participantId : '"+uuid.val+"' })";
            },
            sortable: true
        }, {
            displayName: "Project",
            id: "project.code",
            enabled: true,
            sortable: true,
            sref: function(field, row, scope, $filter) {
                var project = _.find(row, (item) => {
                    return item.id === "project";
                });

                return "project({ projectId: '" + project.val.project_id + "'})";
            }
        }, {
            displayName: "Primary Site",
            id: "project.primary_site",
            enabled: true,
            sortable: true
        }, {
            displayName: "Gender",
            id: "clinical.gender",
            template: function(field, row, scope, $filter) {
                var clinical = _.find(row, (item) => {
                    return item.id === "clinical";
                });
                return $filter("humanify")(clinical.val.gender);
            },
            enabled: true
        }, {
            displayName: "Tumor Stage",
            id: "person_neoplasm_cancer_status",
            enabled: true,
            template: function() {
              return "tbd";
            }
        }, {

            displayName: "Files",
            id: "files",
            fieldClass: 'text-right',
            enabled: true,
            template:function(field){
                //why is fields an object instead of an array....
                return field && field.val && field.val.length;
            },
            sref: function(field, row, scope, $filter) {
                var files = _.find(row, (item) => {
                    return item.id === "files";
                });
                var fileIds = _.map(files.val, (file) => {
                    return file.file_id;
                });

                if (!fileIds.length) {
                    return;
                }

                var uuid:TableiciousEntryDefinition = _.find(row,function(elem:TableiciousEntryDefinition){
                    return elem.id === "participant_id";
                }).val;

                var filter = $filter("makeFilter")([
                    {name: 'file_id', value: fileIds},
                    {name: "participants.participant_id", value: uuid}
                ]);
                return "search.files({ 'filters':"+filter+"})";
            }
        }, {
            displayName: "Available Files per Data Type",
            id: "summary.data_types",
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Clinical')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Raw microarray data')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Raw sequencing data')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    sref: getFileSref("Simple nucleotide variation")
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Copy number variation')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Structural rearrangement')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Gene expression')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Protein expression')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('DNA methylation')
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

                        return $filter("number")(data && data.file_count ? data.file_count : 0);
                    },
                    fieldClass: 'text-right',
                    sref: getFileSref('Other')
                }
            ]
        }, {
            displayName: "Annotations",
            id: "annotations",
            visible: true,
            template: function(field, row) {
                var ret = field && field.val ? field.val.length : "0";

                return ret;
            },
            sref: function(field, row, scope, $filter) {
                var annotations = _.find(row, (item) => {
                    return item.id === "annotations";
                });
                var annotationIds = _.map(annotations.val, (annotation) => {
                    return annotation.annotation_id;
                });

                var filter = $filter("makeFilter")([{name: 'annotation_id', value: annotationIds}]);
                return "annotations({ 'filters':"+filter+"})";
            }
        }],
        fields: [
          "participant_id",
          "clinical.vital_status",
          "clinical.gender",
          "clinical.ethnicity",
          "files.file_id",
          "files.file_name",
          "files.file_size",
          "files.access",
          "summary.file_size",
          "summary.file_count",
          "summary.experimental_strategies.file_count",
          "summary.experimental_strategies.experimental_strategy",
          "summary.data_types.file_count",
          "summary.data_types.data_type",
          "project.name",
          "project.code",
          "project.primary_site",
          "project.project_id",
          "project.program.name",
          "annotations.annotation_id"
        ]
    };
    angular.module("search.table.participants.model", [])
        .value("SearchTableParticipantsModel", searchParticipantsModel);
}
