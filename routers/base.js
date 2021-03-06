import router from 'koa-router'
import User from '../models/user'

var baseRouter = router()

var getUserMiddleware = function *(next) {
	if (!this.session.userId) {
		yield next
		return
	}

	let user = yield User.findById(this.session.userId).exec()

	this.state.user = user
	yield next
}

baseRouter.use(getUserMiddleware)

baseRouter.get('/', function *() {
	yield this.render('public/home')
})

baseRouter.get('/about', function *() {
	yield this.render('public/about')
})

export default baseRouter
