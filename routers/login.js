import router from 'koa-router'
import User from '../models/User'
import bcrypt from 'bcrypt'
import Bluebird from 'bluebird'

var hash = function (toHash) {
	var q = new Bluebird(function (resolve, reject) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) { return reject(err) }

			bcrypt.hash(toHash, salt, function (err, hash) {
				if (err) { return reject(err) }
				resolve(hash)
			})
		})
	})

	return q
}

var compare = function (password, hash) {
	var q = new Bluebird(function (resolve, reject) {
		bcrypt.compare(password, hash, function (err, res) {
			if (err) { return reject(err) }

			resolve(res)
		})
	})

	return q
}

let logInRouter = router()

logInRouter.use(function *(next) {
	if (!this.session.userId) {
		yield next
		return
	}

	let user = yield User.findById(this.session.userId).exec()

	if (user) {
		return this.redirect('/app')
	}

	yield next
})

logInRouter.get('/login', function *() {
	let error = this.flash.error

	yield this.render('public/login', {
		hideLogin: true,
		error: error
	})
})

logInRouter.post('/login', function *() {
	let user = yield User.findOne({name: this.request.body.username}).exec()

	if (!user) {
		this.flash = {error: 'Invalid user combination.'}
		return this.redirect('/login')
	}

	let result = yield compare(this.request.body.password, user.password)

	if (!result) {
		this.flash = {error: 'Invalid user/password combination.'}
		return this.redirect('/login')
	}

	this.session.userId = user._id
	this.redirect('/app')
})

logInRouter.get('/signup', function *() {
	let error = this.flash.error

	yield this.render('public/signup', {
		hideLogin: true,
		error: error
	})
})

logInRouter.post('/signup', function *() {
	let user = yield User.findOne({name: this.request.body.username}).exec()

	if (user) {
		this.flash = {error: 'User already exists.'}
		this.redirect('/signup')
		return
	}

	let bcryptedPassword = yield hash(this.request.body.password)

	let newUser = yield User.create({
		name: this.request.body.username,
		password: bcryptedPassword
	})

	this.session.userId = newUser._id
	this.redirect('/app')
})

logInRouter.get('/logout', function *() {
	this.session = null
	this.redirect('/')
})

export default logInRouter
