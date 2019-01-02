export interface IUserProps {
  username: string;
  projects: {
    phs_ids: {
      phs000178: string[];
    };
    gdc_ids: {
      [x: string]: string[];
    };
  };
}
