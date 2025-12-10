import { SignedIn, SignedOut } from '@clerk/clerk-react';
import DashboardPremium from './components/DashboardPremium';
import SignInPage from './components/SignInPage';
import './index.css';

function App() {
  return (
    <div>
      <SignedOut>
        <SignInPage />
      </SignedOut>

      <SignedIn>
        <DashboardPremium />
      </SignedIn>
    </div>
  );
}

export default App;
