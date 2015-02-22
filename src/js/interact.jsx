/* @flow */

var React = require('react/addons');

var ReactART = require('react-art');
var Surface = ReactART.Surface;

var Simulator = require('./simulator.jsx');

// model *****
type StateId = string;
type Party = boolean;
type Congresscritter = {
    party: Party;
    state: StateId // so we can reference back to state?
};

type SenateModel = {
    class1: Array<Congresscritter>;
    class2: Array<Congresscritter>;
    class3: Array<Congresscritter>;
};
type HouseModel = { [key: StateId]: Array<Congresscritter> };
type CongressModel = {
    senate: SenateModel;
    house: HouseModel;
};

type StateModel = {
    name: string;
    population: number;
    houseVotes: Array<Array<?Party>>;
    senateVotes1: Array<?Party>;
    senateVotes2: Array<?Party>;
};
type StatesModel = { [key: StateId]: StateModel };

type Model = {
    congress: CongressModel;
    states: StatesModel;
};

type Time = number;
type Action = (m: Model) => Model;
// *****

// drill into the top-level model and get what this component needs
var narrowModel = function(comp: ReactComponent, m: Model): StatesModel | CongressModel | HouseModel | SenateModel {

    return {
        'States': m.states,
        'Congress': m.congress,
        'House': m.congress.house,
        'Senate': m.congress.senate
    }[comp.type.displayName];
};

// each <Interact> root has its own instance of the simulation
module.exports = React.createClass({
    getInitialState: function() {
        var simulator = new Simulator();

        return {
            simulator: simulator,
            model: simulator.getModel()
        };
    },

    render: function() {
        return (
            <Surface {...this.props}>
                {React.Children.map(this.props.children, (item, i) => {
                    return React.addons.cloneWithProps(item, {
                        interact: this,
                        model: narrowModel(item, this.state.model)
                    });
                 })}
            </Surface>
        );
    }
});
