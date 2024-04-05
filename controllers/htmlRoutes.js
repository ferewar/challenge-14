const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Route to serve the homepage with blog posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username', 'email'],
      }],
      order: [['createdAt', 'DESC']],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render('home', { 
      posts,
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json(err);
  }
});


// Route to serve the dashboard page with user's blog posts
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userPostData = await Post.findAll({
      where: { userId: req.session.userId },
      include: [User],
    });

    const posts = userPostData.map((post) => post.get({ plain: true }));

    res.render('dashboard', { 
      posts,
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json(err);
  }
});

// Route to serve the login page
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
      res.redirect('/');
      return;
  }
  res.render('signup');
});
module.exports = router;
