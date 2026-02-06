const { sql, getDB } = require('../config/db');

// Get all agents
exports.getAgents = async (req, res) => {
    try {
        const pool = await getDB();
        const result = await new pool.Request().query('SELECT * FROM agents ORDER BY created_at DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get agent by ID with stats
exports.getAgentById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getDB();
        
        const agentResult = await new pool.Request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM agents WHERE id = @id');

        if (agentResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Stats
        const statsResult = await new pool.Request()
            .input('agentId', sql.Int, id)
            .query(`
                SELECT 
                    SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as activeTickets,
                    SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolvedTickets
                FROM tickets 
                WHERE agent_id = @agentId
            `);

        res.json({
            agent: agentResult.recordset[0],
            stats: statsResult.recordset[0]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create agent
exports.createAgent = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
        const pool = await getDB();
        
        await new pool.Request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .query('INSERT INTO agents (name, email) VALUES (@name, @email)');

        res.status(201).json({ message: 'Agent created successfully' });
    } catch (err) {
        if (err.message.includes('UNIQUE KEY')) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: err.message });
    }
};
