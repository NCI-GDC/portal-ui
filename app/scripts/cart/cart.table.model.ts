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
        td: row => '<button data-tooltip-popup-delay=1000 data-tooltip="Download"' +
                    "class='btn btn-primary' download-button files='row' style='margin-right: 10%'>" +
                    "<i class='fa fa-download'></i></button>" +
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
          var caseIds = row.cases.map(c => c.case_id);
          function getParticipants(row, $filter) {
            return caseIds.length == 1 ?
                     '<a href="cases/' + caseIds[0] + '">1</a>' :
                     withFilter(caseIds.length, [{name: "files.file_id", value: row.file_id}], $filter);
          }
          return caseIds.length ? getParticipants(row, $scope.$filter) : '0';
        },
        tdClassName: 'truncated-cell text-right'
      }, {
        name: "Project",
        id: "cases.project.project_id",
        td: row => {
          debugger
          return _.unique(row.cases.map(c => c.project), 'project_id').map(p => {
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
          var annotationIds = (row.annotations || []).map(a => a.annotation_id);
          function getAnnotations(row, $scope) {
            return annotationIds.length == 1 ?
                     '<a href="annotations/' + annotationIds[0] + '">' + 1 + '</a>' :
                     withAnnotationFilter(
                       row.annotationIds.length,
                       [{name: "annotation_id", value: annotationIds}],
                       $scope.$filter);
          }

          return annotationIds.length ? getAnnotations(row, $scope) : '0';
        },
        tdClassName: 'truncated-cell text-right'
      }
    ]
  };
  angular.module("cart.table.model", [])
      .value("CartTableModel", CartTableModel);
}
