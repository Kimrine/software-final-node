/**
 * @file Controller RESTful Web service API for authentication resource
 */
import UserDao from "../daos/UserDao";
import {Request, Response, Express} from "express";
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @class AuthticationController Implements RESTful Web service API for authentication resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/auth/signup to sign up a new user
 *     </li>
 *      <li>POST /api/auth/profile to get the user from cookie
 *     </li>
 *     <li>POST /api/auth/logout to logout from current user
 *     </li>
 *     <li>POST /api/auth/login to login in
 *     </li>
 * </ul>
 * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
 */
const AuthticationController = (app:Express) => {

    const userDao: UserDao = UserDao.getInstance();

    /**
     * User sign up by new information
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * status of whether add a new user is successfully or a JSON object contains new user object
     */
    const signup = async (req: Request,res: Response) => {
        const newUser = req.body;
        const password = newUser.password;
        const hash = await bcrypt.hash(password,saltRounds);

        newUser.password = hash;

        const existingUser = await userDao.findUserByUsername(req.body.username);
        if(existingUser){
            //already sign up
            res.sendStatus(403);
            return;
        }else{
            const insertedUser = await userDao.createUser(newUser);
            insertedUser.password = "";
            // @ts-ignore
            req.session['profile'] = insertedUser;
            res.json(insertedUser);
        }

    }

    /**
     * Get current user information
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * status of whether get user's information is successfully or a JSON object contains a user object
     */
    const profile = (req:Request, res:Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if(profile){
            profile.password = "";
            res.json(profile);
        }else{
            res.sendStatus(403);
        }
    }

    /**
     * User logout
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * status of whether user logout successfully
     */
    const logout = (req:Request,res:Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

    /**
     * Existing user login in.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * status of whether user login in successfully or a JSON object contains a user object
     */
    const login = async (req:Request,res:Response) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await userDao.findUserByUsername(username);

        if(!existingUser){
            res.sendStatus(403);
            return;
        }

        const match = await bcrypt.compare(password,existingUser.password);

        if(match){
            existingUser.password = '*****';
            // @ts-ignore
            req.session['profile'] = existingUser;
            res.json(existingUser);
        }else{
            res.sendStatus(403);
        }
    }

    app.post("/api/auth/signup",signup);
    app.post("/api/auth/profile",profile);
    app.post("/api/auth/logout",logout);
    app.post("/api/auth/login",login);

}

export default AuthticationController;