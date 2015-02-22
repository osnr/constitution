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
            <Group {...this.props}>
                <Text y={this.props.centerY} font="10px Helvetica" fill="black"
                      onClick={this.handleClick}>
                    {'< Year ' + this.props.simulator.currentTime + '\n\n' +
                     '    Year ' + (this.props.simulator.currentTime + this.props.step) + ' >'}
                </Text>
                <Group x={60} opacity={0.6} onClick={()=>{alert('simulate')}}>
                    {React.Children.map(this.props.children, (item, i) => {
                        return React.addons.cloneWithProps(item, {
                            interact: this,
                            model: Simulator.narrowModel(item.type.displayName, this.props.simulator.peek(this.props.step))
                        });
                     })}
                </Group>
            </Group>
        );
    }
});
