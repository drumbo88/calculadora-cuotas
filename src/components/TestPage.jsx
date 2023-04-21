import "../App.css";

import { useState, useCallback } from 'react';

function TestPage() {
  const [tna, setTna] = useState(75);
  const [plazo, setPlazo] = useState(30);

  const handleTnaChange = useCallback((event) => {
    setTna(parseFloat(event.target.value) || 0);
  }, []);

  const handlePlazoChange = useCallback((event) => {
    setPlazo(parseInt(event.target.value, 10) || 0);
  }, []);

  const GeneralForm = () => (
    <table className="config">
      <tbody>
        <tr>
          <td>TNA (%)</td>
          <td>Plazo (días)</td>
        </tr>
        <tr>
          <td>
            <input value={tna} onChange={handleTnaChange} />
          </td>
          <td>
            <input value={plazo} onChange={handlePlazoChange} />
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: 20 }}>
      <div className="panel config">
        <GeneralForm />
      </div>
    </div>
  );
}

export default TestPage;
