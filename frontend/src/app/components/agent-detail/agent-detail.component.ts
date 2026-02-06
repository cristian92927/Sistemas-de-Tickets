import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { Agent, AgentStats } from '../../models/agent.interface';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" *ngIf="agent; else loading">
        <div class="header">
            <h2>Agent: {{ agent.name }}</h2>
            <a routerLink="/agents">Back to List</a>
        </div>
        <p><strong>Email:</strong> {{ agent.email }}</p>
        
        <div class="stats-card">
            <h3>Performance Stats</h3>
            <p>Active Tickets: <strong>{{ stats?.activeTickets || 0 }}</strong></p>
            <p>Resolved Tickets: <strong>{{ stats?.resolvedTickets || 0 }}</strong></p>
        </div>
    </div>
    <ng-template #loading>Loading...</ng-template>
  `,
  styles: [`
    .stats-card { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #ddd; }
  `]
})
export class AgentDetailComponent implements OnInit {
  agent: Agent | null = null;
  stats: AgentStats | null = null;

  constructor(private route: ActivatedRoute, private agentService: AgentService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.agentService.getAgent(+id).subscribe(data => {
        this.agent = data.agent;
        this.stats = data.stats;
      });
    }
  }
}
