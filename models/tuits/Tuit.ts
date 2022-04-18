/**
 * @file Tuit data model
 */
import User from "../users/User";
import mongoose, {Schema, Types} from "mongoose";
import Stats from "./Stats";



/**
 * @typedef Tuit Represents tuits posted on Tuiter
 * @property {string} tuit the content of tuit
 * @property {User} postedBy User posted the tuit
 * @property {date} postedOn the post time of tuit
 */
export default interface Tuit {
     _id?: mongoose.Schema.Types.ObjectId;
    tuit: string;
    postedBy?: User;
    postedOn: Date;
    stats: Stats;
    image?: string;
    youtube?: string;
}