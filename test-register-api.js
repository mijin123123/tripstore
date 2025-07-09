const testData = {
  name: "테스트사용자",
  email: "test@example.com",
  password: "123456"
};

fetch('http://localhost:3000/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log('응답 상태:', response.status);
  return response.json();
})
.then(data => {
  console.log('응답 데이터:', data);
})
.catch(error => {
  console.error('요청 오류:', error);
});
