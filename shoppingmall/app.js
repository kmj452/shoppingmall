const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const errorHandleMiddleware = require('./middlewares/error-handler');
const authRoutes = require('./routes/auth.routes');//정의된 라우터를 인식할수 있도록 함
const productRoutes = require('./routes/products.routes'); 
const baseRoutes = require('./routes/base.routes');

const app = express();

app.set('view engine', 'ejs'); //view 엔진 설정
app.set('views', path.join(__dirname, 'views')); //views 폴더에 대한 절대 경로 구성 

app.use(express.static('public'));// public 폴더 안의 내용을 정적으로 제공(전역적으로) -> 경로가 public/~~일때 public 입력 안해도 됨
app.use(express.urlencoded({extended: false}));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());//요청이 라우터에 도달하기 전의 위치에,csrf 토큰 추가? //misconfigured csrf -> 세션이 없어서 생기는 오류
//csrf토큰은 post요청을 하는 모든곳에 필요
app.use(addCsrfTokenMiddleware); //사용자 정의 미들웨어
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes); // 모든 수신 요청에 트리거될 미들웨어 추가 가능
app.use(productRoutes);

app.use(errorHandleMiddleware);// 에러가 수신되면 이 미들웨어 실행?

db.connectToDatabase()
.then(function(){
    app.listen(3000); 
}).catch(function(error){
    console.log('연결 실패');
    console.log(error); 
});  //이 함수는 프로미스를 반환 -> then 추가로 프로미스성공한 이후의 코드 추가하거나 catch로 프로미스의 실패시 오류 핸들링

