import router from 'koa-router';
import User from '../../models/User';

let apiRouter = router();

apiRouter.use(function *(next){
	let user = yield User.findById(this.session.userId).exec();

	if(!user){return this.throw(403);}

	this.state.user = user;
	yield next;
})

import ideasRouter from './ideas';
apiRouter.use('/api/v1/ideas', ideasRouter.routes());

export default apiRouter;