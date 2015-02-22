/* @flow */

var React = require('react/addons');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Surface = ReactART.Surface;

var Simulator = require('./simulator.jsx');

module.exports = React.createClass({
    handleClick: function() {
        
    },

    render: function(): ?ReactElement {
        return (
            <Group>
                <Text y={this.props.height - 20} font="14pt Arial" fill="black"
                      onClick={this.handleClick}>
                    Next
                </Text>
                {React.Children.map(this.props.children, (item, i) => {
                    return React.addons.cloneWithProps(item, {
                        interact: this,
                        model: Simulator.narrowModel(item.type.displayName, this.props.simulator.peek())
                    });
                 })}
            </Group>
        );
    }
});
