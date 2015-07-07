module ngApp.projects.services {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import ICoreService = ngApp.core.services.ICoreService;
  import IRootScope = ngApp.IRootScope;

  export interface IProjectsService {
    getProject(id: string, params?: Object): ng.IPromise<IProject>;
    getProjects(params?: Object): ng.IPromise<IProjects>;
  }

  class ProjectsService implements IProjectsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService,
                private UserService: IUserService, private CoreService: ICoreService,
                private $rootScope: IRootScope, private $q: ng.IQService) {
      this.ds = Restangular.all("projects");
    }

    getProject(id: string, params: Object = {}): ng.IPromise<IProject> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }
      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      return this.ds.get(id, params).then((response): IProject => {
        return response["data"];
      });
    }

    getTableHeading() {
      return "Case count per data type";
    }

    getProjects(params: Object = {}): ng.IPromise<IProjects> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }
      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }
      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }

      var paging = angular.fromJson(this.LocationService.pagination()["projects"]);

      // Testing is expecting these values in URL, so this is needed.
      paging = paging || {
        size: 20,
        from: 1
      };

      var defaults = {
        size: paging.size || 20,
        from: paging.from || 1,
        sort: paging.sort || "summary.case_count:desc",
        filters: this.LocationService.filters()
      };

      defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "project_id");
      this.CoreService.setSearchModelState(false);

      var abort = this.$q.defer();
      var prom: ng.IPromise<IProjects> = this.ds.withHttpConfig({
        timeout: abort.promise
      })
      .get("", angular.extend(defaults, params)).then((response): IFiles => {
        this.CoreService.setSearchModelState(true);
        return response["data"];
      });

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        abort.resolve();
        eventCancel();
        this.CoreService.setSearchModelState(true);
      });

      return prom;
    }
  }

  export interface ITab {
    active: boolean;
  }

  export interface ITabs {
    summary: ITab;
    table: ITab;
    graph: ITab;
  }

  export interface IProjectsState {
    tabs: ITabs;
    setActive(section: string, s: string): void;
  }

  class State implements IProjectsState {
    tabs: ITabs = {
      summary: {
        active: false
      },
      table: {
        active: false
      },
      graph: {
        active: false
      }
    };

    setActive(section: string, tab: string) {
      if (section && tab) {
        _.each(this[section], function (section: ITab) {
          section.active = false;
        });

        this[section][tab].active = true;
      }
    }
  }

  angular
      .module("projects.services", [
        "restangular",
        "components.location",
        "user.services"
      ])
      .service("ProjectsState", State)
      .service("ProjectsService", ProjectsService);
}
