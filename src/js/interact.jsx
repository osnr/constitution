/* @flow */

var React = require('react/addons');

var ReactART = require('react-art');
var Surface = ReactART.Surface;

var Simulator = require('./simulator.jsx');
var Control = require('./control.jsx');

// each <Interact> root has its own instance of the simulation
module.exports = React.createClass({
    childContextTypes: {
         interact: React.PropTypes.any.isRequired
    },

    getChildContext: function(): any {
         return { interact: this };
    },

    getInitialState: function() {
        var simulator = new Simulator();

        return {
            simulator: simulator,
            model: simulator.getModel()
        };
    },

    componentDidMount: function() {
        // register simulator/interact
        // so child components can tell Control stuff and we can propagate it down from here
        Control.register(null, 'Interact', this);
    },

    render: function() {
        return (
            <Surface {...this.props}>
                {React.Children.map(this.props.children, (item, i) => {
                    return React.addons.cloneWithProps(item, {
                        // not spposed to use these really
                        interact: this,
                        simulator: this.state.simulator,

                        model: Simulator.narrowModel(item.type.displayName, this.state.model)
                    });
                 })}
            </Surface>
        );
    }
});
