//Rutas para crear usuarios
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')

//Crear un usuario
//Api/usuarios
router.post('/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min: 6 })
    ],
    userController.createUser
)
module.exports = router