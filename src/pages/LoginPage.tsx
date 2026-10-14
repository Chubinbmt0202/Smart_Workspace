import { useState } from "react";

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      localStorage.setItem("email", email.trim());
      localStorage.setItem("isLoggedIn", "true");
      setError("");
      onLogin();
    } catch {
      setError("Không thể lưu phiên đăng nhập. Vui lòng kiểm tra cài đặt trình duyệt.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-scene">
        <div className="login-card">
          <h1 className="login-title">Note Login</h1>

          <p className="login-subtitle">
            Hey, Enter your details to get sign in <br />
            to your account
          </p>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <label className="field" aria-label="Email or phone">
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                required
                onChange={handleEmailChange}
              />
            </label>

            <label className="field field--password" aria-label="Password">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={handlePasswordChange}
                placeholder="Password"
              />
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </label>

            <button type="submit" className="sign-in-button">
              Sign in
            </button>
            {error && <p className="login-error" role="alert">{error}</p>}

            <div className="divider">
              <span>Or Sign in with</span>
            </div>

            <button type="button" className="social-button">
              Đăng nhập bằng Google
            </button>
          </form>

          <p className="register-copy">
            Don&apos;t have an account?{" "}
            <button type="button">Register Now</button>
          </p>


        </div>
      </div>
    </div>
  );
}
