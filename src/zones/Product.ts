import {Zone} from "./../service/Zone.ts";
import {ProductApi} from "../api/ProductApi.ts";

export class Product extends Zone {
    private productApi: ProductApi = new ProductApi();
    private currentPopup = null;
    private productData = null;
    constructor(properties: object, zoneName: string) {
        super(properties, zoneName);
        this.init();
    }

    async init(){
        this.showPopup();
    }

    simplePopup(message: string){
        this.closePopup();
        this.currentPopup = WA.ui.openPopup(this.getTrigger('popup').name, message, []);
    }
    showPopup(){
       WA.room.area.onEnter(this.name).subscribe(async () => {
            this.simplePopup("Chargement en cours ...");
            let product = await this.productApi.getProduct(this.shopify_id);
            this.productData = product.data.product ?? null;
            if(!this.productData)
                this.simplePopup("Produit non trouvé");
            else {
                WA.player.state.currentProduct = this.productData;
                this.showProductPopup();
            }
        });

        WA.room.area.onLeave(this.name).subscribe(() => {
            this.closePopup();
        })
    }
    async showProductPopup(){
        this.closePopup();
        let trigger = this.getTrigger('popup');
        let triggerPos = {
            top: trigger.y,
            left: trigger.x + trigger.width/2
        };
        let popup = await WA.ui.website.open({
            allowApi: true,
            url: import.meta.env.VITE_APP_URL + "/product_show.html",
            position: {
                vertical: "top",
                horizontal: "left",
            },
            margin:{
                top: triggerPos.top + "px",
                left: triggerPos.left + "px",
            },
            size: {
                height: (trigger.height*2) + "px",
                width: (trigger.width*2) + "px"
            },
        });
            this.currentPopup = popup;
        }
    closePopup(){
        if(this.currentPopup) {
            this.currentPopup.close();
            this.currentPopup = null;
        }
    }



}
