/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');
var Congresscritter = require('./congresscritter.jsx');

var House = React.createClass({
    getInitialState: function() {
        return { pointing: Control.NotPointing };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, 'House', this);
    },

    render: function() {
        var reps = [];

        var row = 0;
        var col = 0;
        for (var stateId in this.props.model) {
            this.props.model[stateId].forEach(function(rep) {
                if (col > 17) {
                    row += 1;
                    col = 0;
                }

                reps.push(<Congresscritter x={8+col*(5+2)} y={22+row*(5+3)} model={rep} />);
                col++;
            });
        }

        return (
            <Group {...this.props}
                   opacity={this.state.pointing != Control.Elsewhere ? 1 : 0.5}>
                <Rectangle width={140} height={90}
                           fill="#f6cf43"></Rectangle>
                {reps}
                <Text x="5" y="5" fill="black" font="bold 10px Helvetica">
                    House of Representatives
                </Text>
            </Group>
        );
    }
});
module.exports = House;
