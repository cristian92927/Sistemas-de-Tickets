const { sql, getDB } = require("../config/db");

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const pool = await getDB();
    const result = await new pool.Request().query(
      "SELECT * FROM clients ORDER BY created_at DESC",
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get client by ID (with tickets)
exports.getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getDB();

    const clientResult = await new pool.Request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM clients WHERE id = @id");

    if (clientResult.recordset.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    const ticketsResult = await new pool.Request()
      .input("clientId", sql.Int, id)
      .query(
        "SELECT * FROM tickets WHERE client_id = @clientId ORDER BY created_at DESC",
      );

    res.json({
      client: clientResult.recordset[0],
      tickets: ticketsResult.recordset,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create client
exports.createClient = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const pool = await getDB();

    await new pool.Request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .query("INSERT INTO clients (name, email) VALUES (@name, @email)");

    res.status(201).json({ message: "Client created successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE KEY")) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const pool = await getDB();
    const result = await new pool.Request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .query("UPDATE clients SET name = @name, email = @email WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client updated successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE KEY")) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getDB();
    const result = await new pool.Request()
      .input("id", sql.Int, id)
      .query("DELETE FROM clients WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
