class MapSingleton {
    static instance = null;
    map;
    zones = [];

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

    async collectZones(layer) {
        if (layer.name === "zoneList" && layer.objects) {
            for (const object of layer.objects) {
                const properties = this.convertPropertiesToObject(object.properties);
                if (!object.name.includes("trg")) {
                    const ZoneClass = await this.loadComponentDynamically(properties.component);
                    const zone = new ZoneClass(properties, object.name);
                    this.zones.push(zone);
                } else if (object.name.includes("trg")) {
                    const zoneName = object.name.split('_trg_')[0];
                    const zone = this.zones.find(z => z.name === zoneName);
                    if (zone) {
                        zone.addTrigger({ name: object.name, ...properties });
                    }
                }
            }
        }
        if (layer.layers) {
            for (const subLayer of layer.layers) {
                await this.collectZones(subLayer); // Await recursive calls
            }
        }
    }

    async loadComponentDynamically(componentName) {
        const module = await import(`../zones/${componentName}.ts`);
        return module[componentName];
    }

    async initializeAsync() {
        this.zones = [];
        if (this.map && this.map.layers) {
            for (const layer of this.map.layers) {
                await this.collectZones(layer);
            }
        }
    }

    getZone(zoneName) {
        return this.zones.find(zone => zone.name === zoneName);
    }

    getMapInfo() {
        return this.map;
    }
}

export { MapSingleton };
