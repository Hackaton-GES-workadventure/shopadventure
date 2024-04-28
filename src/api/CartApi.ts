import {Client} from "./../service/Client.ts";

export class CartApi{
    private client: Client;
    constructor(){
        this.client = Client.getInstance();
    }
    async createCart() {
        const mutation = `mutation {
            cartCreate {
                cart {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }`;
        const response = await this.client.get().request(mutation);
        if (response.data.cartCreate.cart)
            return response.data.cartCreate.cart.id;
        else
            throw new Error('Failed to create cart: ' + response.data.cartCreate.userErrors.map(e => e.message).join(', '));
    }

    async addToCart(cartId: string, line: { productId: string, quantity: number }) {
        const mutation = `mutation addLineItem($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                    id
                    lines {
                        id
                        merchandise {
                            ... on ProductVariant {
                                product {
                                    title
                                }
                            }
                        }
                        quantity
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }`;
        const variables = {
            cartId: cartId,
            lines: [{
                merchandiseId: line.productId,
                quantity: line.quantity
            }]
        };
        const response = await this.client.get().request(mutation, variables);
        if (response.data.cartLinesAdd.cart)
            return response.data.cartLinesAdd.cart;
        else
            throw new Error('Failed to add to cart: ' + response.data.cartLinesAdd.userErrors.map(e => e.message).join(', '));
    }

    async getCartInfo(cartId: string) {
        const query = `query getCartInfo($cartId: ID!) {
            cart(id: $cartId) {
                id
                lines {
                    id
                    merchandise {
                        ... on ProductVariant {
                            product {
                                id
                                title
                            }
                        }
                    }
                    quantity
                }
                estimatedCost {
                    totalAmount {
                        amount
                        currencyCode
                    }
                }
            }
        }`;
        const variables = { cartId };
        const response = await this.client.get().request(query, variables);
        if (response.data.cart)
            return response.data.cart;
        else if (response.data.errors && response.data.errors.length > 0)
            throw new Error('Failed to retrieve cart information: ' + response.data.errors.map(e => e.message).join(', '));
        else
            throw new Error('Cart not found');
    }



}