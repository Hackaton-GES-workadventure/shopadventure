import {Zone} from "./../service/Zone.ts";
import {ProductApi} from "../api/ProductApi.ts";

export class Product extends Zone {
    private productApi: ProductApi = new ProductApi();
    private currentPopup: any = undefined;

    constructor(properties: object, zoneName: string) {
        super(properties, zoneName);
        this.closePopup = this.closePopup.bind(this);
        this.init();
    }

    async init(){
        const triggers = super.getTriggers();
        const zoneName = this.name;
        WA.room.area.onEnter(zoneName).subscribe(() => {

            triggers.forEach((trigger) => {
                this.currentPopup = WA.ui.openPopup(trigger.name, 'Chargement du produit...', []);

                this.productApi.getProduct(this.shopify_id).then((data) => {

                    const product = data.data.product;

                    this.closePopup();
                    if (product === null) {
                        this.currentPopup = WA.ui.openPopup(trigger.name, 'Produit non trouvé', []);
                        return;
                    }
                    this.currentPopup = WA.ui.openPopup(trigger.name, `${product.title}\n\n${product.description}`, [
                        {
                            label: "Ajouter au panier",
                            className: "primary",
                            callback: (popup) => {
                                popup.close();
                            }
                        },
                    ]);
                });

            });
        });
        WA.room.area.onLeave(zoneName).subscribe(this.closePopup);
    }

    closePopup(){
        if (this.currentPopup !== undefined) {
            this.currentPopup.close();
            this.currentPopup = undefined;
        }
    }
}
