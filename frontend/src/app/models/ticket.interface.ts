export interface Ticket {
    id?: number;
    client_id: number;
    agent_id?: number | null;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    resolution?: string;
    created_at?: string;
    updated_at?: string;
    client_name?: string;
    agent_name?: string;
}

export interface TicketFilters {
    status?: string;
    clientId?: number;
    agentId?: number;
    from?: string;
    to?: string;
    page: number;
    pageSize: number;
}

export interface TicketResponse {
    data: Ticket[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
