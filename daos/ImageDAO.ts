/**
 * @file Implements DAO managing data storage of images. Uses mongoose ImageModel
 * to integrate with MongoDB
 */
import ImageDAOI from "../interfaces/images/ImageDAOI";
import ImageModel from "../mongoose/media/ImageModel";
import Image from "../models/media/Image";
import TuitModel from "../mongoose/tuits/TuitModel";

/**
 * @class ImageDAO Implements Data Access Object managing data storage
 * of Likes
 * @property {ImageDAO} ImageDAO private single instance of ImageDAO
 */
export default class ImageDAO implements ImageDAOI {
    private static ImageDAO: ImageDAO | null = null;

    /**
     * Creates singleton DAO instance
     * @returns ImageDAO
     */
    public static getInstance = (): ImageDAO => {
        if (ImageDAO.ImageDAO === null) {
            ImageDAO.ImageDAO = new ImageDAO();
        }
        return ImageDAO.ImageDAO;
    }

    private constructor() {
    }

    uploadImageForTuit= async (tid: string, image: Image): Promise<Image> =>
        ImageModel.create({...image, attachedBy: tid});

    deleteImageById = async (pid: string): Promise<any> =>
        ImageModel.deleteOne({_id: pid});

    deleteImagesByTuit = async (tid: string): Promise<any> =>
        ImageModel.deleteMany({attachedBy: tid});

    findAllImagesByTuit = async (tid: string): Promise<any> =>
        ImageModel.find({attachedBy: tid})
            .populate("attachedBy")
            .exec();

    findImageById = async (pid: string): Promise<any> =>
        ImageModel.findById(pid).exec();

    findAllImages = async (): Promise<Image[]> =>
        ImageModel.find();



}




