const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

// api/projects
router.post('/',
    auth,
    [
        check('name', ' El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.projectCreate)

//Obtener proyectos
router.get('/',
    auth,
    projectController.getProjects)

//Actualizar proyectos por ID
router.put('/:id',
    auth,
    [
        check('name', ' El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.updateProject)

//Eliminar proyecto
router.delete('/:id',
    auth,
    projectController.deleteProject)

module.exports = router