/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return { pointing: Control.NotPointing };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Group {...this.props}
                   opacity={this.state.pointing != Control.Elsewhere ? 1 : 0.5}>
                <Rectangle {...this.props}
                           width={60} height={20}
                           fill="#002768"></Rectangle>
                <Text x="5" y="5" fill="white" font="normal 9pt Helvetica">
                    Senate
                </Text>
            </Group>
        );
    }
});
