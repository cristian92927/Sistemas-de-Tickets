import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.interface';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Create New Ticket</h2>
      <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Client</label>
          <select formControlName="clientId">
            <option value="">Select Client</option>
            <option *ngFor="let client of clients" [value]="client.id">{{ client.name }}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Title</label>
          <input type="text" formControlName="title" placeholder="Brief summary of the issue">
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea formControlName="description" rows="5" placeholder="Detailed description"></textarea>
        </div>

        <div class="actions">
          <a routerLink="/tickets" class="btn-cancel">Cancel</a>
          <button type="submit" [disabled]="ticketForm.invalid">Create Ticket</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    .actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn-cancel { padding: 10px 15px; text-decoration: none; color: #333; background: #eee; border-radius: 4px; }
  `]
})
export class TicketFormComponent implements OnInit {
  ticketForm: FormGroup;
  clients: Client[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      clientId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      this.ticketService.createTicket(this.ticketForm.value).subscribe({
        next: () => this.router.navigate(['/tickets']),
        error: (err) => console.error(err)
      });
    }
  }
}
