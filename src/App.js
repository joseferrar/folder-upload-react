import JSZip from "jszip";
import React, { useState } from "react";
import FileSaver from "file-saver";

function App() {
  const [changeFolder, setChangeFolder] = useState([]);
  const [todoArr, setTodoArr] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");

  const zip = new JSZip();
  
  const folderChange = (e) => {
    console.log(e.target.files);

    Array.from(e.target.files).forEach((file) => {
      let reader = new FileReader();
      setChangeFolder(e.target.files);

      reader.onloadend = () => {
        const file_content = reader.result;
        todoArr.push({ text: file_content, file: file.name });
        console.log(todoArr);
        setText(file_content);
      };
      reader.readAsText(file);
    });
  };

  const searchFilter = todoArr;

  const replaceFunction = () => {
    todoArr.map((item) => {
      const newText = item.text.replace(search, replace);
      console.log(newText);
      setReplace(newText);

      const newArr = { text: newText, file: item.file };

      searchFilter.push(newArr);
      const ids = searchFilter.map((o) => o.file);
      const filtered = searchFilter.filter(
        ({ file }, index) => !ids.includes(file, index + 1)
      );
      console.log(filtered);
      setTodoArr(filtered);
      setReplace(replace);
    });
  };

  const downloadTxtFile = () => {
    const folderName = zip.folder("files");
    todoArr.map((item) => {
      folderName.file(item.file, item.text);
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {

      console.log(content);
      FileSaver.saveAs(content, "files.zip");
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
      <br /> <br />
      <input
        type="text"
        value={search}
        placeholder="fine"
        onChange={(e) => setSearch(e.target.value)}
      />
      &nbsp;
      <input
        type="text"
        placeholder="replace"
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
      />
      &nbsp;
      <button onClick={replaceFunction}>Replace</button>
      <ul>
        {todoArr.map((item, i) => (
          <div key={i}>
            <h2>{item.file}</h2>
            <li>{item.text}</li>
          </div>
        ))}
      </ul>
      <button onClick={downloadTxtFile}>download</button>
    </div>
  );
}

export default App;
