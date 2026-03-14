import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getNotices = ({ category, search, startDate, endDate, page, limit } = {}) => {
  const params = {
    category,
    search,
    startDate,
    endDate,
    page,
    limit,
  };

  return api.get('/notices', {
    params: Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== '')),
  });
};

export default api;
