/* global io */
import React from 'react'
import Timeline from './widgets/timeline.jsx'
import { Collection as IdeaCollection } from './data/idea'

window.datalayer = {}
window.$ = require('jquery')

let ideas = window.datalayer.ideas = new IdeaCollection()

let socket = window.socket = io.connect()

socket.on('ideas', function (data) {
	window.datalayer.ideas.unshift(data)
})

let xhr = ideas.fetch()

xhr.done(function (data) {
	/* Ideas loaded */
})

React.render(<Timeline collection={ideas} />, document.getElementById('timeline'))
