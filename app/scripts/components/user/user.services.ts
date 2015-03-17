module ngApp.components.user.services {
  import IUser = ngApp.components.user.models.IUser;
  import IFile = ngApp.files.models.IFile;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface IUserService {
    login(username: string): void;
    logout(): void;
    setUser(user: IUser): void;
    toggleFilter(): void;
    addMyProjectsFilter(filters: any, key: string): any;
    isUserProject(file: IFile): boolean;
    currentUser: IUser;
    userCanDownloadFiles(files: IFile[]): boolean;
  }

  class UserService implements IUserService {
    currentUser: IUser;

    /* @ngInject */
    constructor(private Restangular: restangular.IService, private $rootScope: ng.IRootScopeService,
                private LocationService: ILocationService, private $cookies: ng.cookies.ICookiesService,
                private $window: ng.IWindowService) {}

    login(): void {
      if (!this.$cookies["X-Auth-Token"]) {
        return;
      }

      this.Restangular.all("auth/login").post({}, {})
      .then((data) => {
        data.isFiltered = true;
        data.username = this.$cookies["X-Auth-Username"];
        this.setUser(data);
      });
    }

    getToken(): void {
      // TODO: We need to come up with a solution for exporting/downloading
      // that will work with IE9 when auth tokens are required.
      // TODO: Make this code reusable.
      if (this.$window.URL && this.$window.URL.createObjectURL) {
        this.Restangular.all("auth/token")
        .withHttpConfig({
          responseType: "blob"
        })
        .get("", {})
        .then((file) => {
          var url = this.$window.URL.createObjectURL(file);
          var a = this.$window.document.createElement("a");
          a.setAttribute("href", url);
          a.setAttribute("download", "gdc-user-token." + this.$window.moment().format() + ".txt");
          this.$window.document.body.appendChild(a);

          _.defer(() => {
            a.click();
            this.$window.document.body.removeChild(a);
          });
        });
      }
    }

    setUser(user: IUser): void {
      this.currentUser = user;
      this.$rootScope.$broadcast("gdc-user-reset");
    }

    logout(): void {
      // Angular's $cookies/$cookieStore services abstract away the ability to set
      // the expiration time. Manual manipulation seems to be required.
      // See: http://stackoverflow.com/questions/12624181/angularjs-how-to-set-expiration-date-for-cookie-in-angularjs
      this.$window.document.cookie = "X-Auth-Token= ;expires=" + new Date().toGMTString() +
                                     ";domain=.nci.nih.gov;path= /";
      this.$window.document.cookie = "X-Auth-Username= ;expires=" + new Date().toGMTString() +
                                     ";domain=.nci.nih.gov;path= /";
    }

    toggleFilter(): void {
      this.$rootScope.$broadcast("gdc-user-reset");
    }

    isUserProject(file: IFile): boolean {
      if (!this.currentUser) {
        return false;
      }
      
      var projectIds;

      // Support multiple use cases
      if (file.projects) {
        projectIds = file.projects;
      } else {
        projectIds = _.unique(_.map(file.participants, (participant) => {
          return participant.project.project_id;
        }));
      }

      return !!_.intersection(projectIds, this.currentUser.projects.gdc_ids).length;
    }

    setUserProjectsTerms(terms) {
      if (!this.currentUser || !this.currentUser.isFiltered) {
        return terms;
      }

      return _.filter(terms, (term) => {
        return this.isUserProject({
          participants: [
            {
              project: {
                project_id: term.key
              }
            }
          ]
        });
      });
    }

    userCanDownloadFiles(files: IFile[]) {
      return _.every(files, (file) => {
        if (file.access === "open") {
          return true;
        }

        if (file.access !== "open" && !this.currentUser) {
          return false;
        }

        if (this.isUserProject(file)) {
          return true;
        }
      });
    }

    addMyProjectsFilter(filters: any, key: string): any {
      if (this.currentUser && this.currentUser.isFiltered &&
          this.currentUser.projects.gdc_ids.length) {
        var userProjects = {
          content: {
            field: key,
            value: this.currentUser.projects.gdc_ids
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
            var projects = this.currentUser.projects.gdc_ids;

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
      .module("user.services", ["restangular", "location.services", "ngCookies"])
      .service("UserService", UserService);
}
