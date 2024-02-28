import React from "react";
import { Editor } from "@monaco-editor/react";
import { Box, HStack } from "@chakra-ui/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../utils/constants";
import Output from "./Output";
import Question from "./Question";

const CodeEditor = () => {
  const [value, setValue] = React.useState("");
  const [activeLanguage, setActiveLanguage] = React.useState("javascript");

  const editorRef = React.useRef(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (activeLanguage) => {
    setActiveLanguage(activeLanguage);
    setValue(CODE_SNIPPETS[activeLanguage]);
  };

  React.useEffect(() => {
    console.log(activeLanguage);
  }, [activeLanguage]);

  return (
    <Box>
      <Question />
      <HStack>
        <Box w={"50%"}>
          <LanguageSelector
            activeLanguage={activeLanguage}
            onSelect={onSelect}
          />
          <Editor
            height="75vh"
            theme="vs-dark"
            language={activeLanguage}
            defaultValue={CODE_SNIPPETS[activeLanguage]}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            onMount={onMount}
          />
        </Box>
        <Output editorRef={editorRef} activeLanguage={activeLanguage} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
