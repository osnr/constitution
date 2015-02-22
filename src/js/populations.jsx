/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');

var Population = React.createClass({
    contextTypes: {
        interact: React.PropTypes.any.isRequired
    },

    getInitialState: function() {
        return {
            mouseDown: null
        };
    },
    handleMouseDown: function(e) {
        // we will track the delta because react-art doesn't know anything about locations
        this.setState({ mouseDown: {
            pageX: e.pageX,
            pageY: e.pageY,
            population: this.props.model.population
        }});
    },
    handleMouseMove: function(e) {
        if (!this.state.mouseDown) return;

        var dy = e.pageY - this.state.mouseDown.pageY;
        Control.setPopulation(this.context.interact,
                              this.props.model.name,
                              this.state.mouseDown.population + (dy / (this.props.model.population/8000)));
    },
    handleMouseUp: function(e) {
        this.setState({ mouseDown: null });
    },

    render: function() {
        var height = this.props.model.population/8000;
        return (
            <Group {...this.props}

                   onMouseOver={() => {document.body.style.cursor = 'row-resize';}}
                   onMouseOut={() => {document.body.style.cursor = '';}}

                   onMouseDown={this.handleMouseDown}
                   onMouseMove={this.handleMouseMove}
                   onMouseUp={this.handleMouseUp}>
                <Rectangle width={100} height={height} fill="#e9b96e" />
                <Text x={5} y={height < 12 ? 0 : 5}
                      fill="black" font="10px Helvetica">
                    {this.props.model.name +
                     (height < 24 ?
                     '' : '\n' + Math.round(this.props.model.population).toLocaleString())}
                </Text>
                <Text x={105} y={height < 12 ? 0 : 5}
                      fill="black" font="10px Helvetica">
                    {Math.round(this.props.model.population/30000).toLocaleString()}
                </Text>
            </Group>
        );
    }
});

var Populations = React.createClass({
    render: function() {
        var pops = [];
        var bottom = 0;
        for (var stateName in this.props.model) {
            var state = this.props.model[stateName];

            pops.push(<Population model={state} x={20} y={bottom} />);

            bottom += state.population/8000 + 5;
        }

        return (
            <Group {...this.props}>
                {pops}
            </Group>
        );
    }
});
module.exports = Populations;
