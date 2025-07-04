// Static export를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  // 정적 빌드를 위한 고정 ID 목록 반환
  const reservationIds = ['1', '2', '3', '4', '5'];
  return reservationIds.map((id) => ({
    id: id,
  }));
}
