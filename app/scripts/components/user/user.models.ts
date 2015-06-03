module ngApp.components.user.models {
  export interface IUser {
    username: string;
    projects: {gdc_ids: string[]};
    token: string;
    isFiltered: boolean;
  }
}
