export const REQUEST_MAPPING = 'api/v1';


export const PRODUCT_API_ENDPOINTS = {
  GET_ALL: REQUEST_MAPPING + '/product/products',
  GET_BY_ID: REQUEST_MAPPING + '/product',
  CREATE: REQUEST_MAPPING + '/product/new-product',
  EDIT: REQUEST_MAPPING + '/product',
  DELETE: REQUEST_MAPPING + '/product',
};

export const BRAND_API_ENDPOINTS = {
  GET_ALL: REQUEST_MAPPING + '/brands',
  CREATE: REQUEST_MAPPING + '/brands/new-brand',
  EDIT: REQUEST_MAPPING + '/brands/edit',
  DELETE: REQUEST_MAPPING + '/brands',
};

export const LOGIN_API_ENDPOINTS = {
  REQUEST_MAPPING: 'auth',
  LOGIN: 'login',
}

export const REGISTER_API_ENDPOINTS = {
  REQUEST_MAPPING: 'auth',
  REGISTER: 'register',
}
