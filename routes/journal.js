const express = require('express')
const router = express.Router()
const journalController = require('../controllers/journal')
const {ensureAuth} = require('../middleware/auth')

router.get('/', ensureAuth, journalController.getJournal)
router.post('/addEntry', journalController.addEntry)
/* router.delete('/removeEntry', journalController.removeEntry)
router.put('/updateEntry', journalController.updateEntry) */

module.exports = router