export interface User {
    id: number;
    username: string;
    knownAs: string;
    gender: string;
    dateOfBirth: any;
    lastActive: any;
    passwordHash: string;
    passwordSalt: string;
    created: string;
    token: string;
  }