/* @flow */

var React = require('react');

var ReactART = require('react-art');
var Group = ReactART.Group;
var Text = ReactART.Text;
var Rectangle = require('./rectangle.jsx');

var Congresscritter = React.createClass({
    render: function() {
        return <Rectangle {...this.props} width={5} height={5}
                          fill={this.props.model.party ? "blue" : "red"} />
    }
});
module.exports = Congresscritter;
