import db from '../lib/db'
import { Schema } from 'mongoose'
import { v4 } from 'node-uuid'
import mongooseHidden from 'mongoose-hidden'
import _ from 'underscore'

let UserSchema =  new Schema({
	name: String,
	password: { type: String, hide: true },
	apiKey: { type: String, hide: true },
	apiToken: { type: String, hide: true },
})

UserSchema.plugin(mongooseHidden());

UserSchema.pre('save', function(next) {
	if(!this.apiKey){this.apiKey = v4();}
	if(!this.apiToken){this.apiToken = v4();}

	next();
});

UserSchema.methods.toPrivateObject = function(){
	let doc = _.extend({},this._doc);

	delete doc.__v;
	delete doc.password;

	return doc;
};

let User = db.model('User', UserSchema)

export default User