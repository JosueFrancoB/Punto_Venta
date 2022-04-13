const {Router} = require('express');
const {getFinances} = require('../controllers/financesCtrl');
const router = Router();

router.get('/', [], getFinances);

module.exports = router;