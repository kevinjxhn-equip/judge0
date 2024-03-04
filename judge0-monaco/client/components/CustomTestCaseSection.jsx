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
            placeholderTextColor="gray.800"
            minH={{ base: "10rem", xl: "13rem" }}
            variant="filled"
            bg="gray.100" // Set the background color to gray.100
            color="gray.700" // Set the text color to a darker shade of gray
            _hover={{ bg: "gray.200" }} // Adjust background color on hover
            _focus={{
              bg: "gray.200",
              borderColor: "blue.400",
              outline: "none",
            }} // Adjust background color and border color on focus
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            sx={{
              "&::placeholder": { color: "gray.800", fontWeight: "600" }, // Change placeholder color using CSS
            }}
          />
        </Box>
        <Box
          flex={1}
          bg={"#1e283b"}
          minH={{ base: "10rem", xl: "13rem" }}
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
