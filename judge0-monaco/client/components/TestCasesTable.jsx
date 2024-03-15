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
import { questions } from "../utils/questions";

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
                <Td>{questions[0].testcaseText1.input}</Td>
                <Td>{questions[0].testcaseText1.output}</Td>
              </Tr>
              <Tr>
                <Td>{questions[0].testcaseText2.input}</Td>
                <Td>{questions[0].testcaseText2.output}</Td>
              </Tr>
            </>
          ) : (
            <>
               <Tr>
                <Td>{questions[1].testcaseText1.input}</Td>
                <Td>{questions[1].testcaseText1.output}</Td>
              </Tr>
              <Tr>
                <Td>{questions[1].testcaseText2.input}</Td>
                <Td>{questions[1].testcaseText2.output}</Td>
              </Tr>
            </>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TestCasesTable;
