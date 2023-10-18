import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from './context/Context'

const Navbar = () => {
  var navigate = useNavigate()
  const { pathname } = useLocation()

  const { menu } = useContext(Context)

  console.log(menu)

  return (
    <Flex bg="secondary" h="37px" p={1} alignItems="center" boxShadow="sm">
      {/* Navbar Submenu */}
      {menu?.map((navbar, i) => (
        <Button
          key={i}
          bgColor={pathname.includes(navbar.path) ? 'buttonColor' : 'secondary'}
          onClick={() => navigate(navbar.path)}
          _hover={{ bg: '#616161' }}
          borderRadius="0%"
          size="sm"
        >
          <Text className="font" color="#ffff">
            {navbar.title}
          </Text>
        </Button>
      ))}
    </Flex>
  )
}

export default Navbar
