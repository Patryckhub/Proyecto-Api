const express = require ('express');
const jwt = require('jsonwebtoken');
const empleados = express.Router();
const db = require('../config/database');


empleados.post("/login", async (req, res, next) =>{
    const {nombre, correo} = req.body;
    const query = `SELECT * FROM empleados WHERE nombre = '${nombre}' AND correo = '${correo}';`;
    const rows = await db.query(query);
    console.log(rows);

    if(nombre && correo){
        if(rows.length == 1){
            const token = jwt.sign({
                nombre: rows[0].nombre,
                correo: rows[0].correo
            }, "debugkey");
            return res.status(200).json({code: 200, message: token});
        }
        else{
            return res.status(200).json({code: 401, message: "Usuario y/o contraseña incorrectos"});
        }
    }
    return res.status(500).json({code:500,message:"Campos incompletos"});
});

empleados.post("/signin", async (req,res,next) => {
    const {nombre, apellidos, telefono, correo, direccion} = req.body;

    if(nombre && apellidos && telefono && correo && direccion){
        let query ="INSERT INTO `empleados`(nombre, apellidos, telefono, correo, direccion)";
        query += ` VALUES ('${nombre}', '${apellidos}', ${telefono}, '${correo}', '${direccion}')`;

        const rows=await db.query(query);
        console.log(rows);

        if(rows.affectedRows == 1){
            return res.status(201).json({code: 201, message: "Empleado insertado correctamente "});
        }

        return res.status(500).json({code: 500, message: "Ocurrio un error"});

    }
    return res.status(500).json({code: 500, message:"Campos incompletos"});
});

empleados.delete("/eliminar", async (req, res, next) => {
    const {nombre} = req.body;

    const query = `DELETE FROM empleados WHERE nombre = '${nombre}'`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1){
        return res.status(200).json({code: 200, message: "Usuario borrado correctamente"});
    }else{
    return res.status(404).json({code:404,message:"Usuario no encontrado"});
    }

});

empleados.put("/modificar", async (req, res, next) => {
    const {nombre, nuevo, apellidos, telefono, correo, direccion} = req.body;

    if(nombre && nuevo && apellidos && telefono && correo && direccion){
        let query =`UPDATE empleados SET nombre='${nuevo}' ,apellidos= '${apellidos}',`;
        query += `telefono=${telefono},correo='${correo}',direccion='${direccion}' WHERE nombre = '${nombre}';`;

        const rows=await db.query(query);
        console.log(rows);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Empleado actualizado correctamente "});
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error"});

    }
    return res.status(500).json({code: 500, message:"Campos incompletos"});

});

empleados.get('/', async (req,res,next) => {
    const emp = await db.query("SELECT * FROM empleados");
    return res.status(200).json({code: 200, message: emp});
});

empleados.post('/buscar', async (req,res, next) =>{
    
    const {nombre} = req.body;
    const emp = await db.query("SELECT * FROM empleados WHERE UPPER(nombre) = UPPER('"+nombre+"')")

    if (emp.length > 0) 
    {
        return res.status(200).json({ code: 1 , message: emp});
    }else{
        return res.status(404).send({code: 404, message: "Empleado no encontrado"});
    }
});

/*empleados.get('/:id([0-9]{1,3})', async (req,res,next) => {
    const id = req.params.id;
    if (id >= 1 && id <= 722)
    {
        const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_id = " + id + ";");
        return res.status(200).json({ code: 200 , message: pkmn});
    }else{
        return res.status(404).send({code: 404, message: "Pokemon no encontrado"});
    }
}); */

/*pokemon.get('/:id([0-9]{1,3})', async (req,res,next) => {
    const id = req.params.id -1;
    (id >= 0 && id <= 150) ?
        res.status(200).send(pk[req.params.id - 1]) :
        res.status(404).send("Pokemon no encontrado");
});*/

module.exports = empleados;