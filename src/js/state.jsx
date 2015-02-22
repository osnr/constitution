/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

type Party = boolean;
type StateModel = {
    name: string;
    population: number;
    houseVotes: Array<Array<?Party>>;
    senateVotes1: Array<?Party>;
    senateVotes2: Array<?Party>;
};

var Voting = React.createClass({
    getInitialState: function() {
        return { percent: 0.51 };
    },

    handleMouseDown: function(e) {
        console.log(e);
    },

    render: function() {
        return (
            <Group {...this.props}
                   onMouseDown={this.handleMouseDown}>
                <Rectangle height={6} width={12}
                           fill={this.state.vote ? "blue" : "red"} />
                <Rectangle y={6} height={6} width={12}
                           fill={this.state.vote ? "blue" : "red"} />
            </Group>
        );
    }
});

module.exports = React.createClass({
    render: function() {
        return (
            <Group {...this.props}>
                <Rectangle width={50} height={60}
                           fill="orange">
                </Rectangle>
                <Text fill="black" font="10px Helvetica">
                    {this.props.model.name}
                </Text>
                <Voting x={4} y={24} />
            </Group>
        );
    }
});
