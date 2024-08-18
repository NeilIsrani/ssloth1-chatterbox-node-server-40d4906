// Horoscope/dao.js
import axios from 'axios';

export const fetchHoroscope = async (sign) => {
	try {
		const response = await axios.get(`https://ohmanda.com/api/horoscope/${sign}`);
		return response.data.horoscope;
	} catch (error) {
		throw new Error('Failed to fetch horoscope');
	}
};