const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {login, googleSignIn, revalidarToken} = require('../controllers/authCtrl');

const router = Router();


router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener 6 o más caracteres').isLength(6),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El id token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

// Logout
// router.post('/logout', db_connection, logout);

router.get('/validate', validarJWT, (req, res = response) => {
    res.status(200).json({
        usuario: req.usuario,
        ok: true
    })
})

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;