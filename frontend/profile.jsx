import { Model as UserModel } from './data/user'
import React from 'react'
import Profile from './widgets/profile.jsx'

/* Globals */
window.$ = require('jquery')
window.datalayer = {}

var user = window.datalayer.user = new UserModel()

window.datalayer.user.fetch()

React.render(<Profile model={user} />, document.getElementById('profile') )
