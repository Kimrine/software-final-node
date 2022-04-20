/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follow";
import FollowDaoI from "../interfaces/follows/FollowDaoI";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follows
 * @property {FollowDao} followDao private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI {

    private static followDao: FollowDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns FollowDao
     */
    public static getInstance = (): FollowDao => {
        if (FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }

    private constructor() {
    }

    findAllFollow = async (): Promise<Follow[]> =>
        FollowModel.find();

    /**
     * Uses FollowModel to retrieve follows document that the specific user is following
     * from follows collection
     * @param {string} uid User's primary key
     * @returns Promise To be notified when follows are retrieved from the database
     */
    findAllUsersThatUserFollowing = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({userFollowing: uid})
            .populate("userFollowed")
            .exec();

    /**
     * Uses FollowModel to retrieve follows document that following the specific user
     * from follows collection
     * @param {string} uid User's primary key
     * @returns Promise To be notified when follows are retrieved from the database
     */
    findAllUsersThatFollowingUser = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({userFollowed: uid})
            .populate("userFollowing")
            .exec();

    /**
     * Inserts follow instance into the database
     * @param {string} uid1 User's primary key of following user2
     * @param {string} uid2 User's primary key of be followed by user1
     * @returns Promise To be notified when follow is inserted into the database
     */
    userFollowsUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.create({userFollowed: uid2, userFollowing: uid1});


    /**
     * Removes follow from the database, user1 unfollows user2.
     * @param {string} uid1 User's primary key of unfollowing user2
     * @param {string} uid2 User's primary key of be unfollowed by user1
     * @returns Promise To be notified when follow is removed from the database
     */
    userUnfollowsUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.deleteOne({userFollowed: uid2, userFollowing: uid1});


    /**
     * Removes follow from the database, user1 remove user2 from his followers.
     * @param {string} uid1 User's primary key
     * @param {string} uid2 User's primary key
     * @returns Promise To be notified when follow is removed from the database
     */
    userRemoveFollower = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.deleteOne({userFollowed: uid1, userFollowing: uid2});


    /**
     * Check follow instance is exist
     * @param {string} tid Tuit's primary key
     * @param {string} uid User's primary key
     * @returns Promise To be notified when find the like record
     */
    findUserFollowUser = async (uid1: string, uid2: string): Promise<any> =>
        FollowModel.findOne({userFollowed: uid2, userFollowing: uid1});

    /**
     * Count the user have how many followers
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when count finish
     */
    countHowManyFollowers = async (uid:string): Promise<any> =>
        FollowModel.count({userFollowed:uid});

    /**
     * Count have how many users the user is following
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when count finish
     */
    countHowManyFollowings = async (uid:string): Promise<any> =>
        FollowModel.count({userFollowing:uid});

}
