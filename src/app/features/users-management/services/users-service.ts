import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly users: User[] = this.generateDummyUsers(60);

  public getUsers(): User[] {
    return [...this.users];
  }

  private generateDummyUsers(count: number): User[] {
    return Array.from({ length: count }, (_, index) => {
      const serial = index + 1;
      const paddedSerial = serial.toString().padStart(2, '0');

      return {
        username: `user${paddedSerial}`,
        fullName: `User ${paddedSerial} Fullname`,
        email: `user${paddedSerial}@example.com`,
        phoneNumber: `+1-555-${(1000 + serial).toString().padStart(4, '0')}`,
      };
    });
  }
}
