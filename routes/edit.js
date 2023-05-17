const express = require('express')
const router = express.Router()
const editController = require('../controllers/edit')
const {ensureAuth} = require('../middleware/auth')

router.get('/:id', editController.getEditEntry)
router.put('/:id', editController.editEntry)

module.exports = router