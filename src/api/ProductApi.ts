import {Client} from "./../service/Client.ts";

export class ProductApi{
    private client: Client;

    constructor(){
        this.client = Client.getInstance();
    }

    async getProduct(id: number) {
        const query = `query {
            product(id: "gid:\\/\\/shopify\\/Product\\/${id}") {
                title,
                description,
                featuredImage {
                    originalSrc
                }
            }
        }`;
        return await this.client.get().request(query);
    }
}