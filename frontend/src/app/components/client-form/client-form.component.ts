import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.interface';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>{{ isEdit ? 'Edit Client' : 'Create New Client' }}</h2>
      <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Name</label>
          <input type="text" formControlName="name" placeholder="Client name" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="Client email" />
        </div>
        <div class="actions">
          <a routerLink="/clients" class="btn-cancel">Cancel</a>
          <button type="submit" [disabled]="clientForm.invalid">
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      .actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      .btn-cancel {
        padding: 10px 15px;
        text-decoration: none;
        color: #333;
        background: #eee;
        border-radius: 4px;
      }
    `,
  ],
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEdit = false;
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clientId = +id;
      this.clientService.getClient(this.clientId).subscribe((data) => {
        this.clientForm.patchValue({
          name: data.client.name,
          email: data.client.email,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      if (this.isEdit && this.clientId) {
        this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
          next: () => this.router.navigate(['/clients']),
          error: (err) => console.error(err),
        });
      } else {
        this.clientService.createClient(this.clientForm.value).subscribe({
          next: () => this.router.navigate(['/clients']),
          error: (err) => console.error(err),
        });
      }
    }
  }
}
