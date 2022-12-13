import UserServices from '../services/user_services';
import AuthValidaton from '../utils/middleware/auth_middleware';
import joi_middleware from '../utils/middleware/joi_middleware';
import JoiMiddleware from '../utils/middleware/joi_middleware';

const Route = (app) => {
    app.post('/user/register', JoiMiddleware.Middleware, UserServices.addUser);
    app.post('/user/login', JoiMiddleware.Middleware, UserServices.login);
    app.get('/getorg', AuthValidaton.Validattion, UserServices.getProfile);
    app.post('/organization/add', [AuthValidaton.Validattion, JoiMiddleware.Middleware], UserServices.addOrganization);
    app.put('/user/updateuser', [AuthValidaton.Validattion, JoiMiddleware.Middleware], UserServices.updateUser);
    app.get('/allorg', UserServices.getAlluserWithorganization);
    app.put('/org/:id', AuthValidaton.Validattion, UserServices.updateOrg)
}
export default Route;