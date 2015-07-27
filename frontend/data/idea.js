var Backbone = require('Backbone');

export let Model = Backbone.Model.extend({
	urlRoot:'/api/v1/ideas',
	idAttribute: '_id'
});
export let Collection = Backbone.Collection.extend({
	model : Model,
	url:'/api/v1/ideas'
});