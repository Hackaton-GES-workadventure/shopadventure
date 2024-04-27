/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import {MapSingleton} from "./service/MapSingleton";

// Waiting for the API to be ready
WA.onInit().then(async () => {
    const mapData = await WA.room.getTiledMap();
    const map = await MapSingleton.getInstance(mapData);
    console.log(map.zones);
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));


export {};


