module ngApp.search.models {
    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    function withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
        const filterString = $filter("makeFilter")(filters, true);
        const href = 'annotations?filters=' + filterString;
        const val = '{{' + value + '|number:0}}'; 
        return "<a href='" + href + "'>" + val + '</a>';
    }

    function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
        const filterString = $filter("makeFilter")(filters, true);
        const href = 'search/f?filters=' + filterString;
        const val = '{{' + value + '|number:0}}'; 
        return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
    }
    function getDataType(dataTypes: Object[], dataType:string): number {
        const data = _.find(dataTypes, {data_type: dataType});
        return data ? data.file_count : 0;
    }
    function dataTypeWithFilters(dataType: string, row: Object[], $filter: ng.IFilterService) {
        const fs = [
          {name: 'participants.participant_id', value: row.participant_id},
          {name: 'files.data_type', value: dataType}
        ]; 
        return withFilter(getDataType(row.summary.data_types, dataType), fs, $filter);
    }


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
            th: "Add to Cart",
            id: "add_to_cart_filtered",
            noTitle: true,
            enabled: true,
            compile:function($scope){
                $scope.arrayRow = arrayToObject($scope.row);
                var htm = '<div add-to-cart-filtered row="row"></div>';
                return htm;
            }
        }, {
            th: "My Projects",
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
            th: "Case ID",
            id: "participant_id",
            td: row => '<a href="participants/'+row.participant_id + '">' +
                         row.participant_id + 
                       '</a>',
            tdClassName: 'truncated-cell',
            sortable: true
        }, {
            th: "Project",
            id: "project.project_id",
            td: row => '<a href="projects/'+row.project.project_id + 
                     '" data-tooltip="' + row.project.name +
                     '" data-tooltip-append-to-body="true">' + 
                     row.project.project_id + 
                   '</a>',
            sortable: true,
        }, {
            th: "Primary Site",
            id: "project.primary_site",
            td: row => row.project.primary_site,
            sortable: true
        }, {
            th: "Gender",
            id: "clinical.gender",
            td: (row, $filter) => $filter("humanify")(row.clinical.gender)
        }, {

            th: "Files",
            id: "files",
            enabled: true,
            td: (row, $filter) => {
                const fs = [{name: 'participants.participant_id', value: row.participant_id}]
                const sum = _.sum(_.pluck(row.summary.data_types, 'file_count')) 
                return withFilter(sum, fs, $filter);
            },
            tdClassName: 'text-right'
        }, {
            th: "Available Files per Data Type",
            id: "summary.data_types",
            thClassName:'text-center',
            children: [
              {
                th: 'Clinical',
                id: 'clinical',
                td: (row, $filter) => dataTypeWithFilters("Clinical", row, $filter)
              }, {
                th: 'Array',
                id: 'Array',
                td: (row, $filter) => dataTypeWithFilters("Raw microarray data", row, $filter)
              }, {
                th: 'Seq',
                id: 'Seq',
                td: (row, $filter) => dataTypeWithFilters("Raw sequencing data", row, $filter)
              }, {
                th: "SNV",
                id: "SNV",
                td: (row, $filter) => dataTypeWithFilters("Simple nucleotide variation", row, $filter)
              }, {
                th: 'CNV',
                id: 'cnv',
                td: (row, $filter) => dataTypeWithFilters("Copy number variation", row, $filter)
              }, {
                th: 'SV',
                id: 'sv',
                td: (row, $filter) => dataTypeWithFilters("Structural rearrangement", row, $filter)
              }, {
                th: 'Exp',
                id: 'Exp',
                td: (row, $filter) => dataTypeWithFilters("Gene expression", row, $filter)
              }, {
                th: 'PExp',
                id: 'pexp',
                td: (row, $filter) => dataTypeWithFilters("Protein expression", row, $filter)
              }, {
                th: 'Meth',
                id: 'meth',
                td: (row, $filter) => dataTypeWithFilters("DNA methylation", row, $filter)
              }, {
                th: 'Other',
                id: 'other',
                td: (row, $filter) => dataTypeWithFilters("Other", row, $filter)
              }
            ]
        }, {
            th: "Annotations",
            id: "annotations",
        td: (row, $filter) => {
          function getAnnotations(row, $filter) {
            return row.annotations.length == 1 ?
                     '<a href="annotations/' + row.annotations[0].annotation_id + '">' + row.annotations[0].annotation_id + '</a>' :
                     withAnnotationFilter(
                       row.annotations.length, 
                       [{name: "annotation_id", value: _.pluck(row.annotations, 'annotation_id')}], 
                       $filter);
          }
          
          return row.annotations && row.annotations.length ? getAnnotations(row, $filter) : 0;
        },
        tdClassName: 'truncated-cell text-right'
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
