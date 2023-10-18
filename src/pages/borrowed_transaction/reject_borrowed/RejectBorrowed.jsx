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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import PageScroll from "../../../utils/PageScroll";
import request from "../../../services/ApiClient";
import moment from "moment/moment";
import { decodeUser } from "../../../services/decode-user";

const fetchRejectBorrowedApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(
    `Borrowed/GetAllRejectBorrowedWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`
  );
  return res.data;
};

const RejectBorrowed = () => {
  const [rejectData, setRejectData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [statusBody, setStatusBody] = useState({
    id: "",
  });

  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  const fetchReject = () => {
    fetchRejectBorrowedApi(currentPage, pageSize, search).then((res) => {
      setRejectData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchReject();
  }, [pageSize, currentPage, search]);

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

  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      mb="150px"
      w="full"
      p={5}
    >
      <Flex justifyContent="space-between">
        <InputGroup w="15%">
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            onChange={(e) => searchHandler(e.target.value)}
            type="text"
            fontSize="xs"
            placeholder="Search: ID"
            focusBorderColor="accent"
          />
        </InputGroup>
      </Flex>

      <Flex mt={5}>
        <PageScroll minHeight="450px" maxHeight="451px">
          <Table size="sm" variant="striped">
            <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th h="40px" color="white" fontSize="10px">
                  ID
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Customer Name
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Total Borrowed Qty
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Remarks
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Requested Date
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Rejected By
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Rejected Date
                </Th>
              </Tr>
            </Thead>
            <Tbody zIndex={-1}>
              {rejectData?.issue?.map((borrow, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{borrow.borrowedPKey}</Td>
                  <Td fontSize="xs">{borrow.customerCode}</Td>
                  <Td fontSize="xs">{borrow.customerName}</Td>
                  <Td fontSize="xs">
                    {" "}
                    {borrow.totalQuantity.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="xs">{borrow.remarks}</Td>
                  <Td fontSize="xs">{borrow.transactionDate}</Td>
                  <Td fontSize="xs">{borrow.rejectBy}</Td>
                  <Td fontSize="xs">
                    {moment(borrow.rejectDate).format("MM/DD/yyyy")}
                  </Td>

                  {/* <Td fontSize="xs">
                        <Button
                          onClick={() => viewHandler(borrow.id)}
                          colorScheme="blue"
                          size="xs"
                          borderRadius="none"
                        >
                          View
                        </Button>
                      </Td> */}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex mt={5} justifyContent="end">
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="secondary"
                color="white"
                p={1}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "accent", color: "white" }}
                    p={3}
                    bg="secondary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="secondary"
                  color="white"
                  p={1}
                  _hover={{ bg: "accent", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="filled">
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {/* {isView && (
            <ViewModalHistory
              isOpen={isView}
              onClose={closeView}
              statusBody={statusBody}
              fetchHistory={fetchHistory}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )} */}
    </Flex>
  );
};

export default RejectBorrowed;
