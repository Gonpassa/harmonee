const express = require('express')
const router = express.Router()
const journalController = require('../controllers/journal')
const {ensureAuth} = require('../middleware/auth')

router.get('/', ensureAuth, journalController.getJournal)
router.get('/newEntry', journalController.newEntry)
router.post('/addEntry', journalController.addEntry)
router.get('/:id', journalController.getSpecificEntry)
router.delete('/:id', journalController.deleteEntry)
module.exports = router