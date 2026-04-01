import { useState } from "react";
import MapComponent from "./MapComponent";
import Viewer3D from "./Viewer3D";

export default function App() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  return (
    <div>
      {selectedBuilding ? (
        <div style={{ height: "100vh" }}>
          <button onClick={() => setSelectedBuilding(null)}>
            ⬅ Back to Map
          </button>
          <Viewer3D model={selectedBuilding.model} />
        </div>
      ) : (
        <MapComponent onSelectBuilding={setSelectedBuilding} />
      )}
    </div>
  );
}