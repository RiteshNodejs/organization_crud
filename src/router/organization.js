import Helper from '../utils/helpers';
import MESSAGES from '../utils/helpers/message_helper';
import AuthValidaton from '../utils/middleware/auth_middleware';
import JoiMiddleware from '../utils/middleware/joi_middleware';
import OrganizationServices from '../services/organization_services';

const OrganizationRoute = (app) => {
    app.post('/org/add', [AuthValidaton.Validattion, JoiMiddleware.Middleware], OrganizationServices.addOrganization);
    app.get('/org/getall', OrganizationServices.getAlluserWithorganization);
    app.put('/org/getbyid/:id', AuthValidaton.Validattion, OrganizationServices.updateOrg)
    app.all('/org/*',(req,res)=>{
        let payload ={
            message:MESSAGES.SERVER_ERROR,
        }
        return Helper.error(res,payload)
    })
}

export default OrganizationRoute;