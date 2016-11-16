module ngApp.mutations.controllers {

  import ICoreService = ngApp.core.services.ICoreService;

  class MutationController {

    /* @ngInject */
    constructor(
      private mutation: any,
      private allCasesAgg: any,
      private $scope: ng.IScope,
      private CoreService: ICoreService,
      private config: IGDCConfig
    ) {
      CoreService.setPageTitle("Mutation", mutation.ssm_id);
      $scope.mutation = mutation;

      let canonicalTranscript = mutation.consequence.find(x => x.transcript.is_canonical).transcript;
      let tid = canonicalTranscript.transcript_id;
      let geneId = canonicalTranscript.gene.gene_id;

      Promise.all([
        fetch(`${config.es_host}/${config.es_index_version}-ssm-centric/ssm-centric/_search`, {
          method: 'POST',
          headers: { 'Content-Type': `application/json` },
          body: JSON.stringify(
            {
              "size": 10000,
              "query": {
                "nested": {
                  "path": "occurrence",
                  "score_mode": "sum",
                  "query": {
                    "function_score": {
                      "query": {
                        "match_all": {}
                      },
                      "boost_mode": "replace",
                      "script_score": {
                        "script": "doc['occurrence.case.project.project_id'].empty ? 0 : 1"
                      }
                    }
                  }
                }
              },
              "post_filter": {
                "nested": {
                  "path": "consequence",
                  "filter": {
                    "term": {
                      "consequence.transcript.transcript_id": tid
                    }
                  }
                }
              }
            }
          )
        })
          .then(res => res.json()),

        fetch(`${config.es_host}/${config.es_index_version}-gene-centric/gene-centric/_search`, {
          method: 'POST',
          headers: { 'Content-Type': `application/json` },
          body: JSON.stringify(
            {
              "query": {
                "term": {
                  "gene_id": {
                    "value": geneId
                  }
                }
              }
            }
          )
        })
        .then(res => res.json())
      ])
        .then(results => {
          let mutations = results[0].hits.hits;
          this.gene = results[1].hits.hits[0]._source;

          this.proteinLolliplotData = this.buildProteinLolliplotData(
            mutations, tid
          );

          this.renderReact();
        });
    }

    buildProteinLolliplotData(mutations, tid) {
      this.transcripts = this.gene.transcripts;
      this.geneTranscript = this.transcripts.find(x => x.id === tid);
      this.mutations = mutations;

      return {
        mutations: mutations
          .filter(mutation => {
            return mutation._source.consequence.find(c => c.transcript.transcript_id === tid)
          })
          .map(mutation => {
            let consequence = mutation._source.consequence.find(c => c.transcript.transcript_id === tid)
            return {
              id: mutation._source.ssm_id,
              donors: mutation._score,
              x: consequence.transcript.aa_start,
              genomic_dna_change: mutation._source.genomic_dna_change,
              consequence: consequence.transcript.consequence_type,
              impact: consequence.transcript.annotation.impact || 'UNKNOWN',
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
