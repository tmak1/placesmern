import axios from 'axios';

const getGeoCoords = async (address) => {
  const api_key = 'AIzaSyDdC2_d0HQAfqUd9cpkwM85B69YHHoZjqk';
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${api_key}`
    )
    .then((res) => console.log(res.data));
};

export default getGeoCoords;
