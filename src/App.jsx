import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react";
import request from "./services/ApiClient";
import { Navigate, Outlet } from "react-router-dom";
import { decodeUser } from "./services/decode-user";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastComponent } from "./components/Toast";
import { RiFileWarningFill } from "react-icons/ri";

//Component Main Container
import MainContainer from "./components/MainContainer";
import UomManagement from "./pages/setup/UomManagement";
import LotManagement from "./pages/setup/LotManagement";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ErrorPage from "./pages/ErrorPage";
import Login from "./components/Login";
import MaterialsManagement from "./pages/setup/MaterialsManagement";
import CustomersManagement from "./pages/setup/CustomersManagement";
import SuppliersManagement from "./pages/setup/SuppliersManagement";
import ItemCategory from "./pages/setup/ItemCategory";
import { Context } from "./components/context/Context";

//LANDING PAGE
import UserManagementPage from "./UserManagementPage";
import SetupManagementPage from "./SetupManagementPage";
import LotCategory from "./pages/setup/LotCategory";
import CustomerType from "./pages/setup/CustomerType";
import ReasonManagement from "./pages/setup/ReasonManagement";
import CompanyManagement from "./pages/account_title/CompanyManagement";

import UserAccount from "./pages/user_management/UserAccount";
import UserRole from "./pages/user_management/UserRole";
import ModuleManagement from "./pages/user_management/ModuleManagement";
import MenuManagement from "./pages/user_management/MenuManagement";

// Account Title
import AccTDepartment from "./pages/setup/AccTDepartment";
import AccTLocation from "./pages/setup/AccTLocation";
import AccTAccount from "./pages/setup/AccTAccount";
import ImportPage from "./ImportPage";
import ImportPO from "./pages/import/ImportPO";
import ReceivingModule from "./ReceivingModule";
import WarehouseReceiving from "./pages/receiving/WarehouseReceiving";
import CancelledPO from "./pages/receiving/CancelledPO";
import ReceivedMaterials from "./pages/receiving/ReceivedMaterials";
import ApprovalRejectMaterials from "./pages/receiving/ApprovalRejectMaterials";
import WarehouseConfirmReject from "./pages/receiving/WarehouseConfirmReject";
import ItemSubCategory from "./pages/setup/ItemSubCategory";
import OrderingPage from "./OrderingPage";
import Orders from "./pages/ordering/orders/Orders";
import ImportOrder from "./pages/import/import_orders/ImportOrder";
import PreparationSchedule from "./pages/ordering/preparation_schedule/PreparationSchedule";
import ApprovalPage from "./pages/ordering/approval/ApprovalPage";
import CalendarPage from "./pages/ordering/calendar/CalendarPage";
import InventoryPage from "./InventoryPage";
import MoveOrderPage from "./MoveOrderPage";
import MoveOrder from "./pages/inventory/MoveOrder";
import ForApprovalMo from "./pages/move_order/forapprovalmo/ForApprovalMo";
import MrpPage from "./pages/inventory/mrp/MrpPage";
import ApprovedMoPage from "./pages/move_order/approvedmo/ApprovedMoPage";
import RejectMoveOrder from "./pages/move_order/reject_moveorder/RejectMoveOrder";
import TransactMoveOrderPage from "./pages/move_order/transact_moveorder/TransactMoveOrderPage";
import MiscellaneousTransactions from "./MiscellaneousTransactions";
import MiscReceiptPage from "./pages/misc_transactions/misc_receipt/MiscReceiptPage";
import MiscIssuePage from "./pages/misc_transactions/misc_issue/MiscIssuePage";
import { useEffect } from "react";
import { FcHighPriority } from "react-icons/fc";
import BorrowedTransactionPage from "./BorrowedTransactionPage";
import BorrowedMaterialsPage from "./pages/borrowed_transaction/BorrowedMaterialsPage";
import ReportsPage from "./ReportsPage";
import Reports from "./pages/reports/Reports";
import SupplierNew from "./pages/setup/suppliers_new/SupplierNew";
import CustomerNew from "./pages/setup/customer_new/CustomerNew";
import TransactionType from "./pages/setup/TransactionType";
import AddBorrowedMaterials from "./pages/borrowed_transaction/borrowed_new/addborrowed_materials/AddBorrowedMaterials";
import { PendingBorrowedMaterials } from "./pages/borrowed_transaction/borrowed_new/pending_borrowed/PendingBorrowedMaterials";
import ForApprovalBorrowedMaterials from "./pages/borrowed_transaction/borrowed_new/forapproval_borrowed/ForApprovalBorrowedMaterials";
import { ApprovedBorrowedMaterials } from "./pages/borrowed_transaction/borrowed_new/approved_borrowed/ApprovedBorrowedMaterials";
import ReturnedApproval from "./pages/borrowed_transaction/borrowed_new/return_approval/ReturnedApproval";
import ApprovedReturned from "./pages/borrowed_transaction/borrowed_new/approved_returned/ApprovedReturned";
import HistoryReturned from "./pages/borrowed_transaction/borrowed_new/history_returned/HistoryReturned";
import RejectBorrowed from "./pages/borrowed_transaction/reject_borrowed/RejectBorrowed";
import NewPrepSched from "./pages/ordering/a_ordering_new/prepar/NewPrepSched";
import PendingReturned from "./pages/borrowed_transaction/borrowed_new/pending_returned/PendingReturned";
import AddRequest from "./pages/borrowed_transaction/borrowed_v2/view_request/ViewRequest";
import ViewRequest from "./pages/borrowed_transaction/borrowed_v2/view_request/ViewRequest";
import ApproverBorrowedApproval from "./pages/borrowed_transaction/borrowed_v2/approver_borrowedapproval/ApproverBorrowedApproval";
import ViewReturnMaterialsCustomer from "./pages/borrowed_transaction/borrowed_v2/viewreturn_materials_customer/ViewReturnMaterialsCustomer";
import ReturnRequestsApprover from "./pages/borrowed_transaction/borrowed_v2/approver_returnrequests/ReturnRequestsApprover";
import ImportMaterials from "./pages/import/import_materials/ImportMaterials";
import ImportUsers from "./pages/import/import_users/ImportUsers";
import Sample from "./pages/setup/Sample";

