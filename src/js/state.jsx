/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Voter = React.createClass({
    getInitialState: function() {
        return { vote: true };
    },

    handleClick: function() {
        this.setState({ vote: !this.state.vote });
    },

    render: function() {
        return (
            <Rectangle onClick={this.handleClick}
                       {...this.props} height={12} width={12}
                       fill={this.state.vote ? "blue" : "red"} />
        );
    }
});

module.exports = React.createClass({
    render: function() {
        var voters = [];
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                voters.push(<Voter x={x*15} y={y*15} />);
            }
        }

        return (
            <Group x={60*this.props.col} y={60*this.props.row}>
                <Rectangle width={50} height={50}
                           fill="orange">
                </Rectangle>
                <Group x={4} y={4}>
                    {voters}
                </Group>
            </Group>
        );
    }
});
