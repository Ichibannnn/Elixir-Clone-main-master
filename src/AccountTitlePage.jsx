import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AccountTitlePage = () => {
  return (
    <Flex flexDirection="column" width="full">
        <Flex>
            <Outlet/>
        </Flex>
    </Flex>
  )
}

export default AccountTitlePage