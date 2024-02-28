import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Question = () => {
  return (
    <Box p={2} mt={4} mb={6} borderBottom="1px" borderColor="gray.400">
      <Text fontSize="xl" fontWeight="bold">
        Question
      </Text>
      <Text my={3}>
        Given a strings, you must return the first character of the string. You
        are guaranteed that the string has at least one character. Don't change
        the name of the main function on the right. You may write other code
        inside and outside the function.
      </Text>
    </Box>
  );
};

export default Question;
