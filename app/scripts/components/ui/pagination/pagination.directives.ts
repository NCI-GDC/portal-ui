module ngApp.components.ui.pagination.directives {

  /* @ngInject */
  function PaginationControls(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        page: "@",
        paging: "=",
        update: "="
      },
      templateUrl: "components/ui/pagination/templates/pagination.html",
      controller: "PagingController as pc"
    };
  }

  angular.module("pagination.directives", ["pagination.controllers"])
      .directive("paginationControls", PaginationControls);
}

