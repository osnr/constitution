/* @flow */

var Control = require('./control.jsx');

var addons = require('react/addons');
var update = addons.update;

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

type Time = number;
type Action = (m: Model) => Model;

// helpers
var makeStates = function(data: {[key: string]: number}): StatesModel {
    var makeState = function(name: string, population: number): StateModel {
        var houseSeats = Math.ceil(population / 30000);
        var houseVotes = [];
        for (var i = 0; i < houseSeats; i++) {
            houseVotes.push([null, null, null]);
        }

        return {
            name: name,
            population: population,
            houseVotes: houseVotes,
            senateVotes1: [null, null, null],
            senateVotes2: [null, null, null]
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
                "New Hampshire": 30000,
                "Massachusetts": 30000,
                "Rhode Island": 30000,
                "Connecticut": 30000,
                "New York": 30000,
                "New Jersey": 30000,
                "Pennsylvania": 30000,
                "Delaware": 30000,
                "Maryland": 30000,
                "Virginia": 30000,
                "North Carolina": 30000,
                "South Carolina": 30000,
                "Georgia": 30000
            };
            var states = makeStates(stateData);

            var senate = {
                class1: [],
                class2: [],
                class3: []
            };
            var addSenatorFrom = function(stateName) {
                var senator: Congresscritter = {
                    party: (Math.random() > 0.5) ? true : false,
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
            Object.keys(stateData).forEach(addSenatorFrom);

            var house = {};
            var addRepsFrom = function(stateName) {
                var houseSeats = Math.ceil(stateData[stateName] / 30000);
                house[stateName] = [];

                for (var i = 0; i < houseSeats; i++) {
                    house[stateName].push({
                        party: (Math.random() > 0.5) ? true : false,
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

    // action methods


    // do something after n years
    afterDelay(delay: Time, action: Action): void {
        this.agenda[delay + this.currentTime].push(action);
    };

    houseVote(m: Model): Model {
        var electHouse = function(house: HouseModel): HouseModel {
            var updater = {};

            var votes: { [key: Party]: number } = {};

            for (var stateId in m.states) {
                var state: StateModel = m.states[stateId];

                for (var i = 0; i < state.houseVotes[0].length; i++) {
                    var party = state.houseVotes[0][i];

                    if (party in votes) {
                        votes[party] += 1;
                    } else {
                        votes[party] = 0;
                    }
                }

                var winnerVotes: number = 0;
                var winner: Party = m.congress.house[stateId][0];
                for (var party in votes) {
                    if (votes[party] > winnerVotes) {
                        winner = party;
                        winnerVotes = votes[party];
                    }
                }

                updater[stateId] = {};
                updater[stateId][0] = {$set: {
                    party: winner,
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

        this.afterDelay(2, this.houseVote);

        return ret;
    }

    step(): Model {
        // update
        var actions: [Action] = this.agenda[this.currentTime];

        this.currentTime += 1;

        var ret = this.currentModel;
        actions.forEach(function(action) {
            ret = action(ret);
        });

        this.history[this.currentTime] = ret;
        this.currentModel = ret;

        return ret;
    }

    getModel(): Model {
        return this.currentModel;
    }
}

module.exports = Simulator;
