import React from 'react';

import Button from '@ncigdc/uikit/Button';

export default ({ inputGenes, setInputGenes }) => {
  return (
    <div>
      Type or copy-and-paste a list of gene identifiers (Ensembl, Symbol, Entrez
      gene, HGNC, OMIM, or UniProtKB/Swiss-Prot)
      <textarea
        value={inputGenes}
        onChange={e => setInputGenes(e.target.value)}
        placeholder="e.g. ENSG00000155657, TTN, 7273, HGNC:12403, 188840, Q8WZ42"
        style={{
          width: '100%',
          minHeight: 100,
        }}
      />
      <Button
        style={{ margin: '0 0 0 auto' }}
        onClick={() => setInputGenes('')}
      >
        Clear
      </Button>
    </div>
  );
};
