const consequenceTypes = [
  'missense_variant',
  'frameshift_variant',
  'start_lost',
  'stop_lost',
  'initiator_codon_variant',
  'stop_gained',
];

function request(opts) {
  return fetch(opts.url, {
    body: JSON.stringify(opts.data),
    method: 'POST',
    credentials: true,
  })
    .then(r => r.json())
    .then(d => d.hits.hits);
}

function getQueries(projectId, esHost, esIndexVersion) {
  const geneIds = [];
  const responseData = {};

  const occurenceQuery = {
    url: `${esHost}/${esIndexVersion}-ssm_occurrence-centric/ssm_occurrence-centric/_search`,
    data: {
      size: 8000,
      _source: ['ssm.consequence.transcript.consequence_type', 'ssm.consequence.transcript.annotation.impact', 'ssm.consequence.transcript.gene.gene_id', 'ssm.ssm_id', 'case.case_id'],
      query: {
        bool: {
          must: [
            {
              nested: {
                path: 'ssm.consequence',
                query: {
                  terms: {
                    'ssm.consequence.transcript.gene.gene_id': geneIds,
                  },
                },
              },
            },
            {
              nested: {
                path: 'ssm.consequence',
                query: {
                  terms: {
                    'ssm.consequence.transcript.annotation.impact': ['HIGH'],
                  },
                },
              },
            },
            {
              nested: {
                path: 'ssm.consequence',
                query: {
                  terms: {
                    'ssm.consequence.transcript.consequence_type': consequenceTypes,
                  },
                },
              },
            },
            {
              terms: {
                'case.project.project_id': [projectId],
              },
            },
          ],
        },
      },
    },
  };

  const geneQuery = {
    url: `${esHost}/${esIndexVersion}-gene-centric/gene-centric/_search`,
    data: {
      size: 50,
      _source: ['_id', 'case.case_id', 'symbol', 'is_cancer_gene_census'],
      query: {
        nested: {
          path: 'case',
          score_mode: 'sum',
          query: {
            function_score: {
              query: {
                bool: {
                  must: [
                    {
                      terms: {
                        'case.project.project_id': [
                          projectId,
                        ],
                      },
                    },
                    {
                      nested: {
                        path: 'case.ssm',
                        query: {
                          nested: {
                            path: 'case.ssm.consequence',
                            query: {
                              bool: {
                                must: [
                                  {
                                    terms: {
                                      'case.ssm.consequence.transcript.annotation.impact': [
                                        'HIGH',
                                      ],
                                    },
                                  },
                                  {
                                    terms: {
                                      'case.ssm.consequence.transcript.consequence_type': consequenceTypes,
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
              boost_mode: 'replace',
              script_score: {
                script: "doc['case.project.project_id'].empty ? 0 : 1",
              },
            },
          },
        },
      },
    },
  };

  const caseQuery = {
    url: `${esHost}/${esIndexVersion}-case-centric/case-centric/_search`,
    data: {
      size: 10000,
      _source: ['diagnoses.days_to_death', 'diagnoses.age_at_diagnosis', 'diagnoses.vital_status', 'diagnoses.primary_diagnosis', 'demographic.gender', 'demographic.race', 'demographic.ethnicity', 'case_id', 'summary.data_categories.file_count', 'summary.data_categories.data_category'],
      query: {
        nested: {
          path: 'gene',
          score_mode: 'sum',
          query: {
            function_score: {
              query: {
                bool: {
                  must: [
                    {
                      terms: {
                        'gene.gene_id': geneIds,
                      },
                    },
                    {
                      nested: {
                        path: 'gene.ssm',
                        query: {
                          nested: {
                            path: 'gene.ssm.consequence',
                            query: {
                              bool: {
                                must: [
                                  {
                                    terms: {
                                      'gene.ssm.consequence.transcript.annotation.impact': [
                                        'HIGH',
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
              boost_mode: 'replace',
              script_score: {
                script: "doc['gene.gene_id'].empty ? 0 : 1",
              },
            },
          },
        },
      },
      post_filter: {
        terms: {
          'project.project_id': [projectId],
        },
      },
    },
  };

  return request(geneQuery)
    .then((genes) => {
      genes.reduce((ids, gene) => {
        ids.push(gene._id);
        return ids;
      }, geneIds);

      responseData.genes = genes;

      return Promise.all([
        request(occurenceQuery),
        request(caseQuery),
      ]).then(d => ({
        ...responseData,
        occurences: d[0],
        cases: d[1],
      }));
    });
}

export default getQueries;
