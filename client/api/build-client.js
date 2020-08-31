import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // In the server
    return axios.create({
      baseURL: 'http://www.brunowu.me',
      headers: req.headers,
    });
  } else {
    // In the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
