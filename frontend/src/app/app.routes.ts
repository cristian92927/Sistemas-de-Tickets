import { Routes } from '@angular/router';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';

import { AgentListComponent } from './components/agent-list/agent-list.component';
import { AgentDetailComponent } from './components/agent-detail/agent-detail.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
import { ClientFormComponent } from './components/client-form/client-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  { path: 'tickets', component: TicketListComponent },
  { path: 'tickets/new', component: TicketFormComponent },
  { path: 'tickets/:id', component: TicketDetailComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/:id/edit', component: ClientFormComponent },
  { path: 'clients/:id', component: ClientDetailComponent },
  { path: 'agents', component: AgentListComponent },
  { path: 'agents/:id', component: AgentDetailComponent },
];
