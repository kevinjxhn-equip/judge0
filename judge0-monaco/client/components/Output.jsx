import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  getResponseAfterSubmittingUserCode,
  getResponseAfterExecutingUserCode,
} from "../utils/api";
import TerminalIcon from "./TerminalIcon";
import CodeBracketIcon from "./CodeBracketIcon";
import CustomTestCaseSection from "./CustomTestCaseSection";
import RocketLaunchIcon from "./RocketLaunchIcon";
import { editorRefProvider, languageProvider } from "./ProgrammingTestTemplate";

const Output = () => {
  const [isError, setIsError] = React.useState(false);
  const [output, setOutput] = React.useState(null);
  const [loadingState, setLoadingState] = React.useState({
    isSubmitLoading: false,
    isRunCodeLoading: false,
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
            colorScheme="messenger"
            borderRadius={8}
            borderBottomRightRadius={"none"}
            borderBottomLeftRadius={"none"}
          >
            Sample Input Testcases
          </Button>

          <Button
            variant={"solid"}
            colorScheme="blackAlpha"
            borderRadius={8}
            borderBottomRightRadius={"none"}
            borderBottomLeftRadius={"none"}
          >
            Custom Input Testcases
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            variant={"solid"}
            colorScheme="orange"
            onClick={submitCode}
            isLoading={loadingState.isSubmitLoading}
          >
            Run Tests
          </Button>

          <Button variant={"solid"} colorScheme="whatsapp">
            Submit
          </Button>
        </ButtonGroup>
      </Flex>

      <VStack>
        <Box
          w={"100%"}
          bg={"#1e283b"}
          minH={"20rem"}
          p={2}
          mt={1}
          border={"1px solid"}
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

        <Flex w={"100%"} gap={6} justify={"flex-start"}>
          <CustomTestCaseSection />
        </Flex>
      </VStack>
    </Box>
  );
};

export default Output;
