module ngApp.components.tables.pagination.directives {

  /* @ngInject */
  function PaginationControls(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        page: "@",
        paging: "=",
        update: "="
      },
      templateUrl: "components/tables/templates/pagination.html",
      controller: "PagingController as pc"
    };
  }

  /* @ngInject */
  function PaginationHeading(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        page: "@",
        paging: "=",
        update: "=",
        title: "@"
      },
      templateUrl: "components/tables/templates/pagination-heading.html",
      controller: "PagingController as pc"
    };
  }

  angular.module("pagination.directives", ["pagination.controllers"])
      .directive("paginationControls", PaginationControls)
      .directive("paginationHeading", PaginationHeading);

}

