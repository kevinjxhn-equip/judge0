import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  getResponseAfterSubmittingUserCode,
  getResponseAfterExecutingUserCode,
} from "../utils/api";
import CustomTestCaseSection from "./CustomTestCaseSection";
import { editorRefProvider, languageProvider } from "./ProgrammingTestTemplate";
import { getResponseAfterExecutingUserCustomInputCode } from "../utils/api";

const Output = () => {
  const [isError, setIsError] = React.useState(false);
  const [output, setOutput] = React.useState(null);
  const [isCustomTestCaseSectionVisible, setIsCustomTestCaseSectionVisible] =
    React.useState(false);

  const [customInput, setCustomInput] = React.useState("");
  const [isCustomError, setIsCustomError] = React.useState(false);
  const [customTestCaseOutput, setCustomTestCaseOutput] = React.useState(null);

  const [loadingState, setLoadingState] = React.useState({
    isSubmitLoading: false,
    isRunCodeLoading: false,
    isCustomTestLoading: false,
  });

  const editorRef = React.useContext(editorRefProvider);
  const activeLanguage = React.useContext(languageProvider);

  const toast = useToast();

  const runUserCodeAndUpdateOutput = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setLoadingState((prevState) => ({
        ...prevState,
        isRunCodeLoading: true,
      }));

      const result = await getResponseAfterExecutingUserCode(
        activeLanguage,
        sourceCode
      );
      console.log(result);
      const statusId = result.status.id;

      // Correct Answer
      if (statusId === 3) {
        setIsError(false);
        setOutput(result.stdout.split("\n"));

        // Wrong Answer
      } else if (statusId === 4) {
        setIsError(false);

        if (
          result.stderr === null &&
          (!result.stdout || result.stdout.trim() === "")
        ) {
          setOutput(["No output from the code"]);
        } else {
          setOutput(result.stdout.split("\n"));
        }

        // Compilation Error
      } else if (statusId === 6) {
        setIsError(true);
        setOutput(result.compile_output.split("\n"));

        // Time Limit Exceeded
      } else if (statusId === 5) {
        setIsError(true);
        setOutput(["Time Limit Exceeded"]);

        // Runtime Error and Internal Error
      } else {
        setIsError(true);
        setOutput(result.stderr.split("\n"));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState((prevState) => ({
        ...prevState,
        isRunCodeLoading: false,
      }));
    }
  };

  const runCustomTestCase = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setLoadingState((prevState) => ({
        ...prevState,
        isCustomTestLoading: true,
      }));

      const result = await getResponseAfterExecutingUserCustomInputCode(
        activeLanguage,
        sourceCode,
        customInput
      );

      if (result.error) {
        setIsCustomError(true);
        setCustomTestCaseOutput(["Incorrect input format."]);
        return;
      }

      const statusId = result.status.id;

      // Correct Answer
      if (statusId === 3) {
        setIsCustomError(false);
        setCustomTestCaseOutput(result.stdout.split("\n"));

        // Wrong Answer
      } else if (statusId === 4) {
        setIsCustomError(false);

        if (
          result.stderr === null &&
          (!result.stdout || result.stdout.trim() === "")
        ) {
          setCustomTestCaseOutput(["No output from the code"]);
        } else {
          setCustomTestCaseOutput(result.stdout.split("\n"));
        }

        // Compilation Error
      } else if (statusId === 6) {
        setIsCustomError(true);
        setCustomTestCaseOutput(result.compile_output.split("\n"));

        // Time Limit Exceeded
      } else if (statusId === 5) {
        setIsCustomError(true);
        setCustomTestCaseOutput(["Time Limit Exceeded"]);

        // Runtime Error and Internal Error
      } else {
        setIsCustomError(true);
        setCustomTestCaseOutput(result.stderr.split("\n"));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState((prevState) => ({
        ...prevState,
        isCustomTestLoading: false,
      }));
    }
  };

  const submitCode = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setLoadingState((prevState) => ({ ...prevState, isSubmitLoading: true }));
      const result = await getResponseAfterSubmittingUserCode(
        activeLanguage,
        sourceCode
      );
      console.log(result);
      const isPassed = result.submissions.every((item) => item.status.id === 3);

      if (isPassed) {
        toast({
          title: "Great job!",
          description: "All cases passed!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "One or more test cases failed",
          description: "Please check your code.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState((prevState) => ({
        ...prevState,
        isSubmitLoading: false,
      }));
    }
  };

  return (
    <Box mb={2}>
      {/* <Button
            variant={"solid"}
            m={2}
            colorScheme="green"
            onClick={runUserCodeAndUpdateOutput}
            isLoading={loadingState.isRunCodeLoading}
          >
            <Flex align={"center"} gap={2}>
              <CodeBracketIcon fontSize={"x-large"} />
              Run Your Code
            </Flex>
          </Button> */}

      <Flex justifyContent={"space-between"} px={2}>
        <ButtonGroup spacing={0}>
          <Button
            variant={"solid"}
            colorScheme={
              isCustomTestCaseSectionVisible ? "blackAlpha" : "messenger"
            }
            borderRadius={8}
            borderBottomRightRadius={"none"}
            borderBottomLeftRadius={"none"}
            onClick={() => setIsCustomTestCaseSectionVisible(false)}
          >
            Sample Input Testcases
          </Button>

          <Button
            variant={"solid"}
            colorScheme={
              isCustomTestCaseSectionVisible ? "messenger" : "blackAlpha"
            }
            borderRadius={8}
            borderBottomRightRadius={"none"}
            borderBottomLeftRadius={"none"}
            onClick={() => setIsCustomTestCaseSectionVisible(true)}
          >
            Custom Input Testcases
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          {isCustomTestCaseSectionVisible ? (
            <Button
              colorScheme="purple"
              onClick={runCustomTestCase}
              isLoading={loadingState.isCustomTestLoading}
            >
              <Flex align={"center"} gap={2}>
                Run Custom Tests
              </Flex>
            </Button>
          ) : (
            <Button
              variant={"solid"}
              colorScheme="purple"
              onClick={submitCode}
              isLoading={loadingState.isSubmitLoading}
            >
              Run Tests
            </Button>
          )}

          <Button variant={"solid"} colorScheme="whatsapp">
            Submit
          </Button>
        </ButtonGroup>
      </Flex>

      <Box mt={3}>
        {/* This needs to change */}
        {isCustomTestCaseSectionVisible ? (
          <Flex w={"100%"} gap={6} justify={"flex-start"}>
            <CustomTestCaseSection
              customTestCaseOutput={customTestCaseOutput}
              isCustomError={isCustomError}
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
          </Flex>
        ) : (
          <Box
            w={"100%"}
            bg={"#1e283b"}
            minH={"10rem"}
            p={2}
            mt={1}
            borderRadius={4}
            color={isError ? "red.400" : "#309F57"}
            borderColor={isError ? "red.500" : "#333"}
            overflowY={"scroll"}
            fontWeight={600}
          >
            {output
              ? output.map((line, i) => <Text key={i}>{line}</Text>)
              : 'Click "Run Your Code" to see the output here'}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Output;
