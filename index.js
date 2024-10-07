import  {getProduct, getProducts}  from "./services/api.js"
import { createOrder, retrieveOrder } from "./services/klarna.js"
import express from "express"
const app = express()
import { config }  from 'dotenv'
config()

app.get('/', async (req, res)=> {
    const products = await getProducts() 
    const markup = `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Courier New', Courier, monospace;">
        <h1 style="text-align: center;">My Klarna shop </h1>

        <div style=" max-width: 1500px; display: flex; padding: 100px; flex-wrap: wrap; gap: 20px; font-family: Courier New, Geneva, Tahoma, sans-serif;"> ${products.map((p)=>`
            <div style=" border: 1px solid black; min-height: 200px; display: flex; flex-direction: column; align-items: center; border-radius: 15px; background: rgb(235, 235, 235); width: 280px;;" >
                <img style="min-height: 280px; width: 280px; object-fit: fill; border-radius: 15px 15px 0 0;" src="${p.image}" alt="">
                
                <div style="gap: 30px; display: flex; flex-direction: column; height: 100%; width: 80%; padding: 20px; justify-content: space-between;">
                    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 280px;">
                        <h3 style="margin: 0; font-size: 20px; font-weight: 900; word-wrap: break-word; max-width: 100%;">
                            ${p.title}
                        </h3>
                        <h3 style="margin: 0; font-size: 18px; color: rgba(95, 95, 95, 0.841);"> ${p.price} kr</h3>
                    </div>
                    <a href="/products/${p.id}" style="text-decoration: none; color: black; align-self: flex-end; font-weight: bold;">
                        <button style="border: 0.5px solid black; height: 30px; background: #FFA8CD; font-weight: bold; border-radius: 5px;">Buy now with Klarna!</button>
                    </a>
                </div>
            </div>
            `).join('')}</div>
    </div>`
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