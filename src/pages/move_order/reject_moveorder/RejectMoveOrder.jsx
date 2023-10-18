import React, { useEffect, useState } from "react";
import { usePagination } from "@ajna/pagination";
import request from "../../../services/ApiClient";
import { RejectMo } from "./RejectMo";

const fetchRejectedMOApi = async (pageNumber, pageSize, search, status) => {
  const res = await request.get(
    `Ordering/RejectedMoveOrderPaginationOrig?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}&status=${status}`
  );
  return res.data;
};

const RejectMoveOrder = () => {
  const [rejectedData, setRejectedData] = useState([]);

  const [search, setSearch] = useState("");
  const [pageTotal, setPageTotal] = useState(undefined);
  const [status, setStatus] = useState(false);

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

  const fetchRejectedMO = () => {
    fetchRejectedMOApi(currentPage, pageSize, search, status).then((res) => {
      setRejectedData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchRejectedMO();

    return () => {
      setRejectedData([]);
    };
  }, [pageSize, currentPage, search, status]);

  return (
    <RejectMo
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
      setSearch={setSearch}
      pagesCount={pagesCount}
      currentPage={currentPage}
      pageSize={pageSize}
      rejectedData={rejectedData}
      fetchRejectedMO={fetchRejectedMO}
      status={status}
      setStatus={setStatus}
      // fetchNotification={fetchNotification}
    />
  );
};

export default RejectMoveOrder;
