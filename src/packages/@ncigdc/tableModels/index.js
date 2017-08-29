// @flow
import projectsTableModel from './projectsTableModel';
import casesTableModel from './casesTableModel';
import filesTableModel from './filesTableModel';
import annotationsTableModel from './annotationsTableModel';

import exploreCasesTableModel from '@ncigdc/modern_components/ExploreCasesTable/ExploreCasesTable.model';
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
