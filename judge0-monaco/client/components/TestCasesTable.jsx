import {
  Box,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

const TestCasesTable = () => {

  return (
    <TableContainer width={"100%"} border={"1px"} p={2}>
      <Table variant="simple">
        <TableCaption>TEST CASES</TableCaption>
        <Thead>
          <Tr>
            <Th>INPUT</Th>
            <Th>OUTPUT</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>aaa</Td>
            <Td>a</Td>
          </Tr>
          <Tr>
            <Td>bc</Td>
            <Td>b</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TestCasesTable;
