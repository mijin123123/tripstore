const testLoginData = {
  email: "test@example.com",
  password: "123456"
};

fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testLoginData),
})
.then(response => {
  console.log('로그인 응답 상태:', response.status);
  return response.json();
})
.then(data => {
  console.log('로그인 응답 데이터:', data);
})
.catch(error => {
  console.error('로그인 요청 오류:', error);
});
