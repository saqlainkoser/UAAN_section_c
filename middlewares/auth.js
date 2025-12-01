const isAuthenticated =(req,res,next)=>{
    if(req.session.user){
        return next()
    }
    else{
        res.status(403).json({message:"!You Do Not Access."})
    }
}

const checkRole = (role)=>{
    return (req,res,next)=>{
        if(req.session.user && req.session.user.role == role){
            next()
        }
        else{
            res.status(403).json({message:"!You Do Not Access."})
        }
    }
}

module.exports = {isAuthenticated,checkRole}