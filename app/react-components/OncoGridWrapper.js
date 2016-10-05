const OncoGridWrapper = ({$scope}) => (
  <div>
    <div id="grid-div" />
    <button onClick={() => $scope.grid.removeDonors((d) => d.score === 0)}>Remove Clean Donors</button>
    <button onClick={() => $scope.grid.toggleGridLines()}>Grid</button>
    <button onClick={() => $scope.grid.toggleCrosshair()}>Crosshair Mode</button>
  </div>
);

export default OncoGridWrapper;