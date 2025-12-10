import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const SignInPage = () => {
  return (
    <div className="sign-in-container">
      <motion.div
        className="sign-in-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="title">Nutritional Insights</h1>
        <p className="subtitle">Sign in to continue</p>

        {/* Sign In Form */}
        <div className="form-wrapper">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'clerk-root',
                cardBox: 'clerk-card-box',
                card: 'clerk-card',
                header: 'clerk-hidden',
                headerTitle: 'clerk-hidden',
                headerSubtitle: 'clerk-hidden',
                socialButtonsBlockButton: 'clerk-social-btn',
                socialButtonsBlockButtonText: 'clerk-social-text',
                socialButtonsProviderIcon: 'clerk-social-icon',
                dividerLine: 'clerk-divider',
                dividerText: 'clerk-divider-text',
                formFieldLabel: 'clerk-label',
                formFieldInput: 'clerk-input',
                formButtonPrimary: 'clerk-btn-primary',
                footerActionLink: 'clerk-link',
                formFieldAction: 'clerk-link',
                footer: 'clerk-hidden',
                main: 'clerk-main',
                form: 'clerk-form',
                identityPreview: 'clerk-identity',
                identityPreviewText: 'clerk-identity-text',
                identityPreviewEditButton: 'clerk-edit-btn',
                badge: 'clerk-hidden',
                alert: 'clerk-alert',
                alertText: 'clerk-alert-text',
                formFieldErrorText: 'clerk-error',
              },
              variables: {
                colorBackground: 'transparent',
                colorText: '#111',
                colorTextSecondary: '#666',
                colorPrimary: '#111',
                colorDanger: '#dc2626',
                borderRadius: '6px',
                fontFamily: 'inherit',
                shadowShimmer: 'none',
              }
            }}
            routing="hash"
          />
        </div>

        {/* Footer */}
        <p className="footer">
          By continuing, you agree to our{' '}
          <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
        </p>
      </motion.div>

      <style>{`
        .sign-in-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          padding: 2rem;
        }

        .sign-in-content {
          width: 100%;
          max-width: 320px;
        }

        .logo {
          width: 40px;
          height: 40px;
          margin: 0 auto 1.5rem;
          color: #111;
        }

        .logo svg {
          width: 100%;
          height: 100%;
        }

        .title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111;
          text-align: center;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: 0.875rem;
          color: #666;
          text-align: center;
          margin: 0.5rem 0 2rem;
        }

        .form-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        /* Clerk Overrides - Minimal */
        .clerk-root {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .clerk-card-box {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          width: 100% !important;
          max-width: 320px !important;
        }

        .clerk-card {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          width: 100% !important;
        }

        /* Override all Clerk internal card/box styles */
        .cl-card,
        .cl-cardBox,
        .cl-internal-b3fm6y,
        [class*="cl-card"],
        [class*="cl-rootBox"],
        [class*="cl-signIn-root"],
        [class*="cl-internal"] {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
        }

        /* Nuclear option - remove shadow from everything in form wrapper */
        .form-wrapper * {
          box-shadow: none !important;
        }

        /* Re-apply specific shadows only where needed */
        .clerk-social-btn,
        .clerk-input {
          box-shadow: none !important;
        }

        .clerk-hidden {
          display: none !important;
        }

        .clerk-main {
          gap: 1rem !important;
          width: 100% !important;
        }

        .clerk-form {
          gap: 1rem !important;
          width: 100% !important;
        }

        .clerk-social-btn {
          background: #fff !important;
          border: 1px solid #e5e5e5 !important;
          border-radius: 6px !important;
          padding: 0.75rem 1rem !important;
          transition: border-color 0.15s ease !important;
          min-height: 44px !important;
          box-shadow: none !important;
          width: 100% !important;
        }

        .clerk-social-btn:hover {
          border-color: #111 !important;
          background: #fff !important;
        }

        .clerk-social-text {
          color: #111 !important;
          font-weight: 500 !important;
          font-size: 0.875rem !important;
        }

        .clerk-social-icon {
          width: 18px !important;
          height: 18px !important;
        }

        .clerk-divider {
          background: #e5e5e5 !important;
        }

        .clerk-divider-text {
          color: #999 !important;
          font-size: 0.75rem !important;
          background: #fff !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .clerk-label {
          color: #111 !important;
          font-weight: 500 !important;
          font-size: 0.8125rem !important;
        }

        .clerk-input {
          border: 1px solid #e5e5e5 !important;
          border-radius: 6px !important;
          padding: 0.75rem !important;
          font-size: 0.875rem !important;
          transition: border-color 0.15s ease !important;
          background: #fff !important;
          box-shadow: none !important;
          width: 100% !important;
        }

        .clerk-input:focus {
          border-color: #111 !important;
          box-shadow: none !important;
          outline: none !important;
        }

        .clerk-input::placeholder {
          color: #999 !important;
        }

        .clerk-btn-primary {
          background: #111 !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 0.75rem 1rem !important;
          font-weight: 500 !important;
          font-size: 0.875rem !important;
          transition: opacity 0.15s ease !important;
          min-height: 44px !important;
          box-shadow: none !important;
          width: 100% !important;
        }

        .clerk-btn-primary:hover {
          opacity: 0.85 !important;
        }

        .clerk-link {
          color: #111 !important;
          font-weight: 500 !important;
          font-size: 0.8125rem !important;
          text-decoration: none !important;
        }

        .clerk-link:hover {
          text-decoration: underline !important;
        }

        .clerk-identity {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        .clerk-identity-text {
          color: #111 !important;
          font-size: 0.875rem !important;
        }

        .clerk-edit-btn {
          color: #666 !important;
          font-size: 0.8125rem !important;
        }

        .clerk-alert {
          background: #fef2f2 !important;
          border: 1px solid #fee2e2 !important;
          border-radius: 6px !important;
          padding: 0.75rem !important;
        }

        .clerk-alert-text {
          color: #dc2626 !important;
          font-size: 0.8125rem !important;
        }

        .clerk-error {
          color: #dc2626 !important;
          font-size: 0.75rem !important;
        }

        /* Hide badge elements */
        .cl-internal-b3fm6y,
        [class*="badge"],
        [class*="Badge"] {
          display: none !important;
        }

        .footer {
          font-size: 0.75rem;
          color: #999;
          text-align: center;
          margin-top: 2rem;
        }

        .footer a {
          color: #666;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .sign-in-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
