import httpMethods from '@/constants/httpMethods';
import getDomain from '@/utils/getDomain';
import ServerError from '@/utils/serverError';
import {
  CreateParams, DataProvider, GetListParams, GetOneParams, UpdateManyParams, UpdateParams,
} from 'react-admin';
import { ServerData } from '@/interfaces/serverData';
import LocalStorageService from '@/services/storage.service';
import storageKeys from '@/constants/storageKeys';
import { Type } from '@/interfaces/type';
import { Category } from '@/interfaces/category';
import { equalsPrimitiveArrays } from '@/utils/helpers';
import adminResourceMap from '@/constants/admin-resources';
import buildUrlQuery from '@/utils/buildUrlQuery';
import decodeBaseImage from '@/utils/getBaseImage';
import CouponsService from '@/services/coupons.service';
import { User } from '@/interfaces/user';

const BASE_URL = `${getDomain()}/api`;

const buildGetUrl = (resource: string, params: GetListParams) => {
  if (resource === adminResourceMap.returnedOrders) {
    return `${BASE_URL}/orders?returned=true&${buildUrlQuery(params)}`;
  }

  const path: string = resource === adminResourceMap.users ? `${resource}/all` : resource;
  return `${BASE_URL}/${path}?${buildUrlQuery(params)}`;
};

const thenFunc = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new ServerError(data.data, res.status);
  }
  return data;
};

