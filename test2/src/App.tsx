import { useState } from 'react'
import CameraEntry from './CameraEntry'
import EscapeRoom from './EscapeRoom'

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
        <EscapeRoom />
      )}
    </>
  );
}

export default App
