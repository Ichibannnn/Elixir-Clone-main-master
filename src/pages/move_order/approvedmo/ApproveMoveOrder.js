import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import PageScroll from "../../../utils/PageScroll";
// import { PrintModal, RejectModal, TrackModal } from './Action-Modals'
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import moment from "moment";
import { ImLocation } from "react-icons/im";
import { PrintModal, RejectModal, TrackModal } from "./ActionModal";
import { FaShippingFast } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { AiOutlineMore, AiOutlinePrinter } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { FcOk } from "react-icons/fc";

export const ApproveMoveOrder = ({
  setCurrentPage,
  setPageSize,
  setSearch,
  pagesCount,
  currentPage,
  approvedData,
  fetchApprovedMO,
  setOrderId,
  orderId,
  printData,
  status,
  setStatus,
}) => {
  const TableHead = [
    "Line",
    "MIR ID",
    "Customer Code",
    "Customer Name",
    // "Status",
    // "Category",
    "Total Quantity Order",
    "Prepared Date",
    "Status",
    // "Rush",
    "Action",
    // "Print",
    // "Reject",
  ];

  const [trackData, setTrackData] = useState([
    {
      barcodeNo: "",
      itemCode: "",
      itemDescription: "",
      quantity: "",
      isPrepared: "",
      isApproved: "",
      isPrint: "",
      isTransact: "",
    },
  ]);

  const [totalQuantity, setTotalQuantity] = useState("");

  const {
    isOpen: isTrack,
    onClose: closeTrack,
    onOpen: openTrack,
  } = useDisclosure();
  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();
  const {
    isOpen: isPrint,
    onClose: closePrint,
    onOpen: openPrint,
  } = useDisclosure();

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };
  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const rejectHandler = (orderNo) => {
    if (orderNo) {
      setOrderId(orderNo);
      openReject();
    } else {
      setOrderId("");
    }
  };

  const trackHandler = (data) => {
    if (data) {
      setOrderId(data.mirId);
      setTrackData([
        {
          barcodeNo: data.barcodeNo,
          itemCode: data.itemCode,
          itemDescription: data.itemDescription,
          quantity: data.quantity,
          isPrepared: data.isPrepared,
          isApproved: data.isApprove,
          isPrint: data.isPrint,
          isTransact: data.isTransact,
        },
      ]);
      openTrack();
    } else {
      setOrderId("");
      setTrackData([
        {
          barcodeNo: "",
          itemCode: "",
          itemDescription: "",
          quantity: "",
          isPrepared: "",
          isApproved: "",
          isPrint: "",
          isTransact: "",
        },
      ]);
    }
  };

  const printHandler = (id, quantity) => {
    if (id) {
      setOrderId(id);
      setTotalQuantity(quantity);
      openPrint();
    } else {
      setOrderId("");
      setTotalQuantity("");
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <Flex w="full" flexDirection="column" p={5} bg="form">
      <Flex justifyContent="space-between">
        <Select
          onChange={handlePageSizeChange}
          w="7%"
          variant="filled"
          fontSize="11px"
          borderColor="gray.400"
        >
          <option value={Number(10)}>10</option>
          <option value={Number(20)}>20</option>
          <option value={Number(30)}>30</option>
          <option value={Number(50)}>50</option>
        </Select>
        <HStack w="17%">
          <Text fontSize="13px">Search:</Text>
          <Input
            borderColor="gray.400"
            fontSize="11px"
            borderRadius="none"
            placeholder="MIR Id"
            onChange={(e) => searchHandler(e.target.value)}
          />
        </HStack>
      </Flex>

      <Flex mt={5} flexDirection="column">
        <Flex direction="row" justifyContent="left">
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={!status ? "blue" : "gray"}
            variant={!status ? "solid" : "outline"}
            onClick={() => handleStatusChange(false)}
          >
            Regular Orders
            {/* {regularOrdersCount > 0 && (
            // <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
            //   {regularOrdersCount}
            // </Badge>
          )} */}
          </Button>
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={status ? "blue" : "gray"}
            variant={status ? "solid" : "outline"}
            onClick={() => handleStatusChange(true)}
          >
            Rush Orders
            {/* {rushOrdersCount > 0 && (
            <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
              {rushOrdersCount}
            </Badge>
          )} */}
          </Button>
        </Flex>
        <PageScroll minHeight="200px" maxHeight="700px">
          <Text
            textAlign="center"
            bgColor="primary"
            color="white"
            fontSize="14px"
            // fontWeight="semibold"
          >
            List of Approved MO
          </Text>
          <Table size="sm" variant="striped">
            <Thead bgColor="primary">
              <Tr>
                {TableHead?.map((head, i) => (
                  <Th h="30px" p={3} key={i} color="white" fontSize="10px">
                    {head}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {approvedData?.moveorder?.map((order, i) => (
                <Tr key={i}>
                  <Td fontSize="13px">{i + 1}</Td>
                  <Td fontSize="13px">{order.mirId}</Td>
                  <Td fontSize="13px">{order.customerCode}</Td>
                  <Td fontSize="13px">{order.customerName}</Td>
                  {/* <Td fontSize="13px">{order.category}</Td> */}
                  <Td fontSize="13px">{order.quantity}</Td>
                  <Td fontSize="13px">
                    {moment(order.preparedDate).format("MM/DD/yyyy")}
                  </Td>
                  {order.isTransact ? (
                    <Td fontSize="13px">
                      <Flex>
                        <FcOk fontSize="20px" />
                      </Flex>
                    </Td>
                  ) : (
                    <Td fontSize="13px"></Td>
                  )}
                  <Td>
                    <Flex pl={2}>
                      <Box>
                        <Menu>
                          <MenuButton
                            alignItems="center"
                            justifyContent="center"
                            bg="none"
                          >
                            <AiOutlineMore fontSize="20px" />
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<GrLocation fontSize="17px" />}
                              onClick={() => trackHandler(order)}
                            >
                              <Text fontSize="15px">Track</Text>
                            </MenuItem>
                            <MenuItem
                              icon={<AiOutlinePrinter fontSize="17px" />}
                              onClick={() =>
                                printHandler(order.mirId, order.quantity)
                              }
                            >
                              <Text fontSize="15px">Print</Text>
                            </MenuItem>
                            <MenuItem
                              icon={<GiCancel fontSize="17px" />}
                              onClick={() => rejectHandler(order.mirId)}
                              isDisabled={order.isTransact}
                              title={
                                order.isTransact
                                  ? "Order was already transacted"
                                  : "Order not yet transacted"
                              }
                            >
                              <Text fontSize="15px" _hover={{ color: "red" }}>
                                Reject
                              </Text>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                    </Flex>
                    {/* <Button
                      size="xs"
                      p={0}
                      bg="none"
                      onClick={() => trackHandler(order)}
                    >
                      <ImLocation color="#314E89" fontSize="19px" />
                    </Button> */}
                  </Td>
                  {/* <Td>
                    <Button
                      fontSize="13px"
                      borderRadius="none"
                      size="xs"
                      colorScheme="blue"
                      color="white"
                      onClick={() => printHandler(order.mirId, order.quantity)}
                    >
                      Print
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      onClick={() => rejectHandler(order.mirId)}
                      disabled={order.isTransact}
                      title={
                        order.isTransact
                          ? "Order was already transacted"
                          : "Order not yet transacted"
                      }
                      borderRadius="none"
                      size="xs"
                      fontSize="13px"
                      colorScheme="red"
                    >
                      Reject
                    </Button>
                  </Td> */}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={7}>
        <Text fontSize="xs">
          {approvedData?.moveorder?.length > 0
            ? `Showing ${approvedData?.moveorder?.length} entries`
            : "No entries available"}
        </Text>

        <Flex>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                border="1px"
                fontSize="xs"
                px={2}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="secondary" color="white" px={2} pt={1.5}>
                {currentPage}
              </Text>
              <PaginationNext
                border="1px"
                fontSize="xs"
                px={4}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex>
      </Flex>

      {isTrack && (
        <TrackModal
          isOpen={isTrack}
          onClose={closeTrack}
          trackData={trackData}
          trackList={printData}
        />
      )}

      {isPrint && (
        <PrintModal
          isOpen={isPrint}
          onClose={closePrint}
          printData={printData}
          fetchApprovedMO={fetchApprovedMO}
          orderId={orderId}
          totalQuantity={totalQuantity}
        />
      )}

      {isReject && (
        <RejectModal
          isOpen={isReject}
          onClose={closeReject}
          id={orderId}
          fetchApprovedMO={fetchApprovedMO}
          // fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
