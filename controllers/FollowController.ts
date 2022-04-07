/**
 * @file Controller RESTful Web service API for follows resource
 */
import FollowControllerI from "../interfaces/follows/FollowControllerI";
import FollowDao from "../daos/FollowDao";
import {Express, Request, Response} from "express";
import UserDao from "../daos/UserDao";
import UserService from "../services/userService";

/**
 * @class FollowController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/followings to retrieve all the users followed by given user
 *     </li>
 *     <li>GET /api/users/:uid/followers to retrieve all the users that followed given user
 *     </li>
 *     <li>Get /api/follows to retrieve all the follows
 *     </li>
 *     <li>POST /api/users/:uid1/follows/:uid2 to record that user follows another user
 *     </li>
 *     <li>DELETE /api/users/:uid1/unfollows/:uid2 to record that a user
 *     no longer follows another user</li>
 *     <li> DELETE /api/users/:uid1/removesfollower/:uid2 to record that a user remove another user
 *     from his follwers
 *     * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing follow CRUD operations
 * @property {FollowController} followController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {

    private static followDao: FollowDao = FollowDao.getInstance();
    private static userDao: UserDao = UserDao.getInstance();
    private static userSerive: UserService = UserService.getInstance();
    private static followController: FollowController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return FollowController
     */
    public static getInstance = (app: Express): FollowController => {

        if (FollowController.followController === null) {
            FollowController.followController = new FollowController();

            app.get("/api/users/:uid/followings", FollowController.followController.findAllUsersThatUserFollowing);
            app.get("/api/users/:uid/followers", FollowController.followController.findAllUsersThatFollowingUser);
            app.get("/api/follows", FollowController.followController.findAllFollow);

            app.post("/api/users/:uid1/follows/:uid2", FollowController.followController.userFollowsUser);
            app.delete("/api/users/:uid1/unfollows/:uid2", FollowController.followController.userUnfollowsUser);
            app.delete("/api/users/:uid1/removesFollower/:uid2", FollowController.followController.userRemoveFollower);
            app.put("/api/users/:uid1/follows/:uid2",FollowController.followController.userTogglesUserFollows);
        }

        return FollowController.followController;

    }

    private constructor() {
    }

    /**
     * Retrieves all follows from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects
     */
    findAllFollow = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollow()
            .then(follows => res.json(follows));


    /**
     * Retrieves all users that following user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid identifying the foreign key userFollowed of follow to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the users objects
     */
    findAllUsersThatFollowingUser = async (req: Request, res: Response) => {

        let username = req.params.uid;
        let user = await FollowController.userDao.findUserByUsername(username);
        let uid = user._id;
        // @ts-ignore
        let curUid = req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;

        FollowController.followDao.findAllUsersThatFollowingUser(uid)
            .then(async follows => {
                const followersNonNullUser = follows.filter(follow => follow.userFollowing);
                const userFromFollowers = followersNonNullUser.map(follow => follow.userFollowing);
                const getTuits = await FollowController.userSerive
                    .getAllUserFollowing(curUid,userFromFollowers);
                res.json(getTuits)
            });

    }



    /**
     * Retrieves all users that be followed by user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid identifying the foreign key userFollowing of follow to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the users objects
     */
    findAllUsersThatUserFollowing = async (req: Request, res: Response) => {

        let username = req.params.uid;
        let user = await FollowController.userDao.findUserByUsername(username);
        let uid = user._id;
        // @ts-ignore
        let curUid = req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;


        FollowController.followDao.findAllUsersThatUserFollowing(uid)
            .then(async follows => {
                const followingNonNullUser = follows.filter(follow => follow.userFollowed);
                const userFromFollowing = followingNonNullUser.map(follow => follow.userFollowed);
                const getTuits = await FollowController.userSerive
                    .getAllUserFollowing(curUid, userFromFollowing);
                res.json(getTuits)
            });


    }


    /**
     * Create a new follow with given two users.
     * @param {Request} req Represents request from client, including the
     * path parameters uid1 and uid2 representing the user1 that is following the user2
     * and the user2 being followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new follow that was inserted in the
     * database
     */
    userFollowsUser = (req: Request, res: Response) =>
        FollowController.followDao.userFollowsUser(req.params.uid1, req.params.uid2)
            .then(follow => res.json(follow));

    /**
     * Delete a follow in database and returns status of delete.
     * @param {Request} req Represents request from client, including the
     * path parameters uid1 and uid2 representing the user1 that is unfollowing
     * the user2 and the user2 being unfollowed
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userUnfollowsUser = (req: Request, res: Response) =>
        FollowController.followDao.userUnfollowsUser(req.params.uid1, req.params.uid2)
            .then(status => res.json(status));

    /**
     * Delete a follow in database and returns status of delete.
     * @param {Request} req Represents request from client, including the
     * path parameters uid1 and uid2 representing the user1 that is removing user2
     * from followers and the user2 doesn't follow user1 any more
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userRemoveFollower = (req: Request, res: Response) =>
        FollowController.followDao.userRemoveFollower(req.params.uid1, req.params.uid2)
            .then(status => res.json(status));


    /**
     *
     * User follow or unfollow a user
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userTogglesUserFollows = async (req:Request,res:Response) => {

        const followDao = FollowController.followDao;
        const userDao = FollowController.userDao;

        const uid1 = req.params.uid1;
        const uid2 = req.params.uid2;

        try{
            const userAlreadyFollowedUser = await followDao.findUserFollowUser(uid1,uid2);
            const howManyFollowing = await followDao.countHowManyFollowings(uid1);
            const howManyFollowers = await followDao.countHowManyFollowers(uid2);
            const user1 = await userDao.findUserById(uid1);
            const user2 = await userDao.findUserById(uid2);

            if(userAlreadyFollowedUser){
                await followDao.userUnfollowsUser(uid1,uid2);
                user1.followings = howManyFollowing - 1;
                user2.followers = howManyFollowers - 1;

            }else{
                await followDao.userFollowsUser(uid1,uid2);
                user1.followings = howManyFollowing + 1;
                user2.followers = howManyFollowers + 1;
            }

            await userDao.updateUser(uid1,user1);
            await userDao.updateUser(uid2,user2);
            res.sendStatus(200);

        }catch (e){
            res.sendStatus(404);
        }
    }
}

