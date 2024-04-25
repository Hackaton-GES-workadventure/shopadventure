export class Zone {
    triggers: object[] = [];
    name: string;
    constructor(properties: object,zoneName: string) {
        this.name = zoneName;
        this.setPropertiesFromObject(properties);
    }

    setPropertiesFromObject(obj) {
        Object.keys(obj).forEach(key => {
                this[key] = obj[key];
        });
    }

    addTrigger(trigger) {
        this.triggers.push(trigger);
    }

    getTrigger(triggerName) {
        return this.triggers.find(trigger => trigger.name === `${this.name}_trg_${triggerName}`);
    }
}
