function getSignup(req,res,next){ //next = 들어오는 요청을 다음 미들웨어로 보냄
    res.render('customer/auth/signup'); //렌더링 -> 템플릭을 가져와 구문분석하고 텍스트로 바꿔서 방문자에게 전송
}

function getLogin(req,res,next){

}

module.exports = {
    getSignup: getSignup, // 이 키의 값은 get Signup 함수의 포인터
    getLogin: getLogin
};