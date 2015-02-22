/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Control = require('./control.jsx');
var Congresscritter = require('./congresscritter.jsx');

var Senate = React.createClass({
    getInitialState: function() {
        return { pointing: Control.NotPointing };
    },

    componentDidMount: function() {
        Control.register(this.props.ident, 'Senate', this);
    },

    render: function() {
        var senators = [];
        var row = 0;
        var col = 0;
        [this.props.model.class1, this.props.model.class2, this.props.model.class3].forEach(function(cl) {
            cl.forEach(function(senator) {
                if (col > 17) {
                    row += 1;
                    col = 0;
                }

                senators.push(<Congresscritter x={8+col*(5+2)} y={22+row*(5+3)} model={senator} />);
                col++;
            });
        });

        return (
            <Group {...this.props}
                   opacity={this.state.pointing != Control.Elsewhere ? 1 : 0.5}>
                <Rectangle width={140} height={40}
                           fill="#002768"></Rectangle>
                <Text x="5" y="5" fill="white" font="bold 10px Helvetica">
                    Senate
                </Text>
                {senators}
            </Group>
        );
    }
});
module.exports = Senate;
