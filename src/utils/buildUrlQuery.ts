import { GetListParams } from 'react-admin';

export default function buildUrlQuery(params: GetListParams): string {
  const query = new URLSearchParams();
  if (params.pagination.page) {
    query.set('page', params.pagination.page.toString());
  }
  if (params.pagination.page) {
    query.set('perPage', params.pagination.perPage.toString());
  }
  if (params.sort.order) {
    query.set('sort', params.sort.order.toLowerCase());
  }
  if (params.sort.field) {
    query.set('sortField', params.sort.field);
  }
  if (params.filter.excludeOne) {
    query.set('excludeOne', params.filter.excludeOne);
  }
  if (params.filter.dateGte) {
    query.set('dateGte', params.filter.dateGte);
  }
  if (params.filter.dateLte) {
    query.set('dateLte', params.filter.dateLte);
  }
  if (['true', 'false'].includes(params.filter.reviewed)) {
    query.set('reviewed', params.filter.reviewed);
  }
  if (['true', 'false'].includes(params.filter.approved)) {
    query.set('approved', params.filter.approved);
  }
  if (['true', 'false'].includes(params.filter.isActive)) {
    query.set('isActive', params.filter.isActive);
  }
  if (params.filter.name) {
    query.set('name', params.filter.name);
  }
  if (params.filter.sku) {
    query.set('sku', params.filter.sku);
  }
  if (params.filter.stock !== undefined) {
    query.set('stock', params.filter.stock);
  }
  if (params.filter.stockLt) {
    query.set('stockLt', params.filter.stockLt.toString());
  }
  if (params.filter.stockGt !== undefined) {
    query.set('stockGt', params.filter.stockGt.toString());
  }
  if (params.filter.priceGt) {
    query.set('priceGt', params.filter.priceGt.toString());
  }
  if (params.filter.priceLt) {
    query.set('priceLt', params.filter.priceLt.toString());
  }
  if (params.filter.priceLte) {
    query.set('priceLte', params.filter.priceLte.toString());
  }
  if (params.filter.priceGte) {
    query.set('priceGte', params.filter.priceGte.toString());
  }
  if (params.filter.type) {
    query.set('type', params.filter.type);
  }
  if (params.filter.categories?.length) {
    query.set('categories', JSON.stringify(params.filter.categories));
  }
  if (params.filter.appliedProducts?.length) {
    query.set('appliedProducts', JSON.stringify(params.filter.appliedProducts));
  }
  if (params.filter.productId) {
    query.set('productId', params.filter.productId);
  }
  if (params.filter.email) {
    query.set('email', params.filter.email);
  }
  if (params.filter.status) {
    query.set('status', params.filter.status);
  }
  if (params.filter.rating?.length) {
    query.set('rating', JSON.stringify(params.filter.rating));
  }
  return query.toString();
}
