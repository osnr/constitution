/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Surface = ReactART.Surface;

module.exports = React.createClass({
    render: function() {
        return (
            <Surface width="200" height="200">
                {this.props.children}
            </Surface>
        );
    }
});
