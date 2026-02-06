import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ticket, TicketFilters, TicketResponse } from '../models/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) { }

  getTickets(filters: TicketFilters): Observable<TicketResponse> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.status) params = params.set('status', filters.status);
    if (filters.clientId) params = params.set('clientId', filters.clientId.toString());
    if (filters.agentId) params = params.set('agentId', filters.agentId.toString());
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);

    return this.http.get<TicketResponse>(this.apiUrl, { params });
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(ticket: {clientId: number, title: string, description: string}): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }

  assignTicket(id: number, agentId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/assign`, { agentId });
  }

  updateStatus(id: number, status: string, resolution?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status, resolution });
  }
}
