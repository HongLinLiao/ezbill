export class UserUpdateError extends Error {
  name: string = 'UserUpdateError';
  constructor(message: string) {
    super(message);
  }
}
