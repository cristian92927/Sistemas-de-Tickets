import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Agent, AgentStats } from '../models/agent.interface';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = `${environment.apiUrl}/agents`;

  constructor(private http: HttpClient) { }

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl);
  }

  getAgent(id: number): Observable<{agent: Agent, stats: AgentStats}> {
    return this.http.get<{agent: Agent, stats: AgentStats}>(`${this.apiUrl}/${id}`);
  }

  createAgent(agent: Agent): Observable<any> {
    return this.http.post(this.apiUrl, agent);
  }
}
