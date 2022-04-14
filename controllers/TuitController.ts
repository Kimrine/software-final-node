/**
 * @file Controller RESTful Web service API for tuits resource
 */
import {Request, Response, Express} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/tuits/TuitControllerI";
import Tuit from "../models/tuits/Tuit";
import TuitService from "../services/tuitService";
import UserController from "./UserController";
import UserDao from "../daos/UserDao";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/tuits to create a new tuit instance for
 *     a given user</li>
 *     <li>GET /api/tuits to retrieve all the tuit instances</li>
 *     <li>GET /api/tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /api/users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>PUT /api/tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /api/tuits/:tid to remove a particular tuit instance</li>
 *     <li>DELETE /api/tuis to remove all tuit instances
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
export default class TuitController implements TuitControllerI {

    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tuitController: TuitController | null = null;
    private static tuitService: TuitService = TuitService.getInstance();


    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): TuitController => {
        if (TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();

            app.get("/api/tuits", TuitController.tuitController.findAllTuits);
            app.get("/api/users/:uid/tuits", TuitController.tuitController.findTuitByUser);
            app.get("/api/tuits/:tid", TuitController.tuitController.findTuitById);
            app.get("/api/tuits/:uid/followTuits", TuitController.tuitController.findTuitsByFollow);
            app.post("/api/users/:uid/tuits", TuitController.tuitController.createTuitByUser);
            app.put("/api/tuits/:tid", TuitController.tuitController.updateTuit);
            app.delete("/api/tuits/:tid", TuitController.tuitController.deleteTuit);
            app.delete("/api/tuits", TuitController.tuitController.deleteAllTuit);
            app.get("/api/users/:uid/media", TuitController.tuitController.findAllTuitsHaveMediasByUser)
        }
        return TuitController.tuitController;
    }


    private constructor() {
    }


    /**
     * Retrieves all tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTuits = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];

        if(profile){
            //if already login in
            const userId = profile._id;
            TuitController.tuitDao.findAllTuits()
                .then(async (tuits:Tuit[])=>{
                    const markedTuits = await TuitController.tuitService
                        .getTuitsForLikeDislikeByUser(userId,tuits);
                    res.json(markedTuits);
                })
        }else{
            //not login in
            TuitController.tuitDao.findAllTuits()
                .then((tuits: Tuit[]) => res.json(tuits));
        }
    }
    /**
     * Retrieves all tuits that posted by user's following and self from the database and returns
     * an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findTuitsByFollow = (req:Request,res:Response) => {

        // @ts-ignore
        const profile = req.session['profile'];
        if(profile){
            TuitController.tuitDao.findAllTuits()
                .then(async (tuits:Tuit[])=>{
                    const userId = profile._id;
                    const markedTuits = await TuitController.tuitService
                        .getTuitsForLikeDislikeByUser(userId,tuits);
                    const followTuits = await TuitController.tuitService
                        .getTuitsForFollow(userId,markedTuits);

                    res.json(followTuits);
                })
        }else{
            //not login in
            TuitController.tuitDao.findAllTuits()
                .then((tuits: Tuit[]) => res.json(tuits));
        }

    }


    /**
     * Retrieve a tuit from the database and return a tuit.
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the tuit ID
     */
    findTuitById = (req: Request, res: Response) =>
        TuitController.tuitDao.findTuitById(req.params.tid)
            .then((tuit: Tuit) => res.json(tuit));


    /**
     * Retrieves all tuits from the database for a particular user and returns
     * an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findTuitByUser = async (req: Request, res: Response) => {

        // @ts-ignore
        let userId = req.params.uid === req.session['profile'].username && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;

        let flag = false;
        // @ts-ignore
        if (req.params.uid === req.session['profile'].username) {
            flag = true;
        }
        const userDao = UserDao.getInstance()
        if (!flag) {
            let user = await userDao.findUserByUsername(userId);
            userId = user._id;
        }


        TuitController.tuitDao.findAllTuitsByUser(userId)
            .then(async (tuits: Tuit[]) => {
                const getTuits = await TuitController.tuitService
                    .getTuitsForLikeDislikeByUser(userId, tuits);
                res.json(getTuits)
            });
    }

    /**
     * Create a new tuit with given user.
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createTuitByUser = (req: Request, res: Response) => {

        // @ts-ignore
        let userId = req.params.uid === "my" &&req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;

        TuitController.tuitDao.createTuitByUser(userId,req.body)
            .then((tuit)=>res.json(tuit));

    }



    /**
     * Delete a tuit in database and returns status of delete.
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a tuit was successful or not
     */
    deleteTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.deleteTuit(req.params.tid)
            .then((status) => res.json(status));

    /**
     * Update a tuit in database and return status od update.
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be modified
     * @param {Response} res Represents response to client, including status
     * on whether updating a tuit was successful or not
     */
    updateTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.updateTuit(req.params.tid, req.body)
            .then((status) => res.json(status));


    /**
     * Delete all tuits in database and returns status of delete.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including status
     * on whether deleting tuits was successful or not
     */
    deleteAllTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.deleteAllTuit()
            .then((status) => res.json(status));


    findAllTuitsHaveMediasByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ? profile._id : uid;
        TuitController.tuitDao.findAllTuitsHaveMediasByUser(userId)
            .then(async (tuits: Tuit[]) => {
                const getTuits = await TuitController.tuitService
                    .getTuitsForLikeDislikeByUser(userId, tuits);
                res.json(getTuits)
            });

    }


}

