module ngApp.search.models {
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

    var searchParticipantsModel = {
        title: 'Cases',
        order: ['add_to_cart_filtered', 'my_projects', 'participant_id', 'project.project_id', 'project.primary_site', 'clinical.gender', 'files', 'summary.data_types', 'annotations'],
        rowId: 'participant_id',
        headings: [{
            name: "Cart",
            id: "add_to_cart_filtered",
            td: row => '<div add-to-cart-filtered row="row"></div>',
            tdClassName: 'text-center'
        }, {
            name: "My Projects",
            id: "my_projects",
            td: (row, $scope) => {
                const fakeFile = {participants: [{project: row.project}]};
                const isUserProject = $scope.UserService.isUserProject(fakeFile);
                const icon = isUserProject ? 'check-square-o' : 'square-o';
                return '<i class="fa fa-' + icon + '"></i>';
            },
            inactive: $scope => !$scope.UserService.currentUser
        }, {
            name: "Case ID",
            id: "participant_id",
            td: row => '<a href="participants/'+row.participant_id + '">' +
                         row.participant_id +
                       '</a>',
            tdClassName: 'truncated-cell'
        }, {
            name: "Project",
            id: "project.project_id",
            td: row => '<a href="projects/'+row.project.project_id +
                     '" data-tooltip="' + row.project.name +
                     '" data-tooltip-popup-delay=1000' +
                     '" data-tooltip-append-to-body="true">' +
                     row.project.project_id +
                   '</a>',
            sortable: true,
        }, {
            name: "Primary Site",
            id: "project.primary_site",
            td: row => row.project && row.project.primary_site,
            sortable: true
        }, {
            name: "Gender",
            id: "clinical.gender",
            td: (row, $scope) => row.clinical && $scope.$filter("humanify")(row.clinical.gender),
            sortable: true
        }, {

            name: "Files",
            id: "files",
            td: (row, $scope) => {
                const fs = [{name: 'participants.participant_id', value: row.participant_id}]
                const sum = _.sum(_.pluck(row.summary.data_types, 'file_count'))
                return withFilter(sum, fs, $scope.$filter);
            },
            tdClassName: 'text-right'
        }, {
            name: "Available Files per Data Type",
            id: "summary.data_types",
            thClassName:'text-center',
            children: [
          {
            name: 'Clinical',
            id: 'clinical',
            td: (row, $scope) => dataTypeWithFilters("Clinical", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Array',
            th: '<abbr data-tooltip="Raw microarray data">Array</abbr>',
            id: 'Array',
            td: (row, $scope) => dataTypeWithFilters("Raw microarray data", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Seq',
            th: '<abbr data-tooltip="Raw sequencing data">Seq</abbr>',
            id: 'Seq',
            td: (row, $scope) => dataTypeWithFilters("Raw sequencing data", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: "SNV",
            th: '<abbr data-tooltip="Simple nucleotide variation">SNV</abbr>',
            id: "SNV",
            td: (row, $scope) => dataTypeWithFilters("Simple nucleotide variation", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'CNV',
            th: '<abbr data-tooltip="Copy number variation">CNV</abbr>',
            id: 'cnv',
            td: (row, $scope) => dataTypeWithFilters("Copy number variation", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'SV',
            th: '<abbr data-tooltip="Structural rearrangement">SV</abbr>',
            id: 'sv',
            td: (row, $scope) => dataTypeWithFilters("Structural rearrangement", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Exp',
            th: '<abbr data-tooltip="Gene expression">Exp</abbr>',
            id: 'Exp',
            td: (row, $scope) => dataTypeWithFilters("Gene expression", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'PExp',
            th: '<abbr data-tooltip="Protein expression">PExp</abbr>',
            id: 'pexp',
            td: (row, $scope) => dataTypeWithFilters("Protein expression", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Meth',
            th: '<abbr data-tooltip="DNA methylation">Meth</abbr>',
            id: 'meth',
            td: (row, $scope) => dataTypeWithFilters("DNA methylation", row, $scope.$filter),
            tdClassName: 'text-right'
          }, {
            name: 'Other',
            id: 'other',
            td: (row, $scope) => dataTypeWithFilters("Other", row, $scope.$filter),
            tdClassName: 'text-right'
          }
        ]
        }, {
          name: "Annotations",
          id: "annotations",
          td: (row, $scope) => {
            function getAnnotations(row, $filter) {
              return row.annotations.length == 1 ?
                     '<a href="annotations/' + row.annotations[0].annotation_id + '">' + row.annotations[0].annotation_id + '</a>' :
                     withAnnotationFilter(
                       row.annotations.length,
                       [{name: "annotation_id", value: _.pluck(row.annotations, 'annotation_id')}],
                       $filter);
            }

            return row.annotations && row.annotations.length ? getAnnotations(row, $scope.$filter) : 0;
          },
          tdClassName: 'truncated-cell text-right'
        }],
        fields: [
          "participant_id",
          "annotations.annotation_id",
          "clinical.gender",
          "project.project_id",
          "project.name",
          "project.primary_site",
        ],
        expand: [
          "summary.data_types"
        ]
    };
    angular.module("search.table.participants.model", [])
        .value("SearchTableParticipantsModel", searchParticipantsModel);
}
