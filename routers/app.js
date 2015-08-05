import router from 'koa-router';
import User from '../models/User';

let appRouter = router();

var getUserMiddleware = function *(next){
	let user = yield User.findById(this.session.userId).exec();

	if(user){
		this.state.user = user;
		yield next;
	}else{
		this.flash = {error: 'Session expired'}
		this.redirect('/login');
	}
}

appRouter.get('/app', getUserMiddleware, function *() {
	yield this.render('app/main', {});
});

appRouter.get('/profile', getUserMiddleware, function *() {
	// this.body = this.state.user.toPrivateObject();
	yield this.render('app/profile', {});
});

export default appRouter;