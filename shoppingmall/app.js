const path = require('path');

const express = require('express');

const authRoutes = require('./routes/auth.routes');//정의된 라우터를 인식할수 있도록 함

const app = express();

app.set('view engine', 'ejs'); //view 엔진 설정
app.set('views', path.join(__dirname, 'views')); //views 폴더에 대한 절대 경로 구성 

app.use(express.static('public'));// public 폴더 안의 내용을 정적으로 제공(전역적으로) -> 경로가 public/~~일때 public 입력 안해도 됨

app.use(authRoutes); // 모든 수신 요청에 트리거될 미들웨어 추가 가능

app.listen(3000); 