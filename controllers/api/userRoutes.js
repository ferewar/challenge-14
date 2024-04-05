const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;
      // Send a JSON response indicating success
      res.json({ status: 'success', message: 'Signup successful', user: newUser });
    });
  } catch (error) {
    console.error('Signup error:', error);
    // Send back a JSON response with the error message
    res.status(500).json({ status: 'error', message: 'Could not sign up user', error: error.message });
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
      res.redirect('/');
  } else {
      // Pass the error message to the login.handlebars template if it exists
      res.render('login', { error: req.query.error });
  }
});

router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });
    if (!userData) {
      res.status(401).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);
    console.log('Is valid password:', validPassword);
    if (!validPassword) {
      res.status(401).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // Setting up session variables upon successful login
    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;
      res.redirect('/dashboard');

      
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json(err);
  }
});




router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).redirect('/');
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
