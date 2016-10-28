module ngApp.mutations.controllers {

  import ICoreService = ngApp.core.services.ICoreService;

  class MutationController {

    /* @ngInject */
    constructor(
      private mutation: any,
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
            ]
          },
          React.createElement(ReactComponents.Mutation, { mutation: this.mutation}),
        ),
        document.getElementById('react-root')
      );
    };

  }

  angular
      .module("mutations.controller", [])
      .controller("MutationController", MutationController);
}
