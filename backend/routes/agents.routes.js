const express = require('express');
const router = express.Router();
const agentsController = require('../controllers/agents.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the agent
 *         name:
 *           type: string
 *           description: The name of the agent
 *         email:
 *           type: string
 *           description: The email of the agent
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the agent was added
 */

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Returns the list of all the agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: The list of the agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 */
router.get('/', agentsController.getAgents);

/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: Get the agent by id with stats
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The agent id
 *     responses:
 *       200:
 *         description: The agent description by id
 *       404:
 *         description: The agent was not found
 */
router.get('/:id', agentsController.getAgentById);

/**
 * @swagger
 * /agents:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agent'
 *     responses:
 *       201:
 *         description: The agent was successfully created
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Some server error
 */
router.post('/', agentsController.createAgent);

module.exports = router;
