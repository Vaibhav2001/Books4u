const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);

router.post('/dashboard', ensureAuthenticated, (req, res) => {
    req.flash('success_msg', 'Book added, Reload to view the changes');
    res.redirect('dashboard')
});
//Remove
router.get('/remove', ensureAuthenticated, (req, res) =>
    res.render('remove', {
        user: req.user
    })
);

module.exports = router;