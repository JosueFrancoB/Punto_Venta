const {Router} = require('express');
const {check} = require('express-validator');

const {getSales, getSaleById, createSale, updateSale, deleteSale, cancelSale} = require('../controllers/salesCtrl');

const router = Router();

// Get all sales
router.get('/', [], getSales);


// Get one sale by id
router.get('/:id', [], getSaleById);


// Create a sale
router.post('/', [], createSale);


// Update a sale
router.patch('/:id', [], updateSale);


// Delete a sale
router.delete('/:id', [], deleteSale);


// Cancel a sale
router.patch('/cancel/:id', [], cancelSale);


module.exports = router;