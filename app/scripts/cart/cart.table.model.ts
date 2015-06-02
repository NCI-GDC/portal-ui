module ngApp.cart.models {
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
  
  var CartTableModel = {
    title: 'Cart',
    rowId: 'file_id',
    headings: [
      {
        name: "Action",
        id: "file_actions",
        td: row =>"<button class='btn btn-primary' download-button files='row' style='margin-right: 10%'>" +
                    "<i class='fa fa-download'></i></button>" +
                    "<button class='btn btn-default' remove-single-cart file='row'>" +
                    "<i class='fa fa-trash-o'></i></button>",
        tdClassName: "table-compile-cell text-center"
      },{
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
        td: row => '<i class="fa fa-'+ (row.access === 'protected' ? 'lock' : 'unlock-alt') +'"></i> ' + row.access,
        sortable: true
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
            return row.participantIds.length == 1 ?
                     '<a href="participants/' + row.participantIds[0] + '">' + row.participantIds[0] + '</a>' :
                     withFilter(row.participantIds.length, [{name: "files.file_id", value: row.file_id}], $filter);
          }

          return row.participantIds.length ? getParticipants(row, $scope.$filter) : 0;
        },
        tdClassName: 'truncated-cell text-right'
      }, {
        name: "Project",
        id: "participants.project.project_id",
        td: row => {
          return _.map(row.projects, p => {
            return ('<a href="projects/' + p.id +
                    '" data-tooltip="' + p.name +
                    '" data-tooltip-append-to-body="true" data-tooltip-placement="right">'+ p.id + '</a>');
          }).join('<br>');
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
            console.log('here?');
            return row.annotationIds.length == 1 ?
                     '<a href="annotations/' + row.annotationIds[0] + '">' + row.annotationIds[0] + '</a>' :
                     withAnnotationFilter(
                       row.annotationIds.length,
                       [{name: "annotation_id", value: row.annotationIds}],
                       $scope.$filter);
          }

          return row.annotationIds.length ? getAnnotations(row, $scope) : 0;
        },
        tdClassName: 'truncated-cell text-right'
      }
    ]
  };
  angular.module("cart.table.model", [])
      .value("CartTableModel", CartTableModel);
}
