import axios from 'axios';

export const TOKEN_NAME = 'token';
export const SERVER_URL =
  'http://cute-cat-server-elb-1523823705.ap-northeast-2.elb.amazonaws.com';

const token = localStorage.getItem(TOKEN_NAME);

export default axios.create({
  baseURL: SERVER_URL,
  headers: {
    Authorization: `bearer ${token}`,
  },
});
