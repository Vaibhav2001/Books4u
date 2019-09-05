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

//Borrow
router.get('/borrow', ensureAuthenticated, (req, res) =>
    res.render('borrow', {
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
    //I want to get the username and that specific data printed which is inside an array called books
    const Results = await User.find( { $text: { $search: name } } );
    console.log(Results);
    res.redirect('borrow');
});

// function pagelist(items) {
//     result = "<html><body><ul>";
//     items.forEach(function(item) {
//         itemstring = "<li>" + item._id + "<ul><li>" + item.textScore +
//             "</li><li>" + item.created + "</li><li>" + item.document +
//             "</li></ul></li>";
//         result = result + itemstring;
//     });
//     result = result + "</ul></body></html>";
//     return result;
// }

module.exports = router;