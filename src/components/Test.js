export class Test {
    id;
    constructor(properties) {
        this.setPropertiesFromObject(properties);
    }
    setPropertiesFromObject(obj) {
        Object.keys(obj).forEach(key => {
            if (key in this)
                this[key] = obj[key];
        });
    }
}