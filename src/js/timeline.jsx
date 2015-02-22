/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Timeline = React.createClass({
    contextTypes: {
        interact: React.PropTypes.any.isRequired
    },

    render: function() {
        var notches = [];
        for (var i = 0; i < this.props.width / 25; i++) {
            notches.push(
                <Group x={i*25}>
                    <Rectangle y={10} height={10} width={1} fill="white" />
                    <Text x={-2} fill="black" font="normal 10px Helvetica">
                        {i.toString()}
                    </Text>
                </Group>
            );
        }

        if (this.props.preview) {
            notches.push(<Rectangle x={(this.props.simulator.currentTime + parseInt(this.props.preview))*25 - 1}
                                    y={10} height={10} width={2}
                                    fill="#555" />);
        }
        notches.push(<Rectangle x={parseInt(this.props.simulator.currentTime)*25 - 1}
                                y={10} height={10} width={3}
                                fill="black" />);

        return (
            <Group {...this.props}>
                <Rectangle y={10} height={10} width={this.props.width}
                           fill={"#d3d7cf"} />
                {notches}
            </Group>
        );
    }
});
module.exports = Timeline;
