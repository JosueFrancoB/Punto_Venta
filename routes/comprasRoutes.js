const {Router} = require('express');
const {getPurchases, getPurchaseById, createPurchase, updatePurchase, deletePurchase} = require('../controllers/purchasesCtrl');
const router = Router();

// Get all purchases
router.get('/', [], getPurchases);

// Get one purchase by id
router.get('/:id', [], getPurchaseById);

// Create a purchase
router.post('/', [], createPurchase);

// Update a purchase
router.patch('/:id', [], updatePurchase);

// Delete a purchase
router.delete('/:id', [], deletePurchase);


module.exports = router;