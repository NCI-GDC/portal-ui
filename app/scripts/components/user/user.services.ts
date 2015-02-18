module ngApp.components.user.services {
  import IUser = ngApp.components.user.models.IUser;
  import IFile = ngApp.files.models.IFile;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IUserService {
    login(username: string): void;
    logout(): void;
    setUser(user: IUser): void;
    toggleFilter(): void;
    addMyProjectsFilter(filters: any, key: string): any;
    isUserProject(file: IFile): boolean;
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
        data.isFiltered = true;
        this.setUser(data);
      });
    }

    setUser(user: IUser): void {
      user.projects = _.map(user.projects, (project: string) => {
        return project.toLowerCase();
      });
      this.currentUser = user;
      this.$rootScope.$broadcast("gdc-user-reset");
    }

    logout(): void {
      this.Restangular.all("auth/logout").post({
        user: this.currentUser
      }).then(() => {
        this.setUser(null);
      });
    }

    toggleFilter(): void {
      this.$rootScope.$broadcast("gdc-user-reset");
    }

    isUserProject(file: IFile): boolean {
      return this.currentUser.projects.indexOf(file.archive.disease_code) !== -1;
    }

    addMyProjectsFilter(filters: any, key: string): any {
      if (this.currentUser && this.currentUser.isFiltered &&
          this.currentUser.projects.length) {
        var userProjects = {
          content: {
            field: key,
            value: this.currentUser.projects
          },
          op: "in"
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
            var projects = key === "project_code" ? _.assign([], this.currentUser.projects) :
                           _.map(this.currentUser.projects, (project: string) => { return project.toUpperCase(); });

            var sharedValues = _.intersection(projectFilter.content.value, projects);

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
