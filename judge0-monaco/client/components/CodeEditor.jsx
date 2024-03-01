import React from "react";
import { Editor } from "@monaco-editor/react";
import { Box, Container, Flex, HStack } from "@chakra-ui/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../utils/constants";
import Output from "./Output";
import Question from "./Question";

export const editorRefProvider = React.createContext();
export const languageProvider = React.createContext();

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
    <Container maxW={"8xl"}>
      <Question />
      <Flex gap={5}>
        <Box w={"60%"}>
          <LanguageSelector
            activeLanguage={activeLanguage}
            onSelect={onSelect}
          />
          <Box mt={3}>
            <Editor
              height="37rem"
              theme="vs-dark"
              language={activeLanguage}
              defaultValue={CODE_SNIPPETS[activeLanguage]}
              value={value}
              onChange={(newValue) => setValue(newValue)}
              onMount={onMount}
            />
          </Box>
        </Box>
        <languageProvider.Provider value={activeLanguage}>
          <editorRefProvider.Provider value={editorRef}>
            <Output />
          </editorRefProvider.Provider>
        </languageProvider.Provider>
      </Flex>
    </Container>
  );
};

export default CodeEditor;
