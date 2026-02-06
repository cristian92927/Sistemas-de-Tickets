import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.interface';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" *ngIf="client; else loading">
        <div class="header">
            <h2>Client: {{ client.name }}</h2>
            <a routerLink="/clients">Back to List</a>
        </div>
        <p><strong>Email:</strong> {{ client.email }}</p>
        <p><strong>Joined:</strong> {{ client.created_at | date }}</p>

        <h3>Tickets History</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let ticket of tickets">
                    <td>{{ ticket.id }}</td>
                    <td>{{ ticket.title }}</td>
                    <td><span class="status-badge" [ngClass]="{
                        'status-open': ticket.status === 'OPEN',
                        'status-in-progress': ticket.status === 'IN_PROGRESS',
                        'status-resolved': ticket.status === 'RESOLVED'
                      }">{{ ticket.status }}</span></td>
                    <td>{{ ticket.created_at | date }}</td>
                    <td><a [routerLink]="['/tickets', ticket.id]">View</a></td>
                </tr>
                 <tr *ngIf="tickets.length === 0"><td colspan="5">No tickets.</td></tr>
            </tbody>
        </table>
    </div>
    <ng-template #loading>Loading...</ng-template>
  `
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  tickets: any[] = [];

  constructor(private route: ActivatedRoute, private clientService: ClientService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientService.getClient(+id).subscribe(data => {
        this.client = data.client;
        this.tickets = data.tickets;
      });
    }
  }
}
