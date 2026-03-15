import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { User } from '../../models/User';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-users',
  imports: [
    TranslateModule,
    TableModule,
    Button,
    InputTextModule,
    SkeletonModule,
    IconFieldModule,
    InputIconModule,
    Tooltip,
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users implements OnInit {
  private usersService = inject(UsersService);

  @ViewChild('dt') dt!: Table;

  users: User[] = [];
  loading = signal(true);
  skeletonRows = Array.from({ length: 10 }, (_, i) => ({ id: i }));

  ngOnInit(): void {
    setTimeout(() => {
      this.users = this.usersService.getUsers();
      this.loading.set(false);
    }, 1500);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'startsWith');
  }
}
