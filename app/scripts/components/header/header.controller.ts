module ngApp.components.header.controllers {
  export interface IHeaderController {
    isCollapsed: boolean;
    toggleCollapsed(): void;
    collapse(): void;
  }

  class HeaderController implements IHeaderController {
    isCollapsed: boolean = true;

    collapse() : void {
      this.isCollapsed = true;
    }

    toggleCollapsed() : void {
      this.isCollapsed = !this.isCollapsed;
    }

  }

  angular
      .module("header.controller", [])
      .controller("HeaderController", HeaderController);
}
