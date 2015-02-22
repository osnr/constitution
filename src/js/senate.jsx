/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');

var Senate = React.createClass({
    getInitialState: function() {
        return { pointing: Control.NotPointing };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, 'Senate', this);
    },

    render: function() {
        return (
            <Group {...this.props}
                   opacity={this.state.pointing != Control.Elsewhere ? 1 : 0.5}>
                <Rectangle {...this.props}
                           width={140} height={40}
                           fill="#002768"></Rectangle>
                <Text x="5" y="5" fill="white" font="bold 10px Helvetica">
                    Senate
                </Text>
            </Group>
        );
    }
});
module.exports = Senate;
