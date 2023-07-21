function addCsrfToken(req,res,next){
    res.locals.csrfToken = req.csrfToken(); //토큰 생성해서 local에 저장 -> 나중에 사용 가능
    next(); 
}

module.exports = addCsrfToken;