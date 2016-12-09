import { isFullScreen } from '../utils/fullscreen';

export const gridReducer = (gridState, action) => {
  const grid = action.grid;

  switch (action.type) {
    case 'toggleCrosshair':
      grid.toggleCrosshair();
      break;
    case 'toggleGridLines':
      grid.toggleGridLines();
      break;
    case 'toggleHeatmap':
      grid.toggleHeatmap();
      break;
    case 'reload':
      grid.reload();
      break;
    default:
  }

  return {
    ...gridState,
    heatMapMode: grid.heatMapMode,
    gridActive: grid.drawGridLines,
    crosshairMode: grid.crosshairMode,
    isFullScreen: isFullScreen(),
  };
};

export const initialGridState = {
  heatMapMode: false,
  gridActive: true,
  crosshairMode: false,
  isFullScreen: isFullScreen(),
};

export default {
  initialGridState,
  gridReducer,
};
