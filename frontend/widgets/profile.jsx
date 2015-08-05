import React from 'react'
import Backbone from 'Backbone'
import {} from 'backbone-react-component'
import _ from 'underscore'

var Profile = React.createClass({
	mixins: [Backbone.React.Component.mixin],
	refreshTokens: function () {
		let user = this.getModel()
		let xhr = user.refreshTokens()

		xhr.done(function () {})
		xhr.fail(function () {})
	},
	render: function () {
		if ( _.isEmpty(this.state.model) ) {
			return (<div className="profile"><div className="loading">Loading...</div></div>)
		}

		let user = this.state.model

		return (<div className="profile">
			<h4>Hi {user.name}</h4>
			<p>Use this credentials to make api request</p>
			<h5>Api key:</h5>
			<code>{user.apiKey}</code>
			<h5>Api token:</h5>
			<code>{user.apiToken}</code>
			<div className="spacer"></div>
			<p>
				<button className="btn btn-primary" onClick={this.refreshTokens}>Create new tokens</button>
			</p>
		</div>)
	}
})

export default Profile
