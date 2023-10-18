import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import moment from "moment/moment";
import { decodeUser } from "../../../../services/decode-user";
import { ViewModal } from "../../viewingBorrowed/ActionButtonBorrowed";
import { EditModal, PendingCancelModal } from "./PendingActionModal";
import { BsCheck2Square } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { AiOutlineMore } from "react-icons/ai";

const currentUser = decodeUser();
const userId = currentUser?.id;

const fetchBorrowedApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(
    `Borrowed/GetAllBorrowedIssueWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}&empid=${userId}`
  );
  return res.data;
};

export const PendingBorrowedMaterials = () => {
  const [issueBorrowData, setBorrowIssueData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [statusBody, setStatusBody] = useState({
    id: "",
    status: "",
  });

  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();

  // const {
  //   isOpen: isEdit,
  //   onClose: closeEdit,
  //   onOpen: openEdit,
  // } = useDisclosure();

  const {
    isOpen: isCancel,
    onClose: closeCancel,
    onOpen: openCancel,
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

  const fetchBorrowed = () => {
    fetchBorrowedApi(currentPage, pageSize, search, status).then((res) => {
      setBorrowIssueData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchBorrowed();
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
  };

  const cancelHandler = (id, status) => {
    if (id) {
      setStatusBody({
        id: id,
        status: status,
      });
      console.log(statusBody?.id);
      openCancel();
    } else {
      setStatusBody({
        id: "",
        status: "",
      });
    }
  };

  // console.log(issueBorrowData);
  // console.log(statusBody);

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

      <Flex flexDirection="column">
        <Box w="full" bgColor="primary" h="22px">
          <Text
            fontWeight="normal"
            fontSize="13px"
            color="white"
            textAlign="center"
            justifyContent="center"
          >
            Pending Borrowed Materials
          </Text>
        </Box>
        <PageScroll minHeight="400px" maxHeight="401px">
          <Table size="sm" variant="striped">
            <Thead bgColor="primary">
              <Tr>
                <Th h="20px" color="white" fontSize="10px">
                  ID
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  Customer Name
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  Total Borrowed
                </Th>
                <Th h="20px" color="white" fontSize="10px">
                  Borrowed Date
                </Th>
                {/* <Th h="40px" color="white" fontSize="10px">
                  Transacted By
                </Th> */}
                <Th h="20px" color="white" fontSize="10px">
                  Status
                </Th>
                <Th h="20px" color="white" fontSize="10px" textAlign="center">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {issueBorrowData?.issue?.map((borrow, i) => (
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
                  <Td fontSize="xs">
                    {moment(borrow.borrowedDate).format("MM/DD/yyyy")}
                  </Td>
                  {/* <Td fontSize="xs">{borrow.preparedBy}</Td> */}
                  <Td fontSize="xs">
                    {borrow.isApproved === false ? "For Approval" : ""}
                  </Td>
                  <Td fontSize="xs" mr={3}>
                    <Flex justifyContent="center">
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
                              icon={<GrView fontSize="17px" />}
                              onClick={() =>
                                viewHandler(
                                  borrow.borrowedPKey,
                                  borrow.isActive
                                )
                              }
                            >
                              <Text fontSize="15px">View</Text>
                            </MenuItem>
                            <MenuItem
                              icon={<GiCancel fontSize="17px" />}
                              onClick={() =>
                                cancelHandler(
                                  borrow.borrowedPKey,
                                  borrow.isActive
                                )
                              }
                            >
                              <Text fontSize="15px" _hover={{ color: "red" }}>
                                Cancel
                              </Text>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                    </Flex>
                    {/* <HStack spacing={3} justifyContent="center">
                      <Button
                        onClick={() =>
                          viewHandler(borrow.borrowedPKey, borrow.isActive)
                        }
                        colorScheme="blue"
                        size="xs"
                        borderRadius="none"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() =>
                          cancelHandler(borrow.borrowedPKey, borrow.isActive)
                        }
                        colorScheme="red"
                        size="xs"
                        borderRadius="none"
                      >
                        Cancel
                      </Button>
                    </HStack> */}
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
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      {/* {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          statusBody={statusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )} */}

      {isCancel && (
        <PendingCancelModal
          isOpen={isCancel}
          onClose={closeCancel}
          statusBody={statusBody}
          setStatusBody={setStatusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </Flex>
  );
};
