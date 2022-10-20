import React, { useState } from "react";

function App() {
  const [changeFolder, setChangeFolder] = useState([]);

  const folderChange = async (e) => {
    console.log(e.target.files);

    Array.from(e.target.files).forEach((file) => {
      let reader = new FileReader();
      setChangeFolder(e.target.files);
      reader.onload = () => {
        console.log(reader.result);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div style={{ margin: 30 }}>
      <input
        type="file"
        id="flup"
        webkitdirectory="true"
        onChange={(e) => folderChange(e)}
      />

      <ul>
        {Array.from(changeFolder).map((file, i) => (
          <li key={i}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
