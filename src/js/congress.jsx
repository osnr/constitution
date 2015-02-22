/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Rectangle = require('react-art/shapes/Rectangle');

var Control = require('./control.jsx');

var Senate = React.createClass({
    getInitialState: function() {
        return { pointed: false };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Rectangle {...this.props}
                       width={60} height={20}
                       stroke={this.state.pointed ? "black" : null}
                       fill="#002768"></Rectangle>
        );
    }
});

var House = React.createClass({
    getInitialState: function() {
        return { pointed: false };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Rectangle {...this.props}
                       width={60} height={40}
                       stroke={this.state.pointed ? "black" : null}
                       fill="#f6cf43"></Rectangle>
        );
    }
});

module.exports = React.createClass({
    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Group className="congress">
                <Senate ident={this.props.ident + '/senate'} />
                <House y="20" ident={this.props.ident + '/house'} />
            </Group>
        );
    }
});
