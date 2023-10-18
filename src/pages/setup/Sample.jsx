import { Button, Flex } from "@chakra-ui/react";
import React from "react";

const Sample = () => {
  const names = ["Ichiban", "Borris", "Vega", "Patwerk", "Jaypeeow"];

  const result = names.filter((name) => name.length > 6);

  console.log(result);

  return (
    <Flex w="full">
      {/* <Button fontWeight="normal" onClick={resultHandler}>
        Show result
      </Button> */}
    </Flex>
  );
};

export default Sample;
