import React from 'react';

import Row from '@ncigdc/uikit/Flex/Row';
import { QuestionIcon } from '@ncigdc/theme/icons';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

export default ({ inputGenes, setInputGenes, onClear }) => {
  return (
    <div>
      <Row style={{ justifyContent: 'space-between' }}>
        <div>
          Type or copy-and-paste a list of gene identifiers
        </div>
        <Tooltip
          Component={
            <div style={{ whiteSpace: 'nowrap' }}>
              - Gene identifier accepted: Gene symbol, Ensembl, Entrez gene,
              HGNC Gene, OMIM, UniProtKB/Swiss-Prot<br />
              - Delimiters between gene identifiers: comma, space, tab or 1 gene
              identifier per line<br />
              - If you upload a file, format file is text file (.txt, .csv,
              .tsv)
            </div>
          }
        >
          <QuestionIcon />
        </Tooltip>
      </Row>
      <textarea
        value={inputGenes}
        onChange={e => setInputGenes(e.target.value)}
        placeholder="e.g. ENSG00000155657, TTN, 7273, HGNC:12403, 188840, Q8WZ42"
        style={{
          width: '100%',
          minHeight: 80,
        }}
      />
    </div>
  );
};
