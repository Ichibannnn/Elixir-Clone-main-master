import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { RiFileList3Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";

import axios from "axios";
import { ListOfSuppliers } from "./ListOfSuppliers";

const fetchGenusApi = async () => {
  // const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD");
  // const toDateFormatted = moment(toDate).format("yyyy-MM-DD");
  const res = await axios.get(
    `http://10.10.2.76:8000/api/dropdown/suppliers?status=1&paginate=0&api_for=vladimir`,
    {
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
      },
    }
  );
  return res.data;
};

// FETCH API ELIXIR API:
const fetchElixirApi = async () => {
  const response = await request.get(
    `Supplier/GetAllSupplierithPagination/true?PageNumber=1&PageSize=10000`
  );

  return response.data;
};

const SupplierNew = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [genusSupplier, setGenusSupplier] = useState([]);
  const [elixirSuppliers, setElixirSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  // GET GENUS SUPPLIERS
  const fetchGenusSuppliers = () => {
    fetchGenusApi().then((res) => {
      setGenusSupplier(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchGenusSuppliers();

    return () => {
      setGenusSupplier([]);
    };
  }, []);

  // GET ELIXIR SUPPLIERS
  const fetchElixirSuppliers = () => {
    fetchElixirApi().then((res) => {
      setElixirSuppliers(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchElixirSuppliers();

    return () => {
      setElixirSuppliers([]);
    };
  }, []);

  console.log(elixirSuppliers);

  return (
    <ListOfSuppliers
      fetchElixirSuppliers={fetchElixirSuppliers}
      elixirSuppliers={elixirSuppliers}
      setElixirSuppliers={setElixirSuppliers}
      genusSupplier={genusSupplier}
      setGenusSupplier={setGenusSupplier}
      search={search}
      fetchingData={isLoading}
    />
  );
};

export default SupplierNew;
