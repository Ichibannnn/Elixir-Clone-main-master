import {
  Box,
  Flex,
  Heading,
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
  VStack,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Td,
  Portal,
  Button,
  useToast,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  MenuItem,
  IconButton,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tfoot,
  ModalFooter,
  Badge,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { AiOutlineMore } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { AiTwotoneEdit } from "react-icons/ai";
import { BsTrashFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { decodeUser } from "../../services/decode-user";
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

const WarehouseConfirmReject = () => {
  const [pO, setPO] = useState([]);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();
  const [viewData, setViewData] = useState([]);
  const [editData, setEditData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [disableEdit, setDisableEdit] = useState(false);

  const {
    isOpen: isViewModalOpen,
    onOpen: openViewModal,
    onClose: closeViewModal,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const {
    isCancelModalOpen,
    onOpen: openCancelModal,
    onClose: closeCancel,
  } = useDisclosure();

  // FETCH API ROLES:
  const fetchAvailablePOApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Warehouse/GetAllAvailablePoWithPaginationOrig?PageNumber=${pageNumber}&PageSize=${pageSize}`
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
  const getAvailablePOHandler = () => {
    fetchAvailablePOApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setPO(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getAvailablePOHandler();

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

  const viewModalHandler = (poNumber, poDate, prNumber, prDate) => {
    setViewData({ poNumber, poDate, prNumber, prDate });
    openViewModal();
  };
  // console.log(viewData)

  const editModalHandler = (data) => {
    setEditData(data);
    openEditModal();
  };

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      borderRadius="md"
      flexDirection="column"
      bg="background"
      boxShadow="md"
    >
      <Flex bg="buttonColor" borderRadius="10px 10px 0px 0px" w="25%" pl={2}>
        {/* <Icon as={BsTrashFill} mt={2} color="white" fontSize="18px" /> */}
        <Text p={2} fontWeight="semibold" fontSize="12px" color="white">
          Warehouse Receiving Confirm Reject
        </Text>
      </Flex>

      <Flex
        w="full"
        bg="form"
        h="100%"
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
                placeholder="Search PO Number"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </InputGroup>
          </HStack>
        </Flex>

        <Flex w="full" flexDirection="column" gap={2} p={3}>
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
                size="md"
                width="full"
                border="none"
                boxShadow="md"
                bg="gray.200"
                variant="striped"
              >
                <Thead bg="primary">
                  <Tr>
                    <Th color="white" fontSize="9px">
                      PO Number
                    </Th>
                    <Th color="white" fontSize="9px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="9px">
                      Description
                    </Th>
                    <Th color="white" fontSize="9px">
                      Supplier
                    </Th>
                    <Th color="white" fontSize="9px">
                      UOM
                    </Th>
                    <Th color="white" fontSize="9px">
                      Qty Ordered
                    </Th>
                    <Th color="white" fontSize="9px">
                      Actual Good
                    </Th>
                    <Th color="white" fontSize="9px">
                      Actual Reject
                    </Th>
                    <Th color="white" fontSize="9px">
                      Remarks
                    </Th>
                    <Th color="white" fontSize="9px">
                      Confirm
                    </Th>
                    <Th color="white" fontSize="9px">
                      Return
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pO?.posummary?.map((pos) => (
                    <Tr key={pos.id}>
                      <Td fontSize="11px">{pos.poNumber}</Td>
                      <Td fontSize="11px">{pos.itemCode}</Td>
                      <Td fontSize="11px">{pos.itemDescription}</Td>
                      <Td fontSize="11px">{pos.supplier}</Td>
                      <Td fontSize="11px">{pos.uom}</Td>
                      <Td fontSize="11px">{pos.quantityOrdered}</Td>
                      <Td fontSize="11px">{pos.actualGood}</Td>
                      <Td fontSize="11px">{pos.actualRemaining}</Td>
                      <Td pl={0}>
                        <Flex>
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
                                {/* <MenuGroup title='Action:' /> */}
                                {/* <MenuDivider/> */}
                                <MenuItem
                                  icon={<GrView fontSize="17px" />}
                                  onClick={() =>
                                    viewModalHandler(
                                      pos.poNumber,
                                      pos.poDate,
                                      pos.prNumber,
                                      pos.prDate
                                    )
                                  }
                                >
                                  <Text fontSize="15px">View</Text>
                                </MenuItem>
                                <MenuItem
                                  icon={<FaEdit fontSize="17px" />}
                                  onClick={() => editModalHandler(pos)}
                                >
                                  <Text fontSize="15px">Edit</Text>
                                </MenuItem>
                                <MenuItem icon={<GiCancel fontSize="17px" />}>
                                  <Text
                                    fontSize="15px"
                                    _hover={{ color: "red" }}
                                  >
                                    Cancel
                                  </Text>
                                </MenuItem>
                              </MenuList>
                            </Menu>
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
                  Number of Records: {pO.posummary?.length}
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
                    _hover={{ bg: "green", color: "white" }}
                    size="sm"
                  >
                    {"<<"}
                  </PaginationPrevious>
                  <PaginationPageGroup ml={1} mr={1}>
                    {pages.map((page) => (
                      <PaginationPage
                        _hover={{ bg: "green", color: "white" }}
                        _focus={{ bg: "green" }}
                        p={3}
                        bg="primary"
                        color="white"
                        key={`pagination_page_${page}`}
                        page={page}
                        size="sm"
                      />
                    ))}
                  </PaginationPageGroup>
                  <HStack>
                    <PaginationNext
                      bg="primary"
                      color="white"
                      p={1}
                      _hover={{ bg: "green", color: "white" }}
                      size="sm"
                      mb={2}
                    >
                      {">>"}
                    </PaginationNext>
                    <Select
                      onChange={handlePageSizeChange}
                      bg="#FFFFFF"
                      // size="sm"
                      mb={2}
                      variant="outline"
                    >
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
            {/* {isEditModalOpen && (
              <EditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                editData={editData}
                getAvailablePOHandler={getAvailablePOHandler}
              />
            )} */}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default WarehouseConfirmReject;
