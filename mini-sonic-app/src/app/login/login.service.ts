import { Injectable } from "@angular/core";

import { USERS } from "../dummydata/users";
import { User } from "./user.model";


@Injectable({ providedIn: 'root' })

export class LoginService {

  users = USERS;
  nextID = 0;

  constructor() {
    const users = localStorage.getItem('users');

    if (users) {
      this.users = JSON.parse(users);
          this.nextID = Math.max(...this.users.map(u => u.id)) + 1;
        }
  }
  checkIfExists(user: User): boolean {
    return !!this.users.find(
      u => u.email === user.email || u.name === user.name
    );
  }


  getUser(email: string ) {
    return this.users.find(u => u.email === email)
  }

  addNewUser(user: User) {
    if (this.checkIfExists(user)) {
      console.log(`${user.name} already exists`);
      return false;
    }
    user.id = this.nextID++;
    this.users.push({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    });

    console.log(`${user.name} added successfully`);
    this.saveUsers();
    return true;

  }
  private saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  isValidLogin(email: string, password: string) {
    return this.users.find((u) => u.email === email && u.password === password);
  }

  removeUser(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
    this.saveUsers();
  }







}