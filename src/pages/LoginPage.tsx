import { useState } from "react";
import { signInWithGoogle } from "../services/firebase";
import { noteApi } from "../services/api";

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleSigningIn(true);

    try {
      const user = await signInWithGoogle();
      const { userId } = await noteApi.loginUser({
        email: user.email,
        displayName: user.displayName ?? "",
        photoURL: user.photoURL ?? ""
      });

      localStorage.setItem("userId", userId);
      localStorage.setItem("email", user.email);
      localStorage.setItem("isLoggedIn", "true");
      if (user.displayName) localStorage.setItem("displayName", user.displayName);
      if (user.photoURL) localStorage.setItem("photoURL", user.photoURL);
      onLogin();
    } catch (signInError) {
      console.error("Google sign-in or profile save failed:", signInError);
      const errorCode =
        typeof signInError === "object" && signInError !== null && "code" in signInError
          ? String(signInError.code)
          : "";

      if (signInError instanceof Error && signInError.message.includes("chưa được cấu hình")) {
        setError(signInError.message);
      } else if (
        signInError instanceof Error &&
        signInError.message.startsWith("Failed to save user profile:")
      ) {
        setError(`Đăng nhập Google thành công nhưng không lưu được hồ sơ lên máy chủ. ${signInError.message}`);
      } else if (errorCode === "auth/popup-closed-by-user") {
        setError("Bạn đã đóng cửa sổ đăng nhập Google.");
      } else if (errorCode === "auth/unauthorized-domain") {
        setError("Domain hiện tại chưa được cho phép trong Firebase Authentication.");
      } else if (errorCode === "auth/popup-blocked") {
        setError("Trình duyệt đã chặn cửa sổ đăng nhập. Hãy cho phép popup rồi thử lại.");
      } else {
        setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-scene">
        <div className="login-card">
          <h1 className="login-title">Note Login</h1>

          <p className="login-subtitle">
            Hey, Enter your details to get sign in <br />
            to your account
          </p>

          <div className="login-form">
            <button
              type="button"
              className="social-button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSigningIn}
            >
              <span className="google-mark" aria-hidden="true">G</span>
              {isGoogleSigningIn ? "Đang kết nối Google..." : "Đăng nhập bằng Google"}
            </button>
            {error && <p className="login-error" role="alert">{error}</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
