import * as dao from './dao.js';

export default function PostRoutes(app) {
	// Topic-specific routes
	app.post("/api/topics/:tid/post", async (req, res) => {
		const { tid } = req.params;
		const post = {
			...req.body,
			topic: tid,
			_id: new Date().getTime().toString(),
		};
		await dao.createPost(post);
		res.json(post);
	});

	app.get("/api/topics/:tid/posts", async (req, res) => {
		const { tid } = req.params;
		const { search } = req.query;
		try {
			const posts = await dao.findPostforTopic(tid, search);
			res.json(posts);
		} catch (error) {
			console.error("Failed to fetch posts:", error);
			res.status(500).json({ message: "Failed to fetch posts" });
		}
	});

	// General post routes
	app.post('/api/posts', async (req, res) => {
		const post = await dao.createPost(req.body);
		res.json(post);
	});

	app.get('/api/posts', async (req, res) => {
		const posts = await dao.findAllPosts();
		res.json(posts);
	});

	app.get('/api/posts/:postId', async (req, res) => {
		const post = await dao.findPostById(req.params.postId);
		res.json(post);
	});

	app.put('/api/posts/:postId', async (req, res) => {
		const status = await dao.updatePost(req.params.postId, req.body);
		res.json(status);
	});

	app.delete('/api/posts/:postId', async (req, res) => {
		const status = await dao.deletePost(req.params.postId);
		res.json(status);
	});
}