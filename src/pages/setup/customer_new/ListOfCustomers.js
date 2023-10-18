import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Tbody,
  Td,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TiArrowSync } from "react-icons/ti";
import PageScrollImport from "../../../components/PageScrollImport";
import { FiSearch } from "react-icons/fi";
import PageScroll from "../../../utils/PageScroll";
import { ToastComponent } from "../../../components/Toast";
import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import moment from "moment";
import { ErrorCustomers } from "./ErrorCustomers";
import { decodeUser } from "../../../services/decode-user";
// import OrdersConfirmation from "./OrdersConfirmation";

export const ListOfCustomers = ({
  genusCustomers,
  fistoDepartments,
  fistoLocations,
  fetchingData,
  elixirCustomers,
  fetchElixirCustomers,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [errorData, setErrorData] = useState([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = decodeUser();

  // ARRAY FOR THE LIST DATA OF SUPPLIERS
  // const resultArray = genusCustomers?.result?.map((item) => {
  //   return {
  //     customer_No: item?.id,
  //     customerCode: item?.account_code,
  //     customerName: item?.account_name,
  //     customerType: item?.account_type,
  //     companyCode: item?.company_code,
  //     companyName: item?.company,
  //     departmentCode: item?.department_code,
  //     departmentName: item?.department,
  //     locationCode: item?.location_code,
  //     locationName: item?.location,
  //     // companyCode: item?.company_code,
  //     // companyName: item?.company,
  //     // departmentCode: item?.department_code,
  //     // departmentName: item?.department,
  //     // locationCode: item?.location_code,
  //     // locationName: item?.location,
  //   };
  // });

  const resultArrayNew = genusCustomers?.result
    ?.filter((item) => item.scope_order?.length) // kukunin nya yung mga customer na my scope for ordering
    ?.reduce(
      (a, item) => [
        ...a,
        ...item.scope_order.map((customer) => {
          return {
            ...customer,
            customer_type: item.account_type,
          };
        }),
      ],
      []
    ) // pagsasamahin nya sa isang array
    ?.map((item) => {
      return {
        customer_No: item.location_id,
        customerCode: item.location_code,
        customerName:
          item.customer_type === "online"
            ? fistoDepartments.result.departments?.find(
                (customer) => customer.code === item.location_code
              )?.name
            : fistoLocations.result.locations?.find(
                (customer) => customer.code === item.location_code
              )?.name,
        customerType: item.customer_type,
        dateAdded: moment(new Date()).format("yyyy-MM-DD"),
        addedBy: currentUser.fullName,
        modifyDate: moment(new Date()).format("yyyy-MM-DD"),
        modifyBy: currentUser.fullName,
      };
    }) // format
    ?.reduce((a, item) => {
      const isExist = a.some(
        (customer) => customer.customer_No === item.customer_No
      );

      if (isExist) {
        return a;
      } else {
        return [...a, item];
      }
    }, []); // distinct

  console.log(resultArrayNew);

  // SYNC ORDER BUTTON
  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these customers?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = request
            .put(
              `Customer/AddNewCustomer`,
              resultArrayNew.map((item) => {
                return {
                  customer_No: item?.customer_No,
                  customerCode: item?.customerCode,
                  customerName: item?.customerName,
                  customerType: item?.customerType,
                  companyCode: item?.companyCode,
                  companyName: item?.companyName,
                  departmentCode: item?.departmentCode,
                  departmentName: item?.departmentName,
                  locationCode: item?.locationCode,
                  locationName: item?.locationName,
                  dateAdded: item?.dateAdded,
                  addedBy: item?.addedBy,
                  modifyDate: item?.modifyDate,
                  modifyBy: item?.modifyBy,
                  // companyCode: item?.customerCode,
                  // companyName: item?.companyName,
                  // departmentCode: item?.departmentCode,
                  // departmentName: item?.departmentName,
                  // locationCode: item?.locationCode,
                  // locationName: item?.locationName,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Customer Synced!", "success", toast);
              fetchElixirCustomers();
              // fetchNotification();
              // onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                // onClose();
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  const filteredLength = elixirCustomers?.customer?.filter((val) => {
    const newKeyword = new RegExp(`${keyword.toLowerCase()}`);
    return val?.customerName?.toLowerCase().match(newKeyword, "*");
  });

  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    setOrdersCount(0);
    if (elixirCustomers?.customer) {
      elixirCustomers?.customer?.map((cust) => {
        setOrdersCount((prevState) => prevState + 1);
      });
    }
  }, [elixirCustomers]);

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
    >
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
          <HStack>
            {/* <Text>Search</Text> */}
            <InputGroup size="sm">
              <InputLeftElement
                pointerEvents="none"
                children={<FiSearch bg="black" fontSize="18px" />}
              />
              <Input
                w="230px"
                fontSize="13px"
                size="sm"
                type="text"
                placeholder="Search: ex. Customer Name"
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
                borderColor="gray.200"
                _hover={{ borderColor: "gray.400" }}
              />
            </InputGroup>
          </HStack>

          <HStack>
            <Button
              colorScheme="blue"
              size="sm"
              fontSize="13px"
              // borderRadius="none"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<TiArrowSync fontSize="19px" />}
              onClick={() => syncHandler()}
            >
              Sync
            </Button>
          </HStack>
        </Flex>

        <Flex p={4}>
          <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
            <Text color="white" fontSize="13px" textAlign="center">
              LIST OF CUSTOMERS
            </Text>
          </VStack>
        </Flex>

        <Flex p={4}>
          <VStack w="100%" mt={-8}>
            <PageScroll>
              {fetchingData ? (
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
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table
                  // size="sm"
                  //   width="full"
                  // height="100%"
                  className="inputUpperCase"
                  border="none"
                  boxShadow="md"
                  bg="gray.200"
                  variant="striped"
                >
                  <Thead bg="primary" position="sticky" top={0}>
                    <Tr h="30px">
                      <Th color="#D6D6D6" fontSize="10px">
                        Line
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Customer Id
                      </Th>
                      {/* <Th color="#D6D6D6" fontSize="10px" pl="100px">
                               
                              </Th> */}
                      <Th color="#D6D6D6" fontSize="10px">
                        Customer Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Customer Name
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Customer Type
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Date Added
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Added By
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Sync Status
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elixirCustomers?.customer
                      ?.filter((val) => {
                        const newKeyword = new RegExp(
                          `${keyword.toLowerCase()}`
                        );
                        return val?.customerName
                          ?.toLowerCase()
                          .match(newKeyword, "*");
                      })
                      ?.map((comp, i) => (
                        <Tr key={i}>
                          <Td fontSize="12px">{i + 1}</Td>
                          <Td fontSize="12px">{comp.id}</Td>
                          {/* <Td fontSize="12px" pl="100px"></Td> */}
                          <Td fontSize="12px">{comp.customerCode}</Td>
                          <Td fontSize="12px">{comp.customerName}</Td>
                          <Td fontSize="12px">{comp.customerType}</Td>
                          <Td fontSize="12px">
                            {moment(comp.dateAdded).format("yyyy/MM/DD")}
                          </Td>
                          <Td fontSize="12px">{comp.modifyBy}</Td>
                          <Td fontSize="12px">{comp.syncStatus}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>
          </VStack>
        </Flex>

        <Flex justifyContent="space-between">
          <HStack>
            <Badge colorScheme="cyan">
              <Text color="secondary">
                {!keyword
                  ? `Number of records: ${ordersCount} `
                  : `Number of records from ${keyword}: ${filteredLength.length}`}
                {/* Number of Records: {elixirSuppliers?.supplier?.length} */}
              </Text>
            </Badge>
          </HStack>
          <HStack>
            <Badge colorScheme="cyan">
              <Text color="primary" fontSize="12px">
                Sync Date:{" "}
              </Text>
              {elixirCustomers?.customer?.length === 0 ? (
                ""
              ) : (
                <Text color="primary" fontSize="12px">
                  {moment(elixirCustomers?.customer?.syncDate).format(
                    "MM/DD/yyyy"
                  )}
                </Text>
              )}
            </Badge>
          </HStack>
          {/* <Text fontSize="12px">Sync Date: "11/11/23"</Text> */}
        </Flex>

        {isOpen && (
          <ErrorCustomers
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            resultArrayNew={resultArrayNew}
            // resultArray={resultArray}
            errorData={errorData}
            setErrorData={setErrorData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </Flex>
    </Flex>
  );
};
