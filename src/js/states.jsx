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

var Control = require('./control.jsx');
var State = require('./state.jsx');

var values = function(obj: any) {
    var ret = [];
    Object.keys(obj).forEach(function(k) {
        ret.push(obj[k]);
    });
    return ret;
}

var renderState = function(model: StateModel, y: number, col: number): ReactElement {
    return <State x={80*col} y={y} model={model} />;
};

var States = React.createClass({
    componentDidMount: function() {
        Control.register(this.props.ident, 'States', this);
    },

    render: function() {
        var stateComponents = [];

        var row = 0, col = 0, top = 0, bottom = 0;
        values(this.props.model).forEach(function(state, i, states) {
            bottom = Math.max(bottom, state.houseVotes.length * 50);

            stateComponents.push(renderState(state, top, col));

            col += 1;
            if (col > 6) {
                col = 0;
                row += 1;

                top = bottom;
                bottom = top + 80;
            }
        });

        return (
            <Group {...this.props}>
                {stateComponents}
            </Group>
        );
    }
});
module.exports = States;
