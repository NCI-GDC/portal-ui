// @flow
/* global LEGACY:false */

import _ from 'lodash';

const isUserProject = ({ user, file }) => {
  if (!user) {
    return false;
  }
  const projectIds = Array.from(new Set([
    ...(file.projects || []).map(p => p.project_id || p),
    ...(file.cases || { hits: { edges: [] } }).hits.edges.map(e => e.node.project.project_id),
  ]));

  const gdcIds = Object.keys((user.projects || { gdc_ids: {} }).gdc_ids);
  return _.intersection(projectIds, gdcIds).length !== 0;
};

const fileInCorrectState = (file): boolean => LEGACY ?
  file.state === 'live' :
    file.state === 'submitted' && ['submitted', 'processing', 'processed'].indexOf(file.file_state) !== -1;

const intersectsWithFileAcl = ({user, file}): boolean => _.intersection(
    Object.keys((user.projects || { phs_ids: {} }).phs_ids)
      .filter(p => user.projects.phs_ids[p].indexOf('_member_') !== -1) || [],
    file.acl).length !== 0;

const userCanDownloadFiles = ({ user, files }) => (
  files.every(file => {
    if (file.access === 'open') {
      return true;
    }

    if (file.access !== 'open' && !user) {
      return false;
    }

    if (isUserProject({ user, file }) || intersectsWithFileAcl({ user, file}) && fileInCorrectState(file)) {
      return true;
    }

    return false;
  })
);

const userCanDownloadFile = ({ user, file }) => userCanDownloadFiles({ user, files: [file] });

/*----------------------------------------------------------------------------*/

export {
  isUserProject,
  userCanDownloadFiles,
  userCanDownloadFile,
  intersectsWithFileAcl,
  fileInCorrectState,
};
