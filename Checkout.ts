import {Zone} from "./../service/Zone.ts";
import {CartApi} from "./../api/CartApi.ts";

let currentPopup: any = undefined;

// Function to initiate the checkout process
function initiateCheckout(productId: string) {
    // Fetch the checkout URL from Shopify for the specified product
    fetch('https://shoppyventure.myshopify.com/api/2024-04/checkout.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': 'b826f135e6dae20ce01ade8e2c1a2902'
        },
        body: JSON.stringify({
            lineItems: [{ variantId: productId, quantity: 1 }]
        })
    })
        .then(response => response.json())
        .then(data => {
            // Redirect to the checkout URL
            window.location.href = data.checkoutUrl;
        })
        .catch(error => {
            console.error(error);
            // Handle error
        });
}

// Waiting for the API to be ready
WA.onInit().then(() => {
    // Your existing code here...

    shopifyTriggerAreas.then((areas) => {
        areas.forEach(area => {
            WA.room.area.onEnter(area.name).subscribe(() => {
                const shopifyId = area.properties.find(property => property.name === 'shopify_id').value;
                currentPopup = WA.ui.openPopup(`${area.name}_popup`, `Loading...`, []);

                fetch('https://shoppyventure.myshopify.com/api/2024-04/graphql.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Storefront-Access-Token': 'b826f135e6dae20ce01ade8e2c1a2902'
                    },
                    body: JSON.stringify({
                        query: `query { product(id: "gid:\\/\\/shopify\\/Product\\/${shopifyId}") { title id } }`
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        currentPopup.close();

                        if (data.data.product !== null) {
                            const productId = data.data.product.id;
                            currentPopup = WA.ui.openPopup(`${area.name}_popup`, `${data.data.product.title}`, [
                                {
                                    label: "Ajouter au panier",
                                    className: "primary",
                                    callback: (popup) => {
                                        initiateCheckout(productId);
                                        popup.close();
                                    },
                                },
                                {
                                    label: "Voir panier",
                                    className: "primary",
                                    callback: (popup) => {
                                        // Implement your logic to view the cart
                                        popup.close();
                                    },
                                },
                                {
                                    label: "Payer",
                                    className: "primary",
                                    callback: (popup) => {
                                        initiateCheckout(productId);
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
                        currentPopup.close();
                    });
            });
            WA.room.area.onLeave(area.name).subscribe(closePopup);
        });
    });
}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};