var Backbone = require('Backbone');

export let Model = Backbone.Model.extend({
	urlRoot:'/api/v1/user',
	idAttribute: '_id',
	refreshTokens: function () {
		let self = this;
		let url = this.urlRoot + '/refrest-api-credentials';
		let xhr = $.post(url);

		xhr.done(function(data){
			self.set(data);
		});

		return xhr;
	}
});