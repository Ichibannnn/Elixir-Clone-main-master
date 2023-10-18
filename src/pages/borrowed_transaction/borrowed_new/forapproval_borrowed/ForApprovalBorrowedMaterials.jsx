import React, { useEffect, useState } from "react";
import {
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
import {
  ApproveModal,
  RejectModalApproval,
  ViewModalApproval,
} from "./ActionModal";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../../components/Toast";
import { AiOutlineMore } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { BsCheck2Square } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";

const currentUser = decodeUser();

const fetchBorrowedApprovalApi = async (
  pageNumber,
  pageSize,
  search,
  status
) => {
  const res = await request.get(
    `Borrowed/GetAllForApprovalBorrowedWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}`
  );
  return res.data;
};

const ForApprovalBorrowedMaterials = ({ fetchNotification }) => {
  const [borrowedApprovalData, setBorrowedApprovalData] = useState([]);

  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [statusBody, setStatusBody] = useState({
    id: "",
  });

  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();

  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();

  const {
    isOpen: isApprove,
    onClose: closeApprove,
    onOpen: openApprove,
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
    fetchBorrowedApprovalApi(currentPage, pageSize, search, status).then(
      (res) => {
        setBorrowedApprovalData(res);
        setPageTotal(res.totalCount);
      }
    );
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

  const viewHandler = (id) => {
    // console.log(id);
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
  };

  const rejectHandler = (id) => {
    // console.log(id);
    if (id) {
      setStatusBody({
        id: id,
      });
      openReject();
    } else {
      setStatusBody({
        id: "",
      });
    }
  };

  const approveHandler = (id) => {
    if (id) {
      setStatusBody({
        id: id,
      });
      openApprove();
    } else {
      setStatusBody({
        id: "",
      });
    }
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
        <PageScroll minHeight="400px" maxHeight="401px">
          <Table variant="striped" size="sm">
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
                <Th h="40px" color="white" fontSize="10px">
                  Total Borrowed
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Requested Date
                </Th>
                <Th h="40px" color="white" fontSize="10px">
                  Requested By
                </Th>
                {/* <Th h="40px" color="white" fontSize="10px">
                  Status
                </Th> */}
                <Th h="40px" color="white" fontSize="10px" textAlign="center">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {borrowedApprovalData?.issue?.map((borrow, i) => (
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
                  <Td fontSize="xs">{borrow.preparedBy}</Td>
                  {/* <Td fontSize="xs">
                    {borrow.isApproved === false ? "For Approval" : ""}
                  </Td> */}
                  <Td fontSize="xs" ml={3}>
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
                              onClick={() => viewHandler(borrow.borrowedPKey)}
                            >
                              <Text fontSize="15px">View</Text>
                            </MenuItem>
                            <MenuItem
                              icon={<BsCheck2Square fontSize="17px" />}
                              onClick={() =>
                                approveHandler(borrow.borrowedPKey)
                              }
                            >
                              <Text fontSize="15px">Approve</Text>
                            </MenuItem>
                            <MenuItem
                              icon={<GiCancel fontSize="17px" />}
                              onClick={() => rejectHandler(borrow.borrowedPKey)}
                            >
                              <Text fontSize="15px" _hover={{ color: "red" }}>
                                Reject
                              </Text>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                    </Flex>
                    {/* <HStack spacing={3} justifyContent="center">
                      <Button
                        onClick={() => viewHandler(borrow.borrowedPKey)}
                        colorScheme="blue"
                        size="xs"
                        borderRadius="none"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => approveHandler(borrow.borrowedPKey)}
                        colorScheme="facebook"
                        size="xs"
                        borderRadius="none"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectHandler(borrow.borrowedPKey)}
                        colorScheme="red"
                        size="xs"
                        borderRadius="none"
                      >
                        Reject
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
        <ViewModalApproval
          isOpen={isView}
          onClose={closeView}
          statusBody={statusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      {isReject && (
        <RejectModalApproval
          isOpen={isReject}
          onClose={closeReject}
          statusBody={statusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchNotification={fetchNotification}
        />
      )}

      {isApprove && (
        <ApproveModal
          isOpen={isApprove}
          onClose={closeApprove}
          statusBody={statusBody}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};

export default ForApprovalBorrowedMaterials;
