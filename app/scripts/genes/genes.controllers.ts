module ngApp.genes.controllers {

  import ICoreService = ngApp.core.services.ICoreService;

  class GeneController {

    /* @ngInject */
    constructor(
      private gene: any,
      private $scope: ng.IScope,
      private CoreService: ICoreService,
    ) {
      CoreService.setPageTitle("Gene", gene.gene_id);
      $scope.gene = gene;
      this.renderReact();
    }

    renderReact () {
      ReactDOM.render(
        React.createElement(ReactComponents.SideNavLayout, {
            links: [
              { icon: 'table', id: 'summary', title: 'Summary' },
              { icon: 'bar-chart-o', id: 'cancer-distribution', title: 'Cancer Distribution' },
            ]
          },
          React.createElement(ReactComponents.Gene, { gene: this.gene })
        ),
        document.getElementById('react-root')
      );
    };

  }

  angular
      .module("genes.controller", [])
      .controller("GeneController", GeneController);
}
