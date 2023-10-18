import React, { useState } from "react";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Input,
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
// import { ReturnModal } from './Return-Modal'
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
import ReturnModal from "./ReturnModal";
import { FaShippingFast } from "react-icons/fa";

export const RejectMo = ({
  setCurrentPage,
  setPageSize,
  setSearch,
  pagesCount,
  currentPage,
  pageSize,
  rejectedData,
  fetchRejectedMO,
  status,
  setStatus,
}) => {
  const [orderNo, setOrderNo] = useState("");

  const {
    isOpen: isReturn,
    onOpen: openReturn,
    onClose: closeReturn,
  } = useDisclosure();

  const TableHead = [
    "Line",
    "MIR ID",
    "Customer Code",
    "Customer Name",
    // "Category",
    "Total Quantity Order",
    "Prepared Date",
    // "Date Needed",
    // "Reject Date",
    // "Rush",
    "Action",
  ];

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

  const returnHandler = (id) => {
    if (id) {
      setOrderNo(id);
      openReturn();
    } else {
      setOrderNo(id);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <Flex w="full" flexDirection="column" p={5} bg="form">
      <Flex justifyContent="space-between">
        <Select
          fontSize="11px"
          borderColor="gray.400"
          onChange={handlePageSizeChange}
          w="7%"
          variant="filled"
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
            placeholder="Order Id"
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
        <PageScroll minHeight="200px" maxHeight="500px">
        <Text
            textAlign="center"
            bgColor="primary"
            color="white"
            fontSize="14px"
            // fontWeight="semibold"
          >
            List of Rejected Move Orders
          </Text>
          <Table size="sm">
            <Thead bgColor="primary">
              <Tr>
                {TableHead?.map((head, i) => (
                  <Th h="40px" key={i} color="white" fontSize="10px">
                    {head}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {rejectedData?.moveorder?.map((data, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{i + 1}</Td>
                  <Td fontSize="xs">{data.mirId}</Td>
                  <Td fontSize="xs">{data.customerCode}</Td>
                  <Td fontSize="xs">{data.customerName}</Td>
                  {/* <Td fontSize="xs">{data.category}</Td> */}
                  <Td fontSize="xs">{data.quantity}</Td>
                  <Td fontSize="xs">
                    {moment(data.preparedDate).format("MM/DD/yyyy")}
                  </Td>
                  {/* <Td>{data.dateNeeded}</Td> */}
                  {/* <Td>{moment(data.rejectedDate).format("MM/DD/yyyy")}</Td> */}
                  {/* <Td fontSize="xs">
                    {data.rush ? (
                      <Badge
                        fontSize="9.5px"
                        colorScheme="orange"
                        variant="solid"
                        className="inputCapital"
                      >
                        Rush
                      </Badge>
                    ) : (
                      ""
                    )}
                  </Td> */}
                  {/* <Td fontSize="xs">
                    {data.rush ? (
                      <FaShippingFast
                        title="Rush Orders"
                        fontSize="17px"
                        color="#E53E3E"
                      />
                    ) : (
                      <FaShippingFast fontSize="17px" color="#A0AEC0" />
                    )}
                  </Td> */}
                  <Td>
                    <Button
                      // borderRadius="none"
                      size="xs"
                      fontSize="11px"
                      colorScheme="red"
                      onClick={() => returnHandler(data.mirId)}
                    >
                      Return
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={7}>
        <Text fontSize="xs">
          {rejectedData?.moveorder?.length > 0
            ? `Showing ${rejectedData?.moveorder?.length} entries`
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

      {isReturn && (
        <ReturnModal
          isOpen={isReturn}
          onClose={closeReturn}
          orderNo={orderNo}
          fetchRejectedMO={fetchRejectedMO}
          // fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
