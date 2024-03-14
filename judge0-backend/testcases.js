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

module.exports.REAL_TEST_CASES_STRING = {
  inputTestCases: [['"aaa"'], ['"bc"'], ['"def"'], ['"ghij"'], ['"klmno"']],
  outputTestCases: ["a", "b", "d", "g", "k"],
};

module.exports.REAL_TEST_CASES_MATRIX = {
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
    [
      [
        [1, 2, 3],
        [3, 6, 5],
        [7, 7, 7],
      ],
    ],
    [
      [
        [1, 2, 3],
        [1, 6, 3],
        [1, 2, 3],
      ],
    ],
    [
      [
        [3, 2, 3],
        [10, 3, 3],
        [1, 3, 3],
      ],
    ],
  ],
  outputTestCases: ["4.3", "2.0", "4.6", "2.4", "3.4"],
};
