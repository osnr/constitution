/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var State = require('./state.jsx');

var renderState = function(name: string, i: number): ReactElement {
    return <State row={Math.floor(i / 3)} col={i % 3} name={name} />;
};

module.exports = React.createClass({
    render: function() {
        return (
            <Group {...this.props}>
                {[
                    "New Hampshire",
                    "Massachusetts",
                    "Rhode Island",
                    "Connecticut",
                    "New York",
                    "New Jersey",
                    "Pennsylvania",
                    "Delaware",
                    "Maryland",
                    "Virginia",
                    "North Carolina",
                    "South Carolina",
                    "Georgia"
                 ].map(renderState)}
            </Group>
        );
    }
});
