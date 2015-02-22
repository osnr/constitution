/* @flow */

// model
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

// sim
var Simulator = require('./simulator.jsx');

class NotPointing {}
class Elsewhere {}
class Here {}
type Pointing = NotPointing | Elsewhere | Here;

var components = {};
module.exports = {
    NotPointing: NotPointing,
    Elsewhere: Elsewhere,
    Here: Here,

    register: function(ident: string, component: ReactComponent) {
        components[ident] = component;
    },

    point: function(ident: string): void {
        if (!components[ident]) throw "fail";

        for (var k in components) {
            if (k == ident) {
                components[k].setState({ pointing: Here });
            } else {
                components[k].setState({ pointing: Elsewhere });
            }
        }
    },

    unpoint: function(ident: string): void {
        if (!components[ident]) throw "fail";

        for (var k in components) {
            components[k].setState({ pointing: NotPointing });
        }
    },

    update: function(m: Model) {
        
    }
};
