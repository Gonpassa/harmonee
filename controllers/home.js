module.exports = {
    getIndex: (req,res) => {
        if(req.user){
            return res.redirect('journal')
        }
        res.render('index')
    }
}