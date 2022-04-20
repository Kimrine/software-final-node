/**
 * @file Controller RESTful Web service API for images resource
 */
import {Request, Response, Express} from "express";
import ImageControllerI from "../interfaces/images/ImageControllerI";
import ImageDAO from "../daos/ImageDAO";
import Image from "../models/media/Image";

/**
 * @class ImageController Implements RESTful Web service API for images resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/tuits/:tid/images to retrieve all images in a tuit
 *     </li>
 *     <li>POST /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no longer likes a tuit</li>
 *     <li> DELETE /api/likes to delete all like instances
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing like CRUD operations
 * @property {ImageController} ImageController Singleton controller implementing
 * RESTful Web service API
 */
export default class ImageController implements ImageControllerI {

    private static imageDao: ImageDAO = ImageDAO.getInstance();
    private static imageController: ImageController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return ImageController
     */
    public static getInstance = (app: Express): ImageController => {

        if (ImageController.imageController === null) {
            ImageController.imageController = new ImageController();
            app.get("/api/images", ImageController.imageController.findAllImages);
            app.get("/api/tuits/:tid/images", ImageController.imageController.findAllImagesByTuit);
            app.get("/api/images/:pid", ImageController.imageController.findImageById);
            app.delete("/api/tuits/:tid/images", ImageController.imageController.deleteImagesByTuit);
            app.delete("/api/images/:pid", ImageController.imageController.deleteImageById);
            app.post("/api/tuits/:tid/images", ImageController.imageController.uploadImageForTuit);

        }

        return ImageController.imageController;

    }

    private constructor() {
    }

    findAllImagesByTuit = (req: Request, res: Response) =>
        ImageController.imageDao.findAllImagesByTuit(req.params.tid)
            .then(images => res.json(images));

    findImageById = (req: Request, res: Response) =>
        ImageController.imageDao.findImageById(req.params.pid)
            .then((image: Image) => res.json(image));

    deleteImageById = (req: Request, res: Response) =>
        ImageController.imageDao.deleteImageById(req.params.pid)
            .then((status) => res.json(status));

    deleteImagesByTuit = (req: Request, res: Response) =>
        ImageController.imageDao.deleteImagesByTuit(req.params.tid)
            .then((status) => res.json(status));

    findAllImages = (req: Request, res: Response) =>
        ImageController.imageDao.findAllImages()
            .then(images => res.json(images));

    uploadImageForTuit= (req: Request, res: Response) =>
        ImageController.imageDao.uploadImageForTuit(req.params.tid, req.body)
            .then(image => res.json(image));
    //TuitController.tuitDao.createTuitByUser(userId,req.body)
    //             .then((tuit)=>res.json(tuit));

};


