import { googleMapsApiKey, googleApiUrl } from '../settings';

const axios = require('axios');

const getCityCoordianates = async city => {
  const config = {
    method: 'get',
    url: `${googleApiUrl}/geocode/json?address=${city}&key=${googleMapsApiKey}`,
    headers: { }
  };
  const response = await axios(config);
  const { lat, lng } = response.data.results[0].geometry.location;
  return `${lat}%2C${lng}`;
};

export const restaurantsPage = async (req, res) => {
  try {
    let city = '';
    let coordinates = '';
    if (req.query) {
      ({ city, coordinates } = req.query);
    }
    if (city) {
      coordinates = await getCityCoordianates(city);
    }
    const location = `location=${coordinates}`;
    const type = 'type=restaurant';
    const url = `${googleApiUrl}/place/nearbysearch/json?${location}&radius=1500&${type}&key=${googleMapsApiKey}`;
    const config = {
      method: 'get',
      url,
      headers: { }
    };
    const response = await axios(config);
    const parsedRestaurants = response.data.results.map(item => {
      const {
        name, rating, vicinity
      } = item;
      return {
        name, rating, vicinity
      };
    });
    res.status(200).json({ restaurants: parsedRestaurants });
  } catch (err) {
    res.status(500).json({ messages: err.stack });
  }
};
