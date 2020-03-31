const Task = require('../models/Task.model')
const Project = require('../models/Project.model')
const { validationResult } = require('express-validator')


//Crear una nueva tarea
exports.taskCreate = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() })
    }

    //Extraer el proyecto

    const { project } = req.body

    try {
        const projectExist = await Project.findById(project)
        if (!projectExist) {
            return res.status(401).json({ msg: 'Proyecto no encontrado' })
        }
        //Revisar si el proyecto pertenece al usuario autenticado
        if (projectExist.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        //Crear la tarea
        const task = new Task(req.body)
        await task.save()
        res.json({ task })


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error al crear la tarea')
    }

}

//Obtener las tareas de un proyecto
exports.getTasks = async (req, res) => {

    const { project } = req.query

    try {
        const projectExist = await Project.findById(project)
        if (!projectExist) {
            return res.status(401).json({ msg: 'Proyecto no encontrado' })
        }
        //Revisar si el proyecto pertenece al usuario autenticado
        if (projectExist.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        //Obtener la tarea
        const tasks = await Task.find({ project }).sort({ register: -1 })
        res.json({ tasks })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Actualizar una tarea
exports.updateTask = async (req, res) => {
    try {
        const { project, name, state } = req.body

        let task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ msg: 'No existe la tarea' })

        const projectExist = await Project.findById(project)

        //Revisar si el proyecto pertenece al usuario autenticado
        if (projectExist.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        //Crear un objeto con la una info
        const newTask = {}
        newTask.name = name
        newTask.state = state

        //Guardar la tarea
        task = await Task.findByIdAndUpdate({ _id: req.params.id }, newTask, { new: true })
        res.json({ task })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

//Eliminar tarea
exports.deleteTask = async (req, res) => {
    try {
        const { project } = req.query

        let task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ msg: 'No existe la tarea' })

        const projectExist = await Project.findById(project)

        //Revisar si el proyecto pertenece al usuario autenticado
        if (projectExist.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        //Eliminar tarea
        await Task.findByIdAndRemove({ _id: req.params.id })
        res.json({ msg: 'Tarea eliminada' })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

