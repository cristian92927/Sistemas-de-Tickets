import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { AgentService } from '../../services/agent.service';
import { Ticket } from '../../models/ticket.interface';
import { Agent } from '../../models/agent.interface';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  agents: Agent[] = [];
  assignForm: FormGroup;
  statusForm: FormGroup;
  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private agentService: AgentService,
    private fb: FormBuilder
  ) {
    this.assignForm = this.fb.group({
      agentId: ['', Validators.required]
    });

    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      resolution: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(+id);
    }
    this.loadAgents();

    // Conditional validator for resolution
    this.statusForm.get('status')?.valueChanges.subscribe(status => {
      const resolutionControl = this.statusForm.get('resolution');
      if (status === 'RESOLVED') {
        resolutionControl?.setValidators(Validators.required);
      } else {
        resolutionControl?.clearValidators();
      }
      resolutionControl?.updateValueAndValidity();
    });
  }

  loadTicket(id: number): void {
    this.ticketService.getTicket(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.statusForm.patchValue({ 
          status: data.status,
          resolution: data.resolution 
        });
        if (data.agent_id) {
          this.assignForm.patchValue({ agentId: data.agent_id });
        }
      },
      error: (err) => this.errorMsg = 'Error loading ticket'
    });
  }

  loadAgents(): void {
    this.agentService.getAgents().subscribe(data => this.agents = data);
  }

  onAssign(): void {
    if (this.assignForm.invalid || !this.ticket) return;

    const agentId = this.assignForm.value.agentId;
    this.errorMsg = '';
    this.successMsg = '';

    this.ticketService.assignTicket(this.ticket.id!, agentId).subscribe({
      next: () => {
        this.successMsg = 'Agent assigned successfully';
        this.loadTicket(this.ticket!.id!);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to assign agent';
      }
    });
  }

  onUpdateStatus(): void {
    if (this.statusForm.invalid || !this.ticket) return;

    const { status, resolution } = this.statusForm.value;
    this.errorMsg = '';
    this.successMsg = '';

    this.ticketService.updateStatus(this.ticket.id!, status, resolution).subscribe({
      next: () => {
        this.successMsg = 'Status updated successfully';
        this.loadTicket(this.ticket!.id!);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to update status';
      }
    });
  }
}
