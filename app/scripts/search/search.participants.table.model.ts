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

            var files = _.filter(_.find(row, (elem) => {
                return elem.id === "files";
            }).val, (file) => {
                return file.data_type === data_type;
            });

            if (!files.length) {
                return;
            }

            if (files.length > 1) {
                var filter = $filter("makeFilter")([{name: 'participants.participant_id', value: uuid},{name: 'files.data_type', value: data_type}]);
                return {
                    state: "/search/f",
                    filters: filter
                };
            } else if (files.length === 1) {
                return {
                    state: "/files/" + files[0].file_id
                };
            } 
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

                $scope.files = files ? files.val : [];
                var htm = '<div add-to-cart-filtered files="files" row="row"></div>';
                return htm;

            }
        }, {
            displayName: "My Projects",
            id: "my_projects",
            enabled: function (scope) {
              return scope.UserService.currentUser;
            },
            icon: function (field, row, scope) {
              var project = _.find(row, function (elem) {
                return elem.id === 'project'
              }).val;
              var UserService: IUserService = scope.UserService;
              return UserService.isUserProject({
                participants: [
                    {
                        project: project
                    }
                ]
              }) ? 'check' : 'close';
            }
        }, {
            displayName: "Participant ID",
            id: "participant_id",
            enabled: true,
            sref:function(elem,row,scope){
                var uuid:TableiciousEntryDefinition = _.find(row,function(elem:TableiciousEntryDefinition){
                    return elem.id === "participant_id";
                });

                return {
                    state: "/participants/" + uuid.val
                };
            },
            sortable: true
        }, {
            displayName: "Project",
            id: "project.project_id",
            enabled: true,
            sortable: true,
            sref: function(field, row, scope, $filter) {
                var project = _.find(row, (item) => {
                    return item.id === "project";
                });

                return {
                    state: "/projects/" + project.val.project_id
                };
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

            displayName: "Files",
            id: "files",
            fieldClass: 'text-right',
            enabled: true,
            template:function(field){
                //why is fields an object instead of an array....
                return field && field.val && field.val.length;
            },
            sref: function(field, row, scope, $filter) {
                var fileIds = _.map(_.find(row, (item) => {
                    return item.id === "files";
                }).val, (file: any) => {
                    return file.file_id;
                });

                if (!fileIds.length) {
                    return;
                }

                var uuid:TableiciousEntryDefinition = _.find(row,function(elem:TableiciousEntryDefinition){
                    return elem.id === "participant_id";
                }).val;

                var filter = $filter("makeFilter")([
                    {name: "participants.participant_id", value: uuid}
                ]);
                return {
                    state: "/search/f",
                    filters: filter
                };
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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

                        var data = _.find(summary.val.data_types, function(x: any){
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
                var annotationIds = _.map(annotations.val, (annotation: any) => {
                    return annotation.annotation_id;
                });

                if (annotationIds.length > 1) {
                  var filter = $filter("makeFilter")([{name: 'annotation_id', value: annotationIds}]);
                  return {
                    state: "/annotations",
                    filters: filter
                  };
                } else if (annotationIds.length === 1) {
                  return {
                    state: "/annotations/" + annotationIds[0]
                  };
                }
            },
            fieldClass: 'text-right'
        }],
        fields: [
          "participant_id",
          "annotations.annotation_id"
        ],
        expand: [
          "clinical",
          "files",
          "summary",
          "project"
        ]
    };
    angular.module("search.table.participants.model", [])
        .value("SearchTableParticipantsModel", searchParticipantsModel);
}
