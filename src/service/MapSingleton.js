import { Test } from "../components/Test.js";
class MapSingleton {
    static instance = null;
    map;
    components = [];
    constructor(map) {
        if (MapSingleton.instance)
            throw new Error("You can only create one instance of MapSingleton!");

        this.map = map;
        this.initializeComponents();
        MapSingleton.instance = this;
    }

    static getInstance(map) {
        if (!MapSingleton.instance)
            MapSingleton.instance = new MapSingleton(map);

        return MapSingleton.instance;
    }
    convertPropertiesToObject(properties) {
            const obj = {};
            properties.forEach(prop => {
                obj[prop.name] = prop.value;
            });
            return obj;
    }
    // Méthode pour parcourir de manière récursive les layers et collecter les "components"
    async collectComponents(layer) {
        if (layer.properties) {
            const componentProp = layer.properties.find(prop => prop.name === "component");
            if (componentProp) {
                try {
                    const ComponentClass = await this.loadComponentDynamically(componentProp.value);
                    this.components.push(
                        new ComponentClass(this.convertPropertiesToObject(layer.properties))
                    );
                } catch (error) {
                    console.error(`Failed to load component ${componentProp.value}:`, error);
                }
            }

        }
        if (layer.layers)
            layer.layers.forEach(subLayer => this.collectComponents(subLayer));

    }
    async loadComponentDynamically(componentName) {
        const module = await import(`../components/${componentName}.js`);
        return module[componentName];
    }


    // Méthode pour initialiser la collecte des composants
    initializeComponents() {
        this.components = [];
        if (this.map && this.map.layers)
            this.map.layers.forEach(layer => this.collectComponents(layer));

    }

    getMapInfo() {
        return this.map;
    }
}

export { MapSingleton };