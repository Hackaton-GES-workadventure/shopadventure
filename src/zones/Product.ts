import {Zone} from "./../service/Zone.ts";
import {ProductApi} from "./../api/ProductApi.ts";
export class Product extends Zone {
    private cartApi: ProductApi = new ProductApi();

    constructor(properties: object, zoneName: string) {
        super(properties, zoneName);
        this.init();
        console.log("a");
    }

    async init(){
        await this.getProduct();
    }

    async getProduct() {
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
