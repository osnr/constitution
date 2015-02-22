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

var renderState = function(model: StateModel, i: number): ReactElement {
    return <State x={60*(i % 3)} y={70*Math.floor(i / 3)} model={model} />;
};

var States = React.createClass({
    componentDidMount: function() {
        Control.register(this.props.ident, 'States', this);
    },

    render: function() {
        console.log(this.props.model);

        var stateComponents = [];
        var i = 0;
        for (var stateId in this.props.model) {
            stateComponents.push(renderState(this.props.model[stateId], i));
            i++;
        }

        return (
            <Group {...this.props}>
                {stateComponents}
            </Group>
        );
    }
});
module.exports = States;
