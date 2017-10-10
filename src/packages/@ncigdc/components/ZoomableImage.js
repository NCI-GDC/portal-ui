import React from 'react';
import OpenSeadragon from 'openseadragon';
import { compose, withPropsOnChange, withState, lifecycle } from 'recompose';

import { Row } from '@ncigdc/uikit/Flex';

const reAddFullScreenHandler = viewer => {
  viewer.fullPageButton.removeAllHandlers();
  viewer.fullPageButton.addHandler('click', () => {
    OpenSeadragon.supportsFullScreen = false;
    viewer.setFullPage(!viewer.isFullPage());
    OpenSeadragon.supportsFullScreen = true;
  });
};

const enhance = compose(
  withState('viewer', 'setViewer', null),
  withState('boundsByImage', 'setBoundsByImage', {}),
  lifecycle({
    componentDidMount() {
      OpenSeadragon.setString('Tooltips.Home', 'Reset zoom');
      this.props.setViewer(
        OpenSeadragon({
          id: 'osd1',
          prefixUrl:
            'https://cdn.jsdelivr.net/npm/openseadragon@2.3/build/openseadragon/images/',
          showNavigator: true,
        }),
      );
      fetch(this.props.imageUrl).then(res => {
        this.props.viewer.open(res.url);
        // sometimes fullscreen doesn't work, toggling supportsFullScreen seems to fix it
        // https://github.com/openseadragon/openseadragon/issues/91
        reAddFullScreenHandler(this.props.viewer);

        this.props.setBoundsByImage({
          ...this.props.boundsByImage,
          [this.props.imageUrl]: this.props.viewer.viewport.getBounds(),
        });
      });
    },
  }),
  withPropsOnChange(
    (props, nextProps) => {
      if (props.imageUrl !== nextProps.imageUrl) {
        const { boundsByImage, setBoundsByImage, viewer } = props;
        setBoundsByImage({
          ...boundsByImage,
          [props.imageUrl]: viewer.viewport.getBounds(),
        });
        return true;
      }
      return false;
    },
    ({ imageUrl, viewer, boundsByImage }) => ({
      anything:
        viewer &&
        fetch(imageUrl).then(res => {
          viewer.open(res.url);
          viewer.addHandler('open', () => {
            boundsByImage[imageUrl] &&
              viewer.viewport.fitBounds(boundsByImage[imageUrl], true);
          });
        }),
    }),
  ),
);

const ZoomableImage = enhance(() => (
  <Row
    id="osd1"
    style={{ width: '100%', height: '550px', backgroundColor: '#000' }}
  />
));

export default ZoomableImage;
