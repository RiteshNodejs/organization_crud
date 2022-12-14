import UserServices from '../services/user_services';
import AuthValidaton from '../utils/middleware/auth_middleware';
import JoiMiddleware from '../utils/middleware/joi_middleware';
import Helper from '../utils/helpers';

const UserRoute = (app) => {
    app.post('/user/register', JoiMiddleware.Middleware, UserServices.addUser);
    app.post('/user/login', JoiMiddleware.Middleware, UserServices.login);
    app.get('/user/getone', AuthValidaton.Validattion, UserServices.getProfile);
    app.put('/user/updateuser', [AuthValidaton.Validattion, JoiMiddleware.Middleware], UserServices.updateUser);
    app.all('/user/*',(req,res)=>{
        let payload ={
            message:MESSAGES.SERVER_ERROR,
        }
        return Helper.error(res,payload)

    })
}
export default UserRoute;