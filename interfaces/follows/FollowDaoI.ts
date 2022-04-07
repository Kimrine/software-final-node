import Follow from "../../models/follows/Follow";

export default interface FollowDaoI{

    findAllFollow(): Promise<Follow[]>;

    findAllUsersThatFollowingUser(uid: string): Promise<Follow[]>;

    findAllUsersThatUserFollowing(uid:string): Promise<Follow[]>;

    userFollowsUser(uid1:string, uid2:string): Promise<any>;

    userUnfollowsUser(uid1:string,uid2:string): Promise<any>;

    userRemoveFollower(uid1:string,uid2:string): Promise<any>;

    findUserFollowUser(uid1:string,uid2:string): Promise<any>;

}