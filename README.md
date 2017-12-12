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