import React, { useEffect, useState } from "react";
import {
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
import { ViewModal } from "./ActionButtonTransacted";

const fetchTransactBorrowedApi = async (
  pageNumber,
  pageSize,
  search,
  status
) => {
  const res = await request.get(
    `Borrowed/GetAllReturnedItemOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}`
  );
  return res.data;
};

export const TransactedListBorrowed = () => {
  const [transactedBorrowData, setTransactedBorrowData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [statusBody, setStatusBody] = useState({
    id: "",
  });

  // console.log(issueBorrowData )

  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();

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

  const fetchTransactedBorrowed = () => {
    fetchTransactBorrowedApi(currentPage, pageSize, search, status).then(
      (res) => {
        setTransactedBorrowData(res);
        setPageTotal(res.totalCount);
      }
    );
  };

  useEffect(() => {
    fetchTransactedBorrowed();
  }, [status, pageSize, currentPage, search]);

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

  const viewHandler = (id) => {
    if (id) {
      setStatusBody({
        id: id,
      });
      openView();
    } else {
      setStatusBody({
        id: "",
      });
    }
    // console.log(id);
  };

  return (
    <Flex justifyContent="center" flexDirection="column" w="full">
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
        <PageScroll minHeight="400px" maxHeight="401px">
          <Table size="sm">
            <Thead bgColor="primary">
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
                {/* <Th h="40px" color="white" fontSize="10px">
                  Total Quantity
                </Th> */}
                <Th h="40px" color="white" fontSize="10px">
                  Returned Date
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Transacted By
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  View
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactedBorrowData?.issue?.map((borrow, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{borrow.id}</Td>
                  <Td fontSize="xs">{borrow.customerCode}</Td>
                  <Td fontSize="xs">{borrow.customerName}</Td>
                  {/* <Td fontSize="xs">{borrow.totalQuantity}</Td> */}
                  <Td fontSize="xs">
                    {moment(borrow.borrowedDate).format("yyyy-MM-DD")}
                  </Td>
                  <Td fontSize="xs">{borrow.preparedBy}</Td>
                  <Td fontSize="xs">
                    <Button
                      onClick={() => viewHandler(borrow.id)}
                      colorScheme="blue"
                      size="xs"
                    >
                      View
                    </Button>
                  </Td>
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

      {isView && (
        <ViewModal
          isOpen={isView}
          onClose={closeView}
          statusBody={statusBody}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </Flex>
  );
};
