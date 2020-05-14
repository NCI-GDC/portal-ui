export const checkUserAccess = (list, studyToCheck) => {};

export const reshapeSummary = controlledAccessSummary => (
  [ // Sorting order for the modal, as per requirement
    'controlled',
    'open',
    'in_process',
  ]
    .reduce((acc, genesMutationsAccess) => ({
      ...acc,
      [genesMutationsAccess]: controlledAccessSummary[genesMutationsAccess]
        // current API implementation:
        // controlled - '1 study - 1 program - 1 row'
        // open & in process - '1 study - n programs - n rows'
        .reduce((rows, study) => {
          const rowBase = {
            cases_clinical: 'open',
            genes_mutations: genesMutationsAccess,
          };
          return [
            ...rows,
            ...genesMutationsAccess === 'controlled'
            ? study.programs &&
              study.programs.length > 0 &&
              [
                {
                  ...rowBase,
                  program: study.programs[0].name.toLowerCase(),
                  projects: study.programs[0].projects,
                },
              ]
            : study.programs.map(program => ({
              ...rowBase,
              program: program.name.toLowerCase(),
              projects: [],
            })),
          ];
        }, []),
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
