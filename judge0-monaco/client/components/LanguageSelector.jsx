import {
  Box,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import {} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../utils/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ activeLanguage, onSelect }) => {
  return (
    <Box ml={2} mb={2}>
      <Text mb={2} fontSize={"lg"}>
        Language:
      </Text>

      <Menu isLazy>
        <MenuButton mb={2} as={Button}>{activeLanguage}</MenuButton>
        <MenuList bg={"#110c1b"}>
          {languages.map(([language, version]) => (
            <MenuItem
              key={language}
              onClick={() => onSelect(language)}
              color={activeLanguage === language ? "blue.400" : ""}
              bg={activeLanguage === language ? "gray.700" : ""}
              _hover={{ bg: "gray.800", color: "blue.400" }}
            >
              {language}
              &nbsp;
              <Text as={"span"} color={"gray.500"} fontSize={"sm"}>
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
