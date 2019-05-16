// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';
import { stringify } from 'query-string';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { replaceSet } from '@ncigdc/dux/sets';
import SetTable from '@ncigdc/components/SetTable';
import withRouter from '@ncigdc/utils/withRouter';
import { updateClinicalAnalysisSet } from '@ncigdc/dux/analysis';

import onSaveComplete from './onSaveComplete';

const enhance = compose(
  withState('selected', 'setSelected', ({ selected }) => selected || ''),
  connect(({ analysis, sets }) => ({
    analysis,
    sets,
  })),
  withProps(({ analysis, sets, type }) => ({
    analyses: analysis.saved || [],
    sets: sets[type] || {},
  })),
  withRouter
);

const RemoveSetModal = ({
  RemoveFromSetButton,
  analyses,
  currentCohort,
  dispatch,
  field,
  filters,
  history,
  query,
  selected,
  setSelected,
  sets,
  title,
  type,
}) => {
  return (
    <BaseModal
      closeText="Cancel"
      extraButtons={(
        <RemoveFromSetButton
          action="remove"
          disabled={!selected}
          filters={filters}
          onComplete={async setId => {
            if ((query.filters || '').includes(selected)) {
              history.replace({
                search: `?${stringify({
                  ...query,
                  filters: query.filters.replace(selected, setId),
                })}`,
              });
            }

            onSaveComplete({
              dispatch,
              label: sets[selected],
            });
            await dispatch(replaceSet({
              newId: setId,
              oldId: selected,
              type,
            }));
            if (type === 'case') {
              analyses
                .filter(analysis => analysis.sets.case[selected])
                .forEach(affected => {
                  dispatch(
                    updateClinicalAnalysisSet({
                      id: affected.id,
                      setId,
                      setName: affected.sets.case[selected],
                    })
                  );
                });
            }
          }}
          set_id={`set_id:${selected}`}
          >
          Save
        </RemoveFromSetButton>
      )}
      title={title}
      >
      <SetTable
        field={field}
        selected={selected}
        sets={sets}
        setSelected={setSelected}
        type={type}
        />
    </BaseModal>
  );
};

export default enhance(RemoveSetModal);
