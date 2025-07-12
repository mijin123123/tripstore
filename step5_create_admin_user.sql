-- STEP 5: 관리자 계정 생성
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    gen_random_uuid(),
    'sonchanmin89@gmail.com',
    crypt('aszx1212', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "슈퍼 관리자"}',
    false,
    'authenticated'
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('aszx1212', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now();

-- 관리자 테이블에 추가
INSERT INTO admins (email, name, role, permissions, is_active) 
VALUES (
    'sonchanmin89@gmail.com', 
    '슈퍼 관리자', 
    'superadmin',
    '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb,
    true
)
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = true;
