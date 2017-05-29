// @flow
import withSize from "react-sizeme";

export default (options = {}) => withSize({ ...options, refreshRate: 200 });
