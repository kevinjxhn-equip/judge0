import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import TestCasesTable from "./TestCasesTable";

const Question = () => {
  return (
    <Box
      p={2}
      mt={4}
      mb={6}
      borderBottom="1px"
      borderColor="gray.400"
      borderTop="1px"
    >
      <Text fontSize="3xl" fontWeight="bold">
        Question
      </Text>
      <Text my={3}>
        Given a strings, you must return the first character of the string.
        <br />
        You are guaranteed that the string has at least one character. Don't
        change the name of the main function on the right. You may write other
        code inside and outside the function.
      </Text>

      <Box w={"30%"} mt={"10"} mb={5} display={"flex"} justify={"flex-end"}>
        <TestCasesTable />
      </Box>
    </Box>
  );
};

export default Question;
