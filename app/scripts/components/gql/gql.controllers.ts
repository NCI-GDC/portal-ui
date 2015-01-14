module ngApp.components.gql.controllers {

  interface IGqlController {}

  class GqlController implements IGqlController {
    /* @ngInject */
    constructor() {}

    test = "test";

    onChange($event) {
      console.log($event);
    }
  }

  angular.module("gql.controllers", [])
      .controller("GqlController", GqlController);
}
