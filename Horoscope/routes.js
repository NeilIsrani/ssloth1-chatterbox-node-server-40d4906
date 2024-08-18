// Horoscope/routes.js
import express from 'express';
import * as dao from './dao.js';

const router = express.Router();

// GET /api/horoscope/:sign
router.get('/:sign', async (req, res) => {
	const { sign } = req.params;
	try {
		const horoscope = await dao.fetchHoroscope(sign);
		res.json({ horoscope });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch horoscope' });
	}
});

export default router;