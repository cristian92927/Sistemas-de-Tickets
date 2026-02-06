import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClient(id: number): Observable<{ client: Client; tickets: any[] }> {
    return this.http.get<{ client: Client; tickets: any[] }>(`${this.apiUrl}/${id}`);
  }

  createClient(client: Client): Observable<any> {
    return this.http.post(this.apiUrl, client);
  }

  updateClient(id: number, client: Client): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
