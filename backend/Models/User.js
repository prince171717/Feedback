import mongoose from "mongoose";

const UserShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum:["user","admin"],
    default:"user"
  }
});

const UserModel = mongoose.model("users", UserShema);

export default UserModel;
