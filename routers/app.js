import router from 'koa-router'
import User from '../models/user'

let appRouter = router()

var getUserMiddleware = function *(next) {
	if (!this.session.userId) {
		this.flash = {error: 'Session expired'}
		return this.redirect('/login')
	}

	let user = yield User.findById(this.session.userId).exec()

	if (user) {
		this.state.user = user
		yield next
	} else {
		this.flash = {error: 'Session expired'}
		this.redirect('/login')
	}
}

appRouter.get('/app', getUserMiddleware, function *() {
	yield this.render('app/main', {})
})

appRouter.get('/profile', getUserMiddleware, function *() {
	yield this.render('app/profile', {})
})

export default appRouter
