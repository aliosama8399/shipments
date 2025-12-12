import axios from 'axios';

window.axios = axios as any;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
