type TBuildProteinLolliplotArgs = {
  transcript: {
    domains: Array<Object>,
    transcript_id: string,
  },
  data: Array<Object>,
};
export default (
  {
    transcript = {
      domains: [],
      transcript_id: '',
    },
    data = [],
  }: TBuildProteinLolliplotArgs = {},
) => ({
  mutations: data
    .filter(x => {
      const co = x.consequence.find(
        c => c.transcript.transcript_id === transcript.transcript_id,
      );
      return co && co.transcript.aa_start;
    })
    .map(mutation => {
      // need to filter here on client unless filtered on server
      const consequence = mutation.consequence.find(
        c => c.transcript.transcript_id === transcript.transcript_id,
      );

      return {
        id: mutation.ssm_id,
        y: mutation.score,
        genomic_dna_change: mutation.genomic_dna_change,
        x: consequence.transcript.aa_start,
        consequence: consequence.transcript.consequence_type.replace(
          '_variant',
          '',
        ),
        impact: (consequence.transcript.annotation || {}).impact || 'UNKNOWN',
        aa_change: consequence.transcript.aa_change,
      };
    }),

  proteins: (transcript.domains || []).map(protein => ({
    id: protein.hit_name,
    start: protein.start,
    end: protein.end,
    description: protein.description,
  })),
});
