import {Client} from "./../service/Client.ts";

export class ProductApi{
    private client: Client;

    constructor(){
        this.client = Client.getInstance();
    }

    async getProduct(id: number) {
        const query = `query {
            product(id: "gid:\\/\\/shopify\\/Product\\/${id}") {
                id,
                title,
                description,
                featuredImage {
                    originalSrc
                }
            }
        }`;
        let response = await this.client.get().request(query);
        return response;
    }
}