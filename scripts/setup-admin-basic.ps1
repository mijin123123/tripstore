# PowerShell 스크립트를 사용하여 관리자 계정 생성하기

# 이 파일은 Windows PowerShell에서 실행할 수 있는 스크립트입니다.
# 관리자 계정을 생성하고 권한을 설정합니다.

# 실행 방법:
# 1. PowerShell을 관리자 권한으로 실행합니다.
# 2. 스크립트 실행 권한을 설정합니다: Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
# 3. 스크립트를 실행합니다: .\setup-admin-basic.ps1

# 환경 확인
Write-Host "관리자 계정 생성 도구 시작..." -ForegroundColor Cyan

# Node.js 설치 확인
try {
    $nodeVersion = node -v
    Write-Host "Node.js 버전: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "Node.js가 설치되어 있지 않습니다. 설치 후 다시 시도해주세요." -ForegroundColor Red
    exit
}

# 관리자 이메일과 비밀번호 입력 받기
$adminEmail = Read-Host "관리자 이메일을 입력하세요"
$adminPassword = Read-Host "관리자 비밀번호를 입력하세요 (6자 이상)" -AsSecureString
$adminPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPassword))

if ($adminPasswordPlain.Length -lt 6) {
    Write-Host "비밀번호는 6자 이상이어야 합니다." -ForegroundColor Red
    exit
}

# 임시 JavaScript 파일 생성
$jsContent = @"
// 관리자 계정 생성 스크립트
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('환경 변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env 파일에 설정해주세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  try {
    // 1. 사용자 생성
    console.log('사용자 계정 생성 중...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: '$adminEmail',
      password: '$adminPasswordPlain'
    });

    if (authError) {
      console.error('사용자 생성 오류:', authError.message);
      return;
    }

    console.log('사용자가 생성되었습니다:', authData.user.id);

    // 2. 사용자를 관리자로 설정
    console.log('관리자 권한 설정 중...');
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true, name: '관리자' })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('관리자 권한 부여 오류:', updateError.message);
      return;
    }

    console.log('관리자 권한이 부여되었습니다.');
    console.log('이메일 확인 후 로그인하여 관리자 페이지에 접속하세요.');

  } catch (error) {
    console.error('관리자 생성 중 오류 발생:', error.message);
  }
}

createAdmin();
"@

# 임시 파일 저장
$tempFile = "create-admin-temp.js"
$jsContent | Out-File -FilePath $tempFile -Encoding utf8

Write-Host "필요한 패키지 확인 중..." -ForegroundColor Cyan

# dotenv 패키지 설치 여부 확인
npm list dotenv --depth=0 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "dotenv 패키지 설치 중..." -ForegroundColor Yellow
    npm install dotenv
}

# supabase-js 패키지 설치 여부 확인
npm list @supabase/supabase-js --depth=0 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "@supabase/supabase-js 패키지 설치 중..." -ForegroundColor Yellow
    npm install @supabase/supabase-js
}

# 스크립트 실행
Write-Host "관리자 계정 생성 스크립트 실행 중..." -ForegroundColor Cyan
node $tempFile

# 임시 파일 삭제
Remove-Item $tempFile

Write-Host "`n관리자 계정 생성 작업이 완료되었습니다." -ForegroundColor Green
Write-Host "1. 이메일함을 확인하여 계정을 인증하세요." -ForegroundColor Cyan
Write-Host "2. 인증 후 로그인하여 '/admin' 경로에 접속하세요." -ForegroundColor Cyan
