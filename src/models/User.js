import mongoose from 'mongoose';

const collection = "Users";

const usersSchema = new mongoose.Schema({
    name:String,
    email:String,
    cartID:Number,
    address:String,
    age:Number,
    phone_number:Number,
    photo:String,
    password:String
})

const userService =  mongoose.model(collection,usersSchema);
export default userService;