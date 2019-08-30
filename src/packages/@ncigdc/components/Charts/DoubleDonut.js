import React from 'react';
import { Sunburst } from '@nivo/sunburst';

import { withTheme } from '@ncigdc/theme';
import Loader from '@ncigdc/uikit/Loaders/Loader';

const DoubleDonut = ({
  arcData = {},
  borderColor = 'white',
  borderWidth = 0.5,
  childColor = 'noinherit',
  colors,
  height = 400,
  identityKey = 'id',
  loading = true,
  marginStyle = {
    bottom: 20,
    left: 20,
    right: 20,
    top: 20,
  },
  // theme,
  valueKey = 'count',
  width = 400,
}) => (
  loading
    ? <Loader loading={loading} />
      : (
        <Sunburst
          borderColor={borderColor}
          borderWidth={borderWidth}
          childColor={childColor}
          colorBy={data => data.color}
          colors={colors}
          data={arcData}
          height={height}
          identity={identityKey}
          margin={marginStyle}
          value={valueKey}
          width={width}
          />
      )
);

export default withTheme(DoubleDonut);
