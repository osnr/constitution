/* @flow */

var components = {};
module.exports = {
    register: function(ident: string, component: ReactComponent) {
        components[ident] = component;
    },

    point: function(ident: string): void {
        if (!components[ident]) throw "fail";

        components[ident].setState({ pointed: true });
    },

    unpoint: function(ident: string): void {
        if (!components[ident]) throw "fail";

        components[ident].setState({ pointed: false });
    }
};
