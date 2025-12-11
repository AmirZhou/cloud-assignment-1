import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import patternVideo from '../assets/pattern.mp4';
import AnimatedTypeface from './AnimatedTypeface';
import './AnimatedTypeface.css';

const SignInPage = () => {
  return (
    <div className="sign-in-container">
      {/* Background Video */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={patternVideo} type="video/mp4" />
      </video>

      <motion.div
        className="sign-in-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Title */}
        <div className="animated-title-wrapper">
          <AnimatedTypeface
            text="NUTRITIONAL"
            animation="fade"
            stagger={50}
            colorScheme="solid"
            size={28}
            randomInterval={2500}
          />
          <AnimatedTypeface
            text="INSIGHTS"
            animation="fade"
            stagger={50}
            colorScheme="solid"
            size={28}
            randomInterval={2500}
          />
        </div>
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
                otpCodeFieldInput: 'clerk-otp-input',
                otpCodeField: 'clerk-otp-field',
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
          position: relative;
          overflow: hidden;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 0.5;
        }

        .sign-in-content {
          width: 100%;
          max-width: 320px;
          position: relative;
          z-index: 1;
        }

        .animated-title-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .animated-title-wrapper .animated-typeface {
          gap: 0.15rem;
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

        /* Override Clerk card styles only */
        .cl-card,
        .cl-cardBox {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
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

        /* OTP styling - keep Clerk's structure, just clean visuals */
        .cl-otpCodeField {
          padding: 4px 0 !important;
          overflow: visible !important;
        }

        .cl-otpCodeFieldInputs {
          gap: 8px !important;
          overflow: visible !important;
        }

        .cl-otpCodeFieldInput {
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          background: #fff !important;
          color: #111 !important;
          width: 44px !important;
          height: 52px !important;
          font-size: 1.25rem !important;
          font-weight: 500 !important;
          box-shadow: none !important;
        }

        .cl-otpCodeFieldInput:focus {
          border-color: #111 !important;
          outline: none !important;
          box-shadow: none !important;
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
