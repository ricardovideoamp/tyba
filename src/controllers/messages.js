/* eslint-disable no-unused-vars */
const axios = require('axios');
// import Model from '../models/model';
// localhost:3000/v1/restaurants?coordinates=6.2529275%2C-75.5749500
// const messagesModel = new Model('messages');
export const messagesPage = async (req, res) => {
  try {
    let city = '';
    let coordinates = '';
    if (req.query) {
      ({ city, coordinates } = req.query);
    }
    if (city) {
      const config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCC1RX5YF7VA3WIi2sdfe8evHi1CdVZF_s`,
        headers: { }
      };
      const response = await axios(config);
      const { lat, lng } = response.data.results[0].geometry.location;
      coordinates = `${lat}%2C${lng}`;
    }
    const location = `location=${coordinates}`;
    const type = 'type=restaurant';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${location}&radius=1500&${type}&key=AIzaSyCC1RX5YF7VA3WIi2sdfe8evHi1CdVZF_s`;
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
