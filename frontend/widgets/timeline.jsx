/* globals Backbone */
import React from 'react'
import {} from 'backbone-react-component'
import moment from 'moment'

import { Model as IdeaModel } from '../data/idea'

var TimelineItem = React.createClass({
	mixins: [Backbone.React.Component.mixin],
	removeHandler: function () {
		var model = this.getModel()

		model.destroy()
	},
	render: function () {
		let model = this.state.model
		let content = model.content.split('\n').map(function (line) {if (line) {return (<p>{line}</p>) } })
		let date = moment(model.date).fromNow(true)

		let userActions
		if (window.userId === model.user._id) {
			userActions = <div className="row">
				<div className="col-xs-12 text-right"><a href="#" onClick={this.removeHandler}>Remove</a></div>
			</div>
		}

		return (<div className="timeline-item">
			<div className="row">
				<div className="col-xs-12">
					<span className="name">{model.user.name}</span>
					<span> </span>
					<span className="text-muted timestamp" data-timestamp="{model.date}">{date}</span>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12">{content}</div>
			</div>
			{userActions}
		</div>)
	}
})

var Timeline = React.createClass({
	mixins: [Backbone.React.Component.mixin],
	getInitialState: function () {
		return {successButtonEnable: false}
	},
	textareaChangeHandler: function () {
		var value = this.refs.idea.getDOMNode().value

		if (value) {
			this.setState({successButtonEnable: true})
		} else {
			this.setState({successButtonEnable: false})
		}
	},
	addIdea: function () {
		var el = this.refs.idea.getDOMNode()
		var value = el.value

		var idea = new IdeaModel({content: value})
		el.value = ''
		idea.save()
	},
	render: function () {
		var successButton
		if (this.state.successButtonEnable) {
			successButton = (<button ref="successButton" className="btn btn-primary" type="button" onClick={this.addIdea}>
				Share
			</button>)
		} else {
			successButton = (<button ref="successButton" className="btn btn-primary" type="button" disabled="disabled" onClick={this.addIdea}>
				Share
			</button>)
		}

		var items = this.getCollection().map(function (model) {
			return (<TimelineItem model={model} />)
		})

		return (<div className="timeline">
			<div className="input-box">
				<div className="row">
					<div className="col-xs-12">
						<textarea ref="idea" onChange={this.textareaChangeHandler} placeholder="What's yout idea?"></textarea>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12 text-right">
						{successButton}
					</div>
				</div>
			</div>
			<div className="feed">
				{ items }
			</div>
		</div>)
	}
})

export default Timeline
