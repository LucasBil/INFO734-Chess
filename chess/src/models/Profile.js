import Model from './Model.js'

export default class Profile extends Model {
    constructor(id, profilename, avatar) {
        super();
        this.id = id;
        this.profilename = profilename;
        this.avatar = avatar;
    }


};