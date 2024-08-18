import * as dao from './dao.js';

//let currentUser = null;

export default function UserRoutes(app) {


	// create user
	const createUser = async (req, res) => {
		const user = await dao.createUser(req.body);
		//console.log("UserRoutes.createUser: user:", user);
		res.json(user);
	};
	app.post("/api/users", createUser);

	// delete user
	const deleteUser = async (req, res) => {
		const status = await dao.deleteUser(req.params.userId);
		//console.log("UserRoutes.deleteUser: status:", status);
		res.json(status);
	};
	app.delete("/api/users/:userId", deleteUser);

	// find all users
	const findAllUsers = async (req, res) => {
		try {
			const { name } = req.query;
			let users;
	
			if (name) {
				users = await dao.findUsersByPartialName(name);
			} else {
				users = await dao.findAllUsers();
			}
	
			res.json(users);
		} catch (error) {
			console.error('Error in findAllUsers:', error);
			res.status(500).json({ error: 'An error occurred while fetching users' });
		}
	};
	
	app.get("/api/users", findAllUsers);

	// find user by id
	const findUserById = async (req, res) => {
		const user = await dao.findUserById(req.params.userId);
		//console.log("UserRoutes.findUserById: user:", user);
		res.json(user);
	};
	app.get("/api/users/:userId", findUserById);

	// update user
	const updateUser = async (req, res) => {
		const { userId } = req.params;
		const status = await dao.updateUser(userId, req.body);
		//console.log("UserRoutes.updateUser: status:", status);
		res.json(status);
	};
	app.put("/api/users/:userId", updateUser);

	// signin
	const signin = async (req, res) => {
		const { identifier, password } = req.body; // uses 'identifier' for email or username sign ins
		console.log("Attempting to sign in with identifier:", identifier, "password:", password);

		const currentUser = await dao.findUserByCredentials(identifier, password);
		console.log("UserRoutes.signin: currentUser:", currentUser);

		if (currentUser) {
			req.session["currentUser"] = currentUser;
			res.json(currentUser);
		} else {
			res.status(401).json({ message: "Invalid credentials." });
		}
	};

	app.post("/api/users/signin", signin);


	// signup
	const signup = async (req, res) => {
		const user = await dao.findUserByUsername(req.body.username);
		if (user) {
			res.status(400).json({ message: "Username already taken" });
			return;
		}
		const currentUser = await dao.createUser(req.body);
		console.log("UserRoutes.signup: currentUser:", currentUser);
		req.session["currentUser"] = currentUser;
		res.json(currentUser);
	};
	app.post("/api/users/signup", signup);

	// profile, get the current user profile/details
	const profile = async (req, res) => {
		// const sessionUser = req.session["currentUser"];
		// if (!sessionUser) {
		// 	return res.sendStatus(401);
		// }

		try {
			const userId = req.body.userId; // Get userId from query parameter
		
			let user;
			if (userId) {
			  // Fetch user by ID if userId is provided
			   user = await dao.findUserById(userId);
			} else {
			   user = await dao.findUserById('66c02f502fce83791ce2d389');
			}
			if (!user) {
				return res.sendStatus(404);
			}
			res.json(user);
		} catch (err) {
			console.error("Error fetching profile:", err);
			res.sendStatus(500);
		}
	};
	app.post("/api/users/profile", profile);


	// create an anonymous user
	const createAnonymousUser = async (req, res) => {
		try {
			const guestUser = await dao.createAnonymousUser();
			req.session["currentUser"] = guestUser;
			res.json(guestUser);
		} catch (err) {
			console.error("Error creating anonymous user:", err);
			res.sendStatus(500);
		}
	};
	app.post("/api/users/anonymous", createAnonymousUser);
}
