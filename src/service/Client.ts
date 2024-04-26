import { createStorefrontApiClient, StorefrontApiClient } from '@shopify/storefront-api-client';

export class Client {
    private static instance: Client;
    private storefrontClient: StorefrontApiClient;

    private constructor() {
        const storeLink = import.meta.env.VITE_SHOPIFY_STORE_LINK;
        const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION;
        const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_API_KEY;
        this.storefrontClient = createStorefrontApiClient({
            storeDomain: storeLink,
            apiVersion: apiVersion,
            publicAccessToken: storefrontAccessToken
        });
    }

    public static getInstance(): Client {
        if (!Client.instance) {
            Client.instance = new Client();
        }
        return Client.instance;
    }

     get(){
         return this.storefrontClient;
     }

}

export default Client;