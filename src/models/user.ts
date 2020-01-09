export class User {
  id!: number;
  email!: string;
  password!: string;
  role!: string;

  constructor(input: User) {
    Object.assign(this, input);
}
}