module ngApp.search.models {
  function withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = 'annotations?filters=' + filterString;
    var val = '{{' + value + '|number:0}}';
    return "<a href='" + href + "'>" + val + '</a>';
  }

  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = 'search/p?filters=' + filterString;
    var val = '{{' + value + '|number:0}}';
    return "<a href='" + href + "'>" + val + '</a>';
  }

  var searchTableFilesModel = {
    title: 'Files',
    rowId: 'file_id',
    headings: [
      {
        th: '<div add-to-cart-all files="data" data-size="{{paging.total}}"></div>',
        name: 'Add to Cart',
        id: "file_actions",
        td: row => '<span add-to-cart-single file="row" style="margin-right:5px"></span>' +
                    '<a  data-tooltip="Download" data-tooltip-popup-delay=1000 class="btn btn-primary" download-button files="row">' +
                    '<i class="fa fa-download"></i></a>'
      }, {
        name: "File UUID",
        id: "file_id",
        td: row => '<a href="files/' + row.file_id + '">' + row.file_id + '</a>',
        sortable: true,
        hidden: true,
        tdClassName: 'truncated-cell'
      }, {
        name: "My Projects",
        id: "my_projects",
        td: (row, $scope) => {
            var isUserProject = $scope.UserService.isUserProject(row);
            var icon = isUserProject ? 'check' : 'remove';
            return '<i class="fa fa-' + icon + '"></i>';
        },
        inactive: $scope => !$scope.UserService.currentUser || $scope.UserService.currentUser.isFiltered,
        hidden: false,
        tdClassName: "text-center"
      }, {
        name: "Access",
        id: "access",
        td: (row, $scope) => {
          var val = $scope.$filter("humanify")(row.access);
          return '<i class="fa fa-'+ (row.access === 'controlled' ? 'lock' : 'unlock-alt') +'"></i> ' + val;
        }, 
        tdClassName: "text-center",
        sortable: true
      }, {
        name: "File Name",
        id: "file_name",
        td: row => '<a href="files/' + row.file_id + '">' + row.file_name + '</a>',
        sortable: true,
        tdClassName: 'truncated-cell'
      }, {
        name: "Case UUIDs",
        id: "cases",
        td: (row, $scope) => {
          function getParticipants(row, $filter) {
            return row.cases.length == 1 ?
                     '<a href="cases/' + row.cases[0].case_id + '">' + row.cases[0].case_id + '</a>' :
                     withFilter(row.cases.length, [{name: "files.file_id", value: row.file_id}], $filter);
          }

          return row.cases && row.cases.length ? getParticipants(row, $scope.$filter) : 0;
        },
        tdClassName: 'truncated-cell'
      }, {
        name: "Project",
        id: "cases.project.project_id",
        td: row => {
          return _.unique(_.map(row.cases, p => {
            return '<a href="projects/' + p.project.project_id +
                    '" data-tooltip="' + p.project.name +
                    '" data-tooltip-popup-delay=1000' +
                    '" data-tooltip-append-to-body="true">'+ p.project.project_id + '</a>';
          })).join('<br>');
        },
        sortable: true
      }, {
        name: "Data Type",
        id: "data_type",
        td: row => row.data_type,
        sortable: true
      }, {
        name: "Data Format",
        id: "data_format",
        td: row => row.data_format,
        sortable: true
      }, {
        name: "Size",
        id: "file_size",
        td: (row, $scope) => $scope.$filter("size")(row.file_size),
        sortable: true,
        tdClassName: 'text-right'
      }, {
        name: "Annotations",
        id: "annotations.annotation_id",
        td: (row, $scope) => {
          function getAnnotations(row, $scope) {
            return row.annotations.length == 1 ?
                     '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' :
                     withAnnotationFilter(
                       row.annotations.length,
                       [{name: "annotation_id", value: _.pluck(row.annotations, 'annotation_id')}],
                       $scope.$filter);
          }

          return row.annotations && row.annotations.length ? getAnnotations(row, $scope) : 0;
        },
        tdClassName: 'truncated-cell text-right'
      }, {
        name: "Data Subtype",
        id: "data_subtype",
        td: (row, $scope) => row.data_subtype && $scope.$filter("humanify")(row.data_subtype),
        sortable: false,
        hidden: true
      }, {
        name: "Experimental Strategy",
        id: "experimental_strategy",
        td: (row, $scope) => row.experimental_strategy && $scope.$filter("humanify")(row.experimental_strategy),
        sortable: false,
        hidden: true
      }, {
        name: "Platform",
        id: "platform",
        td: (row, $scope) => row.platform && $scope.$filter("humanify")(row.platform),
        sortable: false,
        hidden: true
      }, {
        name: "Data Submitter",
        id: "center.name",
        td: (row, $scope) => row.center && $scope.$filter("humanify")(row.center.name),
        sortable: false,
        hidden: true
      }, {
        name: "Tags",
        id: "tags",
        td: row => (row.tags && row.tags.join(", ")) || "--",
        sortable: false,
        hidden: true
      }],
    fields: [
      "access",
      "state",
      "file_name",
      "data_type",
      "data_subtype",
      "data_format",
      "file_size",
      "file_id",
      "platform",
      "annotations.annotation_id",
      "related_files.file_id",
      "archive.archive_id",
      "experimental_strategy",
      "center.name",
      "tags"
    ],
    expand: [
      "cases",
      "cases.project",
      "cases.clinical"
    ]
  };
  angular.module("search.table.files.model", [])
      .value("SearchTableFilesModel", searchTableFilesModel);
}
