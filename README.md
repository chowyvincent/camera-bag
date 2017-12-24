# Phase One, setup
- Create directory 'express camera-bag --hbs' uses the hbs templating engine
- Run npm install in the directory
- Start server with nodemon bin/www
- Install mongoose with npm install --save mongoose
- Seeded the data from with scrapy output
- Created the view for the home page

# Phase Two, User Setup/Sessions/CSRF
## Sessions
- npm install --save express-session
- require('express-session');
- app.use(session()) after app.use(cookieParser());

## CSURF
- npm install --save csurf
- require('csurf')
- var csrfProtection = csrf();
- router.use(csrfProtection);
- Send csrfTokens to templated files with csrfToken: req.csrfToken()

## User Management
- npm install --save passport (authentication, signup, signin)
- npm install --save passport-local (configure passport strategy for user/pass)
- npm install --save bcrypt-nodejs (encrypt passwords)
- npm install --save connect-flash (flash messages)
- npm install --save express-validator (input validation)
- Configure passport user session serialization to identify the user
- Configure passport authentication functions in config/passport.js
- Use passport.authenticate('authentication_name') for signup/sigin POST callback functions
- Created User model
- Created middleware isLoggedIn/notLoggedIn to protect routes with passport isAuthenticated()


# Personal Notes
- Don't forget to call next() in all user defined functions for middleware! It will hang if forgotten

# Phase Three, Session Storing and Bag Model
## Session Store
- npm install --save connect-mongo
- Use MongoStore to store sessions into a db and not in memory
- Use the store as the existing mongoose connection
- Send in the session to all the views

## Bag Model
- Stores the current items added to the bag for the session
- Keeps counters of quantity of item and total price

# Phase Four, Saving Bags with User
- Off the books, working alone now
- Create bag db schema and model
- npm install --save passport-custom for processing gear list db input (maybe used passport-http)
- Store session's bag in the db

# Phase Five, Display user's bag in the profile page

# TODOs

- Display individual gear list pages when clicking in
- Redo gearlist model
- Show image for gear lists (maybe the first image)?
- Add description for every item (VERY HARD TO DO, COULDN'T DO A FORM FOR AN INDIVIDUAL ITEM IN THE HANDLEBARS LIST)
- Rounding error when displaying total (Done)
- Clear the current gear list when added to bag (Done)
- Show current user's gear lists (Done)
- Add username field to user model (Done)
- Problem: When saving gear list it logs out and redirects to sign in page. (Done, Fixed by not using passport)

# Challenges
- Learning curve of NodeJS and routing
- CSRF Protection
- Session handling
