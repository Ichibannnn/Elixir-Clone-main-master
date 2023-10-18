import { Box, Button, Flex, HStack, Image, Text } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sidebarData } from '../SidebarData'

import { Context } from './context/Context'
import request from '../services/ApiClient'
import { decodeUser } from '../services/decode-user'

const currentUser = decodeUser()

const fetchTagModuleApi = async () => {
  const currentSelectedRole = currentUser?.role
  const res = await request.get(
    `Role/GetRoleModuleWithId/${currentSelectedRole}`,
  )
  console.log(res.data)
  return res.data
}

// console.log(currentUser?.role)

//Header
const SidebarHeader = () => {
  return (
    <Flex
      h="150px"
      flexDirection="column"
      alignItems="center"
      gap={1}
      mt={3}
      pt={2}
    >
      <Image
        boxSize="100px"
        objectFit="cover"
        src="/images/elixirlogos.png"
        alt="etheriumlogo"
        mt={1}
      />
      <Text className="logo-title" color="#D1D2D5" mt={-1}>
        ELIXIR ETD
      </Text>
    </Flex>
  )
}

//Footer
const SidebarFooter = () => {
  return (
    <Flex h="40px" fontSize="10px" textAlign="center" p={2}>
      © 2022, Elixir ETD Powered by Process Automation (MIS)
    </Flex>
  )
}

//ListMenu
const SidebarListMenu = () => {
  const { pathname } = useLocation()
  const [tagModules, setTagModules] = useState([])
  const { setMenu } = useContext(Context)

  const fetchTagged = () => {
    fetchTagModuleApi(tagModules).then((res) => {
      const unique = []
      const map = new Map()
      for (const item of res) {
        if (!map.has(item.mainMenuId)) {
          map.set(item.mainMenuId, true)
          const submenu = res.filter(
            (s) =>
              s.mainMenuId === item.mainMenuId && s.subMenu !== item.mainMenu,
          )
          unique.push({
            mainMenuId: item.mainMenuId,
            mainMenu: item.mainMenu,
            path: item.menuPath,
            subMenu: submenu.map((sub) => {
              return {
                title: sub.subMenu,
                path: sub.moduleName,
              }
            }),
          })
        }
      }
      setTagModules(unique)
    })
  }

  console.log(tagModules)

  useEffect(() => {
    fetchTagged()

    return () => {
      setTagModules([])
    }
  }, [])

  const selectedMenuHandler = (data) => {
    setMenu(data)
  }

  return (
    <Flex flexDirection="column" flex={1}>
      {tagModules?.map((modName) => (
        <Link to={modName.path} key={modName.mainMenuId}>
          <Box
            fontSize="11px"
            // fontColor="fontColor"
            fontWeight="medium"
            onClick={() => selectedMenuHandler(modName.subMenu)}
            p={2}
            cursor="pointer"
            _hover={{ bg: 'buttonColor' }}
            _focus={{ bg: 'buttonColor' }}
            w="full"
            bgColor="primary"
          >
            <HStack justifyContent="space-between">
              <Text color="white" pl={1}>
                {modName.mainMenu}
              </Text>
            </HStack>
          </Box>
        </Link>
      ))}
    </Flex>
  )
}

const Sidebar = () => {
  return (
    <Flex h="100vh" w="240px" bg="primary" color="#D1D2D5" boxShadow="md">
      <Flex flexDirection="column">
        <SidebarHeader />
        <SidebarListMenu />
        <SidebarFooter />
      </Flex>
    </Flex>

    // <div>Sidebar</div>
  )
}

export default Sidebar
