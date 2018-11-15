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

const fileInCorrectState = (file): boolean => file.state === 'submitted';

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

const userCanDownloadFile = ({ user, file }: { user: Object, file: Object }) =>
  userCanDownloadFiles({ user, files: [file] });

type TFilesAuthData = {
  key?: string,
  doc_count: number,
  file_size: number,
  files: Array<Object>,
};

const authPartitionFiles = ({
  user,
  files,
}: {
  user: Object,
  files: Array<Object>,
}): { authorized: TFilesAuthData, unauthorized: TFilesAuthData } => {
  const defaultData = {
    authorized: { doc_count: 0, file_size: 0, files: [] },
    unauthorized: { doc_count: 0, file_size: 0, files: [] },
  };

  return files.reduce((result, file) => {
    const canDownloadKey = userCanDownloadFile({ user, file })
      ? 'authorized'
      : 'unauthorized';
    result[canDownloadKey].doc_count += 1;
    result[canDownloadKey].file_size += file.file_size;
    result[canDownloadKey].files = [...result[canDownloadKey].files, file];
    return result;
  }, defaultData);
};

const getAuthCounts = ({
  user,
  files,
}: {
  user: Object,
  files: Array<Object>,
}): Array<TFilesAuthData> => {
  const authCountAndFileSizes = authPartitionFiles({ user, files });
  return [
    {
      key: 'authorized',
      doc_count: authCountAndFileSizes.authorized.doc_count || 0,
      file_size: authCountAndFileSizes.authorized.file_size,
      files: authCountAndFileSizes.authorized.files,
    },
    {
      key: 'unauthorized',
      doc_count: authCountAndFileSizes.unauthorized.doc_count || 0,
      file_size: authCountAndFileSizes.unauthorized.file_size,
      files: authCountAndFileSizes.unauthorized.files,
    },
  ].filter(i => i.doc_count);
};

const userProjectsCount = (user: Object) =>
  Object.keys(user.projects || {}).reduce(
    (acc, k) => [...acc, ...Object.keys(user.projects[k])],
    [],
  ).length;

const redirectToLogin = () => {
  console.log('forcing logout');
  store.dispatch(forceLogout());
  return (window.location.href = '/login?error=timeout');
};
/*----------------------------------------------------------------------------*/

export {
  isUserProject,
  userCanDownloadFiles,
  userCanDownloadFile,
  intersectsWithFileAcl,
  fileInCorrectState,
  getAuthCounts,
  userProjectsCount,
  authPartitionFiles,
  redirectToLogin,
};
