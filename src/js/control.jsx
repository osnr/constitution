/* @flow */

// sim
class NotPointing {}
class Elsewhere {}
class Here {}
type Pointing = NotPointing | Elsewhere | Here;

type Ident = string;
type Registry = { [key: Ident]: {
    kind: string;
    component: ReactComponent
}};

var registry: Registry = {};

module.exports = {
    NotPointing: NotPointing,
    Elsewhere: Elsewhere,
    Here: Here,

    register: function(ident: ?Ident, kind: string, component: ReactComponent) {
        if (!ident) {
            ident = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        registry[ident] = {
            kind: kind,
            component: component
        };
    },

    point: function(ident: string): void {
        if (!registry[ident]) throw "fail";

        for (var k in registry) {
            if (k == ident) {
                registry[k].component.setState({ pointing: Here });
            } else if (!k.startsWith(ident)) {
                registry[k].component.setState({ pointing: Elsewhere });
            }
        }
    },

    unpoint: function(ident: string): void {
        if (!registry[ident]) throw "fail";

        for (var k in registry) {
            registry[k].component.setState({ pointing: NotPointing });
        }
    },

    vote: function(interact: ReactComponent, stateName: string, choosing: string, seat: number,
                   vote: number) {
        if (choosing === 'house') {
            for (var k in registry) {
                if (registry[k].kind == 'Interact') {
                    var model = registry[k].component.state.simulator.currentModel;

                    model.states[stateName].houseVotes[seat] = vote;
                    registry[k].component.forceUpdate();
                }
            }

        } else if (choosing === 'senate') {
            for (var k in registry) {
                if (registry[k].kind == 'Interact') {
                    var model = registry[k].component.state.simulator.currentModel;

                    if (seat == 0) {
                        model.states[stateName].senateVotes1 = vote;
                    } else if (seat == 1) {
                        model.states[stateName].senateVotes2 = vote;
                    }
                    registry[k].component.forceUpdate();
                }
            }
        }
    },

    setPopulation: function(interact: ReactComponent, stateName: string, population: number) {
        for (var k in registry) {
            if (registry[k].kind == 'Interact') { // makin' this global in an ad-hoc way
                var sim = registry[k].component.state.simulator;

                sim.populateState(stateName, population);

                registry[k].component.forceUpdate();
            }
        }
    },

    step: function(interact: ReactComponent, n: number) {
        for (var i = 0; i < n; i++) {
            interact.state.simulator.step();
        }
        interact.setState({ model: interact.state.simulator.getModel() });
    },

    jump: function(interact: ReactComponent, t: number) {
        var currentTime = interact.state.simulator.currentTime;
        if (currentTime < t) {
            this.step(interact, t - currentTime);
        } else if (currentTime > t) {
            interact.setState({ model: interact.state.simulator.restore(t) });
        }
    }
};
