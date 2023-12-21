import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  List,
  ListItem,
  Stack,
} from "@chakra-ui/react";

export function Folder({ folder, flowInstances, docs }) {

  return (
    <Box bg="white" borderRadius="md" p={5}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="md">
          {folder.name}
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {folder.createdAt}
        </Text>
      </Flex>

      <Flex mt={4} justifyContent="space-between">
        <List spacing={3}>
          {flowInstances.map((flow) => (
            <ListItem key={flow.id}>
              <Text>{flow.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {flow.status}
              </Text>
            </ListItem>
          ))}
        </List>

        <List spacing={3}>
          {docs.map((doc) => (
            <ListItem key={doc.id}>
              <Text>{doc.title}</Text>
              <Text fontSize="sm" color="gray.500">
                {doc.type}
              </Text>
            </ListItem>
          ))}
        </List>
      </Flex>
    </Box>
  );
}