import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  HStack,
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
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
// import { ViewModal } from './Action-Modals-Transact'
import { decodeUser } from "../../../services/decode-user";
import { ViewModal } from "./ActionModalTransact";
import { FaShippingFast, FaSort } from "react-icons/fa";

const currentUser = decodeUser();

export const ListMoveOrder = ({
  moveOrderList,
  setMoveOrderInformation,
  moveOrderInformation,
  moveOrderViewTable,
  checkedItems,
  setCheckedItems,
  status,
}) => {
  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();

  const viewHandler = ({
    mirId,
    deliveryStatus,
    customerName,
    customerCode,
  }) => {
    // Add delivery status for condition
    if (mirId && customerName && customerCode) {
      setMoveOrderInformation({
        orderNo: mirId,
        deliveryStatus: "Pick-Up",
        customerName: customerName,
        customerCode: customerCode,
      });
      openView();
    } else {
      setMoveOrderInformation({
        orderNo: "",
        deliveryStatus: "",
        customerName: "",
        customerCode: "",
      });
    }
  };

  // const moveOrderData = moveOrderList?.filter(item => item.stockOnHand >= item.quantityOrder)
  const submitData = moveOrderList?.map((item) => {
    return {
      orderNo: item.mirId,
      // farmType: item.farmType,
      customerName: item.customerName,
      customerCode: item.customerCode,
      orderNoPKey: item.orderNoPKey,
      isApprove: item.isApproved,
      preparedBy: currentUser?.fullName,
    };
  });
  // console.log(moveOrderData)

  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(submitData);
    } else {
      setCheckedItems([]);
    }
    console.log(checkedItems);
  };

  // console.log(moveOrderList)
  const childCheckHandler = (e) => {
    const data = JSON.parse(e.target.value);
    let valueSubmit = {
      orderNo: data.mirId,
      // farmType: data.farmType,
      customerName: data.customerName,
      customerCode: data.customerCode,
      // orderNoPKey: data.orderNoPKey,
      isApprove: data.isApproved,
      preparedBy: currentUser?.fullName,
    };
    if (e.target.checked) {
      setCheckedItems([...checkedItems, valueSubmit]);
    } else {
      const filterData = checkedItems?.filter(
        (item) => item.orderNo !== valueSubmit.orderNo
      );
      setCheckedItems(filterData);
      console.log(checkedItems);
    }
  };

  //Sort by date start line
  const [preparedSort, setPreparedSort] = useState("asc");
  function descendingComparator(a, b) {
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") <
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return -1;
    }
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") >
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return 1;
    }
    return 0;
  }

  //Sort by date end line
  function getComparator(order) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b)
      : (a, b) => -descendingComparator(a, b);
  }

  return (
    <>
      <Flex w="full" flexDirection="column">
        <VStack spacing={0}>
          <Text
            pb={2}
            textAlign="center"
            fontSize="md"
            color="white"
            bgColor="primary"
            w="full"
            mb={-1.5}
          >
            List of Move Order
          </Text>
          <PageScroll minHeight="690px" maxHeight="770px">
            <Table size="sm" variant="simple">
              <Thead bgColor="secondary">
                <Tr h="40px">
                  <Th color="white" fontSize="10px">
                    <Checkbox
                      size="sm"
                      fontSize="10px"
                      onChange={parentCheckHandler}
                      isChecked={submitData?.length === checkedItems?.length}
                      isDisabled={status}
                      title={status ? "Order already transacted" : ""}
                      color="white"
                    >
                      Line
                    </Checkbox>
                  </Th>
                  <Th color="white" fontSize="11px">
                    MIR Id
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Code
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Name
                  </Th>
                  <Th color="white" fontSize="11px">
                    Total Quantity Order
                  </Th>
                  <Th color="white" fontSize="11px">
                    <HStack>
                      <Text>Prepared Date</Text>
                      <Button
                        cursor="pointer"
                        onClick={() => {
                          setPreparedSort(
                            preparedSort === "asc" ? "desc" : "asc"
                          );
                        }}
                        size="xs"
                        p={0}
                        m={0}
                        background="none"
                        _hover={{ background: "none" }}
                      >
                        <FaSort />
                      </Button>
                    </HStack>
                  </Th>
                  <Th color="white" fontSize="11px">
                    View
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {moveOrderList
                  ?.sort(getComparator(preparedSort))
                  .map((list, i) => (
                    <Tr key={i} cursor="pointer">
                      <Td>
                        <Checkbox
                          size="sm"
                          // onChange={() => childCheckHandler(list)}
                          onChange={childCheckHandler}
                          isChecked={checkedItems.some(
                            (item) => item.orderNo === list.mirId
                          )}
                          value={JSON.stringify(list)}
                          color="black"
                          isDisabled={status}
                          title={status ? "Order already transacted" : ""}
                        >
                          {i + 1}
                        </Checkbox>
                      </Td>
                      <Td fontSize="xs">{list.mirId}</Td>
                      <Td fontSize="xs">{list.customerCode}</Td>
                      <Td fontSize="xs">{list.customerName}</Td>
                      <Td fontSize="xs">{list.totalOrders}</Td>
                      <Td fontSize="xs">
                        {moment(list.preparedDate).format("MM/DD/yyyy")}
                      </Td>
                      <Td fontSize="xs">
                        <Button
                          size="xs"
                          colorScheme="blue"
                          // borderRadius="none"
                          onClick={() => viewHandler(list)}
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </PageScroll>
        </VStack>
      </Flex>
      {isView && (
        <ViewModal
          isOpen={isView}
          onClose={closeView}
          moveOrderInformation={moveOrderInformation}
          moveOrderViewTable={moveOrderViewTable}
        />
      )}
    </>
  );
};
