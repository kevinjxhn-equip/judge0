import React from "react";
import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import TestCasesTable from "./TestCasesTable";
import { Kbd } from "@chakra-ui/react";
import { questionTypeProvider } from "./ProgrammingTestTemplate";

const QuestionSection = () => {
  const questionType = React.useContext(questionTypeProvider);

  return (
    <Flex
      direction={"column"}
      gap={{ lg: 6, xl: 10 }}
      p={2}
      mb={6}
      overflowY={"scroll"}
      maxH={"90vh"}
    >
      <Box p={1} m={1}>
        <Box borderBottom={"1px"} borderColor={"#d1d5da"} pb={2}>
          <Text
            fontSize={"3xl"}
            fontWeight="bold"
            variant={"solid"}
            lineHeight={"shorter"}
          >
            Introduction
          </Text>
        </Box>

        <Text my={3}>
          This demo test will explain how you can use our Coding Interface:
        </Text>

        <UnorderedList pl={8}>
          <ListItem>Choose a language in the dropdown to your right</ListItem>
          <ListItem>Solve the Problem</ListItem>
          <ListItem>Statement below by writing the relevant code</ListItem>
          <ListItem>
            Click on the Run Tests button to see if the code's output matches
            the expected output
          </ListItem>
        </UnorderedList>
      </Box>

      <Box p={1} m={1}>
        <Box borderBottom={"1px"} borderColor={"#d1d5da"} pb={2}>
          <Text
            fontSize={"3xl"}
            fontWeight="bold"
            variant={"solid"}
            lineHeight={"shorter"}
          >
            Problem Statement
          </Text>
        </Box>

        {questionType === "string" ? (
          <Text mt={3}>
            Given a string <Kbd bg={"gray.100"}>s</Kbd> , you must return the
            first character of the string.
            <br />
            <br />
            You are guaranteed that the string has at least one character. Don't
            change the name of the <Kbd bg={"gray.100"}>main</Kbd> function on
            the right. You may write other code inside and outside the function.
          </Text>
        ) : (
          <Text mt={3}>
            Given a matrix <Kbd bg={"gray.100"}>mat</Kbd> , you must return the
            average of the matrix.
            <br />
            <br />
            You are guaranteed that the matrix <Kbd bg={"gray.100"}>
              mat
            </Kbd>{" "}
            has at least one element. Don't change the name of the{" "}
            <Kbd bg={"gray.100"}>main</Kbd> function on the right. You may write
            other code inside and outside the function.
          </Text>
        )}
      </Box>

      <Box p={1} m={1}>
        <Box borderBottom={"1px"} borderColor={"#d1d5da"} pb={2}>
          <Text fontSize="2xl" fontWeight="bold" variant={"solid"}>
            Test Cases
          </Text>
        </Box>
        <Box mt={8} minW={"15rem"}>
          <TestCasesTable />
        </Box>
      </Box>
    </Flex>
  );
};

export default QuestionSection;
