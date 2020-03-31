const Project = require('../models/Project.model')
const { validationResult } = require('express-validator')


exports.projectCreate = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() })
    }

    try {
        //Crear un nuevo proyecto
        const project = new Project(req.body)

        //Guardar el creador via JWT
        project.author = req.user.id

        //Guardar el proyecto
        project.save()
        res.json(project)

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ author: req.user.id }).sort({ register: -1 })
        res.json({ projects })
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.updateProject = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() })
    }

    //Extraer la información del proyecto
    const { name } = req.body
    const newProject = {}

    if (name) {
        newProject.name = name
    }

    try {
        //Revisar el ID
        let project = await Project.findById(req.params.id)

        //Existe el proyecto o no
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //Verifica el creador del proyecto
        if (project.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        //Actualizar proyecto
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true })
        res.json({ project })


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error al actualizar el proyecto')
    }
}

//Eliminar proyecto por ID
exports.deleteProject = async (req, res) => {
    try {
        // revisar el ID 
        let project = await Project.findById(req.params.id);

        // si el proyecto existe o no
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // verificar el creador del proyecto
        if (project.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Eliminar el Proyecto
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado ' })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}