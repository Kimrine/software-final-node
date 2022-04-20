/**
 * @file Implements mongoose model to CRUD
 * documents in the images collection
 */
import mongoose from "mongoose";
import ImageSchema from "./ImageSchema";

const ImageModel = mongoose.model("ImageModel",ImageSchema);

export default ImageModel;