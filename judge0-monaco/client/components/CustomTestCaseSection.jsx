import React from "react";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import CloudArrowUpIcon from "./CloudArrowUpIcon";
import { editorRefProvider, languageProvider } from "./ProgrammingTestTemplate";
import { getResponseAfterExecutingUserCustomInputCode } from "../utils/api";

const CustomTestCaseSection = () => {
  const [customTestCaseOutput, setCustomTestCaseOutput] = React.useState(null);
  const [customInput, setCustomInput] = React.useState("");
  const [customTestCaseLoading, setCustomTestCaseLoading] =
    React.useState(false);

  const [isError, setIsError] = React.useState(false);
  const editorRef = React.useContext(editorRefProvider);
  const activeLanguage = React.useContext(languageProvider);

  const runCustomTestCase = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setCustomTestCaseLoading(true);

      const result = await getResponseAfterExecutingUserCustomInputCode(
        activeLanguage,
        sourceCode,
        customInput
      );

      if (result.error) {
        setIsError(true);
        setCustomTestCaseOutput(["Incorrect input format."]);
        return;
      }

      const statusId = result.status.id;

      // Correct Answer
      if (statusId === 3) {
        setIsError(false);
        setCustomTestCaseOutput(result.stdout.split("\n"));

        // Wrong Answer
      } else if (statusId === 4) {
        setIsError(false);

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
        setIsError(true);
        setCustomTestCaseOutput(result.compile_output.split("\n"));

        // Time Limit Exceeded
      } else if (statusId === 5) {
        setIsError(true);
        setCustomTestCaseOutput(["Time Limit Exceeded"]);

        // Runtime Error and Internal Error
      } else {
        setIsError(true);
        setCustomTestCaseOutput(result.stderr.split("\n"));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCustomTestCaseLoading(false);
    }
  };

  return (
    <Box py={2} w={"100%"} borderColor="gray.400" borderTop="1px" mt={3}>
      <Flex justify={"flex-end"} gap={3} mt={2} mb={1}>
        <Button
          colorScheme="telegram"
          m={2}
          onClick={runCustomTestCase}
          isLoading={customTestCaseLoading}
        >
          <Flex align={"center"} gap={2}>
            <CloudArrowUpIcon fontSize={"x-large"} />
            Run Custom Tests
          </Flex>
        </Button>
      </Flex>

      <Flex align={"flex-start"} gap={5}>
        <Box flex={1}>
          <Textarea
            placeholder="Add a custom test case here..."
            minH={"11rem"}
            variant={"filled"}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
        </Box>
        <Box
          flex={1}
          bg={"#1e283b"}
          minH={"11rem"}
          p={2}
          border={"1px solid"}
          borderRadius={4}
          color={isError ? "red.400" : "#309F57"}
          borderColor={isError ? "red.500" : "#333"}
          overflowY={"scroll"}
          fontWeight={600}
        >
          {customTestCaseOutput
            ? customTestCaseOutput.map((line, i) => <Text key={i}>{line}</Text>)
            : 'Click "Run Custom Tests" to see the output here'}
        </Box>
      </Flex>
    </Box>
  );
};

export default CustomTestCaseSection;
