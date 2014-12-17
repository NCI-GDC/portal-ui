module ngApp.components.user.services {
  import IGDCConfig = ngApp.IGDCConfig;
  import IUser = ngApp.components.user.models.IUser;

  export interface IUserService {
    login(username: string): ng.IPromise<IUser>;
    logout(): ng.IPromise<IUser>;
    currentUser: IUser;
  }

  class UserService implements IUserService {
    currentUser: IUser;

    /* @ngInject */
    constructor(private Restangular: restangular.IService) {}

    login(username: string): ng.IPromise<IUser> {
      return this.Restangular.all("auth/login").post({
        username: username
      }).then((data) => {
        this.currentUser = data;
        return data;
      });
    }

    logout(): ng.IPromise<IUser> {
      return this.Restangular.all("auth/logout").post({
        user: this.currentUser
      }).then(() => {
        this.currentUser = null;
        return this.currentUser;
      });
    }
  }

  angular
      .module("user.services", ["restangular"])
      .service("UserService", UserService);
}
