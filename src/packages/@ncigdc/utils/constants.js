// @flow

export const DATA_CATEGORIES = {
  SEQ: { full: "Raw Sequencing Data", abbr: "Seq" },
  EXP: { full: "Transcriptome Profiling", abbr: "Exp" },
  SNV: { full: "Simple Nucleotide Variation", abbr: "SNV" },
  CNV: { full: "Copy Number Variation", abbr: "CNV" },
  METH: { full: "DNA Methylation", abbr: "Meth" },
  CLINICAL: { full: "Clinical", abbr: "Clinical" },
  BIOSPECIMEN: { full: "Biospecimen", abbr: "Bio" }
};

export const DATA_TYPES = {
  GEQ: { full: "Gene Expression Quantification", abbr: "GEQ" }
};

export const EXPERIMENTAL_STRATEGIES = [
  "Genotyping Array",
  "Gene Expression Array",
  "Exon Array",
  "miRNA Expression Array",
  "Methylation Array",
  "CGH Array",
  "MSI-Mono-Dinucleotide Assay",
  "WGS",
  "WGA",
  "WXS",
  "RNA-Seq",
  "miRNA-Seq",
  "ncRNA-Seq",
  "WCS",
  "CLONE",
  "POOLCLONE",
  "AMPLICON",
  "CLONEEND",
  "FINISHING",
  "ChIP-Seq",
  "MNase-Seq",
  "DNase-Hypersensitivity",
  "Bisulfite-Seq",
  "EST",
  "FL-cDNA",
  "CTS",
  "MRE-Seq",
  "MeDIP-Seq",
  "MBD-Seq",
  "Tn-Seq",
  "FAIRE-seq",
  "SELEX",
  "RIP-Seq",
  "ChIA-PET",
  "DNA-Seq",
  "Total RNA-Seq",
  "VALIDATION",
  "OTHER"
].map(n => n.toLowerCase());
