/**
 * @file Implements mongoose schema for users
 */

import mongoose, {Schema} from "mongoose";
import User from "../../models/users/User";

/**
 * @typedef User Represents users who use Tuiter
 * @property {string} username the username of user account
 * @property {string} password the password of user account
 * @property {string} firstName the first name of user
 * @property {string} lastName the last name of user
 * @property {string} email the email of user
 * @property {string} profilePhoto the profile photo of user
 * @property {string} headerImage the header image of user
 * @property {string} accountType the account type of user: personal,academic or professional
 * @property {string} maritalStatus the marital status of user: married, single or widowed
 * @property {string} biography the biography of user
 * @property {date} dateOfBirth the birth date of user
 * @property {date} joined the time of user joined
 * @property {number} latitude the latitude of user location
 * @property {number} longitude the longitude of user location
 */
const UserSchema = new mongoose.Schema<User>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    email: {type: String, required: true},
    profilePhoto: String,
    headerImage: String,
    accountType: {
        type: String,
        enum: ['PERSONAL', 'ACADEMIC', 'PROFESSIONAL']
    },
    maritalStatus: {type: String, enum: ['MARRIED', 'SINGLE', 'WIDOWED']},
    biography: String,
    dateOfBirth: Date,
    joined: {type: Date, default: Date.now},
    location: {
        latitude: {type: Number},
        longitude: {type: Number}
    },
    followings:{type:Number , default:0},
    followers:{type:Number, default:0}

}, {collection: 'users'});

export default UserSchema;
