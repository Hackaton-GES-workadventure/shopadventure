/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import {MapSingleton} from "./service/MapSingleton";

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(async () => {
    const mapData = await WA.room.getTiledMap();
    WA.player.getWokaPicture();
    const map = await MapSingleton.getInstance(mapData);
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}



export {};


