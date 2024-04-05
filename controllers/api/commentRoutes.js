const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all comments
router.get('/', async (req, res) => {
    const commentData = await Comment.findAll({});
    res.status(200).json(commentData);
});

// POST a new comment
router.post('/', withAuth, async (req, res) => {
    try {
        if (req.session) {
            const newComment = await Comment.create({
                ...req.body,
                userId: req.session.userId,
            });

            res.status(200).json(newComment);
        }
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json(err);
      }
});

// DELETE a comment
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                userId: req.session.userId, // Ensure the user can only delete their own comments
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json(err);
      }
});

module.exports = router;
