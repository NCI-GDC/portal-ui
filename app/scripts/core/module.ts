module ngApp.core {
}

angular
    .module("ngApp.core", [
      "core.controller",
      "core.directives",
      "core.services",
      "core.filters"
    ])
    .constant('DATA_TYPES', {
      GEQ: { full: "Gene Expression Quantifcation", abbr: "GEQ" },
    })
    .constant('DATA_CATEGORIES', {
      SEQ: { full: "Raw Sequencing Data", abbr: "Seq" },
      EXP: { full: "Transcriptome Profiling", abbr: "Exp" },
      SNV: { full: "Simple Nucleotide Variation", abbr: "SNV" },
      CNV: { full: "Copy Number Variation", abbr: "CNV" },
      CLINICAL: { full: "Clinical", abbr: "Clinical" },
      BIOSPECIMEN: { full: "Biospecimen", abbr: "Bio" },
    });
