import { useState } from "react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="field" aria-label="Email or phone">
              <input type="text" placeholder="Enter Email" />
            </label>

            <label className="field field--password" aria-label="Password">
              <input
                type={showPassword ? "text" : "password"}
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
