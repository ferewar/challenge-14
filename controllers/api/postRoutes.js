const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll();
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single post by id
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    if (!postData) {
      res.status(404).json({ message: 'No post found with that id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      userId: req.session.userId, 
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT to update a post by id
router.put('/:id', withAuth, async (req, res) => {
  try {
    const post = await Post.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.session.userId, // Only allow updates to posts by the user who created them
      },
    });

    if (post[0] === 0) {
      res.status(404).json({ message: 'No post found with this id or you do not have permission to edit it!' });
      return;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a post by id
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const post = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId, // Only allow the user who created the post to delete it
      },
    });

    if (!post) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Post deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
