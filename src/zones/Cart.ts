import {Zone} from "./../service/Zone.ts";
import {CartApi} from "./../api/CartApi.ts";
export class Cart extends Zone {
    private cartApi: CartApi = new CartApi();

    constructor(properties: object, zoneName: string) {
        super(properties, zoneName);
        this.init();
    }

    async init(){
        await this.getPlayerCartToken();
    }
    createCartMenuButton() {
        WA.ui.actionBar.addButton({
            id: this.formatId('cartMenuBtn'),
            label: 'Ouvrir votre panier',
            callback: (event) => {

            }
        });
    }

    createCartMenuPopup() {

    }


    async getPlayerCartToken() {
        console.log(WA.player.state.cartToken);

        if (WA.player.state.cartToken)
            return WA.player.state.cartToken;
        try {
            const cartId = await this.cartApi.createCart();
            WA.player.state.cartToken = cartId;
        } catch (error) {
            console.error("Failed to create cart token:", error);
        }

    }


}
