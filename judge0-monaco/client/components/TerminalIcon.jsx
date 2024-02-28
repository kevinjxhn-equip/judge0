import React from 'react'
import { createIcon } from '@chakra-ui/icons';

const TerminalIcon = createIcon({
  displayName: 'TerminalIcon',
  viewBox: '0 0 24 24', // Define the viewBox of your SVG
  path: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  ),
});

export default TerminalIcon;
