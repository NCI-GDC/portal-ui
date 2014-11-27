module ngApp.projects.services {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IProjectsService {
    getProject(id: string, params?: Object): ng.IPromise<IProject>;
    getProjects(params?: Object): ng.IPromise<IProjects>;
  }

  class ProjectsService implements IProjectsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService) {
      this.ds = Restangular.all("projects");
    }

    crunch_summary(hit: any): any {
      if (hit.hasOwnProperty("_summary")) {
        if (hit["_summary"].hasOwnProperty("_analyzed_data")) {
          var analyzed_data = {};
          _.forEach(hit["_summary"]["_analyzed_data"], function(item) {
            analyzed_data[item["data_type"]] = {
              file_count: item["_file_count"],
              participant_count: item["_participant_count"]
            };
          });
          hit["_summary"]["_analyzed_data"] = analyzed_data;
        }

        if (hit["_summary"].hasOwnProperty("_experimental_data")) {
          var experimental_data = {};
          _.forEach(hit["_summary"]["_experimental_data"], function(item) {
            experimental_data[item["experimental_type"]] = {
              file_count: item["_file_count"],
              participant_count: item["_participant_count"]
            };
          });
          hit["_summary"]["_experimental_data"] = experimental_data;
        }
      }
      return hit;
    }

    getProject(id: string, params: Object = {}): ng.IPromise<IProject> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }
      return this.ds.get(id, params).then((response): IProject => {
        return this.crunch_summary(response["data"]);
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
        var outer_class = this;
        _.forEach(response["data"]["hits"], function(hit) {
          hit = outer_class.crunch_summary(hit);
        });
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
