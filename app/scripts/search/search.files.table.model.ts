module ngApp.search.models {
  function withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    const filterString = $filter("makeFilter")(filters, true);
    const href = 'annotations?filters=' + filterString;
    const val = '{{' + value + '|number:0}}';
    return "<a href='" + href + "'>" + val + '</a>';
  }

  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    const filterString = $filter("makeFilter")(filters, true);
    const href = 'search/p?filters=' + filterString;
    const val = '{{' + value + '|number:0}}';
    return "<a href='" + href + "'>" + val + '</a>';
  }

  var searchTableFilesModel = {
    title: 'Files',
    rowId: 'file_id',
    headings: [
      {
        th: '<div add-to-cart-all files="data" paging="paging"></div>',
        name: 'Add to Cart',
        id: "file_actions",
        td: row => '<span add-to-cart-single file="row" style="margin-right:5px"></span>' +
                    '<a class="btn btn-primary" download-button files="row">' +
                    '<i class="fa fa-download"></i></a>'
      }, {
        name: "My Projects",
        id: "my_projects",
        td: (row, $scope) => {
            const isUserProject = $scope.UserService.isUserProject(row);
            const icon = isUserProject ? 'check-square-o' : 'square-o';
            return '<i class="fa fa-' + icon + '"></i>';
        },
        inactive: $scope => !$scope.UserService.currentUser,
        hidden: false
      }, {
        name: "Access",
        id: "access",
        td: row => '<i class="fa fa-lg fa-'+ (row.access === 'protected' ? 'lock' : 'unlock-alt') +'"></i>',
        sortable: true,
        tdClassName: "text-center"
      }, {
        name: "File Name",
        id: "file_name",
        td: row => '<a href="files/' + row.file_id + '">' + row.file_name + '</a>',
        sortable: true,
        tdClassName: 'truncated-cell'
      }, {
        name: "Cases",
        id: "participants",
        td: (row, $scope) => {
          function getParticipants(row, $filter) {
            return row.participants.length == 1 ?
                     '<a href="participants/' + row.participants[0].participant_id + '">' + row.participants[0].participant_id + '</a>' :
                     withFilter(row.participants.length, [{name: "files.file_id", value: row.file_id}], $filter);
          }

          return row.participants && row.participants.length ? getParticipants(row, $scope.$filter) : 0;
        },
        tdClassName: 'truncated-cell text-right'
      }, {
        name: "Project",
        id: "participants.project.project_id",
        td: row => {
          return _.unique(_.map(row.participants, p => {
            return '<a href="projects/' + p.project.project_id +
                    '" data-tooltip="' + p.project.name +
                    '" data-tooltip-append-to-body="true" data-tooltip-placement="right">'+ p.project.project_id + '</a>';
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
        id: "annotations",
        td: (row, $scope) => {
          function getAnnotations(row, $scope) {
            return row.annotations.length == 1 ?
                     '<a href="annotations/' + row.annotations[0].annotation_id + '">' + row.annotations[0].annotation_id + '</a>' :
                     withAnnotationFilter(
                       row.annotations.length,
                       [{name: "annotation_id", value: _.pluck(row.annotations, 'annotation_id')}],
                       $scope.$filter);
          }

          return row.annotations && row.annotations.length ? getAnnotations(row, $scope) : 0;
        },
        tdClassName: 'truncated-cell text-right'
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
      "archive.archive_id"
    ],
    expand: [
      "participants",
      "participants.project",
      "participants.clinical"
    ]
  };
  angular.module("search.table.files.model", [])
      .value("SearchTableFilesModel", searchTableFilesModel);
}
