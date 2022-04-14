import Image from "../../models/media/Image";


export default interface ImageDaoI {
    findAllImages():Promise<Image[]>;

    findAllImagesByTuit(tid:string): Promise<Image[]>;

    findImageById(pid:string): Promise<Image>;

    deleteImagesByTuit(tid: string):Promise<any>;

    deleteImageById(pid: string):Promise<any>;

    uploadImageForTuit(tid: string, image: Image):Promise<Image>;

}