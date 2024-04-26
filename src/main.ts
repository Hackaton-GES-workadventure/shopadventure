/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import {createStorefrontApiClient} from "@shopify/storefront-api-client";

console.log('Script started successfully');

let currentPopup: any = undefined;
let currentItem: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {

    const shopifyStoreVars = Object.entries(import.meta.env)
        .filter(([key]) => key.startsWith('VITE_SHOPIFY_'))
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});

    console.log(shopifyStoreVars);


    // <<<< START SHOPPYVENTURE >>>>
    const shopifyTriggerAreas = WA.room.getTiledMap().then((tiledMap) => {
        return tiledMap.layers
            .find(layer => layer.name === 'floorLayer').objects
            .filter(area => area.name.startsWith('shopify_') && area.name.match(/\d+$/));
    });

    console.log(shopifyTriggerAreas);

    shopifyTriggerAreas.then((areas) => {
        areas.forEach(area => {
            console.log(area);
            WA.room.area.onEnter(area.name).subscribe(() => {
                console.log("AAA");
                const shopifyId = area.properties.find(property => property.name === 'shopify_id').value;
                console.log(area);
                currentPopup = WA.ui.openPopup(area.name + '_popup', `Loading...`, []);

                // 8537826984157
                fetch('https://shoppyventure.myshopify.com/api/2024-04/graphql.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Storefront-Access-Token': 'a39773cc8834ca04c164f233abcdbf7e'
                    },
                    body: JSON.stringify({
                        query: `query { product(id: "gid:\\/\\/shopify\\/Product\\/${shopifyId}") { title } }`
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        // Close the loading popup
                        currentPopup.close();

                        if (data.data.product !== null) {
                            currentPopup = WA.ui.openPopup(`${area.name}_popup`,  "<img src='https://example.com/your-image.jpg' alt='Descriptive text for the image'>", [
                                {
                                    label: "Ajouter au panier",
                                    className: "primary",
                                    callback: (popup) => {
                                        popup.close();
                                    },
                                },
                            ]);
                        } else {
                            currentPopup = WA.ui.openPopup(`${area.name}_popup`, `Produit non trouvé`, []);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        // Close the loading popup in case of error
                        currentPopup.close();
                    });

                // currentPopup = WA.ui.openPopup(`${area.name}_popup`, `${shopifyId} -> ID Shopify renseigné sur l'area ${response}`, [
                //     {
                //         label: "Ajouter au panier",
                //         className: "primary",
                //         callback: (popup) => {
                //             popup.close();
                //         },
                //     },
                //     // {
                //     //     label: "Fermer",
                //     //     className: "primary",
                //     //     callback: (popup) => {
                //     //         popup.close();
                //     //     },
                //     // },
                // ]);
            })
            WA.room.area.onLeave(area.name).subscribe(closePopup)
        });
    });
    // <<<< END SHOPPYVENTURE >>>>

    // const client = createStorefrontApiClient({
    //     storeDomain: 'http://your-shop-name.myshopify.com',
    //     apiVersion: '2023-10',
    //     publicAccessToken: 'your-storefront-public-access-token',
    // });


    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })
    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
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






