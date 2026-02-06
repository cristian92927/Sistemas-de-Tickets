const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the client
 *         name:
 *           type: string
 *           description: The name of the client
 *         email:
 *           type: string
 *           description: The email of the client
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the client was added
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Returns the list of all the clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: The list of the clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
router.get("/", clientsController.getClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get the client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client description by id
 *       404:
 *         description: The client was not found
 */
router.get("/:id", clientsController.getClientById);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: The client was successfully created
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Some server error
 */
router.post("/", clientsController.createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: The client was updated
 *       404:
 *         description: The client was not found
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Some server error
 */
router.put("/:id", clientsController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client was deleted
 *       404:
 *         description: The client was not found
 *       500:
 *         description: Some server error
 */
router.delete("/:id", clientsController.deleteClient);

module.exports = router;
