import {
  Box,
  Button,
  Flex,
  Spacer,
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

const Output = ({ editorRef, activeLanguage }) => {
  const [isError, setIsError] = React.useState(false);
  const [output, setOutput] = React.useState(null);
  const [loadingState, setLoadingState] = React.useState({
    isSubmitLoading: false,
    isRunCodeLoading: false,
    isRunCustomLoading: false,
  });

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
      console.log(result)
      const statusId = result.status.id;

      // Correct Answer
      if (statusId === 3) {
        setIsError(false);
        setOutput(result.stdout.split("\n"));

        // Wrong Answer
      } else if (statusId === 4) {
        setIsError(false);

        if (
          (result.stderr === null) &
          (result.stdout === null ||
            result.stdout === "" ||
            result.stdout === "\n")
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
    <Box w={"50%"} mb={2}>
      <Flex>
        <Flex align={"center"} gap={2}>
          <TerminalIcon fontSize={"xx-large"} mt={1} />
          <Text fontSize={"x-large"} fontWeight={700}>
            Terminal
          </Text>
        </Flex>

        <Spacer />

        <Box direction="row" spacing={4} align={"center"}>
          <Button
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
          </Button>

          <Button
            variant={"solid"}
            colorScheme="pink"
            onClick={submitCode}
            isLoading={loadingState.isSubmitLoading}
          >
            <Flex align={"center"} gap={2}>
              <RocketLaunchIcon fontSize={"x-large"} />
              Test All Cases
            </Flex>
          </Button>
        </Box>
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
