const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req,res,next){ //next = 들어오는 요청을 다음 미들웨어로 보냄
    let sessionData = sessionFlash.getSessionData(req);

    if(!sessionData){
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: '',
        };
    }
    res.render('customer/auth/signup', {inputData: sessionData}); //렌더링 -> 템플릭을 가져와 구문분석하고 텍스트로 바꿔서 방문자에게 전송
}

async function signup(req,res, next){
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password : req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city,
    };

    if(
        !validation.userDetailsAreValid (
            req.body.email,
            req.body.password,
            req.body.fullname
            ,req.body.street,
            req.body.postal,
            req.body.city
            ) || 
            !validation.emailIsconfirmed(req.body.email, req.body['confirm-email'])
        ){
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please Check yout input. Password more than 6 words',
            ...enteredData, //스프레드 연산자?
        }, function(){
            res.redirect('/signup');
        })
        
        return;
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    );

    try {
        const existsAlready = await user. existsAlready();

    if(existsAlready){
        sessionFlash.flashDataToSession(req,{
            errorMessage: 'User exists',
            ...enteredData,
        }, function(){
            res.redirect('/signup');
        })  
        return;
    }
        await user.signup(); //signup는 promise 반화ㅓㄴ
    } catch(error){
        return next(error);
    }
    

    res.redirect('/login'); 
}

function getLogin(req,res,next){
    let sessionData = sessionFlash.getSessionData(req);

    if(!sessionData){
        sessionData = {
            email: '',
            password: ''
        };
    }
    res.render('customer/auth/login', {inputData: sessionData});
}

async function login(req,res,next){ //db 정보와 일치하는지 확인,일치할경우 세션을 로그인중으로 바꿈
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    try{
        existingUser = await user.getUserWithSameEmail();
    }catch(error){   //비동기 방식에서의 오류 발생시 처리법?
        next(error);
        return;
    }
    
    const sessionErrorData = {
        errorMessage: 'Invalid credentials - please check your email and pw',
            email: user.email,
            password: user.password
    };
    
    if(!existingUser){
        sessionFlash.flashDataToSession(req, sessionErrorData, function(){
            res.redirect('/login');
        })

        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if(!passwordIsCorrect){
        sessionFlash.flashDataToSession(req, sessionErrorData, function(){
            res.redirect('/login');
        })
        return;
    }
    authUtil.createUserSession(req, existingUser,function(){ //세션이 저장되면 실행되어야 하는 함수
        res.redirect('/');
    });
    
}

function logout(req,res){
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports = {
    getSignup: getSignup, // 이 키의 값은 get Signup 함수의 포인터
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
};