import  {getProduct, getProducts}  from "./services/api.js"
import { createOrder, retrieveOrder } from "./services/klarna.js"
import express from "express"
const app = express()
import { config }  from 'dotenv'
config()

app.get('/', async (req, res)=> {
    const products = await getProducts() 
    const markup = `<div style="display: flex; padding: 100px; flex-wrap: wrap; gap: 20px"> ${products.map((p)=>`
    <div style="border: 1px solid black; padding: 10px; width: 240px; height: 430px; display: flex; flex-direction: column; align-items: center;"  >
        <img style="height: 200px; width: 200px; object-fit: cover;" src=${p.image} alt="">
        <div style="width: 100%;">
            <h3>${p.title}</h3>
            <h3> ${p.price} kr</h3>
            <a href="/products/${p.id}" style="text-decoration: none; color: black;">
            <button>Buy now!</button>
            </a>
        </div>
    </div>
    `)}</div>`
    res.send(markup)
})



app.get('/products/:id', async (req, res)=>{
    try{
        const id = req.params.id
        const product = await getProduct(id)
        const klarnaResponse = await createOrder(product)
        const markup = klarnaResponse.html_snippet
        res.send(markup)
    }catch(error){
        res.send(error.message)
    }
})

app.get('/confirmation',  async (req, res)=>{
    const {order_id} = req.query
    const klarnaResponse = await retrieveOrder(order_id)
    const markup = klarnaResponse.html_snippet
    res.send(markup)
})
app.listen(process.env.PORT)