import router from 'koa-router';
import User from '../models/User';

var baseRouter = router();

var getUserMiddleware = function *(next){
	let user = yield User.findById(this.session.userId).exec();

	this.state.user = user;
	yield next;
}

baseRouter.use(getUserMiddleware);

baseRouter.get('/', function *() {
	yield this.render('public/home');
});

baseRouter.get('/about', function *() {
	yield this.render('public/about');
});

export default baseRouter;