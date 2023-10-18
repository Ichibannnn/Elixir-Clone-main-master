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
import { ConsumeModal, ViewModal } from "./ActionModal";
import { ListOfMaterials } from "./ListOfMaterials";
import { ReturnRequest } from "./ReturnRequest";
import { GoArrowSmallRight } from "react-icons/go";
import { SlPrinter } from "react-icons/sl";
import { GrView } from "react-icons/gr";
import { AiOutlineMore, AiOutlineWarning } from "react-icons/ai";

const currentUser = decodeUser();
const userId = currentUser?.id;

// LIST OF BORROWED MATERIALS
const fetchBorrowedApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(
    `Borrowed/GetAllBorrowedIssueWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}&empid=${userId}`
  );
  return res.data;
};

// LIST OF MATERIALS
const fetchMaterialListApi = async (borrowedId) => {
  const res = await request.get(`Borrowed/GetItemForReturned?id=${borrowedId}`);

  return res.data;
};

export const ApprovedBorrowedMaterials = ({
  fetchNotificationWithParams,
  navigation,
  setNavigation,
}) => {
  const [issueBorrowData, setBorrowIssueData] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [lengthIndicator, setLengthIndicator] = useState("");
  const [borrowedId, setBorrowedId] = useState("");
  const [materialListId, setMaterialListId] = useState("");
  const [highlighterId, setHighlighterId] = useState("");
  const [consumedQuantity, setConsumedQuantity] = useState("");

  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(true);
  let [buttonChanger, setButtonChanger] = useState(false);
  const [itemCode, setItemCode] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [uom, setUom] = useState("");
  const [returnQuantity, setReturnQuantity] = useState("");

  const [statusBody, setStatusBody] = useState({
    id: "",
    status: "",
  });

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

  const fetchBorrowed = () => {
    fetchBorrowedApi(currentPage, pageSize, search, status).then((res) => {
      setBorrowIssueData(res);
      setLengthIndicator(res.length);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchBorrowed();
  }, [status, pageSize, currentPage, search]);

  const fetchMaterialsList = () => {
    fetchMaterialListApi(borrowedId).then((res) => {
      setMaterialList(res);
    });
  };

  useEffect(() => {
    if (borrowedId) {
      fetchMaterialsList();
    }

    return () => {
      setMaterialList([]);
    };
  }, [borrowedId]);

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

  useEffect(() => {
    if (lengthIndicator === 0) {
      setCurrentPage(1);
      fetchBorrowed();
    }
  }, [lengthIndicator]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    setHighlighterId("");
    setBorrowedId("");
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const handleId = (data) => {
    sessionStorage.setItem("Borrowed ID", data);
    sessionStorage.setItem("Navigation", 2);

    setHighlighterId("");

    if (data) {
      setBorrowedId(data);
      console.log(data);
    } else {
      setBorrowedId("");
    }
  };

  const [navConsume, setNavConsume] = useState(4);

  const storedId = sessionStorage.getItem("Borrowed ID");
  useEffect(() => {
    if (storedId) {
      fetchBorrowed();
      setBorrowedId(storedId);
    }

    return () => {
      // sessionStorage.removeItem("Borrowed ID");
    };
  }, [storedId]);

  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      mb="150px"
      w="full"
      p={5}
    >
      <Flex flexDirection="column">
        {borrowedId ? (
          <ListOfMaterials
            issueBorrowData={issueBorrowData}
            materialList={materialList}
            setMaterialList={setMaterialList}
            setBorrowIssueData={setBorrowIssueData}
            highlighterId={highlighterId}
            setHighlighterId={setHighlighterId}
            setIsConsumeModalOpen={setIsConsumeModalOpen}
            materialListId={materialListId}
            setMaterialListId={setMaterialListId}
            setItemCode={setItemCode}
            setItemDescription={setItemDescription}
            setUom={setUom}
            borrowedId={borrowedId}
            setBorrowedId={setBorrowedId}
            fetchMaterialsList={fetchMaterialsList}
            fetchBorrowed={fetchBorrowed}
            fetchNotificationWithParams={fetchNotificationWithParams}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setButtonChanger={setButtonChanger}
            returnQuantity={returnQuantity}
            setReturnQuantity={setReturnQuantity}
            setConsumedQuantity={setConsumedQuantity}
          />
        ) : (
          <Flex flexDirection="column">
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
            <Box w="full" bgColor="primary" h="22px">
              <Text
                fontWeight="normal"
                fontSize="13px"
                color="white"
                textAlign="center"
                justifyContent="center"
              >
                Approved Borrowed Materials
              </Text>
            </Box>
            <PageScroll minHeight="350px" maxHeight="370px">
              <Table size="sm" variant="striped">
                <Thead bgColor="primary" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th h="20px" color="white" fontSize="10px">
                      Line
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Borrowed ID
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
                    <Th h="20px" color="white" fontSize="10px">
                      Aging Days
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Status
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Remarks
                    </Th>
                    <Th h="20px" color="white" fontSize="10px">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {issueBorrowData?.issue?.map((borrow, i) => (
                    <Tr
                      key={i}
                      bgColor={
                        borrowedId === borrow.borrowedPKey ? "blue.100" : "none"
                      }
                      cursor="pointer"
                    >
                      {borrowedId === borrow.borrowedPKey ? (
                        <Td>
                          <GoArrowSmallRight fontSize="27px" />
                        </Td>
                      ) : (
                        <Td fontSize="11px">{i + 1}</Td>
                      )}
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
                      <Td fontSize="xs">
                        {borrow.agingDays} {`Day(s)`}
                      </Td>
                      <Td fontSize="xs">{borrow.statusApprove}</Td>
                      {/* <Td fontSize="xs">{borrow.reason}</Td> */}
                      {borrow.reason ? (
                        <Td fontSize="xs">
                          <HStack color="black">
                            <Text>{borrow.reason}</Text>
                            <AiOutlineWarning color="red" fontSize="15px" />
                          </HStack>
                        </Td>
                      ) : (
                        <Td fontSize="xs">{borrow.reason}</Td>
                      )}

                      <Td fontSize="xs" mr={3}>
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
                                  icon={<GrView fontSize="17px" />}
                                  onClick={() => handleId(borrow.borrowedPKey)}
                                >
                                  <Text fontSize="15px">View</Text>
                                </MenuItem>
                                <MenuItem
                                  icon={<SlPrinter fontSize="17px" />}
                                  onClick={() =>
                                    viewHandler(
                                      borrow.borrowedPKey,
                                      borrow.isActive
                                    )
                                  }
                                >
                                  <Text
                                    fontSize="15px"
                                    _hover={{ color: "red" }}
                                  >
                                    Print
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
            </PageScroll>

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
          </Flex>
        )}
      </Flex>

      {isView && (
        <ViewModal
          isOpen={isView}
          onCloseView={closeView}
          statusBody={statusBody}
          issueBorrowData={issueBorrowData}
          fetchBorrowed={fetchBorrowed}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchNotificationWithParams={fetchNotificationWithParams}
        />
      )}

      <Flex w="full" flexDirection="column">
        {buttonChanger
          ? ""
          : highlighterId &&
            isConsumeModalOpen && (
              <ConsumeModal
                borrowedId={borrowedId}
                setBorrowedId={setBorrowedId}
                highlighterId={highlighterId}
                setHighlighterId={setHighlighterId}
                fetchMaterialsList={fetchMaterialsList}
                fetchNotificationWithParams={fetchNotificationWithParams}
                isConsumeModalOpen={isConsumeModalOpen}
                setIsConsumeModalOpen={setIsConsumeModalOpen}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                materialList={materialList}
                setMaterialList={setMaterialList}
                materialListId={materialListId}
                setMaterialListId={setMaterialListId}
                fetchBorrowed={fetchBorrowed}
                consumedQuantity={consumedQuantity}
                setConsumedQuantity={setConsumedQuantity}
                itemCode={itemCode}
                setItemCode={setItemCode}
                itemDescription={itemDescription}
                setItemDescription={setItemDescription}
                uom={uom}
                setUom={setUom}
                returnQuantity={returnQuantity}
              />
            )}
      </Flex>
    </Flex>
  );
};

// OLD CODES -----------------------------------------------------------------------
// import React, { useEffect, useState } from "react";
// import {
//   Badge,
//   Button,
//   Flex,
//   HStack,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Select,
//   Stack,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   useDisclosure,
//   useToast,
// } from "@chakra-ui/react";
// import { FaSearch } from "react-icons/fa";
// import {
//   Pagination,
//   usePagination,
//   PaginationNext,
//   PaginationPage,
//   PaginationPrevious,
//   PaginationContainer,
//   PaginationPageGroup,
// } from "@ajna/pagination";
// import PageScroll from "../../../../utils/PageScroll";
// import request from "../../../../services/ApiClient";
// import moment from "moment/moment";
// import { decodeUser } from "../../../../services/decode-user";
// import { ViewModal } from "./ActionModal";
// // import { ViewModal } from "../../viewingBorrowed/ActionButtonBorrowed";

// const currentUser = decodeUser();
// const userId = currentUser?.id;

// const fetchBorrowedApi = async (pageNumber, pageSize, search, status) => {
//   const res = await request.get(
//     `Borrowed/GetAllBorrowedIssueWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}&empid=${userId}`
//   );
//   return res.data;
// };

// export const ApprovedBorrowedMaterials = ({ fetchNotificationWithParams }) => {
//   const [issueBorrowData, setBorrowIssueData] = useState([]);

//   const [pageTotal, setPageTotal] = useState(undefined);
//   const [status, setStatus] = useState(true);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [statusBody, setStatusBody] = useState({
//     id: "",
//     status: "",
//   });

//   const {
//     isOpen: isView,
//     onClose: closeView,
//     onOpen: openView,
//   } = useDisclosure();

//   const outerLimit = 2;
//   const innerLimit = 2;
//   const {
//     currentPage,
//     setCurrentPage,
//     pagesCount,
//     pages,
//     setPageSize,
//     pageSize,
//   } = usePagination({
//     total: pageTotal,
//     limits: {
//       outer: outerLimit,
//       inner: innerLimit,
//     },
//     initialState: { currentPage: 1, pageSize: 5 },
//   });

//   const fetchBorrowed = () => {
//     fetchBorrowedApi(currentPage, pageSize, search, status).then((res) => {
//       setBorrowIssueData(res);
//       setPageTotal(res.totalCount);
//     });
//   };

//   useEffect(() => {
//     fetchBorrowed();
//   }, [status, pageSize, currentPage, search]);

//   const handlePageChange = (nextPage) => {
//     setCurrentPage(nextPage);
//   };

//   const handlePageSizeChange = (e) => {
//     const pageSize = Number(e.target.value);
//     setPageSize(pageSize);
//   };

//   const searchHandler = (inputValue) => {
//     setSearch(inputValue);
//   };

//   const viewHandler = (id, status) => {
//     if (id) {
//       setStatusBody({
//         id: id,
//         status: status,
//       });
//       openView();
//     } else {
//       setStatusBody({
//         id: "",
//         status: "",
//       });
//     }
//   };

//   return (
//     <Flex
//       justifyContent="center"
//       flexDirection="column"
//       mb="150px"
//       w="full"
//       p={5}
//     >
//       <Flex justifyContent="space-between">
//         <InputGroup w="15%">
//           <InputLeftElement
//             pointerEvents="none"
//             children={<FaSearch color="gray.300" />}
//           />
//           <Input
//             onChange={(e) => searchHandler(e.target.value)}
//             type="text"
//             fontSize="xs"
//             placeholder="Search: ID"
//             focusBorderColor="accent"
//           />
//         </InputGroup>
//       </Flex>

//       <Flex mt={5}>
//         <PageScroll minHeight="400px" maxHeight="401px">
//           <Table size="sm" variant="striped">
//             <Thead bgColor="primary">
//               <Tr>
//                 <Th h="40px" color="white" fontSize="10px">
//                   ID
//                 </Th>
//                 <Th h="40px" color="white" fontSize="10px">
//                   Customer Code
//                 </Th>
//                 <Th h="40px" color="white" fontSize="10px">
//                   Customer Name
//                 </Th>
//                 <Th h="40px" color="white" fontSize="10px">
//                   Total Borrowed
//                 </Th>
//                 <Th h="40px" color="white" fontSize="10px">
//                   Borrowed Date
//                 </Th>
//                 {/* <Th h="40px" color="white" fontSize="10px">
//                   Transacted By
//                 </Th> */}

//                 <Th h="40px" color="white" fontSize="10px">
//                   Aging Days
//                 </Th>
//                 <Th h="40px" color="white" fontSize="10px">
//                   Status
//                 </Th>
//                 <Th h="40px" color="white" fontSize="10px">
//                   Remarks
//                 </Th>
//                 <Th h="40px" color="white" fontSize="10px">
//                   Action
//                 </Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {issueBorrowData?.issue?.map((borrow, i) => (
//                 <Tr key={i}>
//                   <Td fontSize="xs">{borrow.borrowedPKey}</Td>
//                   <Td fontSize="xs">{borrow.customerCode}</Td>
//                   <Td fontSize="xs">{borrow.customerName}</Td>
//                   <Td fontSize="xs">
//                     {" "}
//                     {borrow.totalQuantity.toLocaleString(undefined, {
//                       maximumFractionDigits: 2,
//                       minimumFractionDigits: 2,
//                     })}
//                   </Td>
//                   <Td fontSize="xs">
//                     {moment(borrow.borrowedDate).format("yyyy-MM-DD")}
//                   </Td>

//                   {/* <Td fontSize="xs">{borrow.preparedBy}</Td> */}

//                   <Td fontSize="xs">
//                     {borrow.agingDays} {`Day(s)`}
//                   </Td>
//                   <Td fontSize="xs">{borrow.statusApprove}</Td>
//                   <Td fontSize="xs">{borrow.reason}</Td>
//                   <Td fontSize="xs">
//                     <Button
//                       onClick={() =>
//                         viewHandler(borrow.borrowedPKey, borrow.isActive)
//                       }
//                       colorScheme="blue"
//                       borderRadius="none"
//                       size="xs"
//                     >
//                       Return
//                     </Button>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </PageScroll>
//       </Flex>

//       <Flex mt={5} justifyContent="end">
//         <Stack>
//           <Pagination
//             pagesCount={pagesCount}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           >
//             <PaginationContainer>
//               <PaginationPrevious
//                 bg="secondary"
//                 color="white"
//                 p={1}
//                 _hover={{ bg: "accent", color: "white" }}
//               >
//                 {"<<"}
//               </PaginationPrevious>
//               <PaginationPageGroup ml={1} mr={1}>
//                 {pages.map((page) => (
//                   <PaginationPage
//                     _hover={{ bg: "accent", color: "white" }}
//                     p={3}
//                     bg="secondary"
//                     color="white"
//                     key={`pagination_page_${page}`}
//                     page={page}
//                   />
//                 ))}
//               </PaginationPageGroup>
//               <HStack>
//                 <PaginationNext
//                   bg="secondary"
//                   color="white"
//                   p={1}
//                   _hover={{ bg: "accent", color: "white" }}
//                 >
//                   {">>"}
//                 </PaginationNext>
//                 <Select onChange={handlePageSizeChange} variant="filled">
//                   <option value={Number(5)}>5</option>
//                   <option value={Number(10)}>10</option>
//                   <option value={Number(25)}>25</option>
//                   <option value={Number(50)}>50</option>
//                 </Select>
//               </HStack>
//             </PaginationContainer>
//           </Pagination>
//         </Stack>
//       </Flex>

//       {isView && (
//         <ViewModal
//           isOpen={isView}
//           onCloseView={closeView}
//           statusBody={statusBody}
//           issueBorrowData={issueBorrowData}
//           fetchBorrowed={fetchBorrowed}
//           isLoading={isLoading}
//           setIsLoading={setIsLoading}
//           fetchNotificationWithParams={fetchNotificationWithParams}
//         />
//       )}
//     </Flex>
//   );
// };
