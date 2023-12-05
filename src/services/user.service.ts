import { NewUser, User } from '@/interfaces/user';
import storageKeys from '@/constants/storageKeys';
import LocalStorageService from './storage.service';

export default class UserService {
  public static getUserToken(): string {
    return LocalStorageService.get<string>(storageKeys.Auth) || '';
  }

  public static setUserToken(token: string): void {
    LocalStorageService.set<string>(storageKeys.Auth, token);
  }

  public static deleteUserToken(): void {
    LocalStorageService.delete(storageKeys.Auth);
  }

  public static getSession(): string {
    return LocalStorageService.get<string>(storageKeys.SessionId) || '';
  }

  public static setSession(id: string): void {
    LocalStorageService.set<string>(storageKeys.SessionId, id);
  }

  public static deleteSession(): void {
    LocalStorageService.delete(storageKeys.SessionId);
  }

  public static newUser(body: any): NewUser {
    return ({
      name: body.name,
      email: body.email,
      password: body.password,
    });
  }

  public static toServer(email: string, name: string, password: string, hash: string): NewUser {
    return ({
      name,
      email,
      password,
      hash,
    });
  }

  public static fromServer(user: any): User {
    return ({
      _id: user._id?.toString(),
      id: user._id?.toString(),
      email: user.email,
      name: user.name,
      confirmed: user.confirmed,
      isAdmin: user.isAdmin,
    });
  }
}
