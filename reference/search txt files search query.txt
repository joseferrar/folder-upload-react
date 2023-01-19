import React, { useState } from "react";

function App() {
  const [changeFolder, setChangeFolder] = useState([]);
  const [todoArr, setTodo] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");

  const folderChange = (e) => {
    console.log(e.target.files);

    Array.from(e.target.files).forEach((file) => {
      let reader = new FileReader();
      setChangeFolder(e.target.files);

      reader.onloadend = () => {
        const text1 = reader.result;
        todoArr.push({ text: text1, file: file.name });
        console.log(todoArr);
        setText(text1);
      };
      reader.readAsText(file);
    });
  };
  const searchFilter = todoArr.filter((value) => {
    if (search === !null) {
      return value.text;
    } else if (value.text.toLowerCase().includes(search.toLowerCase()))
      return value.text;
  });
  console.log(searchFilter);

  const replaceFunction = () => {
    searchFilter.map((item) => {
      const newText = item.text.replace(search, replace);
      console.log(newText);
      setReplace(newText);
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

      <input
        type="text"
        value={search}
        placeholder="search content"
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {searchFilter.map((item, i) => (
          <div>
            <h2>{item.file}</h2>
            <li key={i}>{item.text}</li>
          </div>
        ))}
      </ul>
      <input
        type="text"
        placeholder="replace text"
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
      />
      <button onClick={replaceFunction}>Replace</button>
    </div>
  );
}

export default App;
