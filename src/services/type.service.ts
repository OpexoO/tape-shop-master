import { ONLY_SPACES } from '@/constants/regex';
import { NewType, Type } from '@/interfaces/type';
import { Types } from 'mongoose';
// eslint-disable-next-line import/no-named-default
import { default as TypeModel } from '@/models/Type';
import { Category } from '@/interfaces/category';
import CategoryService from './category.service';

export default class TypeService {
  public static generateId(name: string): string {
    if (!name) {
      return '';
    }

    return this.trimName(name).toLowerCase().replace(ONLY_SPACES, '-');
  }

  public static toServer(newType: Partial<NewType>): Partial<NewType> {
    let obj: Partial<NewType> = {};

    if (newType.id) {
      obj = { ...obj, id: newType.id };
    }
    if (newType.name) {
      obj = { ...obj, name: this.trimName(newType.name) };
    }
    if (newType.categories) {
      obj = { ...obj, categories: newType.categories.map((c) => new Types.ObjectId(c)) };
    }

    return obj;
  }

  public static fromServer(data: Record<string, string> | Record<string, string>[]): Type | Type[] {
    const mapObject = (o: Record<string, string | Category[]>): Type => ({
      _id: o._id.toString(),
      id: o.id as string,
      categories: CategoryService.fromServer(
        (o.categories as unknown as Record<string, string>[]) || [],
      ) as Category[],
      name: o.name as string,
    });

    if (Array.isArray(data)) {
      return data.map(mapObject);
    }

    return mapObject(data);
  }

  public static findAll(): Promise<Type[]> {
    return TypeModel.find({}).lean();
  }

  public static findById(id: string): Promise<Type> {
    return TypeModel.findOne({ id }).populate('categories').exec();
  }

  private static trimName(name: string): string {
    const newName = name.trim().replace(ONLY_SPACES, ' ').toLocaleLowerCase();
    return newName.charAt(0).toUpperCase() + newName.slice(1);
  }
}
