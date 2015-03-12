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
      return this.ds.get(id, params).then((response): IProject => {
        return response["data"];
      });
    }
  
    getTableHeading() {
      return 'Participant count per data type';
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
        filters: this.LocationService.filters(),
        sort:'summary.participant_count:desc'
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
    table: ITab;
    graph: ITab;
  }

  export interface IProjectsState {
    tabs: ITabs;
    setActive(section: string, s: string): void;
  }

  class State implements IProjectsState {
    tabs: ITabs = {
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
