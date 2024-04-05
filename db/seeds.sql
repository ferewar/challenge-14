USE cms_blog;

INSERT INTO users (username, email, password)
VALUES ('testUser', 'test@example.com', 'testpassword');

INSERT INTO posts (title, content, userId)
VALUES ('First Post', 'This is the content of the first post.', 1);

INSERT INTO comments (content, userId, postId)
VALUES ('First comment on first post', 1, 1);
