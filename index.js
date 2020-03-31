const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

//Crear el servidor
const app = express()

//Conectar a la BBDD
connectDB()

//Habilitar cors
app.use(cors())

//Habilitar express.json
app.use(express.json({ extend: true }))

//Puerto de la app
const PORT = process.env.PORT || 5000

//Importar rutas
app.use('/api/users', require('./routes/user'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))



//Definir la página principal
app.get('/', (req, res) => {
    res.send('Hola mundo')
})

//Arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})
