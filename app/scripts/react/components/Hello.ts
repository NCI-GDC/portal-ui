var HelloController = function( $scope ) {
  $scope.person = { fname: 'Clark', lname: 'Kent' };
}

var Hello = React.createClass( {
  propTypes: {
    fname: React.PropTypes.string.isRequired,
    lname: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.DOM.span( null,
      'Hello ' + this.props.fname + ' ' + this.props.lname
    );
  }
} );

angular
    .module( 'react.components.Hello', ['react'] )
    .controller('HelloController', HelloController)
    .value( "Hello", Hello )
    .directive('hello', function(reactDirective) {
        return reactDirective( Hello );
    });