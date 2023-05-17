const Entry = require('../models/Entry')

exports.getEditEntry = async (req,res) => {
    const id = req.params.id
    try{
        const entry = await Entry.findById(id).lean()
        res.render('editEntry', {entry: entry, user: req.user})
    } catch(err){
        console.log(err);
    }
}

exports.editEntry = async (req, res) => {
    const id = req.params.id
    console.log(id);
    try {
        await Entry.findOneAndUpdate(
            {_id: id},
            {
                title: req.body.title,
                entry: req.body.entry,
                mood: req.body.mood
    })
    res.redirect('../calendar')
    } catch (err) {
        console.log(err);
    }
}

