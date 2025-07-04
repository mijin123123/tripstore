// Static export를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  const packageIds = ['1', '2', '3', '4', '5'];
  
  return packageIds.map((id) => ({
    id: id,
  }));
}
