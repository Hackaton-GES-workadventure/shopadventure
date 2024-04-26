import {Client} from "./../service/Client.ts";

export class CartApi{
    private client: Client;

    constructor(){
        this.client = Client.getInstance();
    }

    async getProduct(id) {
        const query = `query {
            product(id: "gid:\\/\\/shopify\\/Product\\/${id}") {
                title
            }
        }`;
        const response = await this.client.get().request(query);
        if (response.data.cartCreate.cart)
            return response.data.cartCreate.cart.id;
        else
            throw new Error('Failed to create cart: ' + response.data.cartCreate.userErrors.map(e => e.message).join(', '));
    }
}