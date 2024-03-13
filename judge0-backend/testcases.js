module.exports.TEST_CASES_STRING = {
  inputTestCases: [['"aaa"'], ['"bc"']],
  outputTestCases: ["a", "b"],
};

module.exports.TEST_CASES_MATRIX = {
  inputTestCases: [
    [
      [
        [1, 2, 3],
        [3, 4, 5],
        [7, 7, 7],
      ],
    ],
    [
      [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ],
    ],
  ],
  outputTestCases: ["4.3", "2.0"],
};
