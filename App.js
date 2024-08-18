import "dotenv/config";
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import Test from './Test/index.js';
import UserRoutes from './Users/routes.js';
import TopicRoutes from './Topics/routes.js';
import PostRoutes from './Posts/routes.js';
import CommentRoutes from './Comments/routes.js';
import HoroscopeRoutes from './Horoscope/routes.js';

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/chatterbox";

// Connect to MongoDB
mongoose.connect(CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log("Connected to MongoDB successfully"))
	.catch(err => console.error("Failed to connect to MongoDB:", err));

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
const allowedOrigins = [
	'http://localhost:3000', // Development URL
	'https://chatterbox-react-app.netlify.app', // Production URL
];

app.use(
	cors({
		credentials: true,
		origin: (origin, callback) => {
			// Allow requests with no origin (Postman)
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		}
	})
);

// Session options
const sessionOptions = {
	secret: process.env.SESSION_SECRET || "chatterbox",
	resave: false,
	saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
	sessionOptions.proxy = true;
	sessionOptions.cookie = {
		sameSite: "none",
		secure: true, // Ensure cookies are sent over HTTPS
		domain: process.env.NODE_SERVER_DOMAIN, // Set the cookie domain for production
	};
}

app.use(session(sessionOptions));

// Middleware to log requests
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// Import routes
Test(app);
UserRoutes(app);
TopicRoutes(app);
PostRoutes(app);
CommentRoutes(app);

// for our external api requirement for the project
app.use('/api/horoscope', HoroscopeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
