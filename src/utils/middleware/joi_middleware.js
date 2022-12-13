import ValidationHelper from "../helpers/validation_helper.js";
import ResponseHelper from "../helpers/response_helper.js";
import MESSAGES from "../helpers/message_helper.js";
class JoiMiddleware {
  Middleware(req, res, next) {
    let route = req.route.path;
    let method = req.method.toLowerCase();

    let schema = ValidationHelper.Validate(route, method);// validation helper for joi validation 
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      let errors = error.details.map((curr) => {
        let o = {};
        Object.assign(o, { message: curr.message.replace(/[\,"]/g, ' '), path: curr.path.toString() });
        return o;
      })
      let payload = {
        message: MESSAGES.VALIDATION_ERROR,
        payload: errors
      }
      return ResponseHelper.error(res, payload);
    }
    next();
  }
}

export default new JoiMiddleware;