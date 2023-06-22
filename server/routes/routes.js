
// routes.js
//not even sure this is in use anymore
function getIndexPage(req, res) {
    res.send('Welcome to the index page');
  }
  
  function handleNotFound(req, res) {
    res.status(404).send('Error 404 - Page not found. Redirecting to front page after 5 seconds...');
    setTimeout(() => {
      res.redirect('/');
    }, 5000);
  }
  
  module.exports = { getIndexPage, handleNotFound };