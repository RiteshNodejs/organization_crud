import  express  from "express";
const app =express();
import bodyparser from "body-parser";
import Route from "./router/routes";
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
import mongoose from 'mongoose';
import MESSAGES from "./utils/helpers/message_helper";

mongoose.connect('mongodb://localhost:27017/orguser').then(() => {
    console.log(MESSAGES.DB_SUCCESS)
}).catch((err) => {
    console.log(MESSAGES.DB_ERROR, err)
})
Route(app)
app.listen(3200)