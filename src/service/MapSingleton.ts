class MapSingleton {
    static instance = null;
    map;
    zones = [];
    loadedZones = [];
    constructor(map) {
        if (MapSingleton.instance)
            throw new Error("You can only create one instance of MapSingleton!");

        this.map = map;
        MapSingleton.instance = this;
    }

    static async getInstance(map) {
        if (!MapSingleton.instance) {
            const singleton = new MapSingleton(map);
            await singleton.initializeAsync(); // Ensure zones are initialized
            MapSingleton.instance = singleton;
        }
        return MapSingleton.instance;
    }

    convertPropertiesToObject(properties) {
        const obj = {};
        properties.forEach(prop => {
            obj[prop.name] = prop.value;
        });
        return obj;
    }

    dependsOnToArray(properties) {
        if (properties.depends_on && typeof properties.depends_on === 'string')
            properties.depends_on = properties.depends_on.split(',');
    }
    checkDependency(zone){
        let dependencies = zone.properties.depends_on;
        if(!dependencies){
            this.loadedZones.push(zone);
             return true;
        }

        for(let dependency of dependencies) {
            if(!this.loadedZones.find(loadedZone => loadedZone.properties.component == dependency ))
                return false;
        }
        this.loadedZones.push(zone);

        return true;

    }
    async collectZones(layer) {
        let zones = layer.objects.filter(item => !item.name.includes("_trg")).map(zone => {
            let properties = this.convertPropertiesToObject(zone.properties);
            this.dependsOnToArray(properties);
            zone.properties = properties;
            return zone;
        });
        let triggers = layer.objects.filter(item => item.name.includes("_trg"));

        do{
            for (let i = 0; i < zones.length; i++) {
                let zone = zones[i];
                if(!this.checkDependency(zone))
                    continue;
                const ZoneClass = await this.loadComponentDynamically(zone.properties.component);
                const zoneInstance = new ZoneClass(zone.properties, zone.name);
                this.zones.push(zoneInstance);
                zones.splice(i, 1);
            }
        }while(zones.length > 0)
        // Traiter les triggers après les zones
        for (const trigger of triggers) {
            let zoneName = trigger.name.split('_trg_')[0];
            this.zones.find(zone => zone.name === zoneName).addTrigger(trigger);
        }
    }

    async loadComponentDynamically(componentName) {
        const module = await import(`../zones/${componentName}.ts`);
        return module[componentName];
    }

    async initializeAsync() {
        this.zones = [];
        const layer = this.map.layers.find(item => item.name === "floorLayer");
        await this.collectZones(layer);
    }

    getZone(zoneName) {
        return this.zones.find(zone => zone.name === zoneName);
    }

    getMapInfo() {
        return this.map;
    }
}

export { MapSingleton };
