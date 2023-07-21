function handleErrors(error, req,res,next) { // 이 오류핸들러는 비동기 작업 내에서 발생하는 오류는 무시한다
   console.log(error);
   res.status(500).render('shared/500'); 
}

module.exports = handleErrors;