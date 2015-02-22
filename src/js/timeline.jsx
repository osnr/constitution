/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');

var Timeline = React.createClass({
    contextTypes: {
        interact: React.PropTypes.any.isRequired
    },

    getInitialState: function() {
        return { mouseDown: null };
    },    
    handleMouseDown: function(e) {
        // we will track the delta because react-art doesn't know anything about locations
        this.setState({ mouseDown: {
            pageX: e.pageX,
            time: this.props.simulator.currentTime
        }});
    },
    handleMouseMove: function(e) {
        if (!this.state.mouseDown) return;

        var dx = e.pageX - this.state.mouseDown.pageX;
        Control.jump(this.context.interact,
                     Math.min(this.props.width / 25,
                              Math.max(0, 
                                       Math.floor(this.state.mouseDown.time +
                                                  (dx / 25)))));
    },
    handleMouseUp: function(e) {
        this.setState({ mouseDown: null });
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
            <Group {...this.props}
                   onMouseDown={this.handleMouseDown}
                   onMouseMove={this.handleMouseMove}
                   onMouseUp={this.handleMouseUp}>
                <Rectangle y={10} height={10} width={this.props.width}
                           fill={"#d3d7cf"} />
                {notches}
            </Group>
        );
    }
});
module.exports = Timeline;
