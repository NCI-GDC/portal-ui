export const checkUserAccess = (
  userStudies,
  studiesToCheck,
) => studiesToCheck.map(study => ({
  // TODO: revise once multiple are allowed
  programs: userStudies[study],
}));

export const reshapeSummary = controlledAccessSummary => (
  [ // Sorting order for the modal, as per requirement
    'controlled',
    'open',
    'in_process',
  ]
    .reduce((acc, genesMutationsAccess) => ({
      ...acc,
      [genesMutationsAccess]: controlledAccessSummary[genesMutationsAccess]
        // '1 study - 1 program', current API implementation
        .map(study => study.programs && study.programs.length > 0 && ({
          cases_clinical: 'open',
          genes_mutations: genesMutationsAccess,
          program: study.programs[0].name.toLowerCase(),
          projects: study.programs[0].projects,
        })),
        // Future: allow multiple programs in a study
        // .map(study => ({
        //   ...study,
        //   cases_clinical: 'open',
        //   genes_mutations: genesMutationsAccess,
        // }))
    }), {})
);

export const reshapeUserAccess = list => (
  list.length > 0 && list.reduce((acc, { programs }) => (
    programs.length > 0 && ({
      ...acc,
      [programs[0].name.toLowerCase()]: programs,
    })
  ), {})
);
