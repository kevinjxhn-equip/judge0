import React from "react";
import { Box, Button, Flex, Textarea } from "@chakra-ui/react";
import CloudArrowUpIcon from "./CloudArrowUpIcon";

const CustomTestCaseSection = () => {
  const [output, setOutput] = React.useState(null);
  const [isError, setIsError] = React.useState(false);

  return (
    <Box py={2} w={"100%"} borderColor="gray.400" borderTop="1px" mt={3}>
      <Flex justify={"flex-end"} gap={3} mt={2} mb={1}>
        <Button colorScheme="telegram" m={2}>
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
          {output
            ? output.map((line, i) => <Text key={i}>{line}</Text>)
            : 'Click "Run Custom Tests" to see the output here'}
        </Box>
      </Flex>
    </Box>
  );
};

export default CustomTestCaseSection;
