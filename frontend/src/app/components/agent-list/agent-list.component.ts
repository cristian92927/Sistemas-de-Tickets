import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { Agent } from '../../models/agent.interface';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="header">
        <h2>Agents</h2>
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
            <tr *ngFor="let agent of agents">
                <td>{{ agent.id }}</td>
                <td>{{ agent.name }}</td>
                <td>{{ agent.email }}</td>
                <td><a [routerLink]="['/agents', agent.id]">View Details</a></td>
            </tr>
        </tbody>
    </table>
  `,
  styles: [`
    .header { margin-bottom: 20px; }
  `]
})
export class AgentListComponent implements OnInit {
  agents: Agent[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agentService.getAgents().subscribe(data => this.agents = data);
  }
}
