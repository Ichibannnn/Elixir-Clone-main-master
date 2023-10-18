import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
// import PageScrollReusable from '../../../components/PageScroll-Reusable'
import PageScroll from "../../utils/PageScroll";
import { CancelConfirmation } from "./ActionModal";
// import { CancelConfirmation } from './Action-Modals'

export const PreparedItem = ({
  preparedData,
  fetchPreparedItems,
  fetchOrderList,
  fetchNotification,
}) => {
  const [cancelId, setCancelId] = useState([]);

  const {
    isOpen: isCancel,
    onClose: closeCancel,
    onOpen: openCancel,
  } = useDisclosure();

  const TableHead = [
    "Line",
    "Barcode",
    "Item Code",
    "Item Description",
    "Quantity",
    "Unit Cost",
    "Total Cost",
    "Cancel",
  ];

  //   console.log("Prepared Items");

  const cancelHandler = (id) => {
    if (id) {
      setCancelId(id);
      openCancel();
    } else {
      setCancelId("");
    }
  };

  return (
    <VStack w="full" spacing={0} justifyContent="center" mt={10}>
      <Box w="full" bgColor="primary" h="25px">
        <Text
          fontWeight="semibold"
          fontSize="13px"
          color="white"
          textAlign="center"
          justifyContent="center"
        >
          Prepared Items
        </Text>
      </Box>
      <PageScroll minHeight="120px" maxHeight="150px">
        <Table size="xs" variant="simple">
          <Thead bgColor="secondary">
            <Tr>
              {TableHead?.map((head, i) => (
                <Th key={i} color="white" fontSize="10px">
                  {head}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {preparedData?.map((items, i) => (
              <Tr key={i}>
                <Td fontSize="xs">{i + 1}</Td>
                <Td fontSize="xs">{items.barCodes}</Td>
                <Td fontSize="xs">{items.itemCode}</Td>
                <Td fontSize="xs">{items.itemDescription}</Td>
                <Td fontSize="xs">{items.quantity}</Td>
                <Td fontSize="xs">
                  {items.unitCost.toLocaleString(undefined, {
                    maximuFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </Td>
                <Td fontSize="xs">
                  {items.totalCost.toLocaleString(undefined, {
                    maximuFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </Td>

                {/* <Td>{moment(items.expiration).format("yyyy-MM-DD")}</Td> */}
                <Td>
                  <Button
                    onClick={() => cancelHandler(items.id)}
                    size="xs"
                    colorScheme="red"
                    fontSize="11px"
                  >
                    Cancel
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageScroll>
      {isCancel && (
        <CancelConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          id={cancelId}
          setCancelId={setCancelId}
          fetchPreparedItems={fetchPreparedItems}
          fetchOrderList={fetchOrderList}
          fetchNotification={fetchNotification}
        />
      )}
    </VStack>
  );
};
