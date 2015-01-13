module ngApp.components.user.services {
  import IGDCConfig = ngApp.IGDCConfig;
  import IUser = ngApp.components.user.models.IUser;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IUserService {
    login(username: string): void;
    logout(): void;
    toggleFilter(): void;
    addMyProjectsFilter(filters: any, key: string): void;
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

    addMyProjectsFilter(filters: any, key: string): void {
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
            var sharedValues = _.intersection(projectFilter.content.value, this.currentUser.projects);

            // If any of the projects selected belong to the user, stick with those rather then defaulting
            // to all of the users projects.
            if (sharedValues.length) {
              projectFilter.content.value = sharedValues;
            } else {
              // User is trying to search on only projects that aren't in their list.
              projectFilter.content.value = [""];
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
