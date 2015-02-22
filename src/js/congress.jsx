/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('react-art/shapes/Rectangle');

var Control = require('./control.jsx');

var Senate = React.createClass({
    getInitialState: function() {
        return { pointing: Control.NotPointing };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Rectangle {...this.props}
                       width={60} height={20}
                       opacity={this.state.pointing != Control.Elsewhere ? 1 : 0.5}
                       fill="#002768"></Rectangle>
        );
    }
});

var House = React.createClass({
    getInitialState: function() {
        return { pointing: Control.NotPointing };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Group>
                <Rectangle {...this.props}
                           width={60} height={40}
                           opacity={this.state.pointing != Control.Elsewhere ? 1 : 0.5}
                           fill="#f6cf43"></Rectangle>
            </Group>
        );
    }
});

module.exports = React.createClass({
    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Group>
                <Text x="0" y="25"
                      fill="black" font="normal 9pt Helvetica">
                    Congress
                </Text>
                <Text x="52" y="10"
                      fill="black" font="normal 40pt Helvetica Narrow">
                    &#123;
                </Text>
                <Group x="77">
                    <Senate ident={this.props.ident + '/senate'} />
                    <House y="20" ident={this.props.ident + '/house'} />
                </Group>
            </Group>
        );
    }
});
