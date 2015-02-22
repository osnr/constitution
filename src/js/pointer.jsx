/* @flow */

var React = require('react');

var Control = require('./control.jsx');

module.exports = React.createClass({
    handleMouseEnter: function() {
        Control.point(this.props.ident);
    },

    handleMouseLeave: function() {
        Control.unpoint(this.props.ident);
    },

    render: function(): ?ReactElement {
        return (
            <a onMouseEnter={this.handleMouseEnter}
               onMouseLeave={this.handleMouseLeave}
               className="pointer">
                {this.props.children}
            </a>
        );
    }
});
