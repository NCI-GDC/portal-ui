module ngApp.search.models {
    function withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
        var filterString = $filter("makeFilter")(filters, true);
        var href = 'annotations?filters=' + filterString;
        var val = '{{' + value + '|number:0}}';
        return "<a href='" + href + "'>" + val + '</a>';
    }

    function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
        var filterString = $filter("makeFilter")(filters, true);
        var href = 'search/f?filters=' + filterString;
        var val = '{{' + value + '|number:0}}';
        return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
    }
    function getDataCategory(dataCategories: Object[], dataCategory: string): number {
        var data = _.find(dataCategories, {data_category: dataCategory});
        return data ? data.file_count : 0;
    }
    function dataCategoryWithFilters(dataCategory: string, row: Object[], $filter: ng.IFilterService) {
        var fs = [
          {field: 'cases.case_id', value: row.case_id},
          {field: 'files.data_category', value: dataCategory}
        ];
        return withFilter(getDataCategory(row.summary ? row.summary.data_categories : [], dataCategory), fs, $filter);
    }

    var searchParticipantsModel = {
        title: 'Cases',
        rowId: 'case_id',
        headings: [{
            name: "Cart",
            id: "add_to_cart_filtered",
            td: row => '<add-to-cart-filtered row="row"></add-to-cart-filtered>',
            tdClassName: 'text-center'
        }, {
            name: "My Projects",
            id: "my_projects",
            td: (row, $scope) => {
                var fakeFile = {cases: [{project: row.project}]};
                var isUserProject = $scope.UserService.isUserProject(fakeFile);
                var icon = isUserProject ? 'check' : 'remove';
                return '<i class="fa fa-' + icon + '"></i>';
            },
            inactive: $scope => !$scope.UserService.currentUser || $scope.UserService.currentUser.isFiltered,
            hidden: false,
            tdClassName: "text-center"
        }, {
            name: "Case UUID",
            id: "case_id",
            td: row => '<a href="cases/'+ row.case_id + '">' +
                         row.case_id +
                       '</a>',
            tdClassName: 'truncated-cell'
        }, {
            name: "Project",
            id: "project.project_id",
            td: row => '<a href="projects/'+row.project.project_id +
                     '" data-uib-tooltip="' + row.project.name +
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
            id: "demographic.gender",
            td: (row, $scope) => row.demographic && $scope.$filter("humanify")(row.demographic.gender) || '--',
            sortable: true
        }, {
            name: "Files",
            id: "files",
            td: (row, $scope) => {
                var fs = [{field: 'cases.case_id', value: row.case_id}]
                var sum = _.sum(_.pluck(row.summary ? row.summary.data_categories : [], 'file_count'))
                return withFilter(sum, fs, $scope.$filter);
            },
            thClassName: 'text-right',
            tdClassName: 'text-right'
        }, {
            name: "Available Files per Data Category",
            id: "summary.data_categories",
            thClassName:'text-center',
            children: [
          {
            name: 'Seq',
            th: '<abbr data-uib-tooltip="Sequencing data">Seq</abbr>',
            id: 'Seq',
            td: (row, $scope) => dataCategoryWithFilters("Raw sequencing data", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }, {
            name: "Exp",
            th: '<abbr data-uib-tooltip="Transcriptome Profiling">Exp</abbr>',
            id: "Exp",
            td: (row, $scope) => dataCategoryWithFilters("Gene expression", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }, {
            name: 'SNV',
            th: '<abbr data-uib-tooltip="Simple Nucleotide Variation">SNV</abbr>',
            id: 'SNV',
            td: (row, $scope) => dataCategoryWithFilters("Simple nucleotide variation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }, {
            name: 'CNV',
            th: '<abbr data-uib-tooltip="Copy Number Variation">CNV</abbr>',
            id: 'cnv',
            td: (row, $scope) => dataCategoryWithFilters("Copy number variation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }, {
            name: 'SV',
            th: '<abbr data-uib-tooltip="Structural Rearrangement">SV</abbr>',
            id: 'SV',
            td: (row, $scope) => dataCategoryWithFilters("Structural rearrangement", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }, {
            name: 'Meth',
            th: '<abbr data-uib-tooltip="DNA Methylation">Meth</abbr>',
            id: 'meth',
            td: (row, $scope) => dataCategoryWithFilters("DNA methylation", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }, {
            name: 'Clinical',
            th: '<abbr data-uib-tooltip="Clinical">Clinical</abbr>',
            id: 'clinical',
            td: (row, $scope) => dataCategoryWithFilters("Clinical", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }, {
            name: 'Biospecimen',
            id: 'biospecimen',
            td: (row, $scope) => dataCategoryWithFilters("Other", row, $scope.$filter),
            thClassName: 'text-right',
            tdClassName: 'text-right'
          }
        ]
        }, {
          name: "Annotations",
          id: "annotations.annotation_id",
          td: (row, $scope) => {
            function getAnnotations(row, $filter) {
              return row.annotations.length == 1 ?
                     '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' :
                     withAnnotationFilter(
                       row.annotations.length,
                       [{field: "annotation_id", value: _.pluck(row.annotations, 'annotation_id')}],
                       $filter);
            }

            return row.annotations && row.annotations.length ? getAnnotations(row, $scope.$filter) : 0;
          },
          thClassName: 'text-right',
          tdClassName: 'text-right'
        }, {
            name: 'Program',
            id: 'project.program.name',
            td: (row, $scope) => row.project && $scope.$filter("humanify")(row.project.program.name),
            sortable: false,
            hidden: true
        }, {
            name: 'Disease Type',
            id: 'project.disease_type',
            td: (row, $scope) => row.project && $scope.$filter("humanify")(row.project.disease_type),
            sortable: false,
            hidden: true
        }, {
            name: 'Age at diagnosis',
            id: 'diagnoses.age_at_diagnosis',
            td: (row, $scope) => (row.diagnoses && $scope.$filter("ageDisplay")(row.diagnoses.age_at_diagnosis)) || "--",
            sortable: false,
            hidden: true
        }, {
            name: 'Days to death',
            id: 'diagnoses.days_to_death',
            td: (row, $scope) => (row.diagnoses && $scope.$filter("number")(row.diagnoses.days_to_death, 0)) || "--",
            sortable: false,
            hidden: true
        }, {
            name: 'Vital Status',
            id: 'diagnoses.vital_status',
            td: (row, $scope) => row.diagnoses && $scope.$filter("humanify")(row.diagnoses.vital_status),
            sortable: false,
            hidden: true
        }, {
            name: 'Year of diagnosis',
            id: 'diagnoses.year_of_diagnosis',
            td: (row, $scope) => (row.diagnoses && row.diagnoses.year_of_diagnosis) || "--",
            sortable: false,
            hidden: true
        }, {
            name: 'ICD-10',
            id: 'icd_10',
            td: (row, $scope) => (row.clinical && row.clinical.icd_10) || "--",
            sortable: false,
            hidden: true
        }, {
            name: 'Ethnicity',
            id: 'demographic.ethnicity',
            td: (row, $scope) => row.demographic && $scope.$filter("humanify")(row.demographic.ethnicity),
            sortable: false,
            hidden: true
        }, {
            name: 'Race',
            id: 'demographic.race',
            td: (row, $scope) => row.demographic && $scope.$filter("humanify")(row.demographic.race),
            sortable: false,
            hidden: true
        }, {
            name: 'Submitter ID',
            id: 'submitter_id',
            td: (row, $scope) => row.submitter_id,
            sortable: false,
            hidden: true
        }],
        fields: [
          "case_id",
          "annotations.annotation_id",
          "project.project_id",
          "project.name",
          "project.primary_site",
          "project.program.name",
          "project.disease_type",
          "submitter_id"
        ],
        expand: [
          "summary.data_categories",
          "clinical",
          "demographic",
          "diagnoses"
        ],
        facets: [
            {name: "case_id", title: "Case", collapsed: false, facetType: "free-text", placeholder: "Case Submitter ID or Uuid"},
            {name: "project.primary_site", title: "Primary Site", collapsed: false, facetType: "terms"},
            {name: "project.program.name", title: "Cancer Program", collapsed: false, facetType: "terms"},
            {name: "project.project_id", title: "Project", collapsed: false, facetType: "terms"},
            {name: "project.disease_type", title: "Disease Type", collapsed: false, facetType: "terms"},
            {name: "demographic.gender", title: "Gender", collapsed: true, facetType: "terms"},
            {name: "diagnoses.age_at_diagnosis", title: "Age at diagnosis", hasGraph: true, collapsed: false, facetType: "range", unitsMap: [
                            {
                              "label": "years",
                              "conversionDivisor": 365,
                            },
                            {
                              "label": "days",
                              "conversionDivisor": 1,
                            }
                            ]},
            {name: "diagnoses.vital_status", title: "Vital Status", collapsed: false, facetType: "terms"},
            {name: "diagnoses.days_to_death", title: "Days to Death", collapsed: true, facetType: "range", hasGraph: true},
            {name: "demographic.race", title: "Race", collapsed: true, facetType: "terms"},
            {name: "demographic.ethnicity", title: "Ethnicity", collapsed: true, facetType: "terms"}
        ]
    };
    angular.module("search.table.participants.model", [])
        .value("SearchTableParticipantsModel", searchParticipantsModel);
}
