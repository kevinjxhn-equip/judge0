import {
  Table,
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
    <TableContainer border={"1px"} p={2} pb={7} borderColor={"#d1d5da"}>
      <Table>
        <Thead>
          <Tr>
            <Th color={"gray.800"}>INPUT</Th>
            <Th color={"gray.800"}>OUTPUT</Th>
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
