"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password/update`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("비밀번호 재설정 이메일이 전송되었습니다.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>비밀번호 재설정</h1>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "로딩 중..." : "비밀번호 재설정 요청"}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPasswordPage;