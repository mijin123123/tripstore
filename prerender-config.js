// next.config.js
/** @type {import('next').NextConfig} */

// 사전 렌더링에서 제외할 페이지 목록
const noPrerender = [
  '/admin/profile',
  '/admin/settings/admins',
  '/admin/dashboard',
  '/admin/packages/*/edit',
  '/admin/notices/*/edit',
  '/admin/reservations/*',
  '/reset-password'
];

module.exports = {
  // 사전 렌더링 제외 경로
  excludedPrerenderRoutes: noPrerender
};
