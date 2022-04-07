/**
 * @file User service for helping get specific data
 */

import User from "../models/users/User";
import FollowDao from "../daos/FollowDao";
import UserController from "../controllers/UserController";
import UserDao from "../daos/UserDao";

export default class UserService{

    public static userService: UserService | null = null;
    private static followDao: FollowDao = FollowDao.getInstance();
    private static userDao: UserDao = UserDao.getInstance();

    /**
     * Creates singleton service instance
     * @return UserService
     */
    public static getInstance = () : UserService => {
        if(UserService.userService===null){
            UserService.userService = new UserService();
        }

        return UserService.userService;
    }

    private constructor() {
    }

    getSingleFollowedUser = async (uid1:any,user:any): Promise<any> =>{

        let isFollow = null;
        if(user!==null){
            isFollow = await UserService.followDao.findUserFollowUser(uid1,user._id);
        }

        let newUser = user.toObject();

        if(isFollow){
            newUser = {...newUser, followedByMe:true};
        }else{
            newUser = {...newUser, followedByMe:false};
        }

        return newUser;

    }

    getAllUserFollowing = async (uid1:any,users:User[]): Promise<any[]> => {

        let findFollowsPromises: any[] = [];
        users.forEach((user:any)=>{
            let findFollowsPromise = UserService.followDao.findUserFollowUser(uid1, user._id);
            findFollowsPromises.push(findFollowsPromise);

        })

        const followUsers = await Promise.all(findFollowsPromises);

        const userIds = followUsers.map((u)=>{
            if(u){
                return u.userFollowed.toString();
            }
        })

        const getUsers = users.map((u:any)=>{
            let newU = u.toObject();
            if(userIds.indexOf(u._id.toString())>=0){
                newU = {...newU,followedByMe: true};
            }else{
                newU = {...newU,followedByMe: false};
            }

            return newU;
        })

        return getUsers;

    }


}