const currentUser = decodeUser();
const employeeId = currentUser?.id;

const fetchNotificationApi = async () => {
  const res = await request.get(`Notification/GetNotification`);
  return res.data;
};

const fetchNotificationParamsApi = async () => {
  const res = await request.get(
    `Notification/GetNotificationWithParameters?empid=${employeeId}`
  );
  return res.data;
};

const App = () => {
  // const [employeeId, setEmployeeId] = useState("");
  const [notificationWithParams, setNotificationWithParams] = useState([]);
  const [menu, setMenu] = useState(null);
  const user = decodeUser();

  //Miscellaneous Issue Fetch and Cancel Feature
  const [miscData, setMiscData] = useState([]);
  const [navigation, setNavigation] = useState("");

  //Borrowed Mats Fetch and Cancel Feature
  const [borrowedData, setBorrowedData] = useState([]);
  const [borrowedNav, setBorrowedNav] = useState(1);

  //Consume Fetch and Cancel Feature
  const [consumeData, setConsumeData] = useState([]);
  const [consumeNav, setConsumeNav] = useState(1);

  const [notification, setNotification] = useState([]);

  const fetchNotification = () => {
    fetchNotificationApi().then((res) => {
      setNotification(res);
    });
  };

  useEffect(() => {
    fetchNotification();

    return () => {
      setNotification([]);
    };
  }, []);

  const fetchNotificationWithParams = () => {
    fetchNotificationParamsApi().then((res) => {
      setNotificationWithParams(res);
    });
  };

  useEffect(() => {
    fetchNotificationWithParams();

    return () => {
      setNotificationWithParams([]);
    };
  }, []);

  // console.log(notification?.borrowedApproval?.forborrowedApprovalcount);

  //Get Added Misc Issues per Item
  const userId = user?.id;
  const fetchActiveMiscIssuesApi = async (userId) => {
    const res = await request.get(
      `Miscellaneous/GetAllActiveMiscellaneousIssueTransaction?empId=${userId}`
    );
    return res.data;
  };

  //Get Added Borrowed per Item
  const borrowedUserId = user?.id;
  const fetchActiveBorrowedApi = async (borrowedUserId) => {
    const res = await request.get(
      `Borrowed/GetAllActiveBorrowedIssueTransaction?empId=${borrowedUserId}`
    );
    return res.data;
  };

  //Misc Issue Data
  const fetchActiveMiscIssues = () => {
    fetchActiveMiscIssuesApi(userId).then((res) => {
      setMiscData(res);
    });
  };
  useEffect(() => {
    fetchActiveMiscIssues();

    return () => {
      setMiscData([]);
    };
  }, [userId]);

  //Misc Borrowed Data
  const fetchActiveBorrowed = () => {
    fetchActiveBorrowedApi(borrowedUserId).then((res) => {
      setBorrowedData(res);
    });
  };
  useEffect(() => {
    fetchActiveBorrowed();

    return () => {
      setBorrowedData([]);
    };
  }, [borrowedUserId]);

  // console.log(user)
  // Open modal to cancel all ID on table if re-routed without saving
  const {
    isOpen: isArrayCancel,
    onClose: closeArrayCancel,
    onOpen: openArrayCancel,
  } = useDisclosure();
  const path = useLocation();
  const pathMiscIssue = "/miscellaneous/misc-issue";
  useEffect(() => {
    if (path.pathname !== pathMiscIssue && miscData?.length > 0) {
      openArrayCancel();
    }
  }, [path.pathname !== pathMiscIssue]);

  // Open modal to cancel all ID on table if re-routed without saving (Borrowed Transaction)
  const {
    isOpen: isArrayBorrowedCancel,
    onClose: closeArrayBorrowedCancel,
    onOpen: openArrayBorrowedCancel,
  } = useDisclosure();
  const pathBorrowed = useLocation();
  const pathBorrowedMats = "/borrowed/borrowed-materials";
  useEffect(() => {
    if (
      pathBorrowed.pathname !== pathBorrowedMats &&
      borrowedData?.length > 0
    ) {
      openArrayBorrowedCancel();
    }
  }, [pathBorrowed.pathname !== pathBorrowedMats]);

  //Fetch Notif every 40s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotification();
    }, 41000);

    return () => clearInterval(interval);
  }, []);

  // console.log(notification);
  // console.log(notificationWithParams);

  return (
    <Context.Provider value={{ menu, setMenu }}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={<ProtectedRoutes />}
          notification={notification}
          fetchNotification={fetchNotification}
        >
          <Route
            path="/"
            element={
              <MainContainer
                notification={notification}
                fetchNotification={fetchNotification}
                notificationWithParams={notificationWithParams}
                fetchNotificationWithParams={fetchNotificationWithParams}
              />
            }
          >
            {/* SETUP */}
            <Route
              path="/setup"
              element={
                <SetupManagementPage
                  notification={notification}
                  fetchNotification={fetchNotification}
                />
              }
            >
              <Route path="/setup/uom" element={<UomManagement />} />
              <Route
                path="/setup/materials"
                element={<MaterialsManagement />}
              />
              <Route path="/setup/item-category" element={<ItemCategory />} />
              <Route
                path="/setup/accounttitle-item"
                element={<ItemSubCategory />}
              />
              <Route path="/setup/suppliers" element={<SupplierNew />} />
              <Route path="/setup/customers" element={<CustomerNew />} />
              <Route path="/setup/customer-type" element={<CustomerType />} />
              <Route path="/setup/lot-name" element={<LotManagement />} />
              <Route path="/setup/lot-section" element={<LotCategory />} />
              <Route path="/setup/reasons" element={<ReasonManagement />} />
              <Route
                path="/setup/transaction-type"
                element={<TransactionType />}
              />
              <Route
                path="/setup/account_title-company"
                element={<CompanyManagement />}
              />
              <Route
                path="/setup/account_title-department"
                element={<AccTDepartment />}
              />
              <Route
                path="/setup/account_title-location"
                element={<AccTLocation />}
              />
              <Route
                path="/setup/account_title-account"
                element={<AccTAccount />}
              />
            </Route>

            {/* USER */}
            <Route
              path="/user"
              element={
                <UserManagementPage
                  notification={notification}
                  fetchNotification={fetchNotification}
                />
              }
            >
              <Route path="/user/user-account" element={<UserAccount />} />
              <Route path="/user/user-role" element={<UserRole />} />
              <Route
                path="/user/module-management"
                element={<ModuleManagement />}
              />
              <Route
                path="/user/menu-management"
                element={<MenuManagement />}
              />
              <Route path="/user/sample" element={<Sample />} />
            </Route>

            {/* IMPORT */}
            <Route
              path="/import"
              element={
                <ImportPage
                  notification={notification}
                  fetchNotification={fetchNotification}
                />
              }
            >
              <Route path="/import/import-po" element={<ImportPO />} />
              <Route path="/import/import-order" element={<ImportOrder />} />
              <Route
                path="/import/import-materials"
                element={<ImportMaterials />}
              />
              <Route path="/import/import-users" element={<ImportUsers />} />
            </Route>

            {/* RECEIVING */}
            <Route
              path="/receiving"
              element={
                <ReceivingModule
                  notification={notification}
                  fetchNotification={fetchNotification}
                />
              }
            >
              <Route
                path="/receiving/warehouse-receiving"
                element={<WarehouseReceiving />}
                notification={notification}
                fetchNotification={fetchNotification}
              />
              <Route path="/receiving/cancelled-po" element={<CancelledPO />} />
              <Route
                path="/receiving/received-materials"
                element={<ReceivedMaterials />}
              />
              <Route
                path="/receiving/approval-rejectmaterials"
                element={<ApprovalRejectMaterials />}
              />
              <Route
                path="/receiving/warehouse-confirmreject"
                element={<WarehouseConfirmReject />}
              />
            </Route>

            {/* ORDERING */}
            <Route
              path="/ordering"
              element={<OrderingPage />}
              notification={notification}
              fetchNotification={fetchNotification}
            >
              <Route
                path="/ordering/orders"
                element={<Orders />}
                notification={notification}
                fetchNotification={fetchNotification}
              />
              <Route
                path="/ordering/preparation"
                element={
                  <NewPrepSched
                    notification={notification}
                    fetchNotification={fetchNotification}
                  />
                }
              />
              <Route
                path="/ordering/approval"
                element={
                  <ApprovalPage
                    notification={notification}
                    fetchNotification={fetchNotification}
                  />
                }
              />
              <Route path="/ordering/calendar" element={<CalendarPage />} />
            </Route>

            {/* INVENTORY */}
            <Route
              path="/inventory"
              element={
                <InventoryPage
                  notification={notification}
                  fetchNotification={fetchNotification}
                />
              }
            >
              <Route path="/inventory/mrp" element={<MrpPage />} />
            </Route>

            {/* MOVE ORDER */}
            <Route
              path="/move-order"
              element={<MoveOrderPage />}
              notification={notification}
              fetchNotification={fetchNotification}
            >
              <Route
                path="/move-order/mo-issue"
                element={
                  <MoveOrder
                    notification={notification}
                    fetchNotification={fetchNotification}
                  />
                }
              />
              <Route
                path="/move-order/forapprovalmo"
                element={
                  <ForApprovalMo
                    notification={notification}
                    fetchNotification={fetchNotification}
                  />
                }
              />
              <Route
                path="/move-order/approved-mo"
                element={<ApprovedMoPage />}
              />
              <Route
                path="/move-order/reject-mo"
                element={<RejectMoveOrder />}
              />
              <Route
                path="/move-order/transact-moveorder"
                element={
                  <TransactMoveOrderPage
                    notification={notification}
                    fetchNotification={fetchNotification}
                  />
                }
              />
            </Route>

            {/* MISCELLANEOUS */}
            <Route
              path="/miscellaneous"
              element={
                <MiscellaneousTransactions
                  notification={notification}
                  fetchNotification={fetchNotification}
                />
              }
            >
              <Route
                path="/miscellaneous/misc-receipt"
                element={<MiscReceiptPage />}
              />
              <Route
                path="/miscellaneous/misc-issue"
                element={
                  user ? (
                    <MiscIssuePage
                      miscData={miscData}
                      fetchActiveMiscIssues={fetchActiveMiscIssues}
                      navigation={navigation}
                      setNavigation={setNavigation}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Route>

            {/* BORROWED MATERIALS */}
            <Route
              path="/borrowed"
              element={<BorrowedTransactionPage />}
              notification={notification}
              fetchNotification={fetchNotification}
            >
              <Route
                path="/borrowed/borrowed-materials"
                element={
                  user ? (
                    <BorrowedMaterialsPage
                      borrowedData={borrowedData}
                      fetchActiveBorrowed={fetchActiveBorrowed}
                      borrowedNav={borrowedNav}
                      setBorrowedNav={setBorrowedNav}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/borrowed/addborrowed-materials"
                element={
                  user ? (
                    <AddBorrowedMaterials
                      borrowedData={borrowedData}
                      fetchActiveBorrowed={fetchActiveBorrowed}
                      borrowedNav={borrowedNav}
                      setBorrowedNav={setBorrowedNav}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/borrowed/pending-materials"
                element={
                  user ? <PendingBorrowedMaterials /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/borrowed/approval"
                element={
                  user ? (
                    <ForApprovalBorrowedMaterials />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/borrowed/pending-returned"
                element={user ? <PendingReturned /> : <Navigate to="/login" />}
              />

              <Route
                path="/borrowed/approved-borrowed"
                element={
                  user ? (
                    <ApprovedBorrowedMaterials />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/borrowed/return-approval"
                element={user ? <ReturnedApproval /> : <Navigate to="/login" />}
              />

              <Route
                path="/borrowed/approved-returned"
                element={user ? <ApprovedReturned /> : <Navigate to="/login" />}
              />

              <Route
                path="/borrowed/borrowed-history"
                element={user ? <HistoryReturned /> : <Navigate to="/login" />}
              />

              <Route
                path="/borrowed/reject-borrowed"
                element={user ? <RejectBorrowed /> : <Navigate to="/login" />}
              />

              <Route
                path="/borrowed/view-request"
                element={
                  user ? (
                    <ViewRequest
                      notificationWithParams={notificationWithParams}
                      fetchNotificationWithParams={fetchNotificationWithParams}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/borrowed/borrowed-requests"
                element={
                  user ? (
                    <ApproverBorrowedApproval
                      notification={notification}
                      fetchNotification={fetchNotification}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/borrowed/return-materials"
                element={
                  user ? (
                    <ViewReturnMaterialsCustomer
                      notificationWithParams={notificationWithParams}
                      fetchNotificationWithParams={fetchNotificationWithParams}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/borrowed/returned-requests"
                element={
                  user ? (
                    <ReturnRequestsApprover
                      notification={notification}
                      fetchNotification={fetchNotification}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Route>

            {/* REPORTS */}
            <Route
              path="/reports"
              element={
                <ReportsPage
                  notification={notification}
                  fetchNotification={fetchNotification}
                />
              }
            >
              <Route path="/reports/report-details" element={<Reports />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>

      {isArrayCancel && (
        <CancelArrayModalConfirmation
          isOpen={isArrayCancel}
          onClose={closeArrayCancel}
          miscData={miscData}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          setNavigation={setNavigation}
        />
      )}

      {isArrayBorrowedCancel && (
        <CancelBorrowedArrayModalConfirmation
          isOpen={isArrayBorrowedCancel}
          onClose={closeArrayBorrowedCancel}
          borrowedData={borrowedData}
          fetchActiveBorrowed={fetchActiveBorrowed}
          setBorrowedNav={setBorrowedNav}
        />
      )}
    </Context.Provider>
  );
};

export default App;

//Misc Issue Cancel Array
const CancelArrayModalConfirmation = ({
  isOpen,
  onClose,
  miscData,
  fetchActiveMiscIssues,
  setNavigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const cancelArraySubmitHandler = () => {
    setIsLoading(true);
    try {
      const cancelArray = miscData?.map((item) => {
        return {
          id: item.id,
        };
      });
      const res = request
        .put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, cancelArray)
        .then((res) => {
          ToastComponent(
            "Warning",
            "Items has been cancelled",
            "success",
            toast
          );
          fetchActiveMiscIssues();
          onClose();
        })
        .catch((err) => {
          // ToastComponent("Error", "Item was not cancelled", "Error", toast)
        });
    } catch (error) {}
  };

  const noHandler = () => {
    setNavigation(1);
    navigate("/miscellaneous/misc-issue");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.50" pt={10} pb={5}>
        <ModalHeader>
          <VStack justifyContent="center">
            <FcHighPriority fontSize="50px" />
            <Text color="warning" textAlign="center" fontSize="lg">
              [Warning]
            </Text>
            <Text color="warning" textAlign="center" fontSize="sm">
              [Miscellaneous Issue]
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={noHandler} />

        <ModalBody mb={5}>
          <VStack spacing={0}>
            <Text textAlign="center" fontSize="sm">
              Your created lists will be cancelled.
            </Text>
            <Text textAlign="center" fontSize="xs">
              Are you sure you want to leave this page?
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="sm"
              onClick={cancelArraySubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              size="sm"
              onClick={noHandler}
              isLoading={isLoading}
              colorScheme="blackAlpha"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

//Borrowed Cancel Array
const CancelBorrowedArrayModalConfirmation = ({
  isOpen,
  onClose,
  borrowedData,
  fetchActiveBorrowed,
  setBorrowedNav,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigateBorrowed = useNavigate();

  const cancelArraySubmitHandler = () => {
    setIsLoading(true);
    try {
      const cancelArray = borrowedData?.map((item) => {
        return {
          id: item.id,
        };
      });
      const res = request
        .put(`Borrowed/CancelItemForTransactBorrow`, cancelArray)
        .then((res) => {
          ToastComponent(
            "Warning",
            "Items has been cancelled",
            "success",
            toast
          );
          fetchActiveBorrowed();
          onClose();
        })
        .catch((err) => {
          // ToastComponent("Error", "Item was not cancelled", "Error", toast)
        });
    } catch (error) {}
  };

  const noHandlerBorrowed = () => {
    // setBorrowedNav(1);
    navigateBorrowed("/borrowed/addborrowed-materials");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.50" pt={10} pb={5}>
        <ModalHeader>
          <VStack justifyContent="center">
            <FcHighPriority fontSize="50px" />
            <Text color="warning" textAlign="center" fontSize="lg">
              [Warning]
            </Text>
            <Text color="warning" textAlign="center" fontSize="sm">
              [Borrowed Materials]
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={noHandlerBorrowed} />

        <ModalBody mb={5}>
          <VStack spacing={0}>
            <Text textAlign="center" fontSize="sm">
              Your created lists will be cancelled.
            </Text>
            <Text textAlign="center" fontSize="xs">
              Are you sure you want to leave this page?
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="sm"
              onClick={cancelArraySubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              size="sm"
              onClick={noHandlerBorrowed}
              isLoading={isLoading}
              colorScheme="blackAlpha"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
