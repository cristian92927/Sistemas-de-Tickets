export interface Agent {
    id?: number;
    name: string;
    email: string;
    created_at?: string;
}

export interface AgentStats {
    activeTickets: number;
    resolvedTickets: number;
}
