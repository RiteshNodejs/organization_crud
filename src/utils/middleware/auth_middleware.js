import ResponseHelper from "../helpers/response_helper.js";
import jwt from "jsonwebtoken";

class AuthValidaton{
    Validattion(req, res, next)
    { 
        const header = req.headers.authorization;
        const token = header.replace("Bearer ", "")
        try {
            const decoded = jwt.verify(token, "mykey")
          
            req.user = decoded
        }
        catch (err) {
            let payload = {
                message: err.message,
                payload: {}
            }
            return ResponseHelper.error(res, payload, 401);
        }
        next();
    }
}

export default new AuthValidaton;