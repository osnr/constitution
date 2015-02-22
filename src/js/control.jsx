/* @flow */

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
            if (k == ident) {
                components[k].setState({ pointing: NotPointing });
            } else {
                components[k].setState({ pointing: NotPointing });
            }
        }
    }
};
