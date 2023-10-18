import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { ApprovedReturnApprover } from "../../borrowed_new/approved_returned_approver/ApprovedReturnApprover";
import ReturnedApproval from "../../borrowed_new/return_approval/ReturnedApproval";

const ReturnRequestsApprover = ({ notification, fetchNotification }) => {
  const [navigation, setNavigation] = useState(1);

  return (
    <Flex px={5} pt={5} pb={0} w="full" flexDirection="column" bg="form">
      <Flex w="full" justifyContent="space-between">
        <HStack spacing={0} w="full">
          <Button
            w="10%"
            bgColor={navigation === 1 ? "primary" : ""}
            color={navigation === 1 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(1)}
            borderRadius="none"
          >
            Pending
            {notification?.returnedApproval?.forreturnedApprovalcount === 0 ? (
              ""
            ) : (
              <Badge
                ml={2}
                fontSize="10px"
                variant="solid"
                colorScheme="red"
                mb={1}
              >
                {notification?.returnedApproval?.forreturnedApprovalcount}
              </Badge>
            )}
          </Button>
          <Button
            w="10%"
            bgColor={navigation === 2 ? "primary" : ""}
            color={navigation === 2 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(2)}
            borderRadius="none"
          >
            Approved
          </Button>
        </HStack>
      </Flex>

      <VStack
        h="90vh"
        // mt={2}
        className="boxShadow"
        // border="4px"
        // borderColor="#4A5568"
        // borderRadius="20px"
        w="full"
        p={2}
        bg="form"
      >
        {navigation === 1 ? (
          <>
            <ReturnedApproval
              navigation={navigation}
              fetchNotification={fetchNotification}
            />
          </>
        ) : navigation === 2 ? (
          <>
            <ApprovedReturnApprover navigation={navigation} />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default ReturnRequestsApprover;
