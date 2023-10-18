import { Button, Flex, Heading, Icon } from "@chakra-ui/react";
import React from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import PageNotFound from "../../src/assets/PageNotFound.json";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Flex
      w="full"
      h="auto"
      alignItems="center"
      justifyContent="center"
      bg="form"
      flexDirection="column"
      // spacing={0}
      gap={0}
      // spacing={1}
    >
      {/* <Icon
        as={BsExclamationTriangleFill}
        boxSize="80px"
        // fontSize="lg"
        // w={8}
        // h={8}
        color="red.500"
      />
      <Heading color="gray.600">PAGE NOT FOUND!</Heading> */}
      <Lottie
        mb={5}
        style={{ width: "full", height: "700px", padding: 0 }}
        animationData={PageNotFound}
      />
      <Button
        mb={5}
        w="15%"
        size="sm"
        fontSize="13px"
        colorScheme="blue.300"
        variant="outline"
        _hover={{ bg: "primary", color: "white" }}
        onClick={() => {
          navigate("/login");
        }}
      >
        Back to login
      </Button>
    </Flex>
  );
};

export default ErrorPage;
