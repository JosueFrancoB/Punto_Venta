const { response } = require("express");
const statistic = require("../models/statistics");


const most_selled_products = async(productos, date, date_key)=>{
    
    if(date_key === 'year'){
        date = date.split('/')[0]
    }else if(date_key === 'month'){
        date = date.split('/')
        date.pop()
        console.log(date)
        date = date.join('/')
    }
    let query_date = {[date_key]: date}
    let query_find = {}
    let query_product = {}
    let prod_exists = undefined
    
    let date_document = await statistic[date_key].find(query_date)
    if (date_document.length == 0){
        const date_doc = new statistic[date_key]({[date_key]: date});
        await date_doc.save();
    }
    for (let product of productos) {
        try{
            query_find = {[date_key]: date, products: {$elemMatch: {nombre: product.nombre}}}
            query_product = {[date_key]: date, 'products.nombre': product.nombre}
            prod_exists = await statistic[date_key].find(query_find)
            if(prod_exists.length > 0){
                await statistic[date_key].findOneAndUpdate(query_product, {$inc: {'products.$.cantidad': product.cantidad}})
            }else{
                await statistic[date_key].findOneAndUpdate(query_date, {$push: {products: {nombre: product.nombre, cantidad: product.cantidad}}})
            }

        }catch(err){
            console.log(`error in selled products ${err}`);
        }
    }
    let doc_data = await statistic[date_key].find(query_date)
    let data = doc_data[0].toObject()
    let best_products = data.products
    best_products.sort((a,b) => b.cantidad - a.cantidad);
    best_products = best_products.splice(0,4)
    console.log(`best ${best_products}`)
    await statistic[date_key].findOneAndUpdate(query_date, {$set: {most_selled_products: best_products}})
    
}
const best_employees = (employee)=>{
    
}
const best_clients = (client)=>{
    
}


module.exports = {
    most_selled_products,
    best_employees,
    best_clients,
}