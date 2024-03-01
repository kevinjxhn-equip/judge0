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
import { ChevronDownIcon } from "@chakra-ui/icons";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ activeLanguage, onSelect }) => {
  return (
    <Box ml={2} mb={2}>
      <Menu isLazy>
        <MenuButton
          mb={2}
          as={Button}
          colorScheme="blackAlpha"
          rightIcon={<ChevronDownIcon fontSize={"x-large"} />}
        >
          {activeLanguage}
        </MenuButton>
        <MenuList bg="white">
          {languages.map(([language, version]) => (
            <MenuItem
              key={language}
              onClick={() => onSelect(language)}
              color={activeLanguage === language ? "blue.400" : "gray.600"}
              bg={activeLanguage === language ? "gray.100" : ""}
              _hover={{ bg: "gray.100", color: "blue.400" }}
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