const updateMutation = async (resource: string, params: UpdateParams<any>) => {
  const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
  const setRequest = (body: any) => {
    const url = resource === adminResourceMap.returnedOrders
      ? `${BASE_URL}/orders/${params.id}/return`
      : `${BASE_URL}/${resource}/${params.id}`;
    return new Request(url, {
      method: httpMethods.patch,
      body,
      headers: new Headers({ Authorization: token }),
    });
  };
  switch (resource) {
    case adminResourceMap.categories: {
      const body: Record<string, string> = {};
      if (params.previousData.name !== params.data.name) {
        body.name = params.data.name;
      }
      if (params.data.imageUrl.rawFile) {
        body.imageUrl = await decodeBaseImage(params.data.imageUrl.rawFile);
      }
      const request = setRequest(JSON.stringify(body));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.types: {
      const body: Record<string, string | string[]> = {};
      if (params.previousData.name !== params.data.name) {
        body.name = params.data.name;
      }
      const categoryIds = params.data.categories.map((c: Category) => c._id);
      if (!equalsPrimitiveArrays(categoryIds, params.previousData.categories)) {
        body.categories = categoryIds;
      }
      const request = setRequest(JSON.stringify(body));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.feedback: {
      const request = setRequest(JSON.stringify({ reviewed: params.data.reviewed }));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.reviews: {
      const request = setRequest(JSON.stringify({
        isApproved: params.data.isApproved,
        isChecked: params.data.isChecked,
      }));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.products: {
      const { data } = params;
      const body: Record<string, any> = {};
      body.name = data.name;
      body.price = data.price;
      body.weight = Math.round(data.weight);
      body.sku = data.sku;
      body.availability = data.availability;
      body.description = data.description;
      body.characteristics = data.characteristics;
      body.features = data.features;
      if (body.features?.image) {
        let { src } = body.features.image;
        const file = body.features.image.rawFile;
        if (file) {
          src = await decodeBaseImage(file);
        }
        body.features.image = src;
      }
      body.related = data.related || [];
      body.productType = [data.productType];
      body.categories = data.categories;
      body.additionalInformation = data.additionalInformation || [];
      body.options = data.options;
      body.demo = data.demo;
      body.images = await Promise.all(
        data.images.map(async (i: any) => {
          let { src } = i;
          const file = i.rawFile;
          if (file) {
            src = await decodeBaseImage(file);
          }
          return src;
        }),
      );
      const request = setRequest(JSON.stringify(body));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.coupons: {
      let body = params.data;
      body.userIds = body.userIds.map((u: User) => u._id);
      if (params.meta?.edit) {
        body = CouponsService.toServer(body);
      }
      const request = setRequest(JSON.stringify(body));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.returnedOrders: {
      const { status } = params.data;
      const request = setRequest(JSON.stringify({ status }));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    default:
      console.warn(`No handler for resource ${resource}`);
      return Promise.reject();
  }
};

const updateManyMutation = async (resource: string, params: UpdateManyParams) => {
  const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
  switch (resource) {
    case adminResourceMap.feedback: {
      const setRequest = (id: string | number) => new Request(`${BASE_URL}/${resource}/${id}`, {
        method: httpMethods.patch,
        body: JSON.stringify({ reviewed: params.data.reviewed }),
        headers: new Headers({
          Authorization: token,
          'Content-Type': 'Application/json',
        }),
      });
      return Promise.resolve({
        data: await Promise.all(
          params.ids.map((id: string | number) => fetch(setRequest(id)).then(thenFunc)),
        ),
      });
    }
    case adminResourceMap.reviews: {
      const update = (id: string | number) => fetch(new Request(`${BASE_URL}/${resource}/${id}`, {
        method: httpMethods.patch,
        body: JSON.stringify(params.data),
        headers: new Headers({
          Authorization: token,
          'Content-Type': 'Application/json',
        }),
      })).then(thenFunc);
      return Promise.resolve({
        data: await Promise.all(
          params.ids.map(update),
        ),
      });
    }
    case adminResourceMap.coupons: {
      const update = (id: string | number) => fetch(new Request(`${BASE_URL}/${resource}/${id}`, {
        method: httpMethods.patch,
        body: JSON.stringify(params.data),
        headers: new Headers({
          Authorization: token,
          'Content-Type': 'Application/json',
        }),
      })).then(thenFunc);
      return Promise.resolve({
        data: await Promise.all(
          params.ids.map(update),
        ),
      });
    }
    default:
      console.warn(`No handler for resource ${resource}`);
      return Promise.reject();
  }
};

const createMutation = async (resource: string, params: CreateParams) => {
  const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
  const setRequest = (body: any) => new Request(`${BASE_URL}/${resource}`, {
    method: httpMethods.post,
    body,
    headers: new Headers({ Authorization: token }),
  });
  switch (resource) {
    case adminResourceMap.categories: {
      const imageUrl = await decodeBaseImage(params.data.image.rawFile);
      const request = setRequest(JSON.stringify({
        name: params.data.name,
        imageUrl,
      }));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.types: {
      const request = setRequest(JSON.stringify({
        name: params.data.name,
        categories: params.data.categories,
      }));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.products: {
      const { data } = params;
      const body: Record<string, any> = {};
      if (data.demo) {
        body.demo = data.demo;
      }
      body.name = data.name;
      body.price = data.price;
      body.weight = Math.round(data.weight);
      body.sku = data.sku;
      body.availability = data.availability;
      body.description = data.description;
      body.characteristics = data.characteristics;
      body.features = data.features;
      if (body.features?.image) {
        body.features.image = await decodeBaseImage(data.features.image.rawFile);
      }
      body.related = data.related || [];
      body.productType = [data.productType];
      body.categories = data.categories;
      body.additionalInformation = data.additionalInformation || [];
      body.options = data.options;
      body.featureImage = data.featureImage;
      body.images = await Promise.all(
        data.images.map(decodeBaseImage),
      );
      const request = setRequest(JSON.stringify(body));
      request.headers.set('Content-Type', 'Application/json');
      return fetch(request).then(thenFunc);
    }
    case adminResourceMap.coupons: {
      const body = { ...params.data };
      body.userIds = body.userIds.map((u: User) => u._id);
      const request = setRequest(JSON.stringify(CouponsService.toServer(body)));
      request.headers.set('Content-Type', 'application/json');
      return fetch(request).then(thenFunc);
    }
    default:
      console.warn(`No handler for resource ${resource}`);
      return Promise.reject();
  }
};

const getOneMutation = (resource: string, params: GetOneParams<any>) => {
  const headers = new Headers();
  if ([
    adminResourceMap.reviews, adminResourceMap.coupons,
    adminResourceMap.feedback, adminResourceMap.returnedOrders,
  ].includes(resource)) {
    headers.set('Authorization', LocalStorageService.get<string>(storageKeys.AdminAuth) || '');
  }

  const url = resource === adminResourceMap.returnedOrders
    ? `${BASE_URL}/orders/${params.id}/return`
    : `${BASE_URL}/${resource}/${params.id}`;
  return fetch(url, { headers })
    .then(thenFunc)
    .then((data: ServerData<any>) => {
      const updated = { ...data };
      switch (resource) {
        case adminResourceMap.categories:
          updated.data.imageUrl = { id: `${Date.now()}`, src: data.data.imageUrl };
          break;
        case adminResourceMap.types:
          updated.data.categories = updated.data.categories.map((c: Category) => c._id);
          break;
        case adminResourceMap.products:
          updated.data.images = data.data.images.map((src: string, idx: number) => ({
            id: `${Date.now()}_${idx}`,
            src,
          }));
          updated.data.characteristics.items = data.data.characteristics.items
            .map((field: string) => ({ field }));
          updated.data.productType = data.data.productType[0]._id;
          updated.data.categories = data.data.categories
            .map((t: Category) => t._id);
          break;
        default:
          break;
      }
      return updated;
    });
};

const dataProvider: DataProvider = {
  getList: (resource, params) => {
    const headers = new Headers();
    if ([
      adminResourceMap.reviews, adminResourceMap.coupons, adminResourceMap.feedback,
      adminResourceMap.users, adminResourceMap.returnedOrders,
    ].includes(resource)) {
      headers.set('Authorization', LocalStorageService.get<string>(storageKeys.AdminAuth) || '');
    }

    return fetch(buildGetUrl(resource, params), {
      headers,
    }).then(thenFunc);
  },
  getOne: getOneMutation,
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  update: updateMutation,
  updateMany: updateManyMutation,
  create: createMutation,
  delete: (resource, params) => {
    const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
    const url = resource === adminResourceMap.returnedOrders
      ? `${BASE_URL}/orders/${params.id}/return`
      : `${BASE_URL}/${resource}/${params.id}`;
    const request = new Request(url, {
      method: httpMethods.delete,
      headers: new Headers({ Authorization: token }),
    });
    return fetch(request).then(thenFunc);
  },
  deleteMany: async (resource, params) => {
    const token = LocalStorageService.get<string>(storageKeys.AdminAuth) || '';
    const url = (id: string) => (resource === adminResourceMap.returnedOrders
      ? `${BASE_URL}/orders/${id}/return`
      : `${BASE_URL}/${resource}/${id}`);
    const request = (id: any) => fetch(new Request(url(id), {
      method: httpMethods.delete,
      headers: new Headers({ Authorization: token }),
    })).then(thenFunc).then(({ data }: ServerData<Type>) => data._id);

    return Promise.resolve({ data: await Promise.all(params.ids.map(request)) });
  },
};

export default dataProvider;
