// chatterbox-node-server/Topics/schema.js

import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
	topicTitle: { type: String, required: true },
	topicDesc: { type: String, required: true },
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
}, { collection: 'topics' });

export default topicSchema;
