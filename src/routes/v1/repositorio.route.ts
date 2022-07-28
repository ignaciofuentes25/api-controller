import { getStopForever } from "../../mvc/v1/controller/repositorio.controller";

/**
 * API Version: v1
 *
 */
const express = require("express");
const router = express.Router();
//indicar la ubicación del controller segun versión de la API

/*
VERBOS
*********************************************************************
GET:    Obtener entidad(es)
POST:   Crear una entidad
PUT:    Modificar una entidad o crear una nueva en caso de no existir
PATCH:  Modificar parcialmente una entidad
DELETE: Eliminar una entidad
*********************************************************************
*/

router.get("/detener", getStopForever);

module.exports = router;
