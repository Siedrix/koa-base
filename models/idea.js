import db from '../lib/db'
import { Schema } from 'mongoose'

let IdeaSchema =  new Schema({
	content: String,
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	date: { type: Date, default: Date.now }
})

IdeaSchema.post('save', function(doc) {
	doc.populate('user', function(){
		db.io.emit('ideas', doc.toJSON() );
	});
});

let Idea = db.model('Idea', IdeaSchema);

export default Idea;