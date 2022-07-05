const { response } = require("express");
const statistic = require("../models/statistics");


const get_number_week = ()=>{
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7)
}

const process_date = async(date, date_key)=>{
    if(date_key === 'year'){
        date = date.split('-')[0]
    }else if(date_key === 'month'){
        date = date.split('-')
        date.pop()
        date = date.join('-')
    }else if(date_key === 'week'){
        date = date.split('-')[0]
        let week = await get_number_week().toString()
        date = `${date}-${week}`
    }
    return date
}

const init_collections = async(date, date_key)=>{
    date = await process_date(date, date_key)
    let query_date = {[date_key]: date}
    let date_document = await statistic[date_key].find(query_date)
    if (date_document.length == 0){
        const date_doc = new statistic[date_key]({[date_key]: date});
        await date_doc.save();
        return true
    }else{
        return false
    }
}

const process_products = async(productos, date, date_key)=>{
    let query_date = {[date_key]: date}
    let query_find = {}
    let query_product = {}
    let prod_exists = undefined
    
    
    for (let product of productos) {
        try{
            query_find = {[date_key]: date, products: {$elemMatch: {nombre: product.nombre}}}
            query_product = {[date_key]: date, 'products.nombre': product.nombre}
            prod_exists = await statistic[date_key].find(query_find)
            if(prod_exists.length > 0){
                await statistic[date_key].findOneAndUpdate(query_product, {$inc: {'products.$.cantidad': product.cantidad}})
                return true
            }else{
                await statistic[date_key].findOneAndUpdate(query_date, {$push: {products: {nombre: product.nombre, cantidad: product.cantidad}}})
                return true
            }
        }catch(err){
            console.log(`error in process products ${err}`);
            return false
        }
    }
}

const most_selled_products = async(productos, date, date_key)=>{
    date = await process_date(date, date_key)
    let query_date = {[date_key]: date}
    let success = await process_products(productos, date, date_key)
    if (success === true){
        let doc_data = await statistic[date_key].find(query_date)
        let data = doc_data[0].toObject()
        let best_products = data.products
        best_products.sort((a,b) => b.cantidad - a.cantidad);
        best_products = best_products.slice(0,5)
        await statistic[date_key].findOneAndUpdate(query_date, {$set: {most_selled_products: best_products}})
    }
}

const process_employees = async(empleados, date, date_key)=>{
    let query_date = {[date_key]: date}
    let query_find = {}
    let query_employee = {}
    let empl_exists = undefined
    
    for (let employee of empleados) {
        try{
            query_find = {[date_key]: date, employees: {$elemMatch: {nombre: employee.nombre}}}
            query_employee = {[date_key]: date, 'employees.nombre': employee.nombre}
            empl_exists = await statistic[date_key].find(query_find)
            if(empl_exists.length > 0){
                await statistic[date_key].findOneAndUpdate(query_employee, {$inc: {'employees.$.dinero_ventas': employee.dinero_ventas}})
                await statistic[date_key].findOneAndUpdate(query_employee, {$inc: {'employees.$.num_ventas': 1}})
                return true
            }else{
                await statistic[date_key].findOneAndUpdate(query_date, {$push: {employees: {nombre: employee.nombre, dinero_ventas: employee.dinero_ventas, num_ventas: 1}}})
                return true
            }
        }catch(err){
            console.log(`error in process employees ${err}`);
            return false
        }
    }
}
const best_employees = async(empleados, date, date_key)=>{
    date = await process_date(date, date_key)
    let query_date = {[date_key]: date}
    let success = await process_employees(empleados, date, date_key)
    if (success === true){
        let doc_data = await statistic[date_key].find(query_date)
        let data = doc_data[0].toObject()
        let b_employees = data.employees
        b_employees.sort((a,b) => b.dinero_ventas - a.dinero_ventas);
        let money_employees = b_employees.slice(0,3)
        b_employees.sort((a,b) => b.num_ventas - a.num_ventas);
        let seller_employees = b_employees.slice(0,3)
        await statistic[date_key].findOneAndUpdate(query_date, {$set: {money_employees, seller_employees}})
    }
    
}


const process_clients = async(clientes, date, date_key)=>{
    let query_date = {[date_key]: date}
    let query_find = {}
    let query_client = {}
    let client_exists = undefined

    for (let client of clientes) {
        try{
            query_find = {[date_key]: date, clients: {$elemMatch: {nombre: client.nombre, nombre_empresa: client.nombre_empresa}}}
            query_client = {[date_key]: date, 'clients.nombre': client.nombre, 'clients.nombre_empresa': client.nombre_empresa}
            client_exists = await statistic[date_key].find(query_find)
            if(client_exists.length > 0){
                await statistic[date_key].findOneAndUpdate(query_client, {$inc: {'clients.$.dinero_compras': client.dinero_compras}})
                await statistic[date_key].findOneAndUpdate(query_client, {$inc: {'clients.$.num_compras': 1}})
                return true
            }else{
                await statistic[date_key].findOneAndUpdate(query_date, {$push: {clients: {nombre: client.nombre,nombre_empresa: client.nombre_empresa,dinero_compras: client.dinero_compras, num_compras: 1}}})
                return true
            }
        }catch(err){
            console.log(`error in process clients ${err}`);
            return false
        }
    }
}

const best_clients = async(clientes, date, date_key)=>{
    date = await process_date(date, date_key)
    let query_date = {[date_key]: date}
    let success = await process_clients(clientes, date, date_key)
    if (success === true){
        let doc_data = await statistic[date_key].find(query_date)
        let data = doc_data[0].toObject()
        let b_clients = data.clients
        b_clients.sort((a,b) => b.dinero_compras - a.dinero_compras);
        let rich_clients = b_clients.slice(0,5)
        b_clients.sort((a,b) => b.num_compras - a.num_compras);
        let frecuency_clients = b_clients.slice(0,5)
        await statistic[date_key].findOneAndUpdate(query_date, {$set: {rich_clients, frecuency_clients}})
    }
}

const get_statistics = async(req, res=response)=>{
    const {stat, date_key, date} = req.params;
    let query = {[date_key]: date}
    let results = await statistic[date_key].find(query);
    return  res.status(200).json({
        ok: true,
        statistics: results.length > 0 ? results[0] : [] 
    });
}

module.exports = {
    init_collections,
    most_selled_products,
    best_employees,
    best_clients,
    get_statistics
}