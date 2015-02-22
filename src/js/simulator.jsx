/* @flow */

var Control = require('./control.jsx');

var React = require('react/addons');
var update = React.addons.update;

objectAssign = require('object-assign');

// model
type StateId = string;
type Vote = number;
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
    houseVotes: Array<Vote>;
    senateVotes1: Vote;
    senateVotes2: Vote;
};
type StatesModel = { [key: StateId]: StateModel };

type Model = {
    congress: CongressModel;
    states: StatesModel;
};

type Time = number;

class NextActions {
    next: Array<[Time, Action]>;
    constructor(next: typeof NextActions.next) {
        this.next = next;
    }
}
type Action = (m: Model) => [Model, NextActions];
type Agenda = { [key: Time]: Array<Action> };

// helpers
var makeState = function(name: string, population: number): StateModel {
    var houseSeats = Math.min(5, Math.ceil(population / 60000)); // HACK
    var houseVotes = [];
    for (var i = 0; i < houseSeats; i++) {
        houseVotes.push(Math.random());
    }

    return {
        name: name,
        population: population,
        houseVotes: houseVotes,
        senateVotes1: Math.random(),
        senateVotes2: Math.random()
    };
};

var makeStates = function(data: {[key: string]: number}): StatesModel {
    var statesModel = {};
    for (var name in data) {
        statesModel[name] = makeState(name, data[name]);
    }

    return statesModel;
};

var addRepsFrom = function(stateName, states: StatesModel, house: HouseModel) {
    var houseSeats = Math.min(5, Math.ceil(states[stateName].population / 60000)); // should be 30k but that's a lot of reps
    house[stateName] = [];

    for (var i = 0; i < houseSeats; i++) {
        house[stateName].push({
            party: states[stateName].houseVotes[i] > 0.5,
            state: stateName
        });
    }
};

class Simulator {
    // model state
    currentTime: Time;

    history: { [key: Time]: [Model, Agenda] };
    currentModel: Model;

    // agenda / action management
    agenda: Agenda;

    constructor() {
        this.currentTime = 0;
        this.history = {};
        this.agenda = {};
        this.agenda[2] = [this.houseVote.bind(this)];

        this.currentModel = (function() {
            var stateData = {
                "New Hampshire": 142000,
                "Massachusetts": 475000,
                "Rhode Island": 69000,
                "Connecticut": 238000,
                "New York": 340000,
                "New Jersey": 184000,
                "Pennsylvania": 434000,
                "Delaware": 60000,
                "Maryland": 320000,
                "Virginia": 821000,
                "North Carolina": 429000,
                "South Carolina": 250000,
                "Georgia": 83000
            };
            var states = makeStates(stateData);

            var senate = {
                class1: [],
                class2: [],
                class3: []
            };
            var senatorNum = 0; // HACK
            var addSenatorFrom = function(stateName) {
                var senator: Congresscritter = {
                    party: senatorNum == 0 ?
                        states[stateName].senateVotes1 > 0.5 : 
                        states[stateName].senateVotes2 > 0.5,
                    state: stateName
                };

                // HACK hardcoded sizes
                if (senate.class1.length < 8) {
                    senate.class1.push(senator);

                } else if (senate.class2.length < 8) {
                    senate.class2.push(senator);

                } else {
                    senate.class3.push(senator);
                }
            };
            Object.keys(stateData).forEach(addSenatorFrom);
            senatorNum = 1;
            Object.keys(stateData).forEach(addSenatorFrom);

            var house = {};
            Object.keys(stateData).forEach((stateName) => addRepsFrom(stateName, states, house));

            return {
                congress: {
                    house: house,
                    senate: senate
                },
                states: states
            };
        })();
    }

    // HACK outsiders might call this, and it nukes a lot of stuff
    // (also just a useful utility method)
    populateState(stateId: string, population: number): void {
        this.currentModel.states[stateId] = makeState(stateId, population);
        addRepsFrom(stateId, this.currentModel.states, this.currentModel.congress.house);
    }

    // do something after n years
    afterDelay(delay: Time, action: Action): void {
        this.agenda[delay + this.currentTime].push(action);
    };

    // actions. these are pure functions!
    houseVote(m: Model): [Model, NextActions] {
        var electHouse = function(house: HouseModel): HouseModel {
            var updater = {};

            var votes: { [key: Party]: number } = {};

            for (var stateId in m.states) {
                var state: StateModel = m.states[stateId];

                updater[stateId] = {};
                for (var seat = 0; seat < state.houseVotes.length; seat++) {
                    updater[stateId][seat] = {$set: {
                        party: state.houseVotes[seat] > 0.5,
                        stateId: stateId
                    }};
                }
            }
            return update(house, updater);
        };

        var ret = update(m, {
            congress: {house: {$set: electHouse(m.congress.house)}}
        });

        return [ret, new NextActions([[2, this.houseVote.bind(this)]])];
    }

    // see future without updating
    peek(n: number = 1): Model {
        var tempAgenda = {};

        for (var t = this.currentTime + 1; t <= this.currentTime + n; t++) {
            var actions: [Action] = (this.agenda[t] || []).concat(tempAgenda[t] || []);

            var ret = this.currentModel;
            if (actions) {
                actions.forEach(function(action) {
                    var nextActions: ?NextActions;
                    [ret, nextActions] = action(ret);

                    nextActions.next.forEach(function([delay, action]) {
                        tempAgenda[t + delay] = tempAgenda[t + delay] || [];
                        tempAgenda[t + delay].push(action);
                    });
                });
            }
        }

        return ret;
    }

    step(): Model {
        this.history[this.currentTime] = [
            JSON.parse(JSON.stringify(this.currentModel)), // hack
            objectAssign({}, this.agenda)
        ];

        // update
        var actions: [Action] = this.agenda[this.currentTime];

        var ret = this.currentModel;
        (actions || []).forEach((action) => {
            var nextActions: ?NextActions;
            [ret, nextActions] = action(ret);

            nextActions.next.forEach(function([delay, action]) {
                this.agenda[this.currentTime + delay] = this.agenda[this.currentTime + delay] || [];
                this.agenda[this.currentTime + delay].push(action);
            }.bind(this));
        });

        this.currentTime += 1;

        this.currentModel = ret;

        return ret;
    }

    restore(t: Time): Model {
        this.history[this.currentTime] = [
            JSON.parse(JSON.stringify(this.currentModel)), // HACK!!!
            objectAssign({}, this.agenda)
        ];

        this.currentTime = t;
        var snapshot = this.history[t];
        this.currentModel = snapshot[0];
        this.agenda = snapshot[1];

        return this.currentModel;
    }

    getModel(): Model {
        return this.currentModel;
    }

    // drill into the top-level model and get what this component needs
    static narrowModel(kind: string, m: Model): StatesModel | CongressModel | HouseModel | SenateModel {
        return {
            'States': m.states,
            'Congress': m.congress,
            'House': m.congress.house,
            'Senate': m.congress.senate,
            'Populations': m.states
        }[kind];
    }
}

module.exports = Simulator;
