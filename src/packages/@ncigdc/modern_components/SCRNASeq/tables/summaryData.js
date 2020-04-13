const summaryData = {
  leftColumnTables: {
    1: {
      header: 'Mapping',
      rows: [
        ['Reads Mapped to Genome', '94.3%'],
        ['Reads Mapped Confidently to Genome', '88.4%'],
        ['Reads Mapped Confidently to Intergenic Regions', '6.8%'],
        ['Reads Mapped Confidently to Intronic Regions', '25.0%'],
        ['Reads Mapped Confidently to Exonic Regions', '56.7%'],
        ['Reads Mapped Confidently to Transcriptome', '53.2%'],
        ['Reads Mapped Antisense to Gene', '1.3%'],
      ],
    },
    2: {
      header: 'Sequencing',
      rows: [
        ['Number of Reads', '151,731,342'],
        ['Valid Barcodes', '97.5%'],
        ['Sequencing Saturation', '52.4%'],
        ['Q30 Bases in Barcode', '95.8%'],
        ['Q30 Bases in RNA Read', '91.9%'],
        ['Q30 Bases in Sample Index', '89.8%'],
        ['Q30 Bases in UMI', '95.4%'],
      ],
    },
  },
  rightColumnTables: {
    1: {
      header: 'Cells',
      rows: [
        ['Estimated Number of Cells', '5,247'],
        ['Fraction Reads in Cells', '87.7%'],
        ['Mean Reads per Cell', '28,918'],
        ['Median Genes per Cell', '1,644'],
        ['Total Genes Detected', '20,822'],
        ['Median UMI Counts per Cell', '5,496'],
      ],
    },
    2: {
      header: 'Sample',
      rows: [
        ['Sample ID', '5k_pbmc_protein_v3'],
        ['Sample Description', '5k Peripheral blood mononuclear cells (PBMCs) from a healthy donor'],
        ['Chemistry', 'Single Cell 3\' v3'],
        ['Transcriptome', 'GRCh38-3.0.0'],
        ['Pipeline Version', '3.1.0'],
      ],
    },
    3: {
      header: 'Antibody Application',
      rows: [
        ['Fraction Antibody Reads', '94.3%'],
        ['Fraction Antibody Reads Usable', '67.4%'],
        ['Antibody Reads Usable per Cell', '5,022'],
        ['Fraction Reads in Barcodes with High UMI Counts', '0.0%'],
        ['Fraction Unrecognized Antibody', '5.7%'],
        ['Antibody Reads in Cells', '72.1%'],
        ['Median UMIs per Cell (summed over all recognized antibody barcodes)', '2,757'],
      ],
    },
  },
};

export default summaryData;
