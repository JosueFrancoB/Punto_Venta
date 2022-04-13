const {response, request} = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const Venta = require('../models/venta');


/**
 * @api {get} Obtiene todas las ventas y el total de ventas en un rango de fechas
 * @param  {string} date_ini
 * @param  {string} date_end
 */

const getFinances = async (req, res) => {
    
    const {date_ini, date_end} = req.query;
    let date_start = moment(date_ini).toISOString();
    let date_end_ = moment(date_end).toISOString();

    const sales = await Venta.find({fecha: {$gte: date_start, $lte: date_end_}});
    const sales_report = [];
    let total_incomes = 0;
    sales.forEach(sale => {
        const data = {
            fecha: sale.fecha,
            cliente: sale.cliente.nombre,
            total: sale.total_a_pagar,
            atendio: sale.usuario_venta.nombre
        };
        sales_report.push(data);
        total_incomes += sale.total_a_pagar;
    });

    return res.status(200).json({
        ok: true,
        sales: sales_report,
        total_incomes
    });
};

module.exports = { getFinances };