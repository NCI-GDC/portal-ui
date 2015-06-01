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
            },
            hidden: () => false
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
            td: (row, $filter) => row.clinical && $filter("humanify")(row.clinical.gender),
            sortable: true
        }, {

            name: "Files",
            id: "files",
            enabled: true,
            td: (row, $filter) => {
                const fs = [{name: 'participants.participant_id', value: row.participant_id}]
                const sum = _.sum(_.pluck(row.summary.data_types, 'file_count'))
                return withFilter(sum, fs, $filter);
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
                td: (row, $filter) => dataTypeWithFilters("Clinical", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'Array',
                id: 'Array',
                td: (row, $filter) => dataTypeWithFilters("Raw microarray data", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'Seq',
                id: 'Seq',
                td: (row, $filter) => dataTypeWithFilters("Raw sequencing data", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: "SNV",
                id: "SNV",
                td: (row, $filter) => dataTypeWithFilters("Simple nucleotide variation", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'CNV',
                id: 'cnv',
                td: (row, $filter) => dataTypeWithFilters("Copy number variation", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'SV',
                id: 'sv',
                td: (row, $filter) => dataTypeWithFilters("Structural rearrangement", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'Exp',
                id: 'Exp',
                td: (row, $filter) => dataTypeWithFilters("Gene expression", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'PExp',
                id: 'pexp',
                td: (row, $filter) => dataTypeWithFilters("Protein expression", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'Meth',
                id: 'meth',
                td: (row, $filter) => dataTypeWithFilters("DNA methylation", row, $filter),
                tdClassName: 'text-right'
              }, {
                name: 'Other',
                id: 'other',
                td: (row, $filter) => dataTypeWithFilters("Other", row, $filter),
                tdClassName: 'text-right'
              }
            ]
        }, {
          name: "Annotations",
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
