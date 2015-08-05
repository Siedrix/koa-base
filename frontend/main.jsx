import React from 'react'
import Timeline from './widgets/timeline.jsx'
import { Collection as IdeaCollection } from './data/idea'

window.datalayer = {};
window.$ = require('jquery');

var ideas = window.datalayer.ideas = new IdeaCollection();

var socket = window.socket = io.connect();

socket.on('ideas', function(data){
	window.datalayer.ideas.unshift(data)
});

var xhr = ideas.fetch();

xhr.done(function(data){/*'Ideas loaded'*/});

React.render(<Timeline collection={ideas} />, document.getElementById('timeline') );


