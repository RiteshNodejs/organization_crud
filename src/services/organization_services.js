import user from "../models/user";
import Helper from "../utils/helpers/index";
import organization from "../models/organization";
import joi from "joi";
import MESSAGES from "../utils/helpers/message_helper";
class OrganizationServices {
  async addOrganization(req, res) {
    try {
      const idUser = req.user._id;
      let attribute = {
        orgName: req.body.orgName,
        address: req.body.address,
        userId: idUser,
        isActive: true,
      };
      let myorganization = new organization(attribute);

      await myorganization
        .save()
        .then(async (value) => {
          const updateOrg = await organization.updateMany(
            { userId: req.user._id, _id: { $ne: value._id } },
            { isActive: false }
          );

          console.log(updateOrg);
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
        return Helper.error(res, resPayload, 500);
      }
      const updateOrgschema = joi.object({
        orgName: joi.string().trim().min(2).max(50).required(),
        address: joi
          .object({
            orgNo: joi.string().min(2).max(12).required(),
            city: joi.string().min(2).max(15).required(),
            state: joi.string().min(2).max(15).required(),
            country: joi.string().min(2).max(20).required(),
            zipCode: joi.string().min(2).max(6).required(),
          })
          .optional(),
      });
      const { error } = updateOrgschema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        let Validation_error = error.details.map((err) => {
          let userError = {};
          Object.assign(userError, {
            message: err.message.replace(/[\,"]/g, " "),
            path: err.path.toString(),
          });
          return userError;
        });
        let payload = {
          message: MESSAGES.VALIDATION_ERROR,
          payload: Validation_error,
        };
        return Helper.error(res, payload);
      }

      const findOrganization = await organization
        .findByIdAndUpdate(
          req.params.id,
          { ...req.body, isActive: true },
          { new: true }
        )
        .then(async (value) => {
          const updateOrg = await organization.updateMany(
            { userId: req.user._id, _id: { $ne: value._id } },
            { isActive: false }
          );
          let resPayload = {
            message: MESSAGES.UPDATED_SUCCESS,
            payload: value,
          };
          return Helper.success(res, resPayload);
        })
        .catch((err) => {
          let resPayload = {
            message: MESSAGES.UPDATED_ERROR,
            payload: err,
          };
          return Helper.error(res, resPayload, 500);
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

export default new OrganizationServices;
