import JSZip from "jszip";
import React, { useState } from "react";
import FileSaver from "file-saver";
import "./App.css";

function App() {
  const [action, setAction] = useState(false);
  const [changeFolder, setChangeFolder] = useState([]);
  const [todoArr, setTodoArr] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  //form states
  const [mode, setMode] = useState("");
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
      const newText = item.text.replaceAll(search, replace);
      setReplace(newText);
      console.log(replace.split(search).length);
      const newArr = { text: newText, file: item.file };

      searchFilter.push(newArr);
      const ids = searchFilter.map((o) => o.file);
      const filtered = searchFilter.filter(
        ({ file }, index) => !ids.includes(file, index + 1)
      );
      console.log(filtered);
      setTodoArr(filtered);
      setReplace(replace);
      setAction(true);
    });
  };

  const deleteFunction = () => {
    todoArr.map((item) => {
      const newText = item.text.replaceAll(search, "");
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
      setAction(true);
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

  console.log("text count --->", replace.split("developer").length - 1);
  return (
    <div style={{ margin: 30 }}>
      <span className="btn btn-primary btn-file">
        <input
          type="file"
          id="flup"
          webkitdirectory="true"
          onChange={(e) => folderChange(e)}
        />
        Choose Folder - ({changeFolder.length + " files"})
      </span>
      <br />
      <div className="row my-4">
        <div className="col-2">
          <input
            className="form-control"
            type="text"
            value={search}
            placeholder="Find"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-2">
          <select
            className="form-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option selected>Select Mode..</option>
            <option value="replace">Replace</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        {mode === "replace" && (
          <div className="col-2">
            <input
              className="form-control"
              type="text"
              placeholder="replace"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
            />{" "}
          </div>
        )}
        <div className="col-2">
          {mode ===
            "replace" &&(
              <button onClick={replaceFunction} className="btn btn-success">
                Replace
              </button>
            )}
          {mode === "delete" && (
            <button className="btn btn-danger" onClick={deleteFunction}>
              Delete
            </button>
          )}
        </div>
      </div>

      <ul>
        {todoArr.map((item, i) => (
          <div key={i}>
            <h2>{item.file}</h2>
            <li>{item.text}</li>
          </div>
        ))}
      </ul>
      <div className="row">
        <div className="col-1">
          {action  && (
            <button onClick={downloadTxtFile} className="btn btn-dark">
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
