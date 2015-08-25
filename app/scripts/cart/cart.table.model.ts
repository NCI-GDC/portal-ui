module ngApp.cart.models {
   function withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = 'annotations?filters=' + filterString;
    var val = '{{' + value + '|number:0}}';
    return "<a href='" + href + "'>" + val + '</a>';
  }

  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = 'search/c?filters=' + filterString;
    var val = '{{' + value + '|number:0}}';
    return "<a href='" + href + "'>" + val + '</a>';
  }

  var CartTableModel = {
    title: 'Cart',
    rowId: 'file_id',
    headings: [
      {
        name: "Action",
        id: "file_actions",
        td: row => '<download-button data-tooltip="Download" data-tooltip-popup-delay=1000 files="row" style="margin-right: 10%"></download-button>' +
                    "<button class='btn btn-default' remove-single-cart file='row'>" +
                    "<i class='fa fa-trash-o'></i></button>",
        tdClassName: "text-center"
      },{
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
        name: "Cases",
        id: "cases",
        td: (row, $scope) => {
          function getParticipants(row, $filter) {
            return row.caseIds.length == 1 ?
                     '<a href="cases/' + row.caseIds[0] + '">1</a>' :
                     withFilter(row.caseIds.length, [{field: "files.file_id", value: row.file_id}], $filter);
          }

          return row.caseIds.length ? getParticipants(row, $scope.$filter) : 0;
        },
        tdClassName: 'truncated-cell text-right'
      }, {
        name: "Project",
        id: "cases.project.project_id",
        td: row => {
          return _.map(row.projects, p => {
            return ('<a href="projects/' + p.project_id +
                    '" data-tooltip="' + p.name +
                    '" data-tooltip-append-to-body="true" data-tooltip-placement="right">'+ p.project_id + '</a>');
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
            return row.annotationIds.length == 1 ?
                     '<a href="annotations/' + row.annotationIds[0] + '">' + 1 + '</a>' :
                     withAnnotationFilter(
                       row.annotationIds.length,
                       [{field: "annotation_id", value: row.annotationIds}],
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
