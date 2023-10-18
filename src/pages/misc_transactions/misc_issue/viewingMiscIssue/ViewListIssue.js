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
import PageScroll from "../../../../utils/PageScroll";
import request from "../../../../services/ApiClient";
import { ToastComponent } from "../../../../components/Toast";
import { ViewModal } from "./ActionButton";
// import { ViewModal } from "../../../borrowed_transaction/viewingBorrowed/ActionButtonBorrowed";

// import { StatusConfirmation, ViewModal } from './Action-Modals'

const fetchIssuesApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(
    `Miscellaneous/GetAllMiscellaneousIssuePaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}`
  );
  return res.data;
};

export const ViewListIssue = () => {
  const [issueData, setIssueData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");

  const [statusBody, setStatusBody] = useState({
    id: "",
    status: "",
  });

  const {
    isOpen: isStatus,
    onClose: closeStatus,
    onOpen: openStatus,
  } = useDisclosure();
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

  const fetchIssues = () => {
    fetchIssuesApi(currentPage, pageSize, search, status).then((res) => {
      setIssueData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchIssues();
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

  const viewHandler = (id, status) => {
    if (id) {
      setStatusBody({
        id: id,
        status: status,
      });
      openView();
    } else {
      setStatusBody({
        id: "",
        status: "",
      });
    }
    // console.log(id);
    // console.log(status);
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
      </Flex>uom

      <Flex mt={5}>
        <PageScroll minHeight="400px" maxHeight="401px">
        <Text
            textAlign="center"
            bgColor="primary"
            color="white"
            fontSize="14px"
            // fontWeight="semibold"
          >
            List of Materials
          </Text>
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
                  Total Quantity
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Prepared Date
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Transaction Date
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
              {issueData?.issue?.map((issue, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{issue.issuePKey}</Td>
                  <Td fontSize="xs">{issue.customerCode}</Td>
                  <Td fontSize="xs">{issue.customer}</Td>
                  <Td fontSize="xs">{issue.totalQuantity}</Td>
                  <Td fontSize="xs">{issue.preparedDate}</Td>
                  <Td fontSize="xs">{issue.transactionDate}</Td>
                  <Td fontSize="xs">{issue.preparedBy}</Td>
                  <Td fontSize="xs">
                    <Button
                      onClick={() =>
                        viewHandler(issue.issuePKey, issue.isActive)
                      }
                      colorScheme="blue"
                      size="xs"
                      // borderRadius="none"
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
        />
      )}
    </Flex>
  );
};
