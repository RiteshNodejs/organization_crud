import user from "../models/user";
import Helper from "../utils/helpers/index";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import organization from "../models/organization";
import Helpers from "../utils/helpers/index";
import joi from "joi";
import MESSAGES from "../utils/helpers/message_helper";
class UserServices {
    async addUser(req, res) {
        try {
            //check userName is existed 
            const extUser = await user.findOne({ userName: req.body.userName });
            if (extUser) {
                let resPayload = {
                    message: MESSAGES.USER_NAME_ERROR
                };
                return Helper.error(res, resPayload)
            }
            let myUser = new user(req.body);
            if (req.body.organization) {
                let org = {
                    orgName: req.body.organization.orgName,
                    address: req.body.organization.address,
                    userId: myUser._id,
                };
                let myorganization = new organization(org);
                await myorganization.save();
            }
            await myUser.save().then((value) => {
                console.log(value);
                let resPayload = {
                    message: MESSAGES.REGISTER_SUCCESS,
                    payload: value.details,
                };
                return Helper.success(res, resPayload);
            })
                .catch((err) => {
                    let resPayload = {
                        message: MESSAGES.REGISTER_ERROR,
                        payload: {},
                    };
                    return Helper.error(res, resPayload);
                });
        } catch (err) {
            let resPayload = {
                message: MESSAGES.SERVER_ERROR,
                payload: {},
            };
            return Helper.error(res, resPayload, 500);
        }
    }
    async login(req, res) {
        {
            //check user is a valid user or not
            const extUser = await user.findOne({ userName: req.body.userName });
            if (!extUser) {
                let resPayload = {
                    message: MESSAGES.LOGIN_ERROR,
                    payload: {},
                };
                return Helper.error(res, resPayload);
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                extUser.password
            );
            if (!validPassword) {
                let resPayload = {
                    message: MESSAGES.LOGIN_ERROR,
                    payload: {},
                };
                return Helper.error(res, resPayload);
            }
            // genrate jwt token
            const token = jwt.sign({ _id: extUser._id }, "mykey", {
                expiresIn: "6000s",
            });
            let resPayload = {
                message: MESSAGES.LOGIN_SUCCESS,
                payload: { token: token },
            };
            return Helper.success(res, resPayload);
        }
    }
    async getProfile(req, res) {
        try {
            const idUser = req.user._id;
            const getUser = await user.findById(idUser);
            const findOrganization = await organization.find(
                { userId: idUser },
                { _id: 0, orgName: 1 }
            );
            console.log(getUser);
            const finalUser = {
                userName: getUser.userName,
                email: getUser.email,
                organization: findOrganization,
            };
            let resPayload = {
                message: MESSAGES.PROFILE,
                payload: finalUser,
            };
            return Helper.success(res, resPayload);
        } catch (err) {
            let resPayload = {
                message: MESSAGES.SERVER_ERROR,
                payload: {},
            };
            return Helper.error(res, resPayload, 500);
        }
    }
    async addOrganization(req, res) {
        try {
            const idUser = req.user._id;
            let attribute = {
                orgName: req.body.orgName,
                address: req.body.address,
                userId: idUser,
            };
            let myorganization = new organization(attribute);
            await myorganization.save().then((value) => {
                let resPayload = {
                    message: MESSAGES.ORG_SUCCESS,
                    payload: value.orgName,
                };
                return Helper.success(res, resPayload);
            })
                .catch((err) => {
                    let resPayload = {
                        message: err,
                        payload: {},
                    };
                    return Helper.error(res, resPayload);
                });
        } catch (err) {
            let resPayload = {
                message: MESSAGES.SERVER_ERROR,
                payload: {},
            };
            return Helper.error(res, resPayload, 500);
        }
    }
    async updateUser(req, res) {
        try {
            const idUser = req.user._id;
            const findIdforPwd = await user.findById({ _id: idUser });
            //check updatepassword flag is true or false
            if (req.body.password) {
                if (findIdforPwd.updatePassword === false) {
                    let resPayload = {
                        message: MESSAGES.PWD_CHANGE_ERROR,
                    };
                    return Helper.error(res, resPayload);
                }
            }
            const extUser = await user
                .findOne({ userName: req.body.userName, _id: { $ne: idUser } })
                .lean();
            //$ne selects the documents where the value of the field is not equal to the specified value. This includes documents that do not contain the field.
            //   if(extUser.id!=idUser) ->also working

            if (extUser) {
                let resPayload = {
                    message: MESSAGES.EMAIL_EXIST,
                };
                return Helper.error(res, resPayload);
            }
            const updatedUser = await user
                .findByIdAndUpdate(idUser, req.body, { new: true })

            let resPayload = {
                message: MESSAGES.UPDATED_SUCCESS,
                payload: updatedUser.userName,
            };
            return Helper.success(res, resPayload);

        } catch {
            let resPayload = {
                message: MESSAGES.SERVER_ERROR,
                payload: {},
            };
            return Helper.error(res, resPayload, 500);
        }
    }
    async getAlluserWithorganization(req, res) {
        const allusers = await user.aggregate([
            {
                $lookup: {
                    from: "organizations",
                    localField: "_id",
                    foreignField: "userId",
                    as: "organization",
                },
            },
            {
                $project: {
                    _id: 0,
                    by: "$userName",
                    organization: {
                        orgName: 1,
                        address: 1,
                    },
                },
            },
        ]);
        let resPayload = {
            message: MESSAGES.GET_ALL_ORG,
            payload: allusers,
        };
        Helper.success(res, resPayload);
    }
    async updateOrg(req, res) {
        try {
            const idUser = req.user._id;
            const findusersOrg = await organization.findById({ _id: req.params.id });
            if (findusersOrg.userId != idUser) {
                let resPayload = {
                    message: MESSAGES.NO_RECORDS,
                };
                return Helpers.error(res, resPayload, 500);
            }
            const updateOrgschema = joi.object({
                orgName: joi.string().trim().min(2).max(50).required(),
                address: joi.object({
                    orgNo: joi.string().min(2).max(12).required(),
                    city: joi.string().min(2).max(15).required(),
                    state: joi.string().min(2).max(15).required(),
                    country: joi.string().min(2).max(20).required(),
                    zipCode: joi.string().min(2).max(6).required(),
                }).optional(),
            });
            const { error } = updateOrgschema.validate(req.body, { abortEarly: false, });
            if (error) {
                let Validation_error = error.details.map((err) => {
                    let userError = {};
                    Object.assign(userError,
                        {
                            message: err.message.replace(/[\,"]/g, " "),
                            path: err.path.toString(),
                        });
                    return userError;
                });
                let payload = {
                    message: MESSAGES.VALIDATION_ERROR,
                    payload: Validation_error,
                };
                return Helpers.error(res, payload);
            }
            const findOrganization = await organization.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((value) => {
                let resPayload = {
                    message: MESSAGES.UPDATED_SUCCESS,
                    payload: value,
                };
                return Helper.success(res, resPayload);
            })
                .catch((err) => {
                    let resPayload = {
                        message: MESSAGES.UPDATED_ERROR,
                        payload: err
                    };
                    return Helpers.error(res, resPayload, 500);
                });
        } catch {
            let resPayload = {
                message: MESSAGES.SERVER_ERROR,
                payload: {},
            };
            return Helper.error(res, resPayload, 500);
        }
    }
}

export default new UserServices();
