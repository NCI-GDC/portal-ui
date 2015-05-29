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
        title: 'Cases',
        order: ['add_to_cart_filtered', 'my_projects', 'participant_id', 'project.project_id', 'project.primary_site', 'clinical.gender', 'files', 'summary.data_types', 'annotations'],
        rowId: 'participant_id',
        headings: [{
            displayName: "Add to Cart",
            id: "add_to_cart_filtered",
            noTitle: true,
            enabled: true,
            compile:function($scope){
                $scope.arrayRow = arrayToObject($scope.row);
                var htm = '<div add-to-cart-filtered row="row"></div>';
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
            displayName: "Case ID",
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
            compile: function ($scope) {
              var project = _.result(_.findWhere($scope.row, {'id': 'project'}), 'val');
              var htm = '<a data-ng-href="/projects/' + project.project_id + '" data-tooltip="' +
                        project.name + '" tooltip-append-to-body="true" tooltip-placement="right">' +
                        project.project_id + '</a>';
              return htm;
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
            template:function(field, row){
                var fileCount = 0;
                var summary = _.find(row, (item) => {
                    return item.id === "summary";
                }).val;

                _.forEach(summary.data_types, (dType) => {
                    fileCount += dType.file_count;
                });

                return fileCount;
            },
            sref: function(field, row, scope, $filter) {
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
                    toolTipText: 'Raw microarray data',
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
                    toolTipText: 'Raw sequencing data',
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
                    toolTipText: "Simple nucleotide variation",
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
                    toolTipText: 'Copy number variation',
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
                    toolTipText: 'Structural rearrangement',
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
                    toolTipText: 'Gene expression',
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
                    toolTipText: 'Protein expression',
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
                    toolTipText: 'DNA methylation',
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

                if (!annotations) {
                    return;
                }

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
          "summary.data_types",
          "project",
          "project.program"
        ]
    };
    angular.module("search.table.participants.model", [])
        .value("SearchTableParticipantsModel", searchParticipantsModel);
}
