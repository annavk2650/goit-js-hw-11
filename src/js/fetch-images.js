import axios from 'axios';

export { fetchImage };

const API = '33168603-ec2cdd614dfa5cc2d19959754';
const URL = 'https://pixabay.com/api/';

async function fetchImage(query, page = 1, perPage = 40) {
  const response = await axios.get(
    `${URL}?key=${API}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}
