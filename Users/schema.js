import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: String,
	lastName: String,

	// made this non-required so we can have anonymous users
	email: { type: String, unique: true, sparse: true },
	phone: String,
	dob: Date,
	role: {
		type: String,
		enum: ["STAFF", "USER", "MODERATOR", "GUEST"],
		default: "USER",
	},
}, { collection: "users" });

export default userSchema;