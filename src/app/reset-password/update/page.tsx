"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const hashFragment = window.location.hash;
    if (!hashFragment) {
      setError("유효하지 않은 비밀번호 재설정 링크입니다.");
    }
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>비밀번호 변경</h1>
      <form onSubmit={handlePasswordUpdate}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="새 비밀번호"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "처리 중..." : "비밀번호 변경"}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpdatePasswordPage;
