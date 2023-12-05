import SALT from '@/constants/salt';
import { genSalt, hash, compare } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

export default class HashHandlerService {
  private static tokenType: string = 'Bearer';

  public static async hashData(password: string): Promise<string> {
    const salt = await genSalt(SALT);
    return hash(password, salt);
  }

  public static async compareHash(data: string, hashData: string): Promise<boolean> {
    return compare(data, hashData);
  }

  public static createToken(id: string, email: string, isAdmin: boolean): Promise<string> {
    return new Promise((res, rej) => {
      sign(
        { id, email, isAdmin },
        process.env.SECRET_KEY as string,
        { expiresIn: isAdmin ? process.env.JWT_EXPIRES_ADMIN : process.env.JWT_EXPIRES },
        (err, token) => {
          if (err) {
            rej(err);
          } else {
            res(token || '');
          }
        },
      );
    });
  }

  public static verifyToken(authHeader: string = ''): Promise<JwtPayload | false> {
    return new Promise((res) => {
      if (!authHeader) {
        res(false);
        return;
      }

      const [type, token] = authHeader.split(' ');
      if (type !== this.tokenType || !token) {
        res(false);
        return;
      }

      verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
        if (err) {
          res(false);
        } else {
          res(decoded as JwtPayload || {});
        }
      });
    });
  }

  public static verifyAdminToken(authHeader: string = ''): Promise<boolean> {
    return new Promise((res) => {
      if (!authHeader) {
        res(false);
        return;
      }

      const [type, token] = authHeader.split(' ');
      if (type !== this.tokenType || !token) {
        res(false);
        return;
      }

      verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
        if (err) {
          res(false);
        } else {
          const { isAdmin } = decoded as JwtPayload;
          res(isAdmin);
        }
      });
    });
  }
}
