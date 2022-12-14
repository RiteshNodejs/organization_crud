import OrganizationRoute from './organization';
import UserRoute from './user';

const Route = (app) => {
    UserRoute(app);
    OrganizationRoute(app);
}
export default Route;