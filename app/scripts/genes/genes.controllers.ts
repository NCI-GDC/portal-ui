module ngApp.genes.controllers {

  import ICoreService = ngApp.core.services.ICoreService;

  class GeneController {

    /* @ngInject */
    constructor(
      private $scope: ng.IScope,
      private CoreService: ICoreService,
      private config: IGDCConfig,
      private $stateParams
    ) {
      fetch(`${config.api}/genes/${this.$stateParams.geneId}`, {
        headers: { 'Content-Type': `application/json` },
        method: 'POST',
        body: JSON.stringify({
          expand: [
            'external_db_ids',
          ].join(),
          fields: [
            'description',
            'gene_id',
            'symbol',
            'name',
            'synonyms',
            'biotype',
            'gene_chromosome',
            'gene_start',
            'gene_end',
            'gene_strand',
            'canonical_transcript_id',
            'transcripts.is_canonical',
            'transcripts.id',
            'transcripts.length_amino_acid',
            'transcripts.domains.hit_name',
            'transcripts.domains.start',
            'transcripts.domains.end',
            'case.case_id',
            'case.project.project_id',
            'case.project.disease_type',
            'case.project.cancer_type',
            'case.project.primary_site',
            'case.ssm.ssm_id',
            'case.ssm.ncbi_build',
          ].join(),
        }),
      })
      .then(res => res.json())
      .then(data => {
        const gene = data.data || {};
        return fetch(`${config.api}/case_ssms?facets=project.project_id.raw&size=0`)
        .then(res => res.json())
        .then(({ data }) => {
          this.gene = Object.assign(gene, { allCasesAgg: data.aggregations['project.project_id.raw'].buckets });
          CoreService.setPageTitle("Gene", this.gene.gene_id);

          let tid = this.gene.transcripts.find(x => x.is_canonical).id;

          fetch(`${config.api}/analysis/frequent_mutations_by_gene`, {
            method: 'POST',
            headers: { 'Content-Type': `application/json` },
            body: JSON.stringify({
              gene_id: this.$stateParams.geneId,
              fields: [
                'ssm_id',
                'genomic_dna_change',
                'occurrence.case.project.project_id',
                'consequence.transcript.is_canonical',
                'consequence.transcript.annotation.impact',
                'consequence.transcript.consequence_type',
                'consequence.transcript.gene_symbol',
                'consequence.transcript.gene.gene_id',
                'consequence.transcript.aa_change',
                'consequence.transcript.transcript_id',
                'consequence.transcript.aa_start',
              ].join(),
            })
          })
          .then(res => res.json())
          .then(({ data }) => {
            this.frequentMutations = data.hits;

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
              .then(res => res.json())
              .then(({ data }) => {
                this.proteinLolliplotData = this.buildProteinLolliplotData(data.hits, tid);
                this.renderReact();
              });
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
            let consequence = mutation.consequence.find(c => c.transcript.transcript_id === tid)
            return {
              id: mutation.ssm_id,
              donors: mutation._score,
              genomic_dna_change: mutation.genomic_dna_change,
              x: consequence.transcript.aa_start,
              consequence: consequence.transcript.consequence_type,
              impact: (consequence.transcript.annotation || {}).impact || 'UNKNOWN',
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
      let el = document.getElementById('react-root');
      if (el) el.innerHTML = '';

      ReactDOM.render(
        React.createElement(ReactComponents.SideNavLayout, {
            links: [
              { icon: 'table', id: 'summary', title: 'Summary' },
              { icon: 'bar-chart-o', id: 'cancer-distribution', title: 'Cancer Distribution' },
              {
                icon: React.createElement('img', {
                  src: 'images/double-helix-blue.svg',
                  style: { width: '12px' },
                }),
                id: 'protein',
                title: 'Protein',
              },
              { icon: 'bar-chart-o', id: 'frequent-mutations', title: 'Frequent Mutations' },
            ],
            title: this.gene.symbol,
            entityType: 'GE',
          },
          React.createElement(ReactComponents.Gene, {
            gene: this.gene,
            $scope: this,
            frequentMutations: this.frequentMutations,
          })
        ),
        el
      );
    };
  }

  angular
      .module("genes.controller", [])
      .controller("GeneController", GeneController);
}
