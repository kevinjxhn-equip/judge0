import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    body: `'Open Sans', sans-serif`,
    body: `'Lato', sans-serif`,
  },
});
export default theme;
