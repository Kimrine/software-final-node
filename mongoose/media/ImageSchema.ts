/**
 * @file Implements mongoose schema for Images
 */
import mongoose, {Schema} from "mongoose";
import Image from "../../models/media/Image";

/**
 * @typedef Image Represents Image
 * @property {ObjectId} attachedBy the id of Tuit
 * @property {String} src the link of image
 */
const ImageSchema = new mongoose.Schema<Image>({
    attachedBy: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    image: String
}, {collection: "images"});

export default ImageSchema;