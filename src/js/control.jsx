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
            } else {
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
                if (registry[k].component == interact) {
                    var model = registry[k].component.state.simulator.currentModel;
                    model.states[stateName].houseVotes[seat] = vote;
                    registry[k].component.forceUpdate();
                }
            }
        }
    }
};
