// @flow

export const externalLinkNames = {
  civic: 'CIViC',
  entrez_gene: 'NCBI Gene',
  hgnc: 'HGNC',
  omim_gene: 'OMIM',
  uniprotkb_swissprot: 'UniProtKB Swiss-Prot',
};

export default {
  civic: (geneId, variantId) => `https://civicdb.org/events/genes/${geneId}/summary${
    variantId ? `/variants/${variantId}/summary` : ''
  }`,
  cosm: id => `http://cancer.sanger.ac.uk/cosmic/mutation/overview?id=${id}`,
  cosn: id => `http://cancer.sanger.ac.uk/cosmic/ncv/overview?id=${id}`,
  dbsnp: id => `https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=${id}`,
  ensembl: id => `http://may2015.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${id}`,
  entrez_gene: id => `http://www.ncbi.nlm.nih.gov/gene/${id}`,
  hgnc: id => `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`,
  omim_gene: id => `http://omim.org/entry/${id}`,
  transcript: id => `http://feb2014.archive.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=${id}`,
  uniprotkb_swissprot: id => `http://www.uniprot.org/uniprot/${id}`,
};
