const verifyAdmin =  (req, res, next) => {
    if(parseInt(req.user.admin) !== 1){
        return res.sd('无此权限')
    }
    next()
}


module.exports = verifyAdmin