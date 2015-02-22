/* @flow */

var React = require('react');

var ReactART = require('react-art');

var Surface = ReactART.Surface;

// each <Interact> root has its own instance of the simulation
module.exports = React.createClass({
    render: function() {
        return (
            <Surface {...this.props}>
                {this.props.children}
            </Surface>
        );
    }
});
