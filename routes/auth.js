//Rutas para autenticar usuarios
const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')


//Iniciar sesión
//api/auth
router.post('/',
    authController.userAuth
)
//Obtiene usuario autenticado
router.get('/',
    auth,
    authController.authUser
)

module.exports = router