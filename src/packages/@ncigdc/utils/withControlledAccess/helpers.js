import { flatten } from 'lodash';

export const checkUserAccess = (list, studyToCheck) => {};

export const reshapeSummary = controlledAccessSummary => flatten(
  [ // Sorting order for the modal, as per requirement
    'controlled',
    'open',
    'in_process',
  ]
    .map(genesMutationsAccess => (
      controlledAccessSummary[genesMutationsAccess]
        // '1 study - 1 program', current API implementation
        .map(study => study.programs && study.programs.length > 0 && ({
          cases_clinical: 'open',
          genes_mutations: genesMutationsAccess,
          program: study.programs[0].name.toLowerCase(),
          projects: study.programs[0].projects,
        }))
        // Future: allow multiple programs in a study
        // .map(study => ({
        //   ...study,
        //   cases_clinical: 'open',
        //   genes_mutations: genesMutationsAccess,
        // }))
    )),
);
