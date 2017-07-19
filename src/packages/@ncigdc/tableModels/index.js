// @flow
import projectsTableModel from './projectsTableModel';
import casesTableModel from './casesTableModel';
import filesTableModel from './filesTableModel';
import exploreCasesTableModel from './exploreCasesTableModel';
import annotationsTableModel from './annotationsTableModel';

import genesTableModel from '@ncigdc/modern_components/GenesTable/GenesTable.model';
import ssmsTableModel from '@ncigdc/modern_components/SsmsTable/SsmsTable.model';

export default {
  projects: projectsTableModel,
  cases: casesTableModel,
  files: filesTableModel,
  exploreCases: exploreCasesTableModel,
  annotations: annotationsTableModel,
  genes: genesTableModel,
  ssms: ssmsTableModel,
};
