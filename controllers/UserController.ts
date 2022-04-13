/**
 * @file Controller RESTful Web service API for users resource
 */
import {Request, Response, Express} from "express";
import UserDao from "../daos/UserDao";
import UserControllerI from "../interfaces/users/UserControllerI";
import User from "../models/users/User";
import UserService from "../services/userService";

/**
 * @class UserController Implements RESTful Web service API for users resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users to create a new user instance</li>
 *     <li>GET /api/users to retrieve all the user instances</li>
 *     <li>GET /api/users/:uid to retrieve an individual user instance </li>
 *     <li></li>
 *     <li>PUT /api/users to modify an individual user instance </li>
 *     <li>DELETE /api/users/:uid to remove a particular user instance</li>
 *     <li>DELETE /api/users to remove all users</li>
 * </ul>
 * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
 * @property {UserController} userController Singleton controller implementing
 * RESTful Web service API
 */
export default class UserController implements UserControllerI {

    private static userDao: UserDao = UserDao.getInstance();
    private static userService: UserService = UserService.getInstance();
    private static userController: UserController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @returns UserController
     */
    public static getInstance = (app:Express): UserController =>{
        if(UserController.userController === null){
            UserController.userController = new UserController();

            app.get("/api/users",
                UserController.userController.findAllUsers);
            app.get("/api/users/:uid",
                UserController.userController.findUserById);
            app.get("/api/users/username/:username",
                UserController.userController.findUserByUsername);
            app.post("/api/users",
                UserController.userController.createUser);
            app.put("/api/users/:uid",
                UserController.userController.updateUser);
            app.delete("/api/users/:uid",
                UserController.userController.deleteUser);
            app.delete("/api/users",
                UserController.userController.deleteAllUsers);
            app.get("/api/users/username/:username/delete",
                UserController.userController.deleteUsersByUsername);

        }
        return UserController.userController;

    }


    private constructor() {}


    /**
     * Retrieves all users from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsers = (req: Request, res: Response) =>
        UserController.userDao.findAllUsers()
            .then((users:User[]) => res.json(users));

    /**
     * Retrieves the user by their primary key
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying the primary key of the user to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the user that matches the user ID
     */
    findUserById = (req: Request, res: Response) =>
        UserController.userDao.findUserById(req.params.uid)
            .then((user:User) => res.json(user));

    /**
     * Retrieves the user by their username
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying the primary key of the user to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the user that matches the user ID
     */
    findUserByUsername = async (req: Request, res: Response) => {

        // @ts-ignore
        let username = req.params.username === req.session['profile'].username && req.session['profile'] ?
            // @ts-ignore
            req.session['profile'].username : req.params.username;

        let flag = true;
        // @ts-ignore
        if (req.params.username === req.session['profile'].username && req.session['profile']) {
            flag = false;
        }

        // @ts-ignore
        let uid1 = req.session['profile']._id;

        UserController.userDao.findUserByUsername(username)
            .then(async (user: User) => {

                if (flag) {
                    console.log(uid1+" : "+user);
                    const newUser = await UserController.userService
                        .getSingleFollowedUser(uid1,user);

                    res.json(newUser);
                } else {
                    res.json(user);
                }

            });
    }


    /**
     * Creates a new user instance
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new user to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new user that was inserted in the
     * database
     */
    createUser = (req: Request, res: Response) =>
        UserController.userDao.createUser(req.body)
            .then((user:User) => res.json(user));

    /**
     * Modifies an existing user instance
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying the primary key of the user to be modified
     * @param {Response} res Represents response to client, including status
     * on whether updating a user was successful or not
     */
    updateUser = async (req: Request, res: Response) => {

        let newUser = req.body;

        const user = await UserController.userDao.findUserById(newUser._id);
        newUser = {...newUser,password: user.password};


        let update = await UserController.userDao.updateUser(newUser._id,newUser);
        let updatedUser = await UserController.userDao.findUserById(newUser._id);
        // @ts-ignore
        req.session[`profile`] = updatedUser;
        // @ts-ignore
        res.json(updatedUser);
    }


    /**
     * Removes a user instance from the database
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying the primary key of the user to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a user was successful or not
     */
    deleteUser = (req: Request, res: Response) =>
        UserController.userDao.deleteUser(req.params.uid)
            .then((status) => res.send(status));

    /**
     * Removes all user instances from the database. Useful for testing
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including status
     * on whether deleting all users was successful or not
     */
    deleteAllUsers = (req: Request, res: Response) =>
        UserController.userDao.deleteAllUsers()
            .then((status)=>res.send(status))

    /**
     * Removes user instances from the database by username. Useful for testing
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including status
     * on whether deleting user was successful or not
     */
    deleteUsersByUsername = (req: Request, res: Response) =>
        UserController.userDao.deleteUsersByUsername(req.params.username)
            .then(status => res.send(status));




}