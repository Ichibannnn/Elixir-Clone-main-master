import {
  Flex,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  MenuGroup,
  Badge,
} from "@chakra-ui/react";
import { RiLogoutBoxLine, RiUser3Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { decodeUser } from "../services/decode-user";

const Header = ({ toggleSidebar }) => {
  const user = decodeUser();
  var navigate = useNavigate();

  // console.log(user);

  const logoutHandler = () => {
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <Flex
      h="40px"
      bgColor="primary"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <Flex>
        <GiHamburgerMenu
          color="#D1D2D5"
          cursor="pointer"
          w="40%"
          onClick={() => toggleSidebar()}
        />
      </Flex>

      <Flex>
        <Menu>
          <MenuButton mr={2} mt={1} alignItems="center" justifyContent="center">
            {/* <Image
              mt={1.5}
              boxSize="33px"
              objectFit="cover"
              src="/images/user.png"
              alt="lot"
            /> */}
            <FaUserCircle color="#D1D2D5" fontSize="25px" />
          </MenuButton>
          <MenuList zIndex={2}>
            <MenuGroup title="Profile:" />
            <MenuDivider />
            <MenuItem icon={<RiUser3Fill fontSize="17px" />}>
              <Text fontSize="15px">{`${user && user?.fullName}`}</Text>
            </MenuItem>
            <MenuItem
              icon={<RiLogoutBoxLine fontSize="17px" />}
              onClick={logoutHandler}
            >
              <Text fontSize="15px" _hover={{ color: "red" }}>
                Logout
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
        <Box mt={2}>
          {/* <Text fontSize="9px" fontWeight="semibold" color="white">
            Fresh Morning!,
          </Text> */}
          <Text fontSize="9px" fontWeight="semibold" color="white">
            {`${user && user?.fullName}`}
          </Text>
          <Badge
            mb={3}
            textAlign="left"
            fontSize="9px"
            colorScheme="green"
            // className="inputLowerCase"
          >
            {`${user && user?.roleName}`}
          </Badge>
          {/* <Text fontSize="sm">UI Engineer</Text> */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Header;
