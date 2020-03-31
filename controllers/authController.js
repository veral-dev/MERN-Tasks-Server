const User = require('../models/User.model')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.userAuth = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() })
    }
    //Extraer el email y el password
    const { email, password } = req.body

    try {
        //Revisar que sea un usuario registrado
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' })
        }

        //Revisar el password
        const correctPass = await bcryptjs.compare(password, user.password)
        if (!correctPass) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' })
        }

        //Si todo es correcto & Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }

        }
        //Firmar el token
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 //1hora
        }, (error, token) => {
            if (error) throw error

            //Mensaje de confirmación
            res.json({ token })

        })

    } catch (error) {
        console.log(error)
    }
}

exports.authUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({ user })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}