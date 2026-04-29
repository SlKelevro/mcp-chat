type LoginScreenProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;
  onEmailChange(email: string): void;
  onPasswordChange(password: string): void;
  onSubmit(): void;
};

export function LoginScreen({
  email,
  password,
  isSubmitting,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginScreenProps) {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">MCP Chat</p>
        <h1>Talk to your configured LLM in one focused workspace.</h1>
        <p className="auth-copy">
          Sign in with your workspace credentials to open your chats and send prompts through the configured
          backend LLM handler.
        </p>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label>
            <span>Email</span>
            <input
              autoComplete="email"
              placeholder="admin@mcp.chat"
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Entering workspace...' : 'Enter workspace'}
          </button>
        </form>
      </div>
    </section>
  );
}
