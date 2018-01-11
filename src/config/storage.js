import env from '../utils/env';
import api from './api';

const storage = {
  default: env('STORAGE', 'file'),
  file:{
    path: env('STORAGE_PATH', '/Users/ashok/WebRoot/parivartan/storage/'),
    url: `${env('BASE', `${api.base}`)}${api.version}/media/`
  },
  s3: {
    key: env('S3_KEY', ''),
    secret: env('S3_SECRET', ''),
    bucket: env('S3_BUCKET', ''),
    url: env('S3_URL', '')
  },
  mime: {
    image: ['image/jpg','image/jpeg','image/gif','image/png'],
    video: ['video/mpeg', 'video/webm', 'video/mp4'],
    xls: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/x-csv', 'application/csv', 'application/x-csv', 'text/comma-separated-values', 'text/x-comma-separated-values']
  }
}


export default storage;
