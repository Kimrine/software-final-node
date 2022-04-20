/**
 * @file Tuit service for helping get specific data
 */
import Tuit from "../models/tuits/Tuit";
import LikeDao from "../daos/LikeDao";
import DislikeDao from "../daos/DislikeDao";
import FollowDao from "../daos/FollowDao";

export default class TuitService{
    public static tuitService: TuitService | null = null;
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static followDao: FollowDao = FollowDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();

    /**
     * Creates singleton service instance
     * @return TuitService
     */
    public static getInstance = (): TuitService => {
        if(TuitService.tuitService===null){
            TuitService.tuitService = new TuitService();
        }
        return TuitService.tuitService;
    }

    private constructor() {
    }

    /**
     * Get tuits with likeByMe and dislikeByMe by a specific user.
     * @param uid the user id
     * @param tuits the tuits will be modify
     */
    public getTuitsForLikeDislikeByUser = async (uid:any,tuits:Tuit[]): Promise<any[]> =>{
        let findLikesPromises: any[] = []
        let findDislikesPromises: any[] = []

        tuits.forEach((tuit:any)=>{
            let findLikePromise = TuitService.likeDao.findUserLikesTuit(uid,tuit._id);
            let findDislikePromise = TuitService.dislikeDao.findUserDislikesTuit(uid, tuit._id);

            findLikesPromises.push(findLikePromise);
            findDislikesPromises.push(findDislikePromise);

        })

        const likedTuits = await Promise.all(findLikesPromises);
        const dislikedTuits = await Promise.all(findDislikesPromises);

        const likedTuitIds = likedTuits.map((t)=>{
            if(t){
                return t.tuit.toString();
            }
        })

        const dislikedTuitIds = dislikedTuits.map((t)=>{
            if(t){
                return t.tuit.toString();
            }
        })

        const getTuits = tuits.map((t:any)=>{
            let newT = t.toObject();

            if(likedTuitIds.indexOf(t._id.toString())>=0){
                newT = {...newT, likedByMe: true};
            }

            if(dislikedTuitIds.indexOf(t._id.toString())>=0){
                newT = {...newT, dislikedByMe:true};
            }

            if(newT.postedBy._id.toString()===uid.toString()){
                newT = {...newT, postedByMe:true};
            }
            return newT;
        })

        return getTuits;

    }


    /***
     * Get tuits that posted by user I'm following.
     * @param uid the id of specific user
     * @param tuits the all tuits from database
     */
    public getTuitsForFollow = async (uid:any,tuits:Tuit[]): Promise<any[]> =>{

        const users = await TuitService.followDao.findAllUsersThatUserFollowing(uid);
        const followingNonNullUser = users.filter(follow => follow.userFollowed);
        const userFromFollowing = followingNonNullUser.map(follow => follow.userFollowed);

        const usersId = userFromFollowing.map((u)=>{
            if(u){
                return u.username;
            }
        })


        const getTuits =  tuits.map((t:any)=>{
            let newT = t;

            if(usersId.indexOf(t.postedBy.username)>=0){
                newT = {...newT, canShow: true};
            }else if(t.postedBy._id.toString()===uid.toString()) {
                newT = {...newT, canShow: true};
            }
            else{
                newT = {...newT, canShow: false};
            }

            return newT;
        })
        let followTuits = getTuits.filter((t)=>t.canShow===true);

        return followTuits;
    }



}