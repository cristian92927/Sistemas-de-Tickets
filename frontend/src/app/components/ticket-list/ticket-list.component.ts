import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { ClientService } from '../../services/client.service';
import { AgentService } from '../../services/agent.service';
import { Ticket, TicketFilters } from '../../models/ticket.interface';
import { Client } from '../../models/client.interface';
import { Agent } from '../../models/agent.interface';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  clients: Client[] = [];
  agents: Agent[] = [];
  
  filterForm: FormGroup;
  
  page = 1;
  pageSize = 10;
  total = 0;
  totalPages = 0;

  constructor(
    private ticketService: TicketService,
    private clientService: ClientService,
    private agentService: AgentService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      clientId: [''],
      agentId: [''],
      from: [''],
      to: ['']
    });
  }

  ngOnInit(): void {
    this.loadOptions();
    this.loadTickets();

    this.filterForm.valueChanges.subscribe(() => {
      this.page = 1; // Reset to page 1 on filter change
      this.loadTickets();
    });
  }

  loadOptions(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
    this.agentService.getAgents().subscribe(data => this.agents = data);
  }

  loadTickets(): void {
    const filters: TicketFilters = {
      ...this.filterForm.value,
      page: this.page,
      pageSize: this.pageSize
    };

    // Clean empty values
    if (!filters.status) delete filters.status;
    if (!filters.clientId) delete filters.clientId;
    if (!filters.agentId) delete filters.agentId;
    if (!filters.from) delete filters.from;
    if (!filters.to) delete filters.to;

    this.ticketService.getTickets(filters).subscribe(response => {
      this.tickets = response.data;
      this.total = response.total;
      this.totalPages = response.totalPages;
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadTickets();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadTickets();
    }
  }
}
