import joi from "joi";
class ValidationHelper {
    Validate(route, method) {
        let obj = {}
        switch (method) {
            case 'get':
                obj = {
    
                    '/getalluser': userSchema,
                    '/user/get': userSchemaLogin
                }
                return obj[route];
                break;
            case 'post':
                obj = {
                    '/user/register': userSchema,
                    '/user/login': userSchemaLogin,
                    '/org/add':orgSchema
                }
                return obj[route]
                break;
            case 'put':
                obj = {
                    '/user/updateuser':updateuserSchema,
                  
                }
                return obj[route]
                break;
               
        }

    }
}
export default new ValidationHelper;
const userSchema = joi.object({
    firstName: joi.string().min(1).max(20).trim(true).required(),
    lastName: joi.string().min(1).max(20).trim(true).required(),
    userName:joi.string().required().min(1).max(20).required(),
    email: joi.string().email().min(2).max(50).trim(true).required(),
    password: joi.string().min(5).max(25).trim(true).required(),
    organization:joi.object({
        orgName:joi.string().min(1).max(20).required(),
        address:joi.object({
            addressLine1:joi.string().min(2).max(50).required(),
            addressLine2:joi.string().min(2).max(50).optional(),
        orgNo:joi.string().min(2).max(12).required(),
        city:joi.string().min(2).max(15).required(),
        state:joi.string().min(2).max(15).required(),
        country:joi.string().min(2).max(20).required(),
        zipCode:joi.string().min(2).max(6).required()
        }).optional()
        
    }).optional(),
});
const updateuserSchema =joi.object({
    firstName: joi.string().min(1).max(20).trim(true).optional(),
    lastName: joi.string().min(1).max(20).trim(true).optional(),
    userName:joi.string().required().min(1).max(20).required(),
    email: joi.string().email().min(2).max(50).trim(true).optional(),
    password: joi.string().min(5).max(25).trim(true).optional(),
    updatePassword:joi.boolean().optional()

});
const userSchemaLogin = joi.object({
    userName: joi.string().min(5).max(50).trim(true).required(),
    password: joi.string().min(5).max(25).trim(true).required()
});
const orgSchema=joi.object({
    orgName:joi.string().trim().min(2).max(100).required(),
    address:joi.object({
        addressLine1:joi.string().min(2).max(50).required(),
        addressLine2:joi.string().min(2).max(50).optional(),
        orgNo:joi.string().min(2).max(12).required(),
        city:joi.string().min(2).max(15).required(),
        state:joi.string().min(2).max(15).required(),
        country:joi.string().min(2).max(20).required(),
        zipCode:joi.string().min(2).max(6).required()
        }).optional()
  
})

const updateOrgschema=joi.object({
    orgName:joi.string().trim().min(2).max(100).required(),
    address:joi.object({
        orgNo:joi.string().min(2).max(12).required(),
        city:joi.string().min(2).max(15).required(),
        state:joi.string().min(2).max(15).required(),
        country:joi.string().min(2).max(20).required(),
        zipCode:joi.string().min(2).max(6).required()
        }).optional()
  
})
