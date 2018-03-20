import React from 'react';
import OpenSeadragon from 'openseadragon';
import { compose, withPropsOnChange, withState, lifecycle } from 'recompose';
import { SLIDE_IMAGE_ENDPOINT } from '@ncigdc/utils/constants';

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
  withState('imageParams', 'setImageParams', {}),
  withState('loadError', 'setLoadError', false),
  withState('boundsByImage', 'setBoundsByImage', {}),
  lifecycle({
    componentDidMount() {
      OpenSeadragon.setString('Tooltips.Home', 'Reset zoom');
      fetch(`${SLIDE_IMAGE_ENDPOINT}metadata/${this.props.imageId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.Format) {
            this.props.setLoadError(true);
          } else {
            this.props.setLoadError(false);
            this.props.setImageParams({
              height: data.Height,
              width: data.Width,
              overlap: data.Overlap,
              tileSize: data.TileSize,
            });
            this.props.setViewer(
              OpenSeadragon({
                id: 'osd1',
                prefixUrl:
                  'https://cdn.jsdelivr.net/npm/openseadragon@2.3/build/openseadragon/images/',
                defaultZoomLevel: 1,
                visibilityRatio: 1,
                minLevel: 0,
                maxLevel: 14,
                maxZoomLevel: 14,
                minZoomLevel: 1,
                showNavigator: true,
                tileSources: {
                  width: Number(data.Width),
                  height: Number(data.Height),
                  tileSize: Number(data.TileSize),
                  overlap: Number(data.Overlap),
                  getTileUrl: (level, x, y) => {
                    return `${SLIDE_IMAGE_ENDPOINT}${this.props
                      .imageId}?level=${level}&x=${x}&y=${y}`;
                  },
                },
              }),
            );
            reAddFullScreenHandler(this.props.viewer);
            this.props.setBoundsByImage({
              ...this.props.boundsByImage,
              [this.props.imageId]: this.props.viewer.viewport.getBounds(),
            });
            this.props.viewer.addHandler('open', () => {
              this.props.boundsByImage[this.props.imageId] &&
                this.props.viewer.viewport.fitBoundsWithConstraints(
                  this.props.boundsByImage[this.props.imageId],
                  true,
                );
            });
          }
        });
    },
    componentWillUnmount() {
      if (this.props.viewer) {
        this.props.viewer.removeAllHandlers(['open']);
      }
    },
  }),
  withPropsOnChange(
    (props, nextProps) => {
      if (props.imageId !== nextProps.imageId) {
        const { boundsByImage, setBoundsByImage, viewer } = props;
        viewer &&
          setBoundsByImage({
            ...boundsByImage,
            [props.imageId]: viewer.viewport.getBounds(),
          });
        return true;
      }
      return false;
    },
    ({
      viewer,
      boundsByImage,
      setBoundsByImage,
      imageId,
      setLoadError,
      setViewer,
      setImageParams,
    }) => ({
      anything: fetch(`${SLIDE_IMAGE_ENDPOINT}metadata/${imageId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.Format) {
            if (viewer) {
              viewer.destroy();
            }
            return setLoadError(true);
          }
          setImageParams({
            height: data.Height,
            width: data.Width,
            overlap: data.Overlap,
            tileSize: data.TileSize,
          });
          setLoadError(false);
        })
        .catch(error => console.log(error)),
    }),
  ),
  withPropsOnChange(
    ['imageParams'],
    ({
      imageParams: { height, width, overlap, tileSize },
      viewer,
      imageId,
    }) => {
      if (viewer) {
        viewer.open({
          height: Number(height),
          width: Number(width),
          tileSize: Number(tileSize),
          overlap: Number(overlap),
          getTileUrl: (level, x, y) => {
            return `${SLIDE_IMAGE_ENDPOINT}${imageId}?level=${level}&x=${x}&y=${y}`;
          },
        });
      }
    },
  ),
);

const ZoomableImage = enhance(props => {
  if (props.loadError) {
    return (
      <Row style={{ width: '100%', height: '550px', backgroundColor: 'white' }}>
        <div
          style={{
            marginLeft: '5rem',
            marginTop: '2rem',
            fontSize: 40,
            color: 'black',
          }}
        >
          <span>Image is not available</span>
        </div>
      </Row>
    );
  } else {
    return (
      <Row
        id="osd1"
        style={{ width: '100%', height: '550px', backgroundColor: '#000' }}
      />
    );
  }
});

export default ZoomableImage;
