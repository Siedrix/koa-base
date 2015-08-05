import router from 'koa-router';
import Idea from '../../models/idea';

let userRouter = router();

userRouter.get('/', function* (){
	let user = this.state.user;
	
	this.body = user.toPrivateObject();
});

userRouter.post('/refrest-api-credentials', function* (){
	let user = this.state.user;

	user.apiKey = null;
	user.apiToken = null;

	yield user.save();

	this.body = {
		apiKey: user.apiKey,
		apiToken: user.apiToken
	}
});

export default userRouter;
