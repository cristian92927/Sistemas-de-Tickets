const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - client_id
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the ticket
 *         client_id:
 *           type: integer
 *           description: The client id
 *         agent_id:
 *           type: integer
 *           description: The assigned agent id
 *         title:
 *           type: string
 *           description: The ticket title
 *         description:
 *           type: string
 *           description: The ticket description
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED]
 *           description: The ticket status
 *         resolution:
 *           type: string
 *           description: The resolution notes
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the ticket was created
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Returns the list of tickets with filters
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED]
 *         description: Filter by status
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         description: Filter by client ID
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: integer
 *         description: Filter by agent ID
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Page size
 *     responses:
 *       200:
 *         description: The list of tickets
 */
router.get('/', ticketsController.getTickets);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - title
 *               - description
 *             properties:
 *               clientId:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: The ticket was successfully created
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Client not found
 */
router.post('/', ticketsController.createTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get the ticket by id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket id
 *     responses:
 *       200:
 *         description: The ticket description by id
 *       404:
 *         description: The ticket was not found
 */
router.get('/:id', ticketsController.getTicketById);

/**
 * @swagger
 * /tickets/{id}/assign:
 *   patch:
 *     summary: Assign an agent to a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agentId
 *             properties:
 *               agentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Agent assigned successfully
 *       400:
 *         description: Agent has max tickets or other validation error
 *       404:
 *         description: Ticket or Agent not found
 */
router.patch('/:id/assign', ticketsController.assignTicket);

/**
 * @swagger
 * /tickets/{id}/status:
 *   patch:
 *     summary: Update ticket status
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ticket id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED]
 *               resolution:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status transition or missing resolution
 *       404:
 *         description: Ticket not found
 */
router.patch('/:id/status', ticketsController.updateStatus);

module.exports = router;
