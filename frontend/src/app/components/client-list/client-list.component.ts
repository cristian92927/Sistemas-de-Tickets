import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.interface';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="header">
      <h2>Clients</h2>
      <a routerLink="/clients/new" class="btn-new">Create New Client</a>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let client of clients">
          <td>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>
            <a [routerLink]="['/clients', client.id]">View Details</a> |
            <a [routerLink]="['/clients', client.id, 'edit']">Edit</a> |
            <button (click)="deleteClient(client.id)" class="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    `
      .header {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .btn-new {
        padding: 10px 15px;
        text-decoration: none;
        color: #fff;
        background: #007bff;
        border-radius: 4px;
        margin-left: 20px;
        white-space: nowrap;
      }
      .btn-delete {
        padding: 5px 10px;
        color: #fff;
        background: #dc3545;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe((data) => (this.clients = data));
  }

  deleteClient(id: number | undefined): void {
    if (id === undefined) return;
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.loadClients(),
        error: (err) => alert('Error deleting client'),
      });
    }
  }
}
