/* @flow */

var Control = require('./control.jsx');

var addons = require('react/addons');
var update = addons.update;

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

// helpers
var makeStates = function(data: {[key: string]: number}): StatesModel {
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

    var statesModel = {};
    for (var name in data) {
        statesModel[name] = makeState(name, data[name]);
    }

    return statesModel;
};

class Simulator {
    // model state
    currentTime: Time;

    history: { [key: Time]: Model };
    currentModel: Model;

    // agenda / action management
    agenda: { [key: Time]: [Action] };

    constructor() {
        this.currentTime = 0;
        this.history = {};
        this.agenda = {};

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
                if (senate.class1.length < 4) {
                    senate.class1.push(senator);

                } else if (senate.class2.length < 4) {
                    senate.class2.push(senator);

                } else {
                    senate.class3.push(senator);
                }
            };
            Object.keys(stateData).forEach(addSenatorFrom);
            senatorNum = 1;
            Object.keys(stateData).forEach(addSenatorFrom);

            var house = {};
            var addRepsFrom = function(stateName) {
                var houseSeats = Math.min(5, Math.ceil(stateData[stateName] / 60000)); // should be 30k but that's a lot of reps
                house[stateName] = [];

                for (var i = 0; i < houseSeats; i++) {
                    house[stateName].push({
                        party: states[stateName].houseVotes[i] > 0.5,
                        state: stateName
                    });
                }
            };
            Object.keys(stateData).forEach(addRepsFrom);

            return {
                congress: {
                    house: house,
                    senate: senate
                },
                states: states
            };
        })();
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
                updater[stateId][0] = {$set: {
                    party: state.houseVotes[0] > 0.5,
                    stateId: stateId
                }};
            }
            return update(house, updater);
        };

        var clearHouseVote = function(states: StatesModel) {
            var updater = {};
            for (var stateId in states) {
                var state = states[stateId];

                updater[stateId] = {houseVotes: {}};
                for (var i = 0; i < state.houseVotes.length; i++) {
                    updater[stateId].houseVotes[i] = {$set: []};
                };
            }
        };

        var ret = update(m, {$set: {
            states: clearHouseVote(m.states),
            congress: {house: electHouse(m.congress.house)}
        }});

        return [ret, new NextActions([[2, this.houseVote]])];
    }

    // see future without updating
    peek(): Model {
        var actions: [Action] = this.agenda[this.currentTime];

        var ret = this.currentModel;
        actions.forEach(function(action) {
            [ret,] = action(ret);
        });

        return ret;
    }

    step(): Model {
        // update
        var actions: [Action] = this.agenda[this.currentTime];

        var ret = this.currentModel;
        actions.forEach(function(action) {
            var nextActions: ?NextActions;
            [ret, nextActions] = action(ret);

            nextActions.next.forEach(function([delay, action]) {
                this.agenda[this.currentTime + delay] = action;
            });
        });

        this.currentTime += 1;

        this.history[this.currentTime] = ret;
        this.currentModel = ret;

        return ret;
    }

    getModel(): Model {
        return this.currentModel;
    }
}

module.exports = Simulator;
