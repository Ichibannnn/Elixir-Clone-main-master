import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import { ApproveModal, RejectModal } from "./ActionModal";
import PageScroll from "../../../utils/PageScroll";

export const ListOfOrders = ({
  customerOrders,
  orderNo,
  setOrderNo,
  fetchOrderList,
  fetchOrdersByOrderNo,
  orderIds,
  genusData,
  checkedItems,
  fetchNotification,
}) => {
  // const [stockIdentifier, setStockIdentifier] = useState("false");

  const {
    isOpen: isApprove,
    onClose: closeApprove,
    onOpen: openApprove,
  } = useDisclosure();
  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();

  const approveModal = () => {
    openApprove();
  };

  const rejectModal = () => {
    openReject();
  };

  return (
    <Flex w="full" flexDirection="column">
      <Flex flexDirection="column" className="boxShadow" p={4}>
        <Flex flexDirection="column">
          <Text
            textAlign="center"
            bgColor="secondary"
            color="white"
            fontSize="13px"
          >
            LIST OF ORDERS
          </Text>
          <PageScroll minHeight="345px" maxHeight="400px">
            <Table
              size="sm"
              variant="simple"
              position="sticky"
              top={0}
              zIndex={1}
            >
              <Thead bgColor="secondary">
                <Tr h="30px">
                  <Th color="white" fontSize="11px">
                    Line
                  </Th>
                  <Th color="white" fontSize="11px">
                    Order ID
                  </Th>
                  <Th color="white" fontSize="11px">
                    Order Date
                  </Th>
                  <Th color="white" fontSize="11px">
                    Date Needed
                  </Th>
                  <Th color="white" fontSize="11px">
                    Item Code
                  </Th>
                  <Th color="white" fontSize="11px">
                    Item Description
                  </Th>
                  <Th color="white" fontSize="11px">
                    UOM
                  </Th>
                  <Th color="white" fontSize="11px">
                    Item Remarks
                  </Th>
                  <Th color="white" fontSize="11px">
                    Quantity Order
                  </Th>
                </Tr>
              </Thead>
              {orderNo ? (
                <Tbody>
                  {customerOrders?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{i + 1}</Td>
                      <Td fontSize="xs">{item.orderId}</Td>
                      <Td fontSize="xs">{item.orderDate}</Td>
                      <Td fontSize="xs">{item.dateNeeded}</Td>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">{item.itemRemarks}</Td>
                      <Td fontSize="xs">{item.quantityOrder}</Td>
                    </Tr>
                  ))}
                </Tbody>
              ) : null}
            </Table>
          </PageScroll>
        </Flex>
      </Flex>
      <Flex justifyContent="end" mt={4}>
        <ButtonGroup size="sm">
          <Button
            colorScheme="blue"
            px={2}
            disabled={!orderNo || checkedItems?.length === 0}
            onClick={approveModal}
          >
            Approve
          </Button>
          <Button
            px={4}
            disabled={!orderNo || checkedItems?.length === 0}
            onClick={rejectModal}
            color="white"
            colorScheme="red"
          >
            Reject
          </Button>
        </ButtonGroup>
      </Flex>

      {isApprove && (
        <ApproveModal
          isOpen={isApprove}
          onClose={closeApprove}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          fetchOrderList={fetchOrderList}
          fetchOrdersByOrderNo={fetchOrdersByOrderNo}
          orderIds={orderIds}
          genusData={genusData}
          fetchNotification={fetchNotification}
        />
      )}

      {isReject && (
        <RejectModal
          isOpen={isReject}
          onClose={closeReject}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          fetchOrderList={fetchOrderList}
          fetchOrdersByOrderNo={fetchOrdersByOrderNo}
          orderIds={orderIds}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
