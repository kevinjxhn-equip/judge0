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
import { questionTypeProvider } from "./ProgrammingTestTemplate";

const TestCasesTable = () => {
  const questionType = React.useContext(questionTypeProvider);

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
          {questionType === "string" ? (
            <>
              <Tr>
                <Td>aaa</Td>
                <Td>a</Td>
              </Tr>
              <Tr>
                <Td>bc</Td>
                <Td>b</Td>
              </Tr>
            </>
          ) : (
            <>
              <Tr>
                <Td>[[1, 2], [3, 4]]</Td>
                <Td>2.5</Td>
              </Tr>
              <Tr>
                <Td>[[1, 2, 3], [1, 2, 3], [1, 2, 3]]</Td>
                <Td>2.0</Td>
              </Tr>
            </>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TestCasesTable;
