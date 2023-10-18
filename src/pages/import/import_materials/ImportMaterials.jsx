import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { BiImport } from "react-icons/bi";
import { MdOutlineError } from "react-icons/md";
import * as XLSX from "xlsx";
import { ToastComponent } from "../../../components/Toast";
import DateConverter from "../../../components/DateConverter";
import request from "../../../services/ApiClient";
import { decodeUser } from "../../../services/decode-user";
import Swal from "sweetalert2";
import PageScroll from "../../../utils/PageScroll";
import { ErrorList } from "./ErrorList";

const currentUser = decodeUser();

const ImportMaterials = () => {
  const [excelData, setExcelData] = useState([]);
  const [workbook, setWorkbook] = useState([]);
  const [sheetOption, setSheetOption] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [errorOpener, setErrorOpener] = useState(false);
  const [errorData, setErrorData] = useState([]);
  const toast = useToast();
  const [bufferLevel, setBufferLevel] = useState("");

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();
  const clearExcelFile = useRef();

  // EXCEL DATA TRIM TO LOWERCASE
  const fileRender = (jsonData) => {
    setExcelData([]);

    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });
    setExcelData(jsonData);
    console.log(jsonData);
  };

  // EXCEL DATA
  const fileHandler = async (e) => {
    setWorkbook([]);

    const file = e[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.readFile(data);

    setWorkbook(workbook);
    setSheetOption(workbook.SheetNames);

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet);

    // Check for empty cells in the data
    const isEmptyCellPresent = jsonData.some((row) =>
      Object.values(row).some((value) => value === "")
    );

    fileRender(jsonData);

    if (isEmptyCellPresent) {
      setIsDisabled(true);
      ToastComponent("Error!", "Please check empty fields", "error", toast);
    } else {
      setIsDisabled(false);
    }
  };

  const resultArray = excelData.map((item) => {
    return {
      itemCode: item.item_code,
      itemDescription: item.item_description,
      accountPName: item.account_title,
      itemCategoryName: item.item_category,
      uomCode: item.uom,
      bufferLevel: item.buffer_level,
      addedBy: currentUser.username,
    };
  });

  // console.log(resultArray);

  const submitExcelHandler = (resultArray) => {
    console.log(resultArray);
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to import this material list?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          if (resultArray.length > 0) {
            try {
              setIsLoading(true);
              const res = request
                .post("Material/AddNewImportMaterials", resultArray)
                .then((res) => {
                  ToastComponent("Success!", "PO Imported", "success", toast);
                  setIsLoading(false);
                  setIsDisabled(false);
                  clearExcelFile.current.value = "";
                  setExcelData([]);
                })
                .catch((err) => {
                  setIsLoading(false);
                  setErrorData(err.response.data);
                  if (err.response.data) {
                    setErrorOpener(true);
                    onErrorOpen();
                  }
                });
            } catch (err) {
              ToastComponent(
                "Error!",
                "Wrong excel format imported for materials",
                "error",
                toast
              );
            }
          } else {
            ToastComponent(
              "Error!",
              "No data provided, please check your import",
              "error",
              toast
            );
          }
        }
      }
    });
  };

  const [bufferError, setBufferError] = useState(false); // Set it to false initially
  const [toastShown, setToastShown] = useState(false); // Set it to false initially

  useEffect(() => {
    // Check if any value in resultArray's bufferLevel is a letter
    const hasLetterValue = resultArray.some(
      (eData) =>
        isNaN(eData.bufferLevel) ||
        eData.bufferLevel === "" ||
        eData.itemCode === ""
    );
    setBufferError(hasLetterValue);
    setIsDisabled(hasLetterValue || resultArray.length === 0); // Disable if there's any letter value or if resultArray is empty

    if (resultArray.length > 0 && hasLetterValue && !toastShown) {
      ToastComponent("Warning!", "Check column fields", "warning", toast);
      setToastShown(true);
    }
  }, [resultArray, toastShown]);

  const openErrorModal = () => {
    onErrorOpen();
  };

  return (
    <Flex bg="form" h="920px" w="full" flexDirection="column">
      <Flex justifyContent="space-between">
        <Box />
        <Box p={2}>
          {errorOpener === true ? (
            <Button
              onClick={() => openErrorModal()}
              type="submit"
              isLoading={isLoading}
              isDisabled={isDisabled}
              w="170px"
              leftIcon={<MdOutlineError fontSize="19px" />}
              borderRadius="none"
              colorScheme="red"
              fontSize="12px"
              size="xs"
            >
              Error List
            </Button>
          ) : (
            <Button
              type="submit"
              leftIcon={<BiImport fontSize="19px" />}
              colorScheme="blue"
              borderRadius="none"
              fontSize="12px"
              size="xs"
              isLoading={isLoading}
              isDisabled={isDisabled}
              onClick={() => submitExcelHandler(resultArray)}
            >
              Import Materials
            </Button>
          )}
        </Box>
      </Flex>

      <Flex
        w="100%"
        h="full"
        p={2}
        mt={-4}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex w="full" h="full">
          <PageScroll maxHeight="670px">
            <Table variant="striped" size="sm">
              <Thead bg="primary" position="sticky" zIndex="0" top={0}>
                <Tr>
                  <Th h="40px" color="white" fontSize="10px">
                    Line
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Item Code
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Item Description
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Item Category
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Account Title
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    UOM
                  </Th>
                  <Th h="40px" color="white" fontSize="10px">
                    Buffer Level
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((eData, i) => (
                  <Tr key={i}>
                    <Td fontSize="xs">{i + 1}</Td>
                    <Td fontSize="xs">
                      {eData.itemCode ? eData.itemCode : null}
                    </Td>
                    <Td fontSize="xs">
                      {eData.itemDescription ? eData.itemDescription : ""}
                    </Td>
                    <Td fontSize="xs">
                      {eData.itemCategoryName ? eData.itemCategoryName : ""}
                    </Td>
                    <Td fontSize="xs">
                      {eData.accountPName ? eData.accountPName : ""}
                    </Td>
                    <Td fontSize="xs">{eData.uomCode ? eData.uomCode : ""}</Td>
                    <Td fontSize="xs">
                      <Text>
                        {!isNaN(eData?.bufferLevel)
                          ? eData?.bufferLevel.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })
                          : ""}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScroll>
        </Flex>
        <Flex p={2} bg="primary" w="100%">
          <Input
            ref={clearExcelFile}
            color="white"
            type="file"
            w="25%"
            size="25px"
            fontSize="13px"
            onChange={(e) => fileHandler(e.target.files)}
          />
        </Flex>
      </Flex>

      {isErrorOpen && (
        <ErrorList
          isOpen={isErrorOpen}
          onClose={onErrorClose}
          onOpen={onErrorOpen}
          errorData={errorData}
          setErrorData={setErrorData}
          setErrorOpener={setErrorOpener}
          errorOpener={errorOpener}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setExcelData={setExcelData}
          excelData={excelData}
          setIsDisabled={setIsDisabled}
        />
      )}
    </Flex>
  );
};

export default ImportMaterials;
