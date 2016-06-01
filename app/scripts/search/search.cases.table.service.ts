module ngApp.search.cases.table.service {

    class SearchCasesTableService {

      /* @ngInject */
      constructor(private DATA_CATEGORIES) {}

      withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
          var filterString = $filter("makeFilter")(filters, true);
          var href = 'annotations?filters=' + filterString;
          var val = '{{' + value + '|number:0}}';
          return "<a href='" + href + "'>" + val + '</a>';
      }

      withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
          var filterString = $filter("makeFilter")(filters, true);
          var href = 'search/f?filters=' + filterString;
          var val = '{{' + value + '|number:0}}';
          return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
      }

      getDataCategory(dataCategories: Object[], dataCategory: string): number {
          var data = _.find(dataCategories, {data_category: dataCategory});
          return data ? data.file_count : 0;
      }

      dataCategoryWithFilters(dataCategory: string, row: Object[], $filter: ng.IFilterService) {
          var fs = [
            {field: 'cases.case_id', value: row.case_id},
            {field: 'files.data_category', value: dataCategory}
          ];
          return this.withFilter(this.getDataCategory(row.summary ? row.summary.data_categories : [], dataCategory), fs, $filter);
      }

      youngestDiagnosis(p: { age_at_diagnosis: number }, c: { age_at_diagnosis: number }): { age_at_diagnosis: number } {
        return c.age_at_diagnosis < p.age_at_diagnosis ? c : p
      }

      model() {
        return {
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
              toolTipText: row => row.case_id,
              td: row => '<a href="cases/'+ row.case_id + '">' + row.case_id + '</a>',
              tdClassName: 'id-cell'
          }, {
              name: "Project",
              id: "project.project_id",
              toolTipText: row => row.project.name,
              td: row => '<a href="projects/'+row.project.project_id + '">' + row.project.project_id + '</a>',
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
                  return this.withFilter(sum, fs, $scope.$filter);
              },
              thClassName: 'text-right',
              tdClassName: 'text-right'
          }, {
              name: "Available Files per Data Category",
              id: "summary.data_categories",
              thClassName:'text-center',
              children: Object.keys(this.DATA_CATEGORIES).map(key => ({
                name: this.DATA_CATEGORIES[key].abbr,
                th: '<abbr data-uib-tooltip="' + this.DATA_CATEGORIES[key].full + '">'
                  + this.DATA_CATEGORIES[key].abbr + '</abbr>',
                id: this.DATA_CATEGORIES[key].abbr,
                td: (row, $scope) => this.dataCategoryWithFilters(this.DATA_CATEGORIES[key].full, row, $scope.$filter),
                thClassName: 'text-right',
                tdClassName: 'text-right'
              }))
          }, {
            name: "Annotations",
            id: "annotations.annotation_id",
            td: (row, $scope) => {
              var getAnnotations = (row, $filter) => {
                return row.annotations.length === 1
                  ? '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>'
                  : this.withAnnotationFilter(
                      row.annotations.length,
                      [{field: "annotation_id", value: _.pluck(row.annotations, 'annotation_id')}],
                      $filter
                    );
              }

              return (row.annotations || []).length && getAnnotations(row, $scope.$filter);
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
              td: (row, $scope) => {
                // Use diagnosis with minimum age
                const age = (row.diagnoses || []).reduce((p, c) => c.age_at_diagnosis < p ? c.age_at_diagnosis : p, Infinity);
                return age !== Infinity && row.diagnoses ? $scope.$filter("ageDisplay")(age) : "--";
              },
              sortable: false,
              hidden: true
          }, {
              name: 'Days to death',
              id: 'diagnoses.days_to_death',
              td: (row, $scope) => {
                const primaryDiagnosis = (row.diagnoses || [])
                  .reduce(this.youngestDiagnosis, { age_at_diagnosis: Infinity });
                return (row.diagnoses && $scope.$filter("number")(primaryDiagnosis.days_to_death, 0)) || "--"
              },
              sortable: false,
              hidden: true
          }, {
              name: 'Vital Status',
              id: 'diagnoses.vital_status',
              td: (row, $scope) => {
                const primaryDiagnosis = (row.diagnoses || [])
                  .reduce(this.youngestDiagnosis, { age_at_diagnosis: Infinity });
                return $scope.$filter("humanify")(primaryDiagnosis.vital_status);
              },
              sortable: false,
              hidden: true
          }, {
              name: 'Primary Diagnosis',
              id: 'diagnoses.primary_diagnosis',
              td: (row, $scope) => {
                console.log(this.DATA_CATEGORIES)
                const primaryDiagnosis = (row.diagnoses || [])
                  .reduce(this.youngestDiagnosis, { age_at_diagnosis: Infinity });
                return (row.diagnoses && primaryDiagnosis.primary_diagnosis) || "--";
              },
              sortable: false,
              hidden: true
          }, {
              name: 'Ethnicity',
              id: 'demographic.ethnicity',
              td: (row, $scope) => row.demographic && $scope.$filter("humanify")(row.demographic.ethnicity) || '--',
              sortable: false,
              hidden: true
          }, {
              name: 'Race',
              id: 'demographic.race',
              td: (row, $scope) => row.demographic && $scope.$filter("humanify")(row.demographic.race) || '--',
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
            "submitter_id",
            "demographic.gender",
            "demographic.race",
            "demographic.ethnicity",
            "diagnoses.primary_diagnosis",
            "diagnoses.vital_status",
            "diagnoses.days_to_death",
            "diagnoses.age_at_diagnosis"
          ],
          expand: [
            "summary.data_categories",
          ],
          facets: [
            {name: "case_id", title: "Case", collapsed: false, facetType: "free-text", placeholder: "UUID, Submitter ID"},
            {name: "project.primary_site", title: "Primary Site", collapsed: false, facetType: "terms"},
            {name: "project.program.name", title: "Cancer Program", collapsed: false, facetType: "terms"},
            {name: "project.project_id", title: "Project", collapsed: false, facetType: "terms"},
            {name: "project.disease_type", title: "Disease Type", collapsed: false, facetType: "terms"},
            {name: "demographic.gender", title: "Gender", collapsed: false, facetType: "terms"},
            {name: "diagnoses.age_at_diagnosis", title: "Age at diagnosis", collapsed: false, facetType: "range", convertDays: true},
            {name: "diagnoses.vital_status", title: "Vital Status", collapsed: false, facetType: "terms"},
            {name: "diagnoses.days_to_death", title: "Days to Death", collapsed: false, facetType: "range", hasGraph: true},
            {name: "demographic.race", title: "Race", collapsed: false, facetType: "terms"},
            {name: "demographic.ethnicity", title: "Ethnicity", collapsed: false, facetType: "terms"}
          ]
        };
      }
    }
    angular.module("search.cases.table.service", ["ngApp.core"])
        .service("SearchCasesTableService", SearchCasesTableService);
}
