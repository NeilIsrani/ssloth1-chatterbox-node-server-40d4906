// chatterbox-node-server/Topics/dao.js

import model from "./model.js";

export const createTopic = (topic) => model.create(topic);

// old findAllTopics method, let's hold on to it for now
//export const findAllTopics = () => model.find();


export const findAllTopics = async (searchText) => {
	if (searchText) {
		// Use regex to search for topics with titles or descriptions that match the searchText
		return await model.find({
			$or: [
				{ topicTitle: { $regex: searchText, $options: "i" } },
				{ topicDesc: { $regex: searchText, $options: "i" } }
			]
		});
	} else {
		// If no searchText, return all topics
		return await model.find();
	}
};
export const findTopicById = (topicId) => model.findById(topicId);
export const updateTopic = (topicId, topic) => model.updateOne({ _id: topicId }, { $set: topic });
export const deleteTopic = (topicId) => model.deleteOne({ _id: topicId });