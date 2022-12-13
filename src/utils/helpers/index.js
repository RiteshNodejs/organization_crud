import Response_helper from "./response_helper";
class Helper{
    error(res,data,statuscode=406){
        return Response_helper.error(res,data,statuscode)
    }
    success(res,data,statuscode=200){
        return Response_helper.success(res,data,statuscode)
    }

}
export default new Helper