const User = require('../models/User.model')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() })
    }

    //Extraer email y password
    const { email, password } = req.body

    try {
        //Revisar que el usuario registrado sea unico
        let user = await User.findOne({ email })
        console.log('user', user)
        if (user) {
            return res.status(400).json({ msg: "El usuario ya existe" })
        }

        //Crea un nuevo usuario
        user = new User(req.body)

        //Hashear el password
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(password, salt)

        //guardar el nuevo usuario
        await user.save()

        //Crear y firmar el JWT
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
        res.status(400).send('Hubo un error al crear el usuario')
    }

}