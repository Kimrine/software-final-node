/**
 * @file Implements mongoose schema for tuits
 */
import mongoose, {Schema} from "mongoose";
import Tuit from "../../models/tuits/Tuit";



/**
 * @typedef Tuit Represents tuits
 * @property {string} tuit the content of tuit
 * @property {ObjectId} postedBy the User Id who post the tuit
 * @property {date} postedOn the post time of tuit
 */
const TuitSchema = new mongoose.Schema<Tuit>({

    tuit: {type: String, required: true},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
    postedOn: {type: Date, default: Date.now},
    stats: {
        replies: {type: Number, default: 0},
        retuits: {type: Number, default: 0},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0}
    },
    image: String,
    youtube: String
}, {collection: 'tuits'});

export default TuitSchema;