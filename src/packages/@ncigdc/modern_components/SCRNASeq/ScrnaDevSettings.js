import React from 'react';

import DevSettings from '@ncigdc/components/DevSettings';

const ScrnaDevSettings = ({
  dataType,
  dataTypes,
  handleDataButton,
}) => {
  const buttons = dataTypes.map(dType => ({
    active: dataType === dType,
    label: dType,
    onClick: () => {
      handleDataButton(dType);
    },
  }));

  return (
    <DevSettings
      buttons={buttons}
      message="Change the type of data shown in the scRNA-Seq plot."
      openButtonStyle={{
        left: 0,
        right: 'auto',
        top: 0,
      }}
      />
  );
};

export default ScrnaDevSettings;
