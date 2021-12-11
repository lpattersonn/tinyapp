# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of urls page"](https://github.com/lpattersonn/tinyapp/blob/master/docs/urls-page.png?raw=true)

!["screenshot of shorturl page"](https://github.com/lpattersonn/tinyapp/blob/master/docs/shorturl-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Create Your Templates

- Create your .ejs file that will be rendered when a user visits the site.
- Create and customize views and partials templates.

## URL Shortening

- Update `express_server.js` to render your home page with only the URL submitted by the logged in user.
- Allow for only the owner of the Short URL to edit and delete a URL.

## User Database

- Update `express_server.js` to display the correct status messages if the user is trying to register using an existing email, or if trying to register with bad credentials (empty password feild).
- Set permission according to intended redirect after sucessful login or register.

## Passwords

- Encryprt user passwords using bcryptjs for an inproved user password protection.

## Cookies

- Enable cookie-sessions for encrypted cookie sessions.
