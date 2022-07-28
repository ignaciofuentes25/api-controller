import { login, validarAcceso } from "../middleware/auth.middleware";
import * as swaggerDocument from "../api-docs/v1.swagger.json";
import bodyParser from "body-parser";

const express = require("express");
const routerlogin = express.Router();

const swaggerDoc = express({ caseSensitive: false });
const v1 = express({ caseSensitive: false });

const swaggerUi = require("swagger-ui-express");

v1.use(bodyParser.json({ type: "application/*+json" }));

/**
 * Endpoints Otros
 */

v1.use("/login", routerlogin.post("/", login));

/**
 * Endpoint para Swagger
 */

v1.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Endpoints CRGA_CARGAS
 */

v1.use("/repositorio", require("./v1/repositorio.route"));

module.exports = { swaggerDoc, v1 }; //{ v1, v2 }
