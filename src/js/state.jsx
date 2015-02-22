/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

module.exports = React.createClass({
    render: function() {
        return (
            <Rectangle x={60*this.props.col} y={60*this.props.row}
                       width={50} height={50}
                       fill="orange"></Rectangle>
        );
    }
});
