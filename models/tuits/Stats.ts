/**
 * @typedef Stats represents information within tuits
 * @property {number} replies the number of replies on the tuit
 * @property {retuits} number the number of retuits on the tuit
 * @property {number} likes the number of likes on the tuit
 * @property {number} dislikes the number of dislikes on the tuit
 */
export default interface Stats {
    replies?: number,
    retuits: number,
    likes: number,
    dislikes: number
};