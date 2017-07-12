import React from 'react';
import JSURL from 'jsurl';

import CreateExploreGeneSetButton from '@ncigdc/modern_components/CreateSetButton/CreateExploreGeneSetButton';
import { replaceFilters } from '@ncigdc/utils/filters/index';
import { parseFilterParam } from '@ncigdc/utils/uri/index';
import { compose } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import { GENE_ID_FIELDS } from '@ncigdc/utils/validateIds';

type TProps = {
  genes: Array<string>,
  onClose: Function,
  push: Function,
  query: TRawQuery,
};

const enhance = compose(withRouter);

export default enhance(({ genes, onClose, push, query, ...props }: TProps) => {
  return (
    <CreateExploreGeneSetButton
      {...props}
      disabled={!genes.length}
      onComplete={setId => {
        onClose();
        push({
          pathname: '/exploration',
          query: {
            ...query,
            searchTableTab: 'genes',
            filters: JSURL.stringify(
              replaceFilters(
                {
                  op: 'AND',
                  content: [
                    {
                      op: 'in',
                      content: {
                        field: 'genes.gene_id',
                        value: [`set_id:${setId}`],
                      },
                    },
                  ],
                },
                parseFilterParam(query.filters, null),
              ),
            ),
          },
        });
      }}
      filters={{
        op: 'OR',
        content: GENE_ID_FIELDS.map(field => ({
          op: 'in',
          content: {
            field,
            value: genes,
          },
        })),
      }}
    />
  );
});
