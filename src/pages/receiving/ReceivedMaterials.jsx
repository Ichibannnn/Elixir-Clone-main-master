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
  ButtonGroup,
  Badge,
  Select,
  Image,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { useEffect } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { AiOutlineMore } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { AiFillPrinter } from "react-icons/ai";
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
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";

// RECEIVED MATERIALS ----------------------------------------------
const ReceivedMaterials = () => {
  // const [pO, setWarehouseData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();
  // const [viewData, setViewData] = useState([]);
  // const [editData, setEditData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [printData, setPrintData] = useState({
    warehouseId: "",
    poNumber: "",
    dateReceive: "",
    itemCode: "",
    itemDescription: "",
    uom: "",
    supplier: "",
    actualGood: "",
    lotSection: "",
    siNumber: "",
  });

  // OPEN MODAL FOR PRINTER
  const {
    isOpen: isPrintOpen,
    onClose: closePrint,
    onOpen: openPrint,
  } = useDisclosure();

  // FETCH API ROLES:
  const fetchReceivedMatsApi = async (pageNumber, pageSize, search) => {
    const response = await request.get(
      `Warehouse/GetAllReceivedMaterialsPaginationOrig?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
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
  const getReceivedMatsHandler = () => {
    fetchReceivedMatsApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setWarehouseData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getReceivedMatsHandler();

    return () => {
      setWarehouseData([]);
    };
  }, [currentPage, pageSize, search]);

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    console.log(inputValue);
  };

  // PRINT
  const printHandler = ({
    id,
    poNumber,
    itemCode,
    itemDescription,
    dateReceive,
    uom,
    supplier,
    actualGood,
    lotSection,
    siNumber,
  }) => {
    if (id) {
      setPrintData({
        warehouseId: id,
        poNumber: poNumber,
        Date: moment().format("MM/DD/YYYY, h:mm:ss a"),
        dateReceive: dateReceive,
        itemCode: itemCode,
        itemDescription: itemDescription,
        uom: uom,
        supplier: supplier,
        actualGood: actualGood,
        lotSection: lotSection,
        siNumber: siNumber,
      });
      openPrint();
    } else {
      setPrintData({
        warehouseId: "",
        poNumber: "",
        Date: "",
        dateReceive: "",
        itemCode: "",
        itemDescription: "",
        uom: "",
        supplier: "",
        actualGood: "",
        lotSection: "",
        siNumber: "",
      });
    }
  };

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        {/* <Icon as={BsTrashFill} mt={2} color="white" fontSize="18px" /> */}
        <Text
          p={2}
          fontWeight="semibold"
          fontSize="11px"
          color="white"
          letterSpacing="wider"
        >
          RECEIVED MATERIALS
        </Text>
      </Flex>

      <Flex
        w="full"
        bg="form"
        h="100%"
        borderRadius="md"
        flexDirection="column"
        p={4}
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

        <Flex w="full" flexDirection="column" p={3}>
          <Text
            textAlign="center"
            bgColor="primary"
            color="white"
            fontSize="14px"
            // fontWeight="semibold"
          >
            List of Received Materials
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
                variant="striped"
              >
                <Thead
                  bg="primary"
                  h="40px"
                  position="sticky"
                  top={0}
                  zIndex={1}
                >
                  <Tr>
                    <Th color="white" fontSize="10px">
                      Warehouse ID
                    </Th>
                    <Th color="white" fontSize="10px">
                      PO Number
                    </Th>

                    <Th color="white" fontSize="10px">
                      SI Number
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px">
                      Actual Good
                    </Th>
                    <Th color="white" fontSize="10px">
                      Date Received
                    </Th>
                    <Th color="white" fontSize="10px">
                      Unit Cost
                    </Th>
                    <Th color="white" fontSize="10px">
                      Total Cost
                    </Th>
                    <Th color="white" fontSize="10px">
                      Re-Print
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {warehouseData?.warehouse?.map((items) => (
                    <Tr key={items.id}>
                      <Td fontSize="xs">{items.id}</Td>
                      {items.poNumber === 0 ? (
                        <Td fontSize="xs">-</Td>
                      ) : (
                        <Td fontSize="xs">{items.poNumber}</Td>
                      )}
                      {items.siNumber ? (
                        <Td fontSize="xs">{items.siNumber}</Td>
                      ) : (
                        <Td fontSize="xs">-</Td>
                      )}
                      <Td fontSize="xs">{items.itemCode}</Td>
                      <Td fontSize="xs">{items.itemDescription}</Td>
                      <Td fontSize="xs">
                        {items.actualGood.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">{items.dateReceive}</Td>
                      <Td fontSize="xs">
                        {items.unitPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {items.totalUnitPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minumFractionDigits: 2,
                        })}
                      </Td>
                      <Td pl={0}>
                        <Flex>
                          <Box pl={4}>
                            <Button
                              size="xs"
                              bg="none"
                              onClick={() => printHandler(items)}
                            >
                              <BsFillPrinterFill fontSize="16px" />
                            </Button>
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
                  Number of Records: {warehouseData.warehouse?.length}
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
                    <PaginationNext bg="primary" color="white" p={1}>
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
            {isPrintOpen && (
              <PrintModal
                isOpen={openPrint}
                onClose={closePrint}
                printData={printData}
                getReceivedMatsHandler={getReceivedMatsHandler}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ReceivedMaterials;

const PrintModal = ({ isOpen, onClose, printData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const displayData = {
    "PO Number": printData?.poNumber,
    Date: moment().format("MM/DD/YYYY, h:mm:ss a"),
    "Receiving Date": moment(printData?.dateReceive).format("MM/DD/YYYY"),
    "Item Code": printData?.itemCode,
    "Item Description": printData?.itemDescription,
    UOM: printData?.uom,
    Supplier: printData?.supplier,
    "Quantity Good": printData?.actualGood,
    "Lot Section": printData?.lotSection,
    "SI Number": printData?.siNumber,
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text fontSize="15px">Print Preview</Text>
          </Flex>
          <Flex justifyContent="center">
            <Text fontSize="9px">(Duplicated Copy)</Text>
          </Flex>
        </ModalHeader>

        <ModalBody>
          {/* Printed on Paper */}
          <Box display="none">
            <VStack spacing={0} justifyContent="center" ref={componentRef}>
              <VStack spacing={0} justifyContent="start">
                <Image src="/images/RDF Logo.png" w="20%" ml={3} />
                <Text fontSize="9px" ml={2} textAlign="center">
                  Purok 6, Brgy. Lara, City of San Fernando, Pampanga,
                  Philippines
                </Text>
              </VStack>
              <Flex mt={3} w="90%" justifyContent="center">
                <Text fontSize="15px" fontWeight="semibold">
                  Materials
                </Text>
              </Flex>

              {Object.keys(displayData)?.map((key, i) => (
                <Flex w="full" justifyContent="center" key={i}>
                  <Flex ml="10%" w="full">
                    <Flex>
                      <Text fontWeight="semibold" fontSize="8px">
                        {key}:
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex w="full">
                    <Flex>
                      <Text fontWeight="semibold" fontSize="8px">
                        {displayData[key]}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))}

              <VStack spacing={0} w="90%" ml={4} justifyContent="center">
                <Barcode
                  fontSize="16"
                  width={3}
                  height={25}
                  value={printData?.warehouseId}
                />
              </VStack>

              <Flex w="full"></Flex>
            </VStack>
          </Box>

          {/* Display on Preview */}
          <VStack spacing={0} justifyContent="center">
            <VStack spacing={0} justifyContent="start">
              <Image src="/images/RDF Logo.png" w="20%" ml={3} />
              <Text fontSize="9px" ml={2} textAlign="center">
                Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines
              </Text>
            </VStack>
            <Flex mt={3} w="90%" justifyContent="center">
              <Text fontSize="15px" fontWeight="semibold">
                Materials
              </Text>
            </Flex>

            {Object.keys(displayData)?.map((key, i) => (
              <Flex w="full" justifyContent="center" key={i}>
                <Flex ml="10%" w="full">
                  <Flex>
                    <Text fontWeight="semibold" fontSize="13px">
                      {key}:
                    </Text>
                  </Flex>
                </Flex>
                <Flex w="full">
                  <Flex>
                    <Text fontWeight="normal" fontSize="13px">
                      {displayData[key]}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ))}

            <VStack spacing={0} w="90%" ml={4} justifyContent="center">
              <Barcode
                fontSize="16"
                width={3}
                height={25}
                value={printData?.warehouseId}
              />
            </VStack>

            <Flex w="full"></Flex>
          </VStack>

          {/* <Box>
            <VStack spacing={0} justifyContent="center">
              <VStack spacing={0} justifyContent="start"></VStack>
              <Flex mt={3} w="90%" justifyContent="center">
                <Text fontSize="15px" fontWeight="semibold">
                  Materials
                </Text>
              </Flex>

              <Flex
                spacing={0}
                ref={componentRef}
                w="70%"
                justifyContent="space-between"
              >
                <Box>
                  <Text fontSize="13px" fontWeight="semibold">
                    Date:
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="13px">{printData?.Date} </Text>
                </Box>
              </Flex>

              <VStack spacing={0} justifyContent="center" ref={componentRef}>
                <Text>{printData?.itemCode}</Text>
                <Text>{printData?.itemDescription}</Text>
                <Text>Date Received: {printData?.dateReceive}</Text>
                <VStack spacing={0} w="90%" ml={4} justifyContent="center">
                  <Barcode
                    width={2}
                    height={30}
                    value={printData?.warehouseId}
                  />
                </VStack>
              </VStack>
            </VStack>
          </Box> */}
        </ModalBody>
        <ModalFooter mt={10}>
          <ButtonGroup size="xs">
            <Button colorScheme="blue" onClick={handlePrint}>
              Re-Print
            </Button>
            <Button color="black" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
