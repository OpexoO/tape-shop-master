import { ONLY_SPACES } from '@/constants/regex';
import { Category as ICategory } from '@/interfaces/category';
import Category from '@/models/Category';
import { Types } from 'mongoose';

export default class CategoryService {
  public static fromServer(
    data: Record<string, string> | Record<string, string>[],
  ): ICategory | ICategory[] {
    const mapObject = (o: Record<string, string>) => ({
      _id: o._id.toString(),
      id: o._id.toString(),
      name: o.name,
      imageUrl: o.imageUrl,
    });

    if (Array.isArray(data)) {
      return data.map(mapObject);
    }

    return mapObject(data);
  }

  public static trimName(name: string): string {
    if (!name) {
      return '';
    }

    return name.trim().replace(ONLY_SPACES, ' ');
  }

  public static getById(id: string) {
    return Category.findById<ICategory>(new Types.ObjectId(id));
  }
}
