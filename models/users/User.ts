/**
 * @file User data model
 */
import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";
import mongoose from "mongoose";

/**
 * @typedef User Represents users in Tuiter
 * @property {ObjectId} _id the unique id of user
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
export default interface User {
    _id?: mongoose.Schema.Types.ObjectId;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePhoto?: string;
    headerImage?: string;
    accountType: AccountType;
    maritalStatus: MaritalStatus;
    biography?: string;
    dateOfBirth?: Date;
    joined: Date;
    location?: Location;
    followings: number;
    followers: number;
}