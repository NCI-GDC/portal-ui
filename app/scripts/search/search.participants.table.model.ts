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
            displayName: "Disease Type",
            id: "project.name",
            enabled: true,
            sortable: true
        }, {
            displayName: "Gender",
            id: "clinical.gender",
            enabled: true
        }, {
            displayName: "Tumor Stage",
            id: "person_neoplasm_cancer_status",
            enabled: true,
            template: function() {
              return "tbd";
            }
        }, {
            displayName: "Available Files per Data Type",
            id: "summary.data_types",
            headingClass:'text-center',
            enabled: true,
            children: [{
                displayName: 'Clinical',
                id: 'clinical',
                enabled: true,
                fieldClass: 'text-right',
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Clinical';
                    });

                    return data && data.file_count ? data.file_count : 0;
                },
                sref: getFileSref('Clinical')
            },  {
                displayName: 'Exp',
                id: 'Exp',
                fieldClass: 'text-right',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Gene expression';
                    });

                    return data && data.file_count ? data.file_count : 0;
                },
                sref: getFileSref('Gene expression')
            }, {
                displayName: 'Array',
                id: 'Array',
                fieldClass: 'text-right',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Raw microarray data';
                    });

                    return data && data.file_count ? data.file_count : 0;
                },
                sref: getFileSref('Raw microarray data')
            }, {
                displayName: 'Seq',
                id: 'Seq',
                fieldClass: 'text-right',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Raw sequencing data';
                    });

                    return data && data.file_count ? data.file_count : 0;
                },
                sref: getFileSref('Raw sequencing data')
            }, {
                displayName: 'CNV',
                id: 'cnv',
                fieldClass: 'text-right',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'Copy number variation';
                    });

                    return data && data.file_count ? data.file_count : 0;
                },
                sref: getFileSref('Copy number variation')
            }, {
                displayName: 'Meth',
                id: 'meth',
                fieldClass: 'text-right',
                enabled: true,
                template: function (field:TableiciousEntryDefinition,row,scope) {
                    var summary:TableiciousEntryDefinition = _.find(row,function(x:TableiciousEntryDefinition){
                        return x.id === 'summary';
                    });

                    var data = _.find(summary.val.data_types, function(x){
                        return x.data_type === 'DNA methylation';
                    });

                    return data && data.file_count ? data.file_count : 0;
                },
                sref: getFileSref('DNA methylation')
            }]
        }, {

            displayName: "Files",
            id: "files",
            fieldClass: 'text-right',
            enabled: true,
            template:function(field){
                //why is fields an object instead of an array....
                return field && field.val && field.val.length;
            }
        }]
    };
    angular.module("search.table.participants.model", [])
        .value("SearchTableParticipantsModel", searchParticipantsModel);
}
