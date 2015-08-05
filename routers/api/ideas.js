import router from 'koa-router';
import Idea from '../../models/idea';

let ideasRouter = router();

ideasRouter.get('/', function* (){
	let ideas = yield Idea.find({})
	.sort('-date')
	.populate('user')
	.exec();

	this.body = ideas.map(function(item){return item.toJSON()});
});

ideasRouter.post('/', function* (){
	let idea = yield Idea.create({
		content: this.request.body.content,
		user: this.state.user._id
	});

	this.body = idea.toJSON();
});

ideasRouter.get('/:id', function* (){
	let idea = yield Idea.findOne({_id:this.params.id}).exec();

	if(!idea){return this.throw(404);}

	this.body = idea.toJSON();
});

ideasRouter.put('/:id', function* (){
	let idea = yield Idea.findOne({_id:this.params.id})
	.populate('user')
	.exec();

	if( !idea ){return this.throw(404);}
	if( !idea.user._id.equals(this.state.user._id) ){return this.throw(403);}

	idea.set('content', this.request.body.content);

	yield idea.save();

	this.body = idea.toJSON();
});

ideasRouter.del('/:id', function* (){
	let idea = yield Idea.findOne({_id:this.params.id})
	.populate('user')
	.exec();

	if( !idea ){return this.throw(404);}
	if( !idea.user._id.equals(this.state.user._id) ){return this.throw(403);}

	yield idea.remove();

	this.body = {sucess:true};
});

export default ideasRouter;