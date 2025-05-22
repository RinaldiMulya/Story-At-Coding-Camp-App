import CONFIG from '../config';
import { getToken } from '../utils/index';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/stories`,
};

const api = {
  getStories: async () => {
    try {
      const token = getToken();
      const response = await fetch('https://story-api.dicoding.dev/v1/stories?page=1&size=15&location=0', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      return json.listStory; // <-- kembalikan array story
    } catch (error) {
      console.error('Gagal memuat data laporan:', error);
      return []; // untuk mencegah crash di frontend
    }
  },

  addStory: async ({ description, photo, lat, lon }) => {
    try {
      const token = getToken();

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      if (lat !== undefined) formData.append('lat', lat);
      if (lon !== undefined) formData.append('lon', lon);

      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // ❗Jangan set Content-Type! Browser akan otomatis isi dengan multipart boundary
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menambahkan story');
      }

      return result; // { error: false, message: "success" }
    } catch (error) {
      console.error('Gagal menambahkan story:', error);
      throw error;
    }
  },

};
export default api;