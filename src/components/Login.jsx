import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import request from "../services/ApiClient";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { ToastComponent } from "./Toast";
import { saltKey } from "../saltkey";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { BiUser } from "react-icons/bi";
import { CheckIcon } from "@chakra-ui/icons";
import backgroundImage from "../assets/img/svg-login.svg";
import backgroundImage1 from "../assets/img/svg-login1.svg";
import backgroundImage2 from "../assets/img/svg-login2.svg";
import misLogo from "../assets/img/misLogo.png";
import bgWarehouseImage from "../assets/img/warehouse-qls-camdon.jpg";

const schema = yup.object().shape({
  formData: yup.object().shape({
    oldPassword: yup.string().required("Old Password is required"),
    newPassword: yup.string().required("New Password is required"),
    confirmPassword: yup.string().required("Confirm Password is required"),
  }),
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  var navigate = useNavigate();
  var [Loader, setLoader] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [modalUsername, setModalUsername] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    },
  });

  const submitHandler = async (event, user) => {
    event.preventDefault();

    var login = { username, password };

    if ((username || password) === "") {
      return ToastComponent(
        "Login Error",
        "Username and Password is required!",
        "error",
        toast
      );
    } else if ((username && password) === "") {
      return ToastComponent(
        "Login Error",
        "Please fill up username or password!",
        "error",
        toast
      );
    } else {
      setLoader(true);
      var response = await request
        .post("Login/authenticate", login)
        .then((response) => {
          if (response?.data?.userName === response?.data?.password) {
            setShowChangePasswordModal(true);
            setModalUsername(username);
            // setPassword("");
          } else {
            var ciphertext = CryptoJS.AES.encrypt(
              JSON.stringify(response?.data),
              saltKey
            ).toString();
            sessionStorage.setItem("userToken", ciphertext);
            setLoader(false);
            navigate("/");
            window.location.reload(false);
            ToastComponent(
              "Login Success",
              `Welcome to Elixir ETD! ${response?.data.fullName}`,
              "success",
              toast
            );
          }
        })
        .catch((err) => {
          ToastComponent("Login", err.response.data.message, "error", toast);
          setLoader(false);
        });
    }
  };

  const handleChangePassword = async () => {
    console.log(username);

    try {
      const changePasswordData = {
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      };
      const response = await request.post(
        "Login/changepassword",
        changePasswordData
      );
      console.log("Before resetting:", username, password);
      setUsername("");
      setPassword("");
      // console.log("After resetting:", username, password);
      setShowChangePasswordModal(false);
      setLoader(false);
      ToastComponent("Success!", `Password Changed`, "success", toast);
      setInterval(window.location.reload(false), 1000);
    } catch (err) {
      // console.log(err);
      ToastComponent("Error", err.response.data, "error", toast);
    }
  };

  // useEffect(() => {}, [username, password]);

  console.log(username);
  console.log(password);

  const closeHandler = () => {
    setShowChangePasswordModal(false);
    setLoader(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Flex
      h="100vh"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundImage: `url(${backgroundImage2})`,
        backgroundSize: "cover", // Adjust this property to control how the image is scaled
        backgroundRepeat: "no-repeat",
      }}
      flexDirection="column"
      position="relative"
    >
      {/* <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        style={{
          backgroundImage: `url(${bgWarehouseImage})`,
          backgroundSize: "cover",
        }}
        opacity="0.5"
      ></Box>

      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        backgroundColor="#000"
        opacity="0.5"
      ></Box> */}

      <Box
        zIndex="1"
        w={["full", "sm"]}
        p={[8, 8]}
        mt={[20, "10vh"]}
        mx="auto"
        borderRadius={10}
        alignItems="center"
        justifyContent="center"
        className="form-color"
        // boxShadow="lg"
        // opacity="0.9"
      >
        <VStack spacing={8} align="flex-start" w="full">
          <VStack spacing={-1} align={["flex", "center"]} w="full">
            <Image
              boxSize="100px"
              objectFit="fill"
              src="/images/elixirlogos.png"
              alt="etheriumlogo"
            />
            <Heading fontSize="3xl" className="logo-text">
              Elixir ETD
            </Heading>
          </VStack>

          <Flex flexDirection="column" w="full">
            <form onSubmit={submitHandler}>
              <Text color="#fff" fontSize="13px">
                Username
              </Text>
              <Input
                placeholder="Enter username"
                rounded="none"
                variant="outline"
                borderColor="whiteAlpha.300"
                fontSize="xs"
                color="#fff"
                _hover={{ bg: "#1A202C" }}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <Text color="#fff" fontSize="13px">
                Password
              </Text>
              <Input
                placeholder="Enter password"
                rounded="none"
                variant="outline"
                type="password"
                color="#fff"
                borderColor="whiteAlpha.300"
                _hover={{ bg: "#1A202C" }}
                fontSize="xs"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <Button
                borderRadius="none"
                color="white"
                fontSize="13px"
                type="submit"
                className="login-button-gradient"
                // colorScheme="blue"
                w="full"
                mt={5}
                isLoading={Loader}
                disabled={!username || !password}
              >
                Login
              </Button>
            </form>
          </Flex>
        </VStack>
      </Box>

      <Box
        zIndex="1"
        // sx={boxLogoStyle}
        borderRadius="10px 0 0 10px"
        mt={1}
        flexDirection="column"
        display="flex"
        justifyContent="center"
        // opacity="0.5"
      >
        <Box justifyContent="center" display="flex">
          <img
            src={misLogo}
            alt="logo"
            loading="lazy"
            style={{ width: "10%", height: "100%" }}
          />
        </Box>
        <Text fontSize="10px" color="white" textAlign="center">
          &#169; 2023 Powered by <br /> Management Information System
        </Text>
      </Box>

      <Modal isOpen={showChangePasswordModal} onClose={closeHandler} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton onClose={closeHandler} />
          <ModalHeader>Change Password</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Old Password</FormLabel>
              <Input
                {...register("formData.oldPassword")}
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  {...register("formData.newPassword")}
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordsMatch(e.target.value === confirmPassword);
                  }}
                />
                {passwordsMatch && newPassword && (
                  <InputRightElement>
                    <CheckIcon color="green.500" />
                  </InputRightElement>
                )}
              </InputGroup>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordsMatch(e.target.value === newPassword);
                  }}
                />
                {passwordsMatch && newPassword && (
                  <InputRightElement>
                    <CheckIcon color="green.500" />
                  </InputRightElement>
                )}
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              isDisabled={!passwordsMatch || (!newPassword && !confirmPassword)}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Login;

