import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const SetupManagementPage = () => {
  return (
    <Flex flexDirection="column" width="full">
      <Flex h="full">
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default SetupManagementPage
