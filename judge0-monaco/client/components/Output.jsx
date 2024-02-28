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

      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr.split("\n"));
      } else if (result.status.description === "Compilation Error") {
        setIsError(true);
        setOutput(result.compile_output.split("\n"));
      } else {
        setIsError(false);
        setOutput(result.stdout.split("\n"));
      }

      // if (result.status.description === "Wrong Answer") {
      //   setOutput(result.stdout.split("\n"));
      //   toast({
      //     title: "One or more test cases failed",
      //     description: "Please check your code.",
      //     status: "error",
      //     duration: 5000,
      //     isClosable: true,
      //   });

      // } else {
      //   toast({
      //     title: "Great job!",
      //     description: "All cases passed!",
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //   });
      // }
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
