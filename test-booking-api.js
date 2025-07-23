// 예약 API 테스트 스크립트
const testBookingAPI = async () => {
  try {
    const testData = {
      packageId: 'test-package',
      startDate: '2025-08-01',
      quantity: 1,
      peopleCount: 1,
      travelerInfo: {
        name: '테스트',
        birthdate: '1990-01-01',
        gender: '남성',
        phone: '010-1234-5678',
        email: 'test@example.com'
      },
      specialRequests: '',
      totalPrice: 100000,
      cost: 100000,
      userId: null
    };

    console.log('테스트 데이터:', testData);

    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('응답 상태:', response.status);
    const result = await response.json();
    console.log('응답 결과:', result);

  } catch (error) {
    console.error('테스트 오류:', error);
  }
};

testBookingAPI();
