module ngApp.components.user.services {
  import IUser = ngApp.components.user.models.IUser;
  import IFile = ngApp.files.models.IFile;
  import ILocationService = ngApp.components.location.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;
  import INotifyService = ng.cgNotify.INotifyService;

  export interface IUserService {
    login(): void;
    setUser(user: IUser): void;
    toggleFilter(): void;
    addMyProjectsFilter(filters: any, key: string): any;
    isUserProject(file: IFile): boolean;
    currentUser: IUser;
    userCanDownloadFiles(files: IFile[]): boolean;
    getToken(): void;
    hasProjects(): boolean;
  }

  class UserService implements IUserService {
    currentUser: IUser;

    /* @ngInject */
    constructor(private AuthRestangular: restangular.IService,
                private $rootScope: ng.IRootScopeService,
                private LocationService: ILocationService,
                private $cookies: ng.cookies.ICookiesService,
                private $window: ng.IWindowService,
                private $uibModal: any,
                private notify: INotifyService,
                private config: IGDCConfig,
                private $log: ng.ILogService) {
      if (config.fake_auth) {
        this.setUser({
          username: "DEV_USER",
          projects: {
            phs_ids: {
              phs000178: ["_member_", "read", "delete"]
            },
            gdc_ids: {
              "TCGA-LAML": ["read", "delete", "read_report", "_member_"],
              "CGCI-BLGSP": ["read_report"],
              "TCGA-DEV1": ["read", "delete", "_member_"]
            }
          }
        });
      }
    }

    login(): void {
      this.AuthRestangular.all("user")
      .withHttpConfig({
        withCredentials: true
      })
      .post({}, {})
      .then((data) => {
          data.isFiltered = true;
          this.setUser(data);
      }, (response) => {
        if(response.status === 401) {
          if (this.currentUser) {
            this.currentUser = undefined;
            this.notify({
              message: "",
              messageTemplate: "<span data-translate>Session expired or unauthorized.</span>",
              container: "#notification",
              classes: "alert-warning"
            });
          }
        } else {
          this.$log.error("Error logging in, response status " + response.status);
        }
      });
    }

    getToken(): void {
      // TODO: We need to come up with a solution for exporting/downloading
      // that will work with IE9 when auth tokens are required.
      // TODO: Make this code reusable.
      if (this.$window.URL && this.$window.URL.createObjectURL) {
        this.AuthRestangular.all("token")
        .withHttpConfig({
          responseType: "blob",
          withCredentials: true
        })
        .get("", {})
        .then((file) => {
          // This endpoint receives the header 'content-disposition' which our Restangular
          // setup alters the data.
          this.$window.saveAs(file.data, "gdc-user-token." + this.$window.moment().format() + ".txt");
        }, (response) => {
          if(response.status === 401) {
            this.login();
          } else {
            this.$log.error("Error logging in, response status " + response.status);
          }
        });
      }
    }

    setUser(user: IUser): void {
      this.currentUser = { username: user.username,
                           projects: {
                            gdc_ids: _.reduce(user.projects.gdc_ids || {}, (acc, p, key) => {
                             if (p.indexOf("_member_") !== -1) {
                              acc.push(key);
                             }
                             return acc;
                           }, [])}
                         };
      this.$rootScope.$broadcast("gdc-user-reset");
    }

    toggleFilter(): void {
      this.$rootScope.$broadcast("gdc-user-reset");
    }

    hasProjects(): boolean {
      if(!this.currentUser) {
        return false;
      }
      var projects = _.get(this.currentUser.projects, 'gdc_ids', []);
      return projects.length > 0;
    }

    isUserProject(file: IFile): boolean {
      if (!this.currentUser) {
        return false;
      }

      var projectIds;

      // Support multiple use cases
      if (file.projects) {
        projectIds = _.unique(_.map(file.projects, p => p.project_id || p));
      } else {
        projectIds = _.unique(_.map(file.cases, (participant) => {
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
          cases: [
            {
              project: {
                project_id: term.key
              }
            }
          ]
        });
      });
    }

    userCanDownloadFile(file) {
      return this.userCanDownloadFiles([file]);
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
          _.get(this.currentUser.projects, "gdc_ids", []).length) {
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
      .module("user.services", ["restangular", "location.services", "ngCookies", "ui.bootstrap"])
      .service("UserService", UserService);
}
