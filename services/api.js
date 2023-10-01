import fetch from "node-fetch"
const fakeStoreApiUrl = 'https://fakestoreapi.com';


export async function getProducts() {
    const res = await fetch(`${fakeStoreApiUrl}/products`)
    const products = await res.json()
    return products
}

export async function getProduct(id) {
    const res = await fetch(`${fakeStoreApiUrl}/products/${id}`)
    const product = await res.json()
    return product
}