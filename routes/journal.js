const express = require('express')
const router = express.Router()
const journalController = require('../controllers/journal')
const {ensureAuth} = require('../middleware/auth')

router.get('/', ensureAuth, journalController.getJournal)

module.exports = router