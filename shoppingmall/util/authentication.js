function createUserSession(req,user,action){ //action = 세션이 업데이트된 후 실행되는동작, user = 사용자 정보 담음
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;
    req.session.save(action); //action에 전달된 함수를 실행
}

function destroyUserAuthSession(req){
    req.session.uid = null;
    req.session.save();
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
}