import React, { useState, useRef, createContext } from "react";
import { Editor } from "@monaco-editor/react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS_STRING, CODE_SNIPPETS_MATRIX } from "../utils/constants";
import Output from "./Output";
import QuestionSection from "./QuestionSection";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";

export const editorRefProvider = createContext();
export const languageProvider = createContext();
export const questionTypeProvider = createContext();

const ProgrammingTestTemplate = () => {
  const [value, setValue] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  const [isEditorDark, setIsEditorDark] = useState(true);

  const editorRef = useRef(null);

  let questionType;
  if (useLocation().pathname === "/") {
    questionType = "string";
  } else if (useLocation().pathname === "/matrix") {
    questionType = "matrix";
  }

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (activeLanguage) => {
    setActiveLanguage(activeLanguage);
    if (questionType === "string") {
      setValue(CODE_SNIPPETS_STRING[activeLanguage]);
    } else {
      setValue(CODE_SNIPPETS_MATRIX[activeLanguage]);
    }
  };

  return (
    <questionTypeProvider.Provider value={questionType}>
      <Container maxW={"9xl"}>
        <Flex>
          <Box w={"30%"} borderRight={"1px"} borderColor={"#d1d5da"} pr={4}>
            <QuestionSection />
          </Box>

          <Flex w={"70%"} gap={4} direction={"column"}>
            <Box>
              <Flex gap={2} mt={3}>
                <LanguageSelector
                  activeLanguage={activeLanguage}
                  onSelect={onSelect}
                />

                <ButtonGroup>
                  {isEditorDark ? (
                    <Tooltip
                      label="Changes Code Editor to Light Mode"
                      hasArrow
                      aria-label="Light Mode"
                      placement="right"
                      closeOnClick={true}
                      openDelay={2000}
                    >
                      <Button
                        colorScheme="blackAlpha"
                        variant={"ghost"}
                        color={"black"}
                        _hover={{ color: "yellow.500" }}
                        onClick={() => setIsEditorDark(false)}
                        cursor={"pointer"}
                      >
                        <SunIcon fontSize={"x-large"} />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      label="Changes Code Editor to Dark Mode"
                      hasArrow
                      aria-label="Dark Mode"
                      placement="right"
                      closeOnClick={true}
                      openDelay={2000}
                    >
                      <Button
                        colorScheme="blackAlpha"
                        variant={"ghost"}
                        color={"gray.500"}
                        _hover={{ color: "black" }}
                        onClick={() => setIsEditorDark(true)}
                        cursor={"pointer"}
                      >
                        <MoonIcon fontSize={"large"} />
                      </Button>
                    </Tooltip>
                  )}
                </ButtonGroup>
              </Flex>

              <Box
                borderTop={"1px"}
                borderBottom={"1px"}
                borderColor={"#d1d5da"}
              >
                <Editor
                  height={"50vh"}
                  theme={isEditorDark ? "vs-dark" : "vs-light"}
                  language={activeLanguage}
                  defaultValue={
                    questionType === "string"
                      ? CODE_SNIPPETS_STRING[activeLanguage]
                      : CODE_SNIPPETS_MATRIX[activeLanguage]
                  }
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
    </questionTypeProvider.Provider>
  );
};

export default ProgrammingTestTemplate;
