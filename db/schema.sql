Create Database (Optional, depending on environment permissions)
CREATE DATABASE TicketSystem;
GO
USE TicketSystem;
GO

-- Create Clients Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[clients]') AND type in (N'U'))
BEGIN
    CREATE TABLE clients (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Create Agents Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[agents]') AND type in (N'U'))
BEGIN
    CREATE TABLE agents (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Create Tickets Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tickets]') AND type in (N'U'))
BEGIN
    CREATE TABLE tickets (
        id INT IDENTITY(1,1) PRIMARY KEY,
        client_id INT NOT NULL,
        agent_id INT NULL,
        title NVARCHAR(200) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        status NVARCHAR(20) NOT NULL DEFAULT 'OPEN',
        resolution NVARCHAR(MAX) NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        
        CONSTRAINT FK_Ticket_Client FOREIGN KEY (client_id) REFERENCES clients(id),
        CONSTRAINT FK_Ticket_Agent FOREIGN KEY (agent_id) REFERENCES agents(id),
        CONSTRAINT CHK_Status CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED'))
    );
END
GO

-- Add indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tickets_AgentId' AND object_id = OBJECT_ID('tickets'))
BEGIN
    CREATE INDEX IX_Tickets_AgentId ON tickets(agent_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tickets_Status' AND object_id = OBJECT_ID('tickets'))
BEGIN
    CREATE INDEX IX_Tickets_Status ON tickets(status);
END
GO

INSERT INTO dbo.agents ([name], [email]) VALUES
(N'Ana Torres', N'ana.torres@example.com'),
(N'Carlos Ruiz', N'carlos.ruiz@example.com'),
(N'Lucía Gómez', N'lucia.gomez@example.com'),
(N'Pedro Sánchez', N'pedro.sanchez@example.com'),
(N'María López', N'maria.lopez@example.com');
GO
