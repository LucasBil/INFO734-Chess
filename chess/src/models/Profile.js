import Model from './Model.js'

export default class Profile extends Model {
    constructor(id, username, email, avatar='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToZh97pUX74Jt8J5fmkH7k19EQUHFs39wMA&s') {
        super();
        this.id = id;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
    }

};