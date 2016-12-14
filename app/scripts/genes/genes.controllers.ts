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
      fetch(`${config.es_host}/${config.es_index_version}-gene-centric/gene-centric/${this.$stateParams.geneId}`, {
        headers: { 'Content-Type': `application/json` },
      })
      .then(res => res.json())
      .then(data => {
        const gene = data._source || {};
        return fetch(`${config.es_host}/${config.es_index_version}-case-centric/case-centric/_search`, {
          method: 'POST',
          headers: { 'Content-Type': `application/json` },
          body: JSON.stringify({
            "size": 0,
            "aggs": {
              "project_ids": {
                "terms": {
                  "field": "project.project_id.raw",
                }
              }
            }
          })
        })
        .then(res => res.json())
        .then(data => {
          this.gene = Object.assign(gene, { allCasesAgg: data.aggregations.project_ids.buckets });
          CoreService.setPageTitle("Gene", this.gene.gene_id);

          let tid = this.gene.transcripts.find(x => x.is_canonical).id;

          fetch(`${config.es_host}/${config.es_index_version}-ssm-centric/ssm-centric/_search`, {
            method: 'POST',
            headers: { 'Content-Type': `application/json` },
            body: JSON.stringify({
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
                  "query": {
                    "term": {
                      "consequence.transcript.gene.gene_id": this.$stateParams.geneId
                    }
                  }
                }
              }
            })
          })
          .then(res => res.json())
          .then(data => {
            this.frequentMutations = data.hits.hits;

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
                      "query": {
                        "term": {
                          "consequence.transcript.transcript_id": tid
                        }
                      }
                    }
                  }
                }
              )
            })
            .then(res => res.json())
            .then(data => {
              this.proteinLolliplotData = this.buildProteinLolliplotData(
                data.hits.hits, tid
              );

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
            return mutation._source.consequence.find(c => c.transcript.transcript_id === tid)
          })
          .map(mutation => {
            let consequence = mutation._source.consequence.find(c => c.transcript.transcript_id === tid)
            return {
              id: mutation._source.ssm_id,
              donors: mutation._score,
              genomic_dna_change: mutation._source.genomic_dna_change,
              x: consequence.transcript.aa_start,
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
            frequentMutations: this.frequentMutations.map(g => Object.assign({}, g._source, { score: g._score })),
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
