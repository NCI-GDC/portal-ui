module ngApp.mutations.controllers {

  import ICoreService = ngApp.core.services.ICoreService;

  class MutationController {

    /* @ngInject */
    constructor(
      private $scope: ng.IScope,
      private CoreService: ICoreService,
      private config: IGDCConfig,
      private $stateParams
    ) {
      return fetch(`${config.api}/case_ssms?facets=project.project_id.raw&size=0`)
        .then(res => res.json())
        .then(({ data }) => {
          this.allCasesAgg = data.aggregations['project.project_id.raw'].buckets;

          fetch(`${config.api}/ssms/${this.$stateParams.mutationId}`, {
            headers: {'Content-Type' : 'application/json'},
            method: 'POST',
            body: JSON.stringify({
              expand: [
                'consequence.transcript.gene.external_db_ids',
              ].join(),
              fields: [
                'ssm_id',
                'chromosome',
                'start_position',
                'reference_allele',
                'genomic_dna_change',
                'tumor_allele',
                'variant_type',
                'ncbi_build',
                'consequence.transcript.aa_change',
                'consequence.transcript.consequence_type',
                'consequence.transcript.transcript_id',
                'consequence.transcript.is_canonical',
                'consequence.transcript.transcript_id',
                'consequence.transcript.gene_symbol',
                'consequence.transcript.annotation.impact',
                'consequence.transcript.annotation.hgvsc',
                'consequence.transcript.gene.gene_strand',
                'consequence.transcript.gene.gene_id',
                'occurrence.case.case_id',
                'occurrence.case.project.project_id',
                'occurrence.case.project.disease_type',
                'occurrence.case.project.cancer_type',
                'occurrence.case.project.primary_site',
              ].join(),
            }),
          })
          .then(res => res.json())
          .then(data => {
            this.mutation = data.data || {};

            CoreService.setPageTitle("Mutation", this.mutation.ssm_id);

            let canonicalTranscript = this.mutation.consequence.find(x => x.transcript.is_canonical).transcript;
            let tid = canonicalTranscript.transcript_id;
            let geneId = canonicalTranscript.gene.gene_id;

            Promise.all([
              fetch(`${config.api}/analysis/lolliplot`, {
                method: 'POST',
                headers: { 'Content-Type': `application/json` },
                body: JSON.stringify({
                  transcript_id: tid,
                  fields: [
                    'ssm_id',
                    'genomic_dna_change',
                    'consequence.transcript.transcript_id',
                    'consequence.transcript.aa_start',
                    'consequence.transcript.consequence_type',
                    'consequence.transcript.annotation.impact',
                  ].join(),
                }),
              })
                .then(res => res.json()),

              fetch(`${config.api}/genes/${geneId}`, {
                headers: { 'Content-Type': `application/json` },
                method: 'POST',
                body: JSON.stringify({
                  fields: [
                    'transcripts.id',
                    'transcripts.domains.hit_name',
                    'transcripts.domains.start',
                    'transcripts.domains.end',
                    'transcripts.domains.description',
                  ].join(),
                }),
              })
                .then(res => res.json())
            ])
              .then(results => {
                let mutations = results[0].data.hits;
                this.gene = results[1].data;

                this.proteinLolliplotData = this.buildProteinLolliplotData(
                  mutations, tid
                );

                this.renderReact();
              });
          });
      });
    }

    buildProteinLolliplotData(mutations, tid) {
      this.transcripts = this.gene.transcripts;
      this.geneTranscript = this.transcripts.find(x => x.id === tid);
      this.mutations = mutations;

      return {
        mutations: mutations
          .filter(mutation => {
            return mutation.consequence.find(c => c.transcript.transcript_id === tid)
          })
          .map(mutation => {
            const consequence = mutation.consequence.find(c => c.transcript.transcript_id === tid)
            const transcript = consequence.transcript || {};
            const annotation = transcript.annotation || {};

            return {
              id: mutation.ssm_id,
              donors: mutation._score,
              x: transcript.aa_start,
              genomic_dna_change: mutation.genomic_dna_change,
              consequence: transcript.consequence_type,
              impact: annotation.impact || 'UNKNOWN',
            }
          })
          .filter(mutation => mutation.x),

        proteins: this.geneTranscript.domains
          .map(protein => ({
            id: protein.hit_name,
            start: protein.start,
            end: protein.end,
            description: protein.description,
          })),
      };
    }

    selectTranscript(tid) {
      this.proteinLolliplotData = this.buildProteinLolliplotData(
        this.mutations, tid
      );

      this.renderReact();
    }

    renderReact () {
      ReactDOM.render(
        React.createElement(ReactComponents.SideNavLayout, {
            links: [
              { id: 'summary', title: 'Summary', icon: 'table' },
              { icon: 'table', id: 'consequences', title: 'Consequences' },
              { icon: 'bar-chart-o', id: 'cancer-distribution', title: 'Cancer Distribution' },
              {
                icon: React.createElement('img', {
                  src: 'images/double-helix-blue.svg',
                  style: { width: '12px' },
                }),
                id: 'protein',
                title: 'Protein',
              },
            ],
            title: this.mutation.genomic_dna_change,
            entityType: 'MU',
          },
          React.createElement(ReactComponents.Mutation, {
            $scope: this,
            mutation: this.mutation,
            allCasesAgg: this.allCasesAgg
          }),
        ),
        document.getElementById('react-root')
      );
    }

  }

  angular
      .module("mutations.controller", [])
      .controller("MutationController", MutationController);
}
