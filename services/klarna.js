import fetch from "node-fetch";

export function getKlarnaAuth() {
    const username = process.env.PUBLIC_KEY;
    const password = process.env.SECRET_KEY;
    const auth = `Basic ${Buffer.from(username + ':' + password).toString('base64')}`;
    return auth;
}

// Skapar en order hos Klarna
export async function createOrder(product) {
    const path = '/checkout/v3/orders';
    const auth = getKlarnaAuth();
    const url = process.env.BASE_URL + path;
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json',
        Authorization: auth
    };

    const quantity = 1;
    const price = product.price * 100; // Klarna vill att man multiplicerar priset med 100 för att undvika decimaler
    const tax_rate = 2500; 
    const tax_multiplier = tax_rate / 10000;
    const total_tax_amount = Math.round(price * tax_multiplier);
    const total_amount = price + total_tax_amount;

    const payload = {
        purchase_country: 'SE',
        purchase_currency: 'SEK',
        locale: 'sv-SE',
        order_amount: total_amount,
        order_tax_amount: total_tax_amount,
        allowed_customer_types: ['person'],
        allow_separate_shipping_address: true,
        payment_method_categories: ['pay_now', 'pay_later', 'pay_over_time'],

        order_lines: [
            {
                type: 'physical',
                reference: product.id,
                name: product.title,
                quantity,
                quantity_unit: 'pcs',
                unit_price: price,
                tax_rate,
                total_amount,
                total_discount_amount: 0,
                total_tax_amount,
                image_url: product.image
            }
        ],

        customer: {
            type: 'person',
            email: 'test@example.com',  // Använd Klarna test credentials
            phone: '0701234567',
            billing_address: {
                given_name: 'Isac',
                family_name: 'Danielsson',
                email: 'isac.danielsson03@gmail.com',
                street_address: 'Paternostervägen 86',
                postal_code: '12149',
                city: 'Johanneshov',
                country: 'SE'
            }
        },

        merchant_urls: {
            terms: 'https://myklarnacheckout-2300b124b2d8.herokuapp.com/terms.html',
            checkout: 'https://myklarnacheckout-2300b124b2d8.herokuapp.com/checkout.html',
            confirmation: 'https://myklarnacheckout-2300b124b2d8.herokuapp.com/confirmation?order_id={checkout.order.id}',
            push: 'https://myklarnacheckout-2300b124b2d8.herokuapp.com/api/push',
            status_callback: 'https://myklarnacheckout-2300b124b2d8.herokuapp.com/api/status'
        }
    };

    const body = JSON.stringify(payload);
    
    try {
        const response = await fetch(url, { method, headers, body });
        const json = await response.json();

        console.log("Klarna API Response:", json);

        if (response.status === 200 || response.status === 201) {
            return json;
        } else {
            throw new Error(`Klarna API error: ${JSON.stringify(json)}`);
        }
    } catch (error) {
        console.error("Klarna Order Creation Failed:", error);
        return {
            html_snippet: `<h1>${error.message}</h1>`
        };
    }
}

// Hämtar en order från Klarna
export async function retrieveOrder(order_id) {
    const path = `/checkout/v3/orders/${order_id}`;
    const auth = getKlarnaAuth();
    const url = process.env.BASE_URL + path;
    const method = 'GET';
    const headers = { Authorization: auth };

    try {
        const response = await fetch(url, { method, headers });
        const json = await response.json();

        console.log("Retrieve Order Response:", json);

        if (response.status === 200 || response.status === 201) {
            return json;
        } else {
            throw new Error(`Klarna Retrieve Order error: ${JSON.stringify(json)}`);
        }
    } catch (error) {
        console.error("Klarna Retrieve Order Failed:", error);
        return {
            html_snippet: `<h1>${error.message}</h1>`
        };
    }
}
