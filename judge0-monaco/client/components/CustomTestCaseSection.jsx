import React from "react";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";

const CustomTestCaseSection = ({
  customTestCaseOutput,
  isCustomError,
  customInput,
  setCustomInput,
}) => {
  return (
    <Box w={"100%"}>
      <Flex align={"flex-start"} gap={5}>
        <Box flex={1}>
          <Textarea
            placeholder="Add a custom test case here..."
            minH={"10rem"}
            variant={"filled"}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            colorScheme="pink"
          />
        </Box>
        <Box
          flex={1}
          bg={"#1e283b"}
          minH={"10rem"}
          p={2}
          border={"1px solid"}
          borderRadius={4}
          color={isCustomError ? "red.400" : "#309F57"}
          borderColor={isCustomError ? "red.500" : "#333"}
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
