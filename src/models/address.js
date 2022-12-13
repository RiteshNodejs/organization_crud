import mongoose from "mongoose";
import { Schema } from "mongoose";

export const addressSchema= new Schema ({
  _id:false,
    orgNo: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country:{
        type: String,
        required: true,
    },
    zipcode : {
        type: String,
        required: true,
      }
})




