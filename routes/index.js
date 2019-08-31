const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

//DB Config
const db = require('../config/keys').MongoURI;

mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const User = mongoose.model('User');
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);

// Add
router.post('/add', ensureAuthenticated, (req, res) => {
    const { name } = req.body;
    console.log(name);
    console.log(req.user.books);
    const newBooks = req.user.books;
    newBooks.push(name);
    console.log(newBooks);
    User.updateOne(
        {"email" : req.user.email},
        {$set: { "books" : newBooks}});
    console.log(req.user.books);
    req.flash('success_msg', 'Book added');
    res.render('dashboard', {
        user: req.user
    });
});



module.exports = router;