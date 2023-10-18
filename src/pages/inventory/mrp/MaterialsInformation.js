import React from "react";
import {
  Badge,
  Box,
  Flex,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";

export const MaterialsInformation = ({ rawMatsInfo, mrpDataLength }) => {
  return (
    <>
      <Flex justifyContent="center" flexDirection="column" w="full">
        <Flex w="full" justifyContent="space-between">
          <Box w="15%" bg="primary">
            <Text
              textAlign="center"
              fontSize="xs"
              fontWeight="semibold"
              color="white"
            >
              MATERIALS INFORMATION
            </Text>
          </Box>
          <Box w="15%">
            <Text textAlign="center" fontSize="xs" fontWeight="semibold">
              TOTAL RECORDS/PAGE: {mrpDataLength}
            </Text>
          </Box>
        </Flex>

        <VStack
          w="full"
          spacing={6}
          border="2px"
          borderColor="gray.400"
          borderRadius="sm"
          py={10}
        >
          <Flex w="95%" justifyContent="space-between">
            <VStack alignItems="start" w="40%" mx={5}>
              <HStack w="full">
                <Text
                  w="full"
                  bgColor="secondary"
                  color="white"
                  pl={2}
                  pr={7}
                  py={2.5}
                  fontSize="xs"
                >
                  Item Code:{" "}
                </Text>
                <Input
                  borderRadius="none"
                  w="95%"
                  fontSize="xs"
                  readOnly
                  bgColor="gray.300"
                  value={rawMatsInfo.itemCode}
                />
              </HStack>
              <HStack w="full">
                <Text
                  w="full"
                  bgColor="secondary"
                  color="white"
                  pl={2}
                  pr={10}
                  py={2.5}
                  fontSize="xs"
                >
                  Item Description:{" "}
                </Text>
                <Input
                  w="98%"
                  borderRadius="none"
                  fontSize="xs"
                  readOnly
                  bgColor="gray.300"
                  value={rawMatsInfo.itemDescription}
                />
              </HStack>
            </VStack>

            <VStack alignItems="start" w="40%" mx={5}>
              <HStack w="full">
                <Text
                  w="full"
                  bgColor="secondary"
                  color="white"
                  pl={2}
                  pr={7}
                  py={2.5}
                  fontSize="xs"
                >
                  Stock on Hand:{" "}
                </Text>
                <Input
                  w="95%"
                  borderRadius="none"
                  fontSize="xs"
                  readOnly
                  bgColor="gray.300"
                  value={rawMatsInfo.soh.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                />
              </HStack>
              <HStack w="full">
                <Text
                  w="full"
                  bgColor="secondary"
                  color="white"
                  pl={2}
                  pr={7}
                  py={2.5}
                  fontSize="xs"
                >
                  Buffer Level:{" "}
                </Text>
                <Input
                  w="95%"
                  borderRadius="none"
                  fontSize="xs"
                  readOnly
                  bgColor="gray.300"
                  value={rawMatsInfo.bufferLevel.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                />
              </HStack>
            </VStack>

            <VStack alignItems="start" w="40%" mx={5}>
              <HStack w="full">
                <Text
                  w="full"
                  bgColor="secondary"
                  color="white"
                  pl={2}
                  py={2.5}
                  fontSize="xs"
                >
                  Average Issuance:{" "}
                </Text>
                <Input
                  w="95%"
                  readOnly
                  bgColor="gray.300"
                  fontSize="xs"
                  value={rawMatsInfo.averageIssuance.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                />
              </HStack>
              <HStack w="full">
                <Text
                  w="full"
                  bgColor="secondary"
                  color="white"
                  pl={2}
                  py={2.5}
                  fontSize="xs"
                >
                  Days Level:{" "}
                </Text>
                <Input
                  w="95%"
                  readOnly
                  bgColor="gray.300"
                  fontSize="xs"
                  value={rawMatsInfo.daysLevel.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                />
              </HStack>
            </VStack>
          </Flex>
        </VStack>
      </Flex>
    </>
  );
};
