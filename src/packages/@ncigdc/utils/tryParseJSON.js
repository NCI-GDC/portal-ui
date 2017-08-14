/* @flow */

export default (str: string, defaultValue: any = null) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
};
