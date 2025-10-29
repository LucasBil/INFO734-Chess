export default class Model {
    constructor() {}

    static loadJSONModel(json) {
        const instance = new this(); // `this` = classe héritée
        for (const key in json) {
            if (Object.hasOwn(instance, key)) {
                instance[key] = json[key];
            }
        }
        return instance;
    }
}