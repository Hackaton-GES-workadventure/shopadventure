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
        this.createCartMenuButton();
    }
    createCartMenuButton() {
        WA.ui.actionBar.addButton({
            id: this.formatId('cartMenuBtn'),
            label: 'Ouvrir votre panier',
            callback: (event) => {
                this.createCartMenuPopup();
            }
        });
    }

    createCartMenuPopup() {
        WA.ui.modal.closeModal();
        WA.ui.modal.openModal({
            title: "Votre panier",
            src: import.meta.env.VITE_APP_URL+'/cart_menu_popup.html',
            allow: "fullscreen",
            allowApi: true,
            position: "center"
        });

    }


    async getPlayerCartToken() {
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
