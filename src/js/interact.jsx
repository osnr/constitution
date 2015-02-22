/* @flow */

var React = require('react');

var ReactART = require('react-art');

var Surface = ReactART.Surface;

module.exports = React.createClass({
    render: function() {
        return (
            <Surface {...this.props}>
                {this.props.children}
            </Surface>
        );
    }
});
