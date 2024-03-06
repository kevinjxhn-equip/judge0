import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  getResponseAfterSubmittingUserCode,
  getResponseAfterExecutingUserCode,
} from "../utils/api";
import CustomTestCaseSection from "./CustomTestCaseSection";
import { editorRefProvider, languageProvider } from "./ProgrammingTestTemplate";
import { getResponseAfterExecutingUserCustomInputCode } from "../utils/api";

const Output = () => {
  // const [isError, setIsError] = React.useState(false);
  // const [output, setOutput] = React.useState(null);
  const [isCustomTestCaseSectionVisible, setIsCustomTestCaseSectionVisible] =
    React.useState(false);

  const [customInput, setCustomInput] = React.useState("");
  const [isCustomError, setIsCustomError] = React.useState(false);
  const [customTestCaseOutput, setCustomTestCaseOutput] = React.useState(null);
  const [batchOutput, setBatchOutput] = React.useState(null);

  const [loadingState, setLoadingState] = React.useState({
    isSubmitLoading: false,
    isRunCodeLoading: false,
    isCustomTestLoading: false,
  });

  const editorRef = React.useContext(editorRefProvider);
  const activeLanguage = React.useContext(languageProvider);

  // const runUserCodeAndUpdateOutput = async () => {
  //   const sourceCode = editorRef.current.getValue();

  //   if (!sourceCode) return;

  //   try {
  //     setLoadingState((prevState) => ({
  //       ...prevState,
  //       isRunCodeLoading: true,
  //     }));

  //     const result = await getResponseAfterExecutingUserCode(
  //       activeLanguage,
  //       sourceCode
  //     );

  //     console.log(result);
  //     const statusId = result.status.id;

  // // Correct Answer
  // if (statusId === 3) {
  //   setIsError(false);
  //   setOutput(result.stdout.split("\n"));

  //   // Wrong Answer
  // } else if (statusId === 4) {
  //   setIsError(false);

  //   if (
  //     result.stderr === null &&
  //     (!result.stdout || result.stdout.trim() === "")
  //   ) {
  //     setOutput(["No output from the code"]);
  //   } else {
  //     setOutput(result.stdout.split("\n"));
  //   }

  //   // Compilation Error
  // } else if (statusId === 6) {
  //   setIsError(true);
  //   setOutput(result.compile_output.split("\n"));

  //   // Time Limit Exceeded
  // } else if (statusId === 5) {
  //   setIsError(true);
  //   setOutput(["Time Limit Exceeded"]);

  //   // Runtime Error and Internal Error
  // } else {
  //   setIsError(true);
  //   setOutput(result.stderr.split("\n"));
  // }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoadingState((prevState) => ({
  //       ...prevState,
  //       isRunCodeLoading: false,
  //     }));
  //   }
  // };

  const runCustomTestCase = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setLoadingState((prevState) => ({
        ...prevState,
        isCustomTestLoading: true,
      }));

      const result = await getResponseAfterExecutingUserCustomInputCode(
        activeLanguage,
        sourceCode,
        customInput
      );

      if (result.error) {
        setIsCustomError(true);
        setCustomTestCaseOutput(["Incorrect input format."]);
        return;
      }

      const statusId = result.status.id;

      // Correct Answer
      if (statusId === 3) {
        setIsCustomError(false);
        setCustomTestCaseOutput(result.stdout.split("\n"));

        // Wrong Answer
      } else if (statusId === 4) {
        setIsCustomError(false);

        if (
          result.stderr === null &&
          (!result.stdout || result.stdout.trim() === "")
        ) {
          setCustomTestCaseOutput(["No output from the code"]);
        } else {
          setCustomTestCaseOutput(result.stdout.split("\n"));
        }

        // Compilation Error
      } else if (statusId === 6) {
        setIsCustomError(true);
        setCustomTestCaseOutput(result.compile_output.split("\n"));

        // Time Limit Exceeded
      } else if (statusId === 5) {
        setIsCustomError(true);
        setCustomTestCaseOutput(["Time Limit Exceeded"]);

        // Runtime Error and Internal Error
      } else {
        setIsCustomError(true);
        setCustomTestCaseOutput(result.stderr.split("\n"));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState((prevState) => ({
        ...prevState,
        isCustomTestLoading: false,
      }));
    }
  };

  const submitCode = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setLoadingState((prevState) => ({ ...prevState, isSubmitLoading: true }));
      const result = await getResponseAfterSubmittingUserCode(
        activeLanguage,
        sourceCode
      );

      console.log(result);

      const updatedBatchOutput = result.map((item) => {
        const statusId = item.status.id;
        let output;

        if (statusId === 3) {
          output = {
            text: item.stdout.split("\n"),
            color: "green.500",
          };
        } else {
          let errorMessage;
          let color;
          switch (statusId) {
            case 4:
              errorMessage =
                item.stderr === null &&
                (!item.stdout || item.stdout.trim() === "")
                  ? ["No output from the code"]
                  : item.stdout.split("\n");
              color = "orange.500";
              break;
            case 6:
              errorMessage = item.compile_output.split("\n");
              color = "red.500";
              break;
            case 5:
              errorMessage = ["Time Limit Exceeded"];
              color = "red.500";
              break;
            default:
              errorMessage = item.stderr.split("\n");
              color = "red.500";
          }

          output = {
            text: errorMessage,
            color: color,
          };
        }

        return output;
      });

      setBatchOutput(updatedBatchOutput);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState((prevState) => ({
        ...prevState,
        isSubmitLoading: false,
      }));
    }
  };

  return (
    <Box mb={2}>
      <Flex justifyContent={"space-between"} px={2}>
        <ButtonGroup spacing={0}>
          <Button
            variant={"solid"}
            colorScheme={
              isCustomTestCaseSectionVisible ? "blackAlpha" : "messenger"
            }
            borderRadius={8}
            borderBottomRightRadius={"none"}
            borderBottomLeftRadius={"none"}
            onClick={() => setIsCustomTestCaseSectionVisible(false)}
          >
            Sample Input Testcases
          </Button>

          <Button
            variant={"solid"}
            colorScheme={
              isCustomTestCaseSectionVisible ? "messenger" : "blackAlpha"
            }
            borderRadius={8}
            borderBottomRightRadius={"none"}
            borderBottomLeftRadius={"none"}
            onClick={() => setIsCustomTestCaseSectionVisible(true)}
          >
            Custom Input Testcases
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          {/* {!isCustomTestCaseSectionVisible && (
            <Button
              variant={"solid"}
              colorScheme="yellow"
              onClick={runUserCodeAndUpdateOutput}
              isLoading={loadingState.isRunCodeLoading}
            >
              <Flex align={"center"} gap={2}>
                Run Your Code
              </Flex>
            </Button>
          )} */}

          {isCustomTestCaseSectionVisible ? (
            <Button
              colorScheme="purple"
              onClick={runCustomTestCase}
              isLoading={loadingState.isCustomTestLoading}
            >
              <Flex align={"center"} gap={2}>
                Run Custom Tests
              </Flex>
            </Button>
          ) : (
            <Button
              variant={"solid"}
              colorScheme="purple"
              onClick={submitCode}
              isLoading={loadingState.isSubmitLoading}
            >
              Run Tests
            </Button>
          )}

          {/* <Button variant={"solid"} colorScheme="whatsapp">
            Submit
          </Button> */}
        </ButtonGroup>
      </Flex>

      <Box mt={3}>
        {isCustomTestCaseSectionVisible ? (
          <CustomTestCaseSection
            customTestCaseOutput={customTestCaseOutput}
            isCustomError={isCustomError}
            customInput={customInput}
            setCustomInput={setCustomInput}
          />
        ) : (
          // <Box
          //   w={"100%"}
          //   bg={"#1e283b"}
          //   minH={{ base: "10rem", xl: "13rem" }}
          //   p={2}
          //   mt={1}
          //   borderRadius={4}
          //   color={isError ? "red.400" : "#309F57"}
          //   borderColor={isError ? "red.500" : "#333"}
          //   overflowY={"scroll"}
          //   fontWeight={600}
          // >
          //   {output
          //     ? output.map((line, i) => <Text key={i}>{line}</Text>)
          //     : 'Click "Run Your Code" to see the output here'}
          // </Box>
          <Flex>
            <Flex
              direction="column"
              h={"13rem"}
              pl={2}
              overflow={"scroll"}
              flex={2}
            >
              <Flex
                justify="space-between"
                align="center"
                flex={1}
                color={"gray.500"}
              >
                <Box flex={1} textAlign="center" p={2}>
                  <Text fontWeight={500}>Input</Text>
                </Box>
                <Box flex={1} textAlign="center">
                  <Box p={2}>
                    <Text fontWeight={500}>Expected Output</Text>
                  </Box>
                </Box>
              </Flex>
              <Flex
                justify="space-between"
                align="center"
                flex={1}
                bg={"#f3f4f6"}
              >
                <Box flex={1} textAlign="center" p={2}>
                  <Text fontWeight={700}>aaa</Text>
                </Box>
                <Box flex={1} textAlign="center" p={2}>
                  <Text fontWeight={700}>a</Text>
                </Box>
              </Flex>
              <Flex justify="space-between" align="center" flex={1}>
                <Box flex={1} textAlign="center" p={2}>
                  <Text fontWeight={700}>bc</Text>
                </Box>
                <Box flex={1} textAlign="center" p={2}>
                  <Text fontWeight={700}>b</Text>
                </Box>
              </Flex>
            </Flex>
            {batchOutput && (
              <Flex flex={1} direction="column" h="13rem" align="center">
                <Flex
                  flex={1}
                  textAlign="center"
                  align="center"
                  w="100%"
                  justify="center"
                >
                  <Text fontWeight={500} color="gray.500">
                    Output
                  </Text>
                </Flex>

                {batchOutput.map((item, index) => (
                  <Flex
                    key={index}
                    flex={1}
                    direction={"column"}
                    justify={
                      item.color === "green.500" || item.color === "orange.500" ? "center" : "flex-start"
                    }
                    overflow={"auto"}
                    w="100%"
                    color={item.color} // Set color based on status
                    bg={index % 2 === 0 ? "#f3f4f6" : "white"}
                  >
                    {item.text.map((line, index) => (
                      <Text fontWeight={600} key={index}>
                        {line}
                      </Text>
                    ))}
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Output;
