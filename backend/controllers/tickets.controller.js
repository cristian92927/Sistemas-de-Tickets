const { sql, getDB } = require('../config/db');

// Get tickets with filters and pagination
exports.getTickets = async (req, res) => {
    try {
        const { status, clientId, agentId, from, to, page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;
        const pool = await getDB();
        
        let query = 'SELECT t.*, c.name as client_name, a.name as agent_name FROM tickets t LEFT JOIN clients c ON t.client_id = c.id LEFT JOIN agents a ON t.agent_id = a.id WHERE 1=1';
        const request = new pool.Request();

        if (status) {
            query += ' AND t.status = @status';
            request.input('status', sql.NVarChar, status);
        }
        if (clientId) {
            query += ' AND t.client_id = @clientId';
            request.input('clientId', sql.Int, clientId);
        }
        if (agentId) {
            query += ' AND t.agent_id = @agentId';
            request.input('agentId', sql.Int, agentId);
        }
        if (from) {
            query += ' AND t.created_at >= @from';
            request.input('from', sql.DateTime, new Date(from));
        }
        if (to) {
            query += ' AND t.created_at <= @to';
            request.input('to', sql.DateTime, new Date(to));
        }

        // Count total for pagination
        const countQuery = query.replace('t.*, c.name as client_name, a.name as agent_name', 'COUNT(*) as total');
        const countResult = await request.query(countQuery);
        const total = countResult.recordset[0].total;

        // Fetch data
        query += ' ORDER BY t.created_at DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY';
        request.input('offset', sql.Int, parseInt(offset));
        request.input('pageSize', sql.Int, parseInt(pageSize));

        const result = await request.query(query);

        res.json({
            data: result.recordset,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total,
            totalPages: Math.ceil(total / pageSize)
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Ticket
exports.createTicket = async (req, res) => {
    const { clientId, title, description } = req.body;
    
    if (!clientId || !title || !description) {
        return res.status(400).json({ message: 'Client ID, title, and description are required' });
    }

    try {
        const pool = await getDB();
        
        // Verify client exists
        const clientCheck = await new pool.Request()
            .input('id', sql.Int, clientId)
            .query('SELECT id FROM clients WHERE id = @id');
            
        if (clientCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }

        await new pool.Request()
            .input('clientId', sql.Int, clientId)
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description)
            .query('INSERT INTO tickets (client_id, title, description, status) VALUES (@clientId, @title, @description, \'OPEN\')');

        res.status(201).json({ message: 'Ticket created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Ticket by ID
exports.getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getDB();
        const result = await new pool.Request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM tickets WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Assign Ticket
exports.assignTicket = async (req, res) => {
    const { id } = req.params;
    const { agentId } = req.body; // Allow unassigning if null? Prompt implies "Assignar". Assuming required.

    if (!agentId) {
        return res.status(400).json({ message: 'Agent ID is required' });
    }

    try {
        const pool = await getDB();
        
        // Check ticket exists
        const ticketCheck = await new pool.Request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM tickets WHERE id = @id');
            
        if (ticketCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        const ticket = ticketCheck.recordset[0];
        if (ticket.status === 'RESOLVED') {
             return res.status(400).json({ message: 'Cannot assign agent to a RESOLVED ticket' });
        }

        // Check agent exists
        const agentCheck = await new pool.Request()
            .input('agentId', sql.Int, agentId)
            .query('SELECT id FROM agents WHERE id = @agentId');
            
        if (agentCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // If ticket is already IN_PROGRESS, check if NEW agent can accept it?
        // Rules say: "Un agente no puede tener más de 5 tickets en IN_PROGRESS".
        // Usage: If I assign ticket (OPEN) to Agent, it's just assigned. If I assign ticket (IN_PROGRESS) to Agent, that Agent must have slots.
        
        if (ticket.status === 'IN_PROGRESS') {
             const agentStats = await new pool.Request()
                .input('agentId', sql.Int, agentId)
                .query("SELECT COUNT(*) as count FROM tickets WHERE agent_id = @agentId AND status = 'IN_PROGRESS'");
            
             if (agentStats.recordset[0].count >= 5) {
                 return res.status(400).json({ message: 'Agent has reached maximum capacity of 5 IN_PROGRESS tickets' });
             }
        }

        // Update
        await new pool.Request()
            .input('id', sql.Int, id)
            .input('agentId', sql.Int, agentId)
            .query('UPDATE tickets SET agent_id = @agentId, updated_at = GETDATE() WHERE id = @id');

        res.json({ message: 'Agent assigned successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Status
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status, resolution } = req.body; // status: OPEN, IN_PROGRESS, RESOLVED

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const pool = await getDB();
        const ticketCheck = await new pool.Request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM tickets WHERE id = @id');

        if (ticketCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const ticket = ticketCheck.recordset[0];

        // Transitions Logic
        if (ticket.status === 'RESOLVED') {
            return res.status(400).json({ message: 'Cannot change status of a RESOLVED ticket' });
        }

        if (status === 'RESOLVED') {
            if (ticket.status === 'OPEN') {
                return res.status(400).json({ message: 'Cannot go from OPEN to RESOLVED directly' });
            }
            if (!resolution || resolution.trim() === '') {
                return res.status(400).json({ message: 'Resolution text is required when resolving a ticket' });
            }
        }

        if (status === 'IN_PROGRESS') {
            if (!ticket.agent_id) {
                return res.status(400).json({ message: 'Cannot move to IN_PROGRESS without an assigned agent' });
            }
            
            // Limit check for the assigned agent
            // We assume agent is already assigned.
            const agentStats = await new pool.Request()
                .input('agentId', sql.Int, ticket.agent_id)
                .query("SELECT COUNT(*) as count FROM tickets WHERE agent_id = @agentId AND status = 'IN_PROGRESS'");
            // Use count logic: if we are moving THIS ticket to IN_PROGRESS, it currently IS NOT.
            // So existing count + 1 must be <= 5. i.e., existing count < 5.
            
            if (agentStats.recordset[0].count >= 5) {
                 return res.status(400).json({ message: 'Assigned agent has reached maximum capacity of 5 IN_PROGRESS tickets' });
            }
        }

        // Perform Update
        const request = new pool.Request()
            .input('id', sql.Int, id)
            .input('status', sql.NVarChar, status);
        
        if (status === 'RESOLVED') {
            request.input('resolution', sql.NVarChar, resolution);
            await request.query('UPDATE tickets SET status = @status, resolution = @resolution, updated_at = GETDATE() WHERE id = @id');
        } else {
             await request.query('UPDATE tickets SET status = @status, updated_at = GETDATE() WHERE id = @id');
        }

        res.json({ message: 'Status updated successfully' });

    } catch (err) {
         res.status(500).json({ message: err.message });
    }
};
