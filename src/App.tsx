import { useState } from 'react'
import CameraEntry from './CameraEntry'
import UnifiedEscapeRoom from './UnifiedEscapeRoom'

function App() {
  const [isEntryComplete, setIsEntryComplete] = useState(false);

  const handleEntryComplete = () => {
    setIsEntryComplete(true);
  };

  return (
    <>
      {!isEntryComplete ? (
        <CameraEntry onEntryComplete={handleEntryComplete} />
      ) : (
        <UnifiedEscapeRoom />
      )}
    </>
  );
}

export default App
