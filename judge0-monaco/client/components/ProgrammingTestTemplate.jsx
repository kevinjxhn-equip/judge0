import React from "react";
import { Editor } from "@monaco-editor/react";
import { Box, Button, ButtonGroup, Container, Flex } from "@chakra-ui/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../utils/constants";
import Output from "./Output";
import QuestionSection from "./QuestionSection";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const editorRefProvider = React.createContext();
export const languageProvider = React.createContext();

const ProgrammingTestTemplate = () => {
  const [value, setValue] = React.useState("");
  const [activeLanguage, setActiveLanguage] = React.useState("javascript");
  const [isEditorDark, setIsEditorDark] = React.useState(true);

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
    <Container maxW={"9xl"}>
      <Flex>
        <Box w={"30%"} borderRight={"1px"} borderColor={"#d1d5da"} pr={4}>
          <QuestionSection />
        </Box>

        <Flex w={"100%"} gap={5} direction={"column"}>
          <Box>
            <Flex gap={2} p={1}>
              <LanguageSelector
                activeLanguage={activeLanguage}
                onSelect={onSelect}
              />

              <ButtonGroup>
                {isEditorDark ? (
                  <Button
                    colorScheme="blackAlpha"
                    variant={"ghost"}
                    color={"black"}
                    _hover={{ color: "yellow.500" }}
                    onClick={() => setIsEditorDark(false)}
                  >
                    <SunIcon fontSize={"x-large"} />
                  </Button>
                ) : (
                  <Button
                    colorScheme="blackAlpha"
                    variant={"ghost"}
                    color={"gray.500"}
                    _hover={{ color: "black" }}
                    onClick={() => setIsEditorDark(true)}
                  >
                    <MoonIcon fontSize={"large"} />
                  </Button>
                )}
              </ButtonGroup>
            </Flex>

            <Box borderTop={"1px"} borderBottom={"1px"} borderColor={"#d1d5da"}>
              <Editor
                height="37rem"
                theme={isEditorDark ? "vs-dark" : "vs-light"}
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
      </Flex>
    </Container>
  );
};

export default ProgrammingTestTemplate;
