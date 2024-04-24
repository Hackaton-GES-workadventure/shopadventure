export class Component {
    constructor(props) {
        this.setPropertiesFromObject(props);
    }

    setPropertiesFromObject(obj) {
        Object.keys(obj).forEach(key => {
            if (key in this) {
                this[key] = obj[key];
            }
        });
    }
}