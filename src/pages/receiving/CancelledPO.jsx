import {
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Td,
  Button,
  useToast,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Badge,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useEffect } from "react";
import { TiArrowBack } from "react-icons/ti";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
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
import { EditModal } from "./warehouse_receiving/EditModal";
import CancelledReturnModal from "./warehouse_receiving/CancelledReturnModal";

const CancelledPO = () => {
  const [pO, setPO] = useState([]);
  const [editData, setEditData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageTotal, setPageTotal] = useState(undefined);
  const toast = useToast();

  // const [viewData, setViewData] = useState([]);
  // const {
  //   isOpen: isViewModalOpen,
  //   onOpen: openViewModal,
  //   onClose: closeViewModal,
  // } = useDisclosure();
  // const {
  //   isOpen: isEditModalOpen,
  //   onOpen: openEditModal,
  //   onClose: closeEditModal,
  // } = useDisclosure();

  const {
    isOpen: isReturnModalOpen,
    onOpen: openReturnModal,
    onClose: closeReturnModal,
  } = useDisclosure();

  // FETCH API CANCELLED PO:
  const fetchCancelledPOApi = async (pageNumber, pageSize, search) => {
    const response = await request.get(
      `Warehouse/GetAllCancelledPoWithPaginationOrig?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
    );

    return response.data;
  };

  //PAGINATION
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

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  //SHOW MAIN MENU DATA----
  const getCancelledPOHandler = () => {
    fetchCancelledPOApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setPO(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getCancelledPOHandler();

    return () => {
      setPO([]);
    };
  }, [currentPage, pageSize, search]);

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    console.log(inputValue);
  };

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const returnModalHandler = (data) => {
    setEditData(data);
    // console.log(data);
    openReturnModal();
  };

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      borderRadius="md"
      flexDirection="column"
      bg="background"
    >
      <Flex bg="btnColor" borderRadius="none" w="20%" pl={2}>
        <Text
          p={2}
          fontWeight="semibold"
          fontSize="12px"
          color="white"
          letterSpacing="wider"
        >
          CANCELLED PURCHASE ORDER
        </Text>
      </Flex>

      <Flex
        w="full"
        bg="form"
        h="100%"
        p={4}
        borderRadius="md"
        flexDirection="column"
      >
        <Flex w="full" borderRadius="md" bg="form" h="6%" position="sticky">
          <HStack p={2} w="20%" mt={3}>
            <InputGroup size="sm">
              <InputLeftElement
                pointerEvents="none"
                children={<FiSearch bg="black" fontSize="18px" />}
              />
              <Input
                borderRadius="lg"
                fontSize="13px"
                type="text"
                border="none"
                bg="#E9EBEC"
                placeholder="Search"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </InputGroup>
          </HStack>
        </Flex>

        <Flex w="full" flexDirection="column" p={3} mt={3}>
          <Text
            textAlign="center"
            bgColor="primary"
            color="white"
            fontSize="14px"
            // fontWeight="semibold"
          >
            Cancelled Purchase Orders
          </Text>
          <PageScroll>
            {isLoading ? (
              <Stack width="full">
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            ) : (
              <Table
                size="sm"
                width="full"
                border="none"
                boxShadow="md"
                bg="gray.200"
                variant="striped"
              >
                <Thead bg="primary">
                  <Tr h="40px">
                    <Th color="white" fontSize="10px">
                      PO Number
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px">
                      Description
                    </Th>
                    <Th color="white" fontSize="10px">
                      Supplier
                    </Th>
                    <Th color="white" fontSize="10px">
                      Qty Remaining
                    </Th>
                    {/* <Th color="white" fontSize="9px">
                      Qty Cancel
                    </Th>
                    <Th color="white" fontSize="9px">
                      Qty Good
                    </Th> */}
                    <Th color="white" fontSize="10px">
                      Date Cancelled
                    </Th>
                    {/* <Th color="white" fontSize="9px">
                      Remarks
                    </Th> */}
                    <Th color="white" fontSize="10px">
                      Return
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pO?.cancel?.map((canc) => (
                    <Tr key={canc.id}>
                      <Td fontSize="xs">{canc.pO_Number}</Td>
                      <Td fontSize="xs">{canc.itemCode}</Td>
                      <Td fontSize="xs">{canc.itemDescription}</Td>
                      <Td fontSize="xs">{canc.supplier}</Td>
                      <Td fontSize="xs">
                        {canc.actualRemaining.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {moment(canc.dateCancelled).format("MM/DD/YYYY")}
                      </Td>
                      {/* <Td fontSize="11px">{canc.remarks}</Td> */}
                      <Td pl={0}>
                        <Flex>
                          <Box>
                            <Button
                              bg="none"
                              // onClick={() => editRolesHandler(rol)}
                              onClick={() => returnModalHandler(canc.id)}
                            >
                              <TiArrowBack />
                            </Button>
                            {/* <Menu>
                                  <MenuButton  alignItems="center" justifyContent="center" bg="none">
                                  <AiOutlineMore fontSize="20px" />
                                  </MenuButton>
                                  <MenuList>
                                    <MenuItem icon={<GrView fontSize="17px"/>} onClick={() => viewModalHandler(pos.poNumber, pos.poDate, pos.prNumber, pos.prDate)}>
                                      <Text fontSize="15px">
                                      View
                                      </Text>
                                    </MenuItem>
                                    <MenuItem icon={<FaEdit fontSize="17px"/>} onClick={() => editModalHandler(pos)} >
                                      <Text fontSize="15px">
                                        Edit
                                      </Text>
                                    </MenuItem>
                                    <MenuItem icon={<GiCancel fontSize="17px"/>}>
                                      <Text fontSize="15px" _hover={{ color: "red" }}>
                                        Cancel
                                      </Text>
                                    </MenuItem>
                                  </MenuList>
                                </Menu> */}
                          </Box>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </PageScroll>

          <Flex justifyContent="space-between">
            <HStack>
              <Badge colorScheme="cyan">
                <Text color="secondary">
                  Number of Records: {pO.cancel?.length}
                </Text>
              </Badge>
            </HStack>

            <Stack>
              <Pagination
                pagesCount={pagesCount}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              >
                <PaginationContainer>
                  <PaginationPrevious
                    bg="primary"
                    color="white"
                    p={1}
                    _hover={{ bg: "btnColor", color: "white" }}
                  >
                    {"<<"}
                  </PaginationPrevious>
                  <PaginationPageGroup ml={1} mr={1}>
                    {pages.map((page) => (
                      <PaginationPage
                        _hover={{ bg: "btnColor", color: "white" }}
                        _focus={{ bg: "btnColor" }}
                        p={3}
                        bg="primary"
                        color="white"
                        key={`pagination_page_${page}`}
                        page={page}
                      />
                    ))}
                  </PaginationPageGroup>
                  <HStack>
                    <PaginationNext
                      bg="primary"
                      color="white"
                      p={1}
                      _hover={{ bg: "btnColor", color: "white" }}
                    >
                      {">>"}
                    </PaginationNext>
                    <Select onChange={handlePageSizeChange} variant="outline">
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

          <Flex justifyContent="end">
            {isReturnModalOpen && (
              <CancelledReturnModal
                editData={editData}
                isOpen={isReturnModalOpen}
                onClose={closeReturnModal}
                getCancelledPOHandler={getCancelledPOHandler}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CancelledPO;

const ViewModal = ({ isOpen, onClose, viewData }) => {
  return (
    <Flex>
      <Modal size="6xl" isOpen={isOpen} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent bg="#D9DFE7" h="90vh">
          <ModalHeader>
            <Flex justifyContent="center">
              <Text fontSize="sm" fontWeight="semibold">
                PO Summary
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            {!viewData ? (
              <Stack w="full">
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
                <Skeleton h="20px" />
              </Stack>
            ) : (
              <Table variant="striped" size="sm">
                <Thead bg="primary">
                  <Tr>
                    <Th color="white" fontSize="9px">
                      PO No.
                    </Th>
                    <Th color="white" fontSize="9px">
                      Approved Date
                    </Th>
                    <Th color="white" fontSize="9px">
                      PR No.
                    </Th>
                    <Th color="white" fontSize="9px">
                      PR Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr key={viewData.id}>
                    <Td fontSize="11px">{viewData.poNumber}</Td>
                    <Td fontSize="11px">{viewData.poDate}</Td>
                    <Td fontSize="11px">{viewData.prNumber}</Td>
                    <Td fontSize="11px">{viewData.prDate}</Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} color="gray.600" fontSize="11px">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
