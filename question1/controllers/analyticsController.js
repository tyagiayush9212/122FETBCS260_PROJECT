const axios = require('axios');

const baseUrl = 'http://20.244.56.144/evaluation-service';

// Hardcoded access code and bearer token
const ACCESS_CODE = 'hFhJhm';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2MzM4OTI1LCJpYXQiOjE3NDYzMzg2MjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImVlNTc3MzM4LTM5MGUtNDFkYy05NzdlLWUxZDVlNjNmNWRlMyIsInN1YiI6InR5YWdpLmF5dXNoOTIxMkBnbWFpbC5jb20ifSwiZW1haWwiOiJ0eWFnaS5heXVzaDkyMTJAZ21haWwuY29tIiwibmFtZSI6ImF5dXNoIHR5YWdpIiwicm9sbE5vIjoiMTIyZmV0YmNzMjYwIiwiYWNjZXNzQ29kZSI6ImhGaEpobSIsImNsaWVudElEIjoiZWU1NzczMzgtMzkwZS00MWRjLTk3N2UtZTFkNWU2M2Y1ZGUzIiwiY2xpZW50U2VjcmV0IjoiYlFIZlVVdURrZGVjV3VXZSJ9.eN62FgE128GjH7tyGGq6SI2OYYFkj7KqBEFJ6JvATg8';

// Function to fetch users data
async function getUsers() {
    try {
        const response = await axios.get(`${baseUrl}/users`, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.users; // Ensure this returns an object of users
    } catch (error) {
        throw new Error('Error fetching users');
    }
}

// Function to fetch posts for each user and calculate total comments
async function getPostAnalytics(req, res) {
    try {
        const users = await getUsers();
        const userData = Object.entries(users).map(([id, name]) => ({
            id,
            name,
        }));

        const userComment = await Promise.all(
            userData.map(async (user) => {
                const userPosts = await axios.get(`${baseUrl}/users/${user.id}/posts`, {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                    },
                });
                const postData = userPosts.data.posts;
                let totalComments = 0;

                for (let post of postData) {
                    const commentRes = await axios.get(`${baseUrl}/posts/${post.id}/comments`, {
                        headers: {
                            Authorization: `Bearer ${BEARER_TOKEN}`,
                        },
                    });
                    totalComments += commentRes.data.comments.length;
                }

                return { user, totalComments };
            })
        );

        userComment.sort((a, b) => b.totalComments - a.totalComments);
        const topUsers = userComment.slice(0, 5).map((entry) => entry.user);

        res.status(200).json(topUsers);
    } catch (error) {
        console.error('Error in fetching posts:', error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getPostAnalytics,
};
