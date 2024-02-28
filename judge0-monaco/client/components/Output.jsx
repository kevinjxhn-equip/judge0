import { Box, Button, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { executeCode } from "../utils/api";

const Output = ({ editorRef, activeLanguage }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [output, setOutput] = React.useState(null);

  const toast = useToast();

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const result = await executeCode(activeLanguage, sourceCode);
      console.log(result);

      const statusId = result.status.id;

      // Correct Answer
      if (statusId === 3) {
        setIsError(false);
        setOutput(result.stdout.split("\n"));

        toast({
          title: "Great job!",
          description: "All cases passed!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Wrong Answer
      } else if (statusId === 4) {
        setIsError(false);
        setOutput(result.stdout.split("\n"));
        toast({
          title: "One or more test cases failed",
          description: "Please check your code.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        if(result.stderr === null & (result.stdout === null || result.stdout === "" || result.stdout === "\n")){
          setOutput(["No output from the code"]);
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
      setIsLoading(false);
    }
  };

  return (
    <Box w={"50%"} mb={2}>
      <Text mb={2} fontSize={"lg"}>
        Output:
      </Text>

      <Button
        variant={"solid"}
        mb={2}
        color={"#7FFFD4"}
        onClick={runCode}
        isLoading={isLoading}
      >
        Run Code
      </Button>

      <Box
        minH={"75vh"}
        p={2}
        mt={3}
        border={"1px solid"}
        borderRadius={4}
        color={isError ? "red.400" : ""}
        borderColor={isError ? "red.500" : "#333"}
        overflowY={"scroll"}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
