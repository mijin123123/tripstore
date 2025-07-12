-- STEP 6: 최종 확인
SELECT 'packages' as table_name, count(*) as row_count FROM packages
UNION ALL
SELECT 'admins' as table_name, count(*) as row_count FROM admins;

-- 관리자 확인
SELECT 
    u.email,
    u.email_confirmed_at,
    a.name,
    a.role,
    a.permissions
FROM auth.users u
JOIN admins a ON u.email = a.email
WHERE u.email = 'sonchanmin89@gmail.com';
