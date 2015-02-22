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

var Congress = React.createClass({
    componentDidMount: function() {
        Control.register(this.props.ident, 'Congress', this);
    },

    render: function() {
        return (
            <Group>
                <Text x={0} y={62}
                      fill="black" font="bold 10px Helvetica">
                    Congress
                </Text>
                <Text x={58} y={12}
                      transform={new Transform().transform(1, 0, 0, 3.5)}
                      fill="black" font="normal 30pt Helvetica">
                    &#123;
                </Text>
                <Group x={77}>
                    <Senate model={this.props.model.senate} ident={this.props.ident + '/senate'} />
                    <House y={50} model={this.props.model.house} ident={this.props.ident + '/house'} />
                </Group>
            </Group>
        );
    }
});
module.exports = Congress;
