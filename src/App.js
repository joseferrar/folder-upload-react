import JSZip from "jszip";
import React, { useState } from "react";
import FileSaver from "file-saver";
import "./App.css";

function App() {
  const [action, setAction] = useState(false);
  const [changeFolder, setChangeFolder] = useState([]);
  const [Data, setData] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  //form states
  const [mode, setMode] = useState("");
  const [increment, setIncrement] = useState(0);
  const zip = new JSZip();

  const folderChange = (e) => {
    console.log(e.target.files);

    Array.from(e.target.files).forEach((file) => {
      let reader = new FileReader();
      setChangeFolder(e.target.files);

      reader.onloadend = () => {
        const file_content = reader.result;
        Data.push({ text: file_content, file: file.name, checked: false });
        console.log(Data);
        setText(file_content);
      };
      reader.readAsText(file);
    });
  };

  const searchFilter = Data;
  
  function newrep() {
    var fid = document.getElementById("find").value;
    var regexp = new RegExp(fid, "gi");
    // var rv = document.getElementById("replace").value;
    var rv = ""
    var count = 0;
    Data.map((item) => {
      let str2 = item.text.replaceAll(regexp, (x) => {
        count++;
        return rv;
      });
      document.getElementById("message").value = str2;
      document.getElementById("ChCtr").innerHTML = "Find - " + count;
    });
  }
  const replaceAllFunction = () => {
    Data.map((item) => {
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
      setData(filtered);
      setReplace(replace);
      setAction(true);
      newrep();

    });
  };

  const deleteAllFunction = () => {
    Data.map((item, i) => {
      const newText = item.text.replaceAll(search, "");
      setReplace(newText);
      const newArr = { text: newText, file: item.file };

      searchFilter.push(newArr);
      const ids = searchFilter.map((o) => o.file);
      const filtered = searchFilter.filter(
        ({ file }, index) => !ids.includes(file, index + 1)
      );
      console.log(filtered);
      setData(filtered);
      setReplace(replace);
      setAction(true);
      newrep();
    });
  };

  const downloadTxtFile = () => {
    const folderName = zip.folder("files");
    Data.map((item) => {
      folderName.file(item.file, item.text);
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      console.log(content);
      FileSaver.saveAs(content, "files.zip");
    });
  };

  console.log("text count --->", replace.split("developer").length - 1);

  const removeOne = (index) => {
    const newTasks = [...Data];
    newTasks[index].checked = true;
    var regexp = new RegExp(search, "gi");
    var count = 0
    const newText = newTasks[index].text.replaceAll(search, "");
    let str2 = newTasks[index].text.replaceAll(regexp, (x) => {
      count++;
      return replace;
    });
    setIncrement(count)
    console.log(count, str2)
    const newArr = { text: newText, file: newTasks[index].file };
    searchFilter.push(newArr);
    const ids = searchFilter.map((o) => o.file);
    const filtered = searchFilter.filter(
      ({ file }, index) => !ids.includes(file, index + 1)
    );
    
    console.log(newText);
    setData(filtered);
    setAction(true);
  };

  console.log(Data);

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
            id="find"
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
            <option value="replace">Replace All</option>
            <option value="delete">Delete All</option>
          </select>
        </div>

        {mode === "replace" && (
          <div className="col-2">
            <input
              id="replace"
              className="form-control"
              type="text"
              placeholder="replace"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
            />{" "}
          </div>
        )}
        <div className="col-2">
          {mode === "replace" && (
            <button onClick={replaceAllFunction} className="btn btn-success">
              Replace All
            </button>
          )}
          {mode === "delete" && (
            <button className="btn btn-danger" onClick={deleteAllFunction}>
              Delete All
            </button>
          )}
        </div>
      </div>
      <h4 id="ChCtr" style={{marginLeft: "auto"}}>{"Find - " + increment}</h4>
      <div className="row">
        <div className="col-1">
          {action && (
            <button onClick={downloadTxtFile} className="btn btn-dark">
              Download
            </button>
          )}
          {/* <button className="btn btn-danger">Delete</button> */}
         
        </div>

        <table id="customers">
          <tr>
            <th>S.No</th>
            <th>File</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
          {Data.map((item, i) => (
            <tr key={i} id="message">
              <input
                type="checkbox"
                value={item.checked}
                className="checkbox"
                // onChange={() => removeOne(i)}
              />
              <td>{item.file}</td>
              <td>{item.text}</td>
              <td>
                {/* <button
                  onClick={() => replaceOne(i)}
                  className="btn btn-success"
                >
                  Replace
                </button> */}
                <button onClick={() => removeOne(i)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>

    </div>
  );
}

export default App;
