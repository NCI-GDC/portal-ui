module ngApp.search {
  "use strict";

  import IFacet = ngApp.models.IFacet;

  /* @ngInject */
  function searchConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("search", {
      url: "/search",
      controller: "SearchController as sc",
      templateUrl: "search/templates/search.html",
      resolve: {
        fileFacets: () => {
          return [
            {
              category: "Data Type",
              terms: [
                "Clinical data",
                "Biospecimen data",
                "Pathology report",
                "WGS",
                "WXS",
                "RNA-Seq",
                "Protein expression array",
                "Gene expression array",
                "SNP array",
                "CGH array",
                "Simple somatic mutation",
                "Simple germline variation",
                "Structural rearrangement",
                "Copy number somatic mutation",
                "Probe level methylation value",
                "Methylation calls",
                "Differentially methylated regions",
                "Expression - exon",
                "Expression - splice junction",
                "Expression - isoform",
                "Expression - gene",
                "Expression - miRNA",
                "Protein expression",
                "Microsatellite instability",
              ]
            },
            {
              category: "Data category",
              terms: [
                "Clinical",
                "Sequencing data",
                "Microarray data",
                "SNV",
                "Structural rearrangement",
                "Copy number variation",
                "DNA methylation",
                "mRNA expression",
                "miRNA expression",
                "Protein expression",
                "Other"
              ]
            },
            {
              category: "File type",
              terms: [
                "BAM",
                "VCF",
                "MAF",
                "Clinical XML",
                "Biospecimen XML",
                "SRA metadata XML",
                "MAGE-Tab",
                "SVS",
                "PDF",
                "TSV"
              ]
            },
            {
              category: "Platform",
              terms: [
                "ABI",
                "Affymetrix U133 2.0",
                "Affymetrix SNP 6.0",
                "HG-CGH-244A",
                "HumanMethylation450",
                "Illumina GA",
                "Illumina HiSeq",
                "MDA_RPPA_Core"
              ]
            }
          ];

        },
        participantFacets: () => {
          return [
            {
              category: "Cancer program",
              terms: [
                "TCGA",
                "TARGET",
                "CGCI"
              ]
            },
            {
              category: "Project",
              terms: [
                "Chronic Lymphocytic Leukemia",
                "Ovarian Serous Cystadenocarcinoma",
                "Pancreatic Cancer",
                "Breast Cancer",
                "Pediatric Brain Tumors"
              ]
            },
            {
              category: "Primary Site",
              terms: [
                "Brain",
                "Breast",
                "Colon"
              ]
            },
            {
              category: "Gender",
              terms: [
                "Male",
                "Female"
              ]
            }
          ];
        }
      }
    });
  }

  angular
      .module("ngApp.search", [
        "search.controller",
        "ui.router.state"
      ])
      .config(searchConfig);
}
