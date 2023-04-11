const Entry = require('../models/Entry')

exports.getJournal = (req, res) => {
    return res.render('journal', {user: req.user})
}