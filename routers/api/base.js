import router from 'koa-router'
import User from '../../models/user'

let apiRouter = router()

apiRouter.use(function *(next) {
	let user

	if (this.request.headers.authorization) {
		let authorizationHeader = this.request.headers.authorization.split(' ')

		if (authorizationHeader.length === 2 && authorizationHeader[0] === 'ApiKey') {
			let keys = authorizationHeader[1].split(':')

			user = yield User.findOne({apiKey: keys[0], apiToken: keys[1]}).exec()
		}
	}

	if (this.session.userId) {
		user = yield User.findById(this.session.userId).exec()
	}

	if (!user) {return this.throw(403)}

	this.state.user = user
	yield next
})

import ideasRouter from './ideas'
apiRouter.use('/api/v1/ideas', ideasRouter.routes())

import userRouter from './user'
apiRouter.use('/api/v1/user', userRouter.routes())

export default apiRouter
