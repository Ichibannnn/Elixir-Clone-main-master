import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const UserManagementPage = () => {
  return (
    <Flex flexDirection="column" width="full">
      <Flex h="full">
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default UserManagementPage
