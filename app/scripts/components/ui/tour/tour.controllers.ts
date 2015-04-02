module ngApp.components.ui.tour.controllers {

  interface IGDCTourScope extends ng.IScope {
    config: any;
  }

  export interface IGDCTourController {
    currentStep: number;
    currentStepItem: any;
    nextstep(): void;
    previousStep(): void;
  }

  class GDCTourController implements IGDCTourController {

    /* @ngInject */
    constructor(private $scope: IGDCTourScope) {
      this.currentStep = $scope.config.start || 0;
      this.tourSteps = $scope.config.steps;
      this.currentStepItem = this.tourSteps[this.currentStep];
    }

    nextStep() {
      this.currentStep++;
    }

    previousStep() {
      this.currentStep--;
    }

  }

  angular.module("tour.controllers", [])
      .controller("GDCTourController", GDCTourController);
}
