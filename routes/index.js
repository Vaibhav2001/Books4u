const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.redirect('/users/login'));

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

// Donated Books
router.get('/donated', ensureAuthenticated, (req, res) =>
    res.render('donated', {
        user: req.user
    })
);

//Search
router.get('/search', ensureAuthenticated, (req, res) =>
    res.render('search', {
        users: req.users
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

    User.findOneAndUpdate({"email" : req.user.email}, {books: newBooks}, {new: true})
        .then(user => {
            console.log(user.books);
            req.flash('success_msg', 'Book added');
            res.redirect('/dashboard');
        });
    console.log(req.user.books);
});

// Remove
router.post('/remove', ensureAuthenticated, (req, res) => {
    const { name } = req.body;
    console.log(name);
    console.log(req.user.books);
    const newBooks = req.user.books;
    newBooks.splice(name, 1);
    console.log(newBooks);

    User.findOneAndUpdate({"email" : req.user.email}, {books: newBooks}, {new: true})
        .then(user => {
            console.log(user.books);
            req.flash('error_msg', 'Book Removed');
            res.redirect('/dashboard');
        });
    console.log(req.user.books);
});

// Donate
router.post('/donate', ensureAuthenticated, (req, res) => {
    const { name } = req.body;
    console.log(name);
    console.log(req.user.books);
    const newBooks = req.user.books;
    const newDonatedBook = newBooks[name];
    newBooks.splice(name, 1);
    console.log(newBooks);

    User.findOneAndUpdate({"email" : req.user.email}, {books: newBooks}, {new: true})
        .then(user => {
            console.log(user.books);
            req.flash('success_msg', 'Book Queued for Donation');
            res.redirect('/dashboard');
        });

    const newDonatedBooks = req.user.DonatedBooks;
    newDonatedBooks.push(newDonatedBook);
    console.log(newDonatedBooks);

    User.findOneAndUpdate({"email" : req.user.email}, {DonatedBooks: newDonatedBooks}, {new: true})
        .then(user => {
            console.log(user.books);
        });
    console.log(req.user.books);
});

// Search
router.post('/search', ensureAuthenticated, async(req, res) => {
    const { name } = req.body;
    console.log(name);
    var words = name.split(" ");
    const regex = words.map(e=>new RegExp(e));
    console.log(regex);

    User.find( { books: { $in: regex  } } )
        .then(users => {
            console.log(users);
            users.forEach(function (user) {
                user.books.forEach(function (book) {
                    if(regex.test(book)) {

                    }
                })
            });
            res.render('search', {
                users: users
            })
        });
});

module.exports = router;