module ngApp.mutations.controllers {

  import ICoreService = ngApp.core.services.ICoreService;

  class MutationController {

    /* @ngInject */
    constructor(
      private mutation: any,
      private allCasesAgg: any,
      private $scope: ng.IScope,
      private CoreService: ICoreService,
    ) {
      CoreService.setPageTitle("Mutation", mutation.ssm_id);
      $scope.mutation = mutation;
      this.renderReact();
    }

    renderReact () {
      ReactDOM.render(
        React.createElement(ReactComponents.SideNavLayout, {
            links: [
              { id: 'summary', title: 'Summary', icon: 'table' },
              { icon: 'pencil', id: 'consequences', title: 'Consequences' },
              { icon: 'bar-chart-o', id: 'cancer-distribution', title: 'Cancer Distribution' },
            ]
          },
          React.createElement(ReactComponents.Mutation, { mutation: this.mutation, allCasesAgg: this.allCasesAgg }),
        ),
        document.getElementById('react-root')
      );
    };

  }

  angular
      .module("mutations.controller", [])
      .controller("MutationController", MutationController);
}
