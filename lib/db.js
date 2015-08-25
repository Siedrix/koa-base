import mongoose from 'mongoose'
import env from '../env'

mongoose.connect(env.mongo.url)

export default mongoose
