import {Request,Response} from "express";
import Bookmark from "../../models/bookmarks/Bookmark";

export default interface ImageControllerI{

    findAllImages(req: Request, res: Response):void;

    findAllImagesByTuit(req: Request, res: Response): void;

    findImageById(req: Request, res: Response):void;

    deleteImagesByTuit(req: Request, res: Response):void;

    deleteImageById(req: Request, res: Response):void;

    uploadImageForTuit(req: Request, res: Response):void;

}