/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Transform = ReactART.Transform;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');
var Senate = require('./senate.jsx');
var House = require('./house.jsx');

module.exports = React.createClass({
    componentDidMount: function() {
        Control.register(this.props.ident, this);
    },

    render: function() {
        return (
            <Group>
                <Text x={0} y={25}
                      fill="black" font="normal 9pt Helvetica">
                    Congress
                </Text>
                <Text x={52} y={10}
                      fill="black" font="normal 40pt Helvetica Narrow">
                    &#123;
                </Text>
                <Group x={77}>
                    <Senate ident={this.props.ident + '/senate'} />
                    <House y={25} ident={this.props.ident + '/house'} />
                </Group>
            </Group>
        );
    }
});
