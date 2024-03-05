import { Flex } from "@chakra-ui/react";
import ProgrammingTestTemplate from "./components/ProgrammingTestTemplate";

function App() {
  return (
    <Flex minH={"100vh"} bg={"white"} color={"gray.800"} align={"center"}>
      <ProgrammingTestTemplate />
    </Flex>
  );
}

export default App;
