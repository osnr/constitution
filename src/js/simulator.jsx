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

// agenda / action management
type Time = number;
type Action = (m: Model) => Model;

var currentTime: Time = 0;
var past: { [key: Time]: Model } = {};

var agenda: { [key: Time]: [Action] } = {};

// action methods


// do something after n years
var afterDelay = function(delay: Time, action: Action) {
    agenda[delay + currentTime].push(action);
};

var houseVote = function(m: Model): Model {
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

    afterDelay(2, houseVote);

    return ret;
};

var step = function(m: Model): Model {
    // update
    var actions: [Action] = agenda[currentTime];
    delete agenda[currentTime];

    currentTime += 1;

    var ret = m;
    actions.forEach(function(action) {
        ret = action(ret);
    });

    return ret;
};


