const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const isAuthenticated = require('./config/middleware/isAuthenticated');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const sess = {
  secret: 'super_secret_key',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize })
};

app.use(session(sess));

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.handlebars',
  helpers: {
    formatDate: function (date) {
      return new Date(date).toLocaleDateString('en-US');
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const htmlRoutes = require('./controllers/htmlRoutes');
const userRoutes = require('./controllers/api/userRoutes');
const postRoutes = require('./controllers/api/postRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Apply the isAuthenticated middleware to the routes that require authentication
app.use('/dashboard', isAuthenticated);
app.use('/some-other-protected-route', isAuthenticated);

app.use(htmlRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
});
