/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');

type Party = boolean;
type StateModel = {
    name: string;
    population: number;
    houseVotes: Array<Array<?Party>>;
    senateVotes1: Array<?Party>;
    senateVotes2: Array<?Party>;
};

var Voting = React.createClass({
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
            pageY: e.pageY,
            percent: this.props.vote
        }});
    },
    handleMouseMove: function(e) {
        if (!this.state.mouseDown) return;

        var dx = e.pageX - this.state.mouseDown.pageX;
        Control.vote(this.context.interact,
                     this.props.stateName, this.props.choosing, this.props.seat,
                     Math.max(0.01,
                              Math.min(0.99,
                                       this.state.mouseDown.percent +
                                       (dx / this.props.width))));
    },
    handleMouseUp: function(e) {
        this.setState({ mouseDown: null });
    },

    render: function() {
        return (
            <Group {...this.props}

                   onMouseOver={() => {document.body.style.cursor = 'col-resize';}}
                   onMouseOut={() => {document.body.style.cursor = '';}}

                   onMouseDown={this.handleMouseDown}
                   onMouseMove={this.handleMouseMove}
                   onMouseUp={this.handleMouseUp}>
                <Rectangle height={this.props.height} 
                           width={this.props.width*this.props.vote}
                           opacity={Math.min(1, Math.max(0.10, this.props.vote*1.2))}
                           fill={"#3465a4"} />
                <Rectangle x={this.props.width*this.props.vote}
                           height={this.props.height} 
                           width={this.props.width*(1-this.props.vote)}
                           opacity={Math.min(1, Math.max(0.10, (1-this.props.vote)*1.2))}
                           fill={"#cc0000"} />
            </Group>
        );
    }
});

module.exports = React.createClass({
    render: function() {
        var votings = [];
        if (this.props.choosing == 'house') {
            this.props.model.houseVotes.forEach((vote, i) => {
                votings.push(<Voting x={5} y={20+45*votings.length} width={60} height={40}
                                     stateName={this.props.model.name}
                                     vote={vote} seat={i} choosing="house"/>);
            });
        } else if (this.props.choosing == 'senate') {
            [this.props.model.senateVotes1,this.props.model.senateVotes2].forEach((vote, i) => {
                votings.push(<Voting x={5} y={20+30*votings.length} width={60} height={25}
                                     stateName={this.props.model.name}
                                     vote={vote} seat={i} choosing="senate"/>);
            });
        }

        return (
            <Group {...this.props}>
                <Rectangle width={70} height={60} />
                <Text x={5} y={5}
                      fill="black" font="10px Helvetica">
                    {this.props.model.name}
                </Text>
                {votings}
            </Group>
        );
    }
});
