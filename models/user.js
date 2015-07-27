import db from '../lib/db'

let UserSchema = {
	name: String,
	password: String
}

let User = db.model('User', UserSchema)

export default User