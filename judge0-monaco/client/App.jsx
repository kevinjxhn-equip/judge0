import { Box } from "@chakra-ui/react";
import ProgrammingTestTemplate from "./components/ProgrammingTestTemplate";

function App() {
  return (
    <Box minH={"100vh"} bg={"white"} p={4} color={"gray.800"} px={6} py={10}>
      <ProgrammingTestTemplate />
    </Box>
  );
}

export default App;
