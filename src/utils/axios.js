import axios from 'axios';

export const TOKEN_NAME = 'token';
export const SERVER_URL = 'https://api.my-cute-cat.com';

const token = localStorage.getItem(TOKEN_NAME);

export default axios.create({
  baseURL: SERVER_URL,
  headers: {
    Authorization: `bearer ${token}`,
  },
});
