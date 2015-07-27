require('babel/register');
var React = require('react');
var Timeline = require( './widgets/timeline.jsx' );
var IdeaCollection = require('./data/idea').Collection;
window.datalayer = {};

var ideas = window.datalayer.ideas = new IdeaCollection();

var socket = window.socket = io.connect();

socket.on('ideas', function(data){
	window.datalayer.ideas.unshift(data)
});

var xhr = ideas.fetch();

xhr.done(function(data){console.log('Ideas loaded')});

React.render(<Timeline collection={ideas} />, document.getElementById('timeline') );


