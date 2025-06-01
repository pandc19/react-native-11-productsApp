import {STAGE, API_URL as PROD_URL, API_URL_IOS, API_URL_ANDROID} from '@env';
import axios from 'axios';
import {Platform} from 'react-native';
import {StorageApdater} from '../adapters/async-storage';

export const API_URL =
  STAGE === 'prod'
    ? PROD_URL
    : Platform.OS === 'ios'
    ? API_URL_IOS
    : API_URL_ANDROID;

const tesloApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: Interceptors
tesloApi.interceptors.request.use(async config => {
  const token = await StorageApdater.getITem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export {tesloApi};
