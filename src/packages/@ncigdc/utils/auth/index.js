// @flow

import _ from 'lodash';

const isUserProject = ({ user, file }) => {
  if (!user) {
    return false;
  }
  const projectIds = Array.from(
    new Set([
      ...(file.projects || []).map(p => p.project_id || p),
      ...(file.cases || { hits: { edges: [] } }).hits.edges.map(
        e => e.node.project.project_id,
      ),
    ]),
  );

  const gdcIds = Object.keys(_.get(user, 'projects.gdc_ids', {}));
  return _.intersection(projectIds, gdcIds).length !== 0;
};

const fileInCorrectState = (file): boolean =>
  file.state === 'submitted' &&
  ['submitted', 'processing', 'processed'].indexOf(file.file_state) !== -1;

const intersectsWithFileAcl = ({ user, file }): boolean =>
  _.intersection(
    Object.keys(_.get(user, 'projects.phs_ids', {})).filter(
      p => user.projects.phs_ids[p].indexOf('_member_') !== -1,
    ) || [],
    file.acl,
  ).length !== 0;

const userCanDownloadFiles = ({ user, files }) =>
  files.every(file => {
    if (file.access === 'open') {
      return true;
    }

    if (file.access !== 'open' && !user) {
      return false;
    }

    if (
      isUserProject({ user, file }) ||
      (intersectsWithFileAcl({ user, file }) && fileInCorrectState(file))
    ) {
      return true;
    }

    return false;
  });

const userCanDownloadFile = ({ user, file }) =>
  userCanDownloadFiles({ user, files: [file] });

const getAuthCounts = ({ user, files }) => {
  const defaultData = {
    authorized: { count: 0, file_size: 0 },
    unauthorized: { count: 0, file_size: 0 },
  };

  const authCountAndFileSizes = files.reduce((result, file) => {
    const canDownloadKey = userCanDownloadFile({ user, file })
      ? 'authorized'
      : 'unauthorized';
    result[canDownloadKey].count += 1;
    result[canDownloadKey].file_size += file.file_size;
    return result;
  }, defaultData);

  return [
    {
      key: 'authorized',
      doc_count: authCountAndFileSizes.authorized.count || 0,
      file_size: authCountAndFileSizes.authorized.file_size,
    },
    {
      key: 'unauthorized',
      doc_count: authCountAndFileSizes.unauthorized.count || 0,
      file_size: authCountAndFileSizes.unauthorized.file_size,
    },
  ].filter(i => i.doc_count);
};

const userProjectsCount = (user: Object) =>
  Object.keys(user.projects || {}).reduce(
    (acc, k) => [...acc, ...Object.keys(user.projects[k])],
    [],
  ).length;

/*----------------------------------------------------------------------------*/

export {
  isUserProject,
  userCanDownloadFiles,
  userCanDownloadFile,
  intersectsWithFileAcl,
  fileInCorrectState,
  getAuthCounts,
  userProjectsCount,
};
