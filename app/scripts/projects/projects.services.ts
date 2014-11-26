module ngApp.projects.services {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IProjectsService {
    getProject(id: string): ng.IPromise<IProject>;
    getProjects(params?: Object): ng.IPromise<IProjects>;
  }

  class ProjectsService implements IProjectsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService) {
      this.ds = Restangular.all("projects");
    }

    getProject(id: string, params: Object = {}): ng.IPromise<IProject> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }
      return this.ds.get(id, params).then((response): IProject => {
        return response["data"];
      });
    }

    getProjects(params: Object = {}): ng.IPromise<IProjects> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }
      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }
      var defaults = {
        size: 10,
        from: 1,
        filters: this.LocationService.filters()
      };

      return this.ds.get("", angular.extend(defaults, params)).then((response): IProjects => {
        return response["data"];
      });
    }
  }

  angular
      .module("projects.services", [
        "restangular",
        "components.location"
      ])
      .service("ProjectsService", ProjectsService);
}
