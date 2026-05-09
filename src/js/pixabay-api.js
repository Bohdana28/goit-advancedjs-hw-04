import axios from 'axios';

axios.defaults.baseURL = "https://pixabay.com/api/";

const API_KEY = "44023316-0d50012e2ff9db94e7166d7a8";

export async function getImagesByQuery(query, page = 1) {
  const response = await axios.get("", {
    params: {
      key: API_KEY,
      q: query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: page,
      per_page: 15,
    },

  });
  return response.data;

}