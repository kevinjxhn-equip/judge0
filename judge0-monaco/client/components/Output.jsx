import { Box, Button, ButtonGroup, Flex, Text } from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import { getResponseAfterSubmittingUserCode } from "../utils/api";
import CustomTestCaseSection from "./CustomTestCaseSection";
import {
  editorRefProvider,
  languageProvider,
  questionTypeProvider,
} from "./ProgrammingTestTemplate";
import { getResponseAfterExecutingUserCustomInputCode } from "../utils/api";

const Output = () => {
  const [isCustomTestCaseSectionVisible, setIsCustomTestCaseSectionVisible] =
    useState(false);
  const [customInput, setCustomInput] = useState("");
  const [isCustomError, setIsCustomError] = useState(false);
  const [customTestCaseOutput, setCustomTestCaseOutput] = useState(null);
  const [batchOutput, setBatchOutput] = useState(null);

  const [userName, setUserName] = useState("");

  const questionType = useContext(questionTypeProvider);
  const editorRef = useContext(editorRefProvider);
  const activeLanguage = useContext(languageProvider);

  let functionName;
  if (questionType === "string") {
    functionName = "firstCharacter";
  } else if (questionType === "matrix") {
    functionName = "calculateMatrixAverage";
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const userNameParam = params.get("userName");

    if (userNameParam) {
      setUserName(userNameParam);
      console.log(userName);
    }
  }, [userName]);

  const [loadingState, setLoadingState] = useState({
    isSubmitLoading: false,
    isCustomTestLoading: false,
  });

  // function to run custom test case
  const runCustomTestCase = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    if (questionType === "matrix") {
      let sanitisedInput;
      try {
        sanitisedInput = JSON.parse(customInput);
      } catch (error) {
        setIsCustomError(true);
        setCustomTestCaseOutput(["Input is not in array format"]);
      }

      // Input is not an array
      if (!Array.isArray(sanitisedInput)) {
        setIsCustomError(true);
        setCustomTestCaseOutput(["Input is not an array"]);
        return;
      }
    }

    try {
      setLoadingState((prevState) => ({
        ...prevState,
        isCustomTestLoading: true,
      }));

      const result = await getResponseAfterExecutingUserCustomInputCode(
        activeLanguage,
        sourceCode,
        customInput,
        userName,
        functionName
      );

      if (result.error) {
        setIsCustomError(true);
        setCustomTestCaseOutput([result.error]);
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

  // function to submit code against sample test cases
  const submitCode = async () => {
    const sourceCode = editorRef.current.getValue();

    if (!sourceCode) return;

    try {
      setLoadingState((prevState) => ({ ...prevState, isSubmitLoading: true }));
      const result = await getResponseAfterSubmittingUserCode(
        activeLanguage,
        sourceCode,
        userName,
        functionName
      );

      console.log(result);

      const updatedBatchOutput = result.map((item) => {
        const statusId = item.status.id;
        let output;

        // Correct Answer
        if (statusId === 3) {
          output = {
            text: item.stdout.split("\n"),
            color: "green.500",
          };
        } else {
          let errorMessage;
          let color;

          switch (statusId) {
            // Wrong Answer
            case 4:
              errorMessage =
                item.stderr === null &&
                (!item.stdout || item.stdout.trim() === "")
                  ? ["No output from the code"]
                  : item.stdout.split("\n");
              color = "orange.500";
              break;

            // Compilation Error
            case 6:
              errorMessage = item.compile_output.split("\n");
              color = "red.500";
              break;

            // Time Limit Exceeded
            case 5:
              errorMessage = ["Time Limit Exceeded"];
              color = "red.500";
              break;

            // Runtime Error and Internal Error
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

        <Flex align={"center"}>
          {/* Slack task */}
          {isCustomTestCaseSectionVisible ? (
            <Text fontWeight={600}>
              {loadingState.isCustomTestLoading
                ? "Running..."
                : customTestCaseOutput
                ? isCustomError
                  ? `${userName}, your custom input didn't run due to some error.`
                  : `${userName}, your custom input ran.`
                : "Check now"}
            </Text>
          ) : (
            <Text fontWeight={600}>
              {loadingState.isSubmitLoading
                ? "Running..."
                : batchOutput
                ? batchOutput.some(
                    (item) =>
                      item.color === "red.500" || item.color === "orange.500"
                  )
                  ? `${userName}, your answer is wrong.`
                  : `${userName}, your answer is right.`
                : "Check now"}
            </Text>
          )}
        </Flex>

        <ButtonGroup>
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

              {questionType === "string" ? (
                <>
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
                </>
              ) : (
                <>
                  <Flex
                    justify="space-between"
                    align="center"
                    flex={1}
                    bg={"#f3f4f6"}
                  >
                    <Box flex={1} textAlign="center" p={2}>
                      <Text fontWeight={700}>[[1, 2], [3, 4]]</Text>
                    </Box>
                    <Box flex={1} textAlign="center" p={2}>
                      <Text fontWeight={700}>2.5</Text>
                    </Box>
                  </Flex>
                  <Flex justify="space-between" align="center" flex={1}>
                    <Box flex={1} textAlign="center" p={2}>
                      <Text fontWeight={700}>
                        [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
                      </Text>
                    </Box>
                    <Box flex={1} textAlign="center" p={2}>
                      <Text fontWeight={700}>2</Text>
                    </Box>
                  </Flex>
                </>
              )}
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
                      item.color === "green.500" || item.color === "orange.500"
                        ? "center"
                        : "flex-start"
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
