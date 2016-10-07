module ngApp.genes.controllers {

  class GeneController {

    /* @ngInject */
    constructor(private gene: any, private $scope: ng.IScope) {
      $scope.gene = gene;
      this.renderReact();
    }

    renderReact () {
      ReactDOM.render(
        React.createElement(Gene, { gene: this.gene }),
        document.getElementById('react-root')
      );
    };

  }

  angular
      .module("genes.controller", [])
      .controller("GeneController", GeneController);
}
