module ngApp.components.user.services {
  import IGDCConfig = ngApp.IGDCConfig;
  import IUser = ngApp.components.user.models.IUser;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IUserService {
    login(username: string): void;
    logout(): void;
    toggleFilter(): void;
    addMyProjectsFilter(filters: any, key: string);
    currentUser: IUser;
  }

  class UserService implements IUserService {
    currentUser: IUser;

    /* @ngInject */
    constructor(private Restangular: restangular.IService, private $rootScope: ng.IRootScopeService,
                private LocationService: ILocationService) {}

    login(username: string): void {
      this.Restangular.all("auth/login").post({
        username: username
      }).then((data) => {
        this.currentUser = data;
        this.currentUser.isFiltered = true;
        this.$rootScope.$broadcast("gdc-user-reset");
      });
    }

    logout(): void {
      this.Restangular.all("auth/logout").post({
        user: this.currentUser
      }).then(() => {
        this.currentUser = null;
        this.$rootScope.$broadcast("gdc-user-reset");
      });
    }

    toggleFilter(): void {
      this.$rootScope.$broadcast("gdc-user-reset");
    }

    addMyProjectsFilter(filters: any, key: string) {
      if (this.currentUser && this.currentUser.isFiltered &&
          this.currentUser.projects.length) {
        var userProjects = {
          content: {
            field: key,
            value: this.currentUser.projects
          },
          op: "is"
        };

        if (!filters.content) {
          filters.content = [userProjects];
          filters.op = "and";
        } else {
          var projectFilter = _.find(filters.content, (filter: any) => {
            if (filter.content.field === key) {
              return filter;
            }

            return null;
          });

          if (!projectFilter) {
            filters.content.push(userProjects);
          } else {
            // If there are projects selected already, check if any aren't in users list
            // If there are, default to entire user list. If there aren't, stick with selection.
            var diff = _.difference(projectFilter.content.value, this.currentUser.projects);
            if (diff.length) {
              projectFilter.content.value = this.currentUser.projects;
              this.LocationService.setFilters(filters);
            }
          }
        }
      }

      return filters;
    }
  }

  angular
      .module("user.services", ["restangular", "location.services"])
      .service("UserService", UserService);
}