// import {
//   Box,
//   Button,
//   Flex,
//   Heading,
//   Image,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Text,
//   VStack,
//   useDisclosure,
//   useToast,
// } from "@chakra-ui/react";
// import React, { useState } from "react";
// import request from "../services/ApiClient";
// import { useNavigate } from "react-router-dom";
// import CryptoJS from "crypto-js";

// //Toast
// import { ToastComponent } from "./Toast";
// import { saltKey } from "../saltkey";
// import { VscEye, VscEyeClosed } from "react-icons/vsc";

// const Login = () => {
//   var [username, setUsername] = useState("");
//   var [password, setPassword] = useState("");
//   var navigate = useNavigate();
//   var [Loader, setLoader] = useState(false);
//   const toast = useToast();
//   // const user = decodeUser()
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const submitHandler = async (event, user) => {
//     event.preventDefault();

//     var login = { username, password };

//     if ((username || password) === "") {
//       return ToastComponent(
//         "Login Error",
//         "Username and Password is required!",
//         "error",
//         toast
//       );
//     } else if ((username && password) === "") {
//       return ToastComponent(
//         "Login Error",
//         "Please fill up username or password!",
//         "error",
//         toast
//       );
//     } else {
//       setLoader(true);
//       var response = await request
//         .post("Login/authenticate", login)
//         .then((response) => {
//           var ciphertext = CryptoJS.AES.encrypt(
//             JSON.stringify(response?.data),
//             saltKey
//           ).toString();
//           sessionStorage.setItem("userToken", ciphertext);
//           setLoader(false);
//           navigate("/");
//           window.location.reload(false);
//           ToastComponent(
//             "Login Success",
//             `Welcome to Elixir ETD! ${response?.data.fullName}`,
//             "success",
//             toast
//           );
//         })
//         .catch((err) => {
//           ToastComponent("Login", err.response.data.message, "error", toast);
//           setLoader(false);
//         });
//     }
//   };

//   return (
//     <Flex h="100vh" justifyContent="center" alignItems="center" bg="background">
//       <Box
//         w={["full", "sm"]}
//         p={[8, 8]}
//         mt={[20, "10vh"]}
//         mx="auto"
//         borderRadius={10}
//         alignItems="center"
//         justifyContent="center"
//         className="form-color"
//         boxShadow="lg"
//       >
//         <VStack spacing={8} align="flex-start" w="full">
//           <VStack spacing={-1} align={["flex", "center"]} w="full">
//             <Image
//               boxSize="100px"
//               objectFit="fill"
//               src="/images/elixirlogos.png"
//               alt="etheriumlogo"
//             />
//             <Heading fontSize="3xl" className="logo-text">
//               Elixir ETD
//             </Heading>
//           </VStack>

//           <Flex flexDirection="column" w="full">
//             <form onSubmit={submitHandler}>
//               <Text color="#fff" fontSize="13px">
//                 Username
//               </Text>
//               <Input
//                 placeholder="Enter username"
//                 rounded="none"
//                 variant="outline"
//                 borderColor="whiteAlpha.300"
//                 fontSize="xs"
//                 color="#fff"
//                 // bg="#1A202C"
//                 _hover={{ bg: "#1A202C" }}
//                 onChange={(event) => {
//                   setUsername(event.target.value);
//                 }}
//               />
//               <Text color="#fff" fontSize="13px">
//                 Password
//               </Text>
//               <Input
//                 placeholder="Enter password"
//                 rounded="none"
//                 variant="outline"
//                 type="password"
//                 color="#fff"
//                 borderColor="whiteAlpha.300"
//                 // bg="#1A202C"
//                 _hover={{ bg: "#1A202C" }}
//                 fontSize="xs"
//                 onChange={(event) => {
//                   setPassword(event.target.value);
//                 }}
//               />
//               <Button
//                 borderRadius="none"
//                 fontSize="13px"
//                 type="submit"
//                 colorScheme="blue"
//                 w="full"
//                 mt={5}
//                 isLoading={Loader}
//                 disabled={!username || !password}
//               >
//                 Login
//               </Button>

//               {/* {<ModalChangePassword isOpen={isOpen} onClose={onClose} />} */}
//             </form>
//           </Flex>
//         </VStack>
//       </Box>
//     </Flex>
//   );
// };

// export default Login;
