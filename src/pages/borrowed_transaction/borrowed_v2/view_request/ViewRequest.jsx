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
import { PendingBorrowedMaterials } from "../../borrowed_new/pending_borrowed/PendingBorrowedMaterials";
import { ApprovedBorrowedMaterials } from "../../borrowed_new/approved_borrowed/ApprovedBorrowedMaterials";
import RejectBorrowed from "../../borrowed_new/reject_borrowed_customer/RejectBorrowed";
import CustomerNew from "../../../setup/customer_new/CustomerNew";
import CustomerReturnMaterials from "../../borrowed_new/approved_borrowed/customer_returnmaterials/CustomerReturnMaterials";
import { ListOfMaterials } from "../../borrowed_new/approved_borrowed/ListOfMaterials";

const ViewRequest = ({
  notificationWithParams,
  fetchNotificationWithParams,
}) => {
  const [navigation, setNavigation] = useState(1);

  // console.log(navigation);

  const storedNavigation = Number(sessionStorage.getItem("Navigation"));
  useEffect(() => {
    if (storedNavigation) {
      setNavigation(storedNavigation);
    }

    return () => {
      sessionStorage.removeItem("Navigation");
    };
  }, [storedNavigation]);

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
            {notificationWithParams?.borrowedApproved?.borrowedApprovecount ===
            0 ? (
              ""
            ) : (
              <Badge
                ml={2}
                fontSize="10px"
                variant="solid"
                colorScheme="red"
                mb={1}
              >
                {notificationWithParams?.borrowedApproved?.borrowedApprovecount}
              </Badge>
            )}
          </Button>
          <Button
            w="10%"
            bgColor={navigation === 3 ? "primary" : ""}
            color={navigation === 3 ? "white" : ""}
            _hover={{ bgColor: "btnColor", color: "white" }}
            border="1px"
            borderColor="gray.300"
            size="sm"
            fontSize="xs"
            onClick={() => setNavigation(3)}
            borderRadius="none"
          >
            Rejected
            {notificationWithParams?.rejectNotification?.rejectNotifcount ===
            0 ? (
              ""
            ) : (
              <Badge
                ml={2}
                fontSize="10px"
                variant="solid"
                colorScheme="red"
                mb={1}
              >
                {notificationWithParams?.rejectNotification?.rejectNotifcount}
              </Badge>
            )}
          </Button>
        </HStack>
      </Flex>

      <VStack height="90vh" w="full" className="boxShadow" bg="form">
        {navigation === 1 ? (
          <>
            <PendingBorrowedMaterials navigation={navigation} />
          </>
        ) : navigation === 2 ? (
          <>
            <ApprovedBorrowedMaterials
              navigation={navigation}
              setNavigation={setNavigation}
              fetchNotificationWithParams={fetchNotificationWithParams}
            />
          </>
        ) : navigation === 3 ? (
          <>
            <RejectBorrowed navigation={navigation} />
          </>
        ) : (
          ""
        )}
      </VStack>
    </Flex>
  );
};

export default ViewRequest;
