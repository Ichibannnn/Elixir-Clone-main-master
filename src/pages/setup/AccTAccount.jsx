import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Skeleton,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    useToast,
    Thead,
    Tr,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    VStack,
    Portal,
  } from '@chakra-ui/react'
  import React, { useState } from 'react'
  import { useEffect } from 'react'
  import { useForm } from 'react-hook-form'
  import { AiTwotoneEdit } from 'react-icons/ai'
  import { GiChoice } from 'react-icons/gi'
  import { MdLibraryAdd } from 'react-icons/md'
  import { FiSearch } from 'react-icons/fi'
  import PageScroll from '../../utils/PageScroll'
  import request from '../../services/ApiClient'
  import { ToastComponent } from '../../components/Toast'
  import { yupResolver } from '@hookform/resolvers/yup'
  import * as yup from 'yup'
  import { decodeUser } from '../../services/decode-user'
  import {
    Pagination,
    usePagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
  } from '@ajna/pagination'
import { RiAddFill } from 'react-icons/ri'
  
  const Department = () => {
    const [account, setAccount] = useState([])
    const [editData, setEditData] = useState([])
    const [status, setStatus] = useState(true)
    const [search, setSearch] = useState('')
    const toast = useToast()
    const currentUser = decodeUser()
  
    const [isLoading, setIsLoading] = useState(true)
    const [pageTotal, setPageTotal] = useState(undefined)
    const [disableEdit, setDisableEdit] = useState(false)
  
    const fetchAccountApi = async (pageNumber, pageSize, status, search) => {
      const response = await request.get(
        `Account/GetAllAccountWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`,
      )
  
      return response.data
    }
  
    //PAGINATION
    const outerLimit = 2
    const innerLimit = 2
    const {
      currentPage,
      setCurrentPage,
      pagesCount,
      pages,
      setPageSize,
      pageSize,
    } = usePagination({
      total: pageTotal,
      limits: {
        outer: outerLimit,
        inner: innerLimit,
      },
      initialState: { currentPage: 1, pageSize: 5 },
    })
  
    //SHOW USER DATA----
    const getAccountHandler = () => {
      fetchAccountApi(currentPage, pageSize, status, search).then((res) => {
        setIsLoading(false)
        setAccount(res)
        setPageTotal(res.totalCount)
      })
    }
  
    useEffect(() => {
      getAccountHandler()
  
      return () => {
        setAccount([])
      }
    }, [currentPage, pageSize, status, search])
  
    const handlePageChange = (nextPage) => {
      setCurrentPage(nextPage)
    }
  
    const handlePageSizeChange = (e) => {
      const pageSize = Number(e.target.value)
      setPageSize(pageSize)
    }
  
    const statusHandler = (data) => {
      setStatus(data)
    }
  
    const changeStatusHandler = (id, status) => {
      let routeLabel
      if (status) {
        routeLabel = 'InActiveAccount'
      } else {
        routeLabel = 'ActivateAccount'
      }
  
      request
        .put(`/Account/${routeLabel}`, { id: id })
        .then((res) => {
          ToastComponent('Success', 'Status updated', 'success', toast)
          getAccountHandler()
        })
        .catch((err) => {
          console.log(err)
        })
      console.log(routeLabel)
    }
  
    const searchHandler = (inputValue) => {
      setSearch(inputValue)
      console.log(inputValue)
    }
  
    //ADD USER HANDLER---
    const addAccountHandler = () => {
      setEditData({
        id: '',
        accountCode: '',
        accountName: '',
        addedBy: currentUser.userName,
        modifiedBy: '',
      })
      onOpen()
      setDisableEdit(false)
    }
  
    //EDIT USER--
    const editAccountHandler = (account) => {
      setDisableEdit(true)
      setEditData(account)
      onOpen()
    }
    //FOR DRAWER
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    // console.log(status);
  
    return (
      <Flex
        color="fontColor"
        h="full"
        w="full"
        flexDirection="column"
        p={2}
        bg="form"
        boxShadow="md"
      >
        <Flex p={2} w="full">
          <Flex flexDirection="column" gap={1} w="full">
            <Flex justifyContent="space-between" alignItems="center">
              <HStack w="25%" mt={3}>
                  <InputGroup size="sm">
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FiSearch bg="black" fontSize="18px" />}
                    />
                    <Input
                      borderRadius="lg"
                      fontSize="13px"
                      type="text"
                      border="1px"
                      bg="#E9EBEC"
                      placeholder="Search Account Name"
                      borderColor="gray.400"
                      _hover={{ borderColor: 'gray.400' }}
                      onChange={(e) => searchHandler(e.target.value)}
                    />
                  </InputGroup>
                </HStack>
  
              <HStack flexDirection="row">
                <Text fontSize="12px">STATUS:</Text>
                <Select
                  fontSize="12px"
                  onChange={(e) => statusHandler(e.target.value)}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </Select>
              </HStack>
            </Flex>
  
            <Flex w="full" flexDirection="column" gap={2}>
              <PageScroll maxHeight="470px">
                {isLoading ? (
                  <Stack width="full">
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                    <Skeleton height="20px" />
                  </Stack>
                ) : (
                  <Table
                    size="sm"
                    width="full"
                    border="none"
                    boxShadow="md"
                    bg="gray.200"
                    variant="striped"
                  >
                    <Thead bg="secondary">
                      <Tr fontSize="15px">
                        <Th color="#D6D6D6" fontSize="10px">
                          ID
                        </Th>
                        <Th color="#D6D6D6" fontSize="10px">
                          Account Code
                        </Th>
                        <Th color="#D6D6D6" fontSize="10px">
                          Account Name
                        </Th>
                        <Th color="#D6D6D6" fontSize="10px">
                          Added By
                        </Th>
                        <Th color="#D6D6D6" fontSize="10px">
                          Date Added
                        </Th>
                        <Th color="#D6D6D6" fontSize="10px">
                          Action
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {account.account?.map((acc, i) => (
                        <Tr key={i}>
                          <Td fontSize="11px">{acc.id}</Td>
                          <Td fontSize="11px">{acc.accountCode}</Td>
                          <Td fontSize="11px">{acc.accountName}</Td>
                          <Td fontSize="11px">{acc.addedBy}</Td>
                          <Td fontSize="11px">{acc.dateAdded}</Td>
  
                          <Td pl={0}>
                            <HStack>
                              <Button
                                bg="none"
                                onClick={() => editAccountHandler(acc)}
                              >
                                <AiTwotoneEdit />
                              </Button>
                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      <Button p={0} bg="none">
                                        <GiChoice />
                                      </Button>
                                    </PopoverTrigger>
                                    <Portal>
                                      <PopoverContent bg="primary" color="#fff">
                                        <PopoverArrow bg="primary" />
                                        <PopoverCloseButton />
                                        <PopoverHeader>
                                          Confirmation!
                                        </PopoverHeader>
                                        <PopoverBody>
                                          <VStack onClick={onClose}>
                                            {acc.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set this
                                                account inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set this
                                                account active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  acc.id,
                                                  acc.isActive,
                                                )
                                              }
                                            >
                                              Yes
                                            </Button>
                                          </VStack>
                                        </PopoverBody>
                                      </PopoverContent>
                                    </Portal>
                                  </>
                                )}
                              </Popover>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </PageScroll>
  
              <Flex justifyContent="space-between">
                <Button
                  size="sm"
                  colorScheme="blue"
                  fontSize="13px"
                  fontWeight="normal"
                  _hover={{ bg: 'blue.400', color: '#fff' }}
                  w="auto"
                  leftIcon={<RiAddFill fontSize="19px" />}
                  borderRadius="none"
                  onClick={addAccountHandler}
                >
                  New Account
                </Button>
  
                {/* PROPS */}
                {isOpen && (
                  <DrawerComponent
                    isOpen={isOpen}
                    onClose={onClose}
                    fetchAccountApi={fetchAccountApi}
                    getAccountHandler={getAccountHandler}
                    editData={editData}
                    disableEdit={disableEdit}
                  />
                )}
  
                <Stack>
                  <Pagination
                    pagesCount={pagesCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  >
                    <PaginationContainer>
                      <PaginationPrevious
                        bg="primary"
                        color="white"
                        p={1}
                        _hover={{ bg: 'btnColor', color: 'white' }}
                        size="sm"
                      >
                        {'<<'}
                      </PaginationPrevious>
                      <PaginationPageGroup ml={1} mr={1}>
                        {pages.map((page) => (
                          <PaginationPage
                            _hover={{ bg: 'btnColor', color: 'white' }}
                            _focus={{ bg: 'btnColor' }}
                            p={3}
                            bg="primary"
                            color="white"
                            key={`pagination_page_${page}`}
                            page={page}
                            size="sm"
                          />
                        ))}
                      </PaginationPageGroup>
                      <HStack>
                        <PaginationNext
                          bg="primary"
                          color="white"
                          p={1}
                          _hover={{ bg: 'btnColor', color: 'white' }}
                          size="sm"
                          mb={2}
                        >
                          {'>>'}
                        </PaginationNext>
                        <Select
                          onChange={handlePageSizeChange}
                          bg="#FFFFFF"
                          size="sm"
                          mb={2}
                        >
                          <option value={Number(5)}>5</option>
                          <option value={Number(10)}>10</option>
                          <option value={Number(25)}>25</option>
                          <option value={Number(50)}>50</option>
                        </Select>
                      </HStack>
                    </PaginationContainer>
                  </Pagination>
                </Stack>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  }
  
  export default Department
  
  const schema = yup.object().shape({
    formData: yup.object().shape({
      id: yup.string(),
      accountCode: yup.string().required('Account Code is required'),
      accountName: yup.string().required('Account Name is required'),
    }),
  })
  
  const currentUser = decodeUser()
  
  const DrawerComponent = (props) => {
    const { isOpen, onClose, getAccountHandler, editData, disableEdit } = props
    const toast = useToast()
  
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      setValue,
      watch,
    } = useForm({
      resolver: yupResolver(schema),
      mode: 'onChange',
      defaultValues: {
        formData: {
          id: '',
          accountCode: '',
          accountName: '',
          addedBy: currentUser?.userName,
          modifiedBy: '',
        },
      },
    })
  
    const submitHandler = async (data) => {
      try {
        if (data.formData.id === '') {
          delete data.formData['id']
          const res = await request
            .post('Account/AddNewAccounts', data.formData)
            .then((res) => {
              ToastComponent(
                'Success',
                'New account created!',
                'success',
                toast,
              )
              getAccountHandler()
              onClose()
            })
            .catch((err) => {
              ToastComponent('Error', err.response.data, 'error', toast)
              data.formData.id = ''
            })
        } else {
          const res = await request
            .put(`Account/UpdateAccount`, data.formData)
            .then((res) => {
              ToastComponent('Success', 'Account Updated', 'success', toast)
              getAccountHandler()
              onClose(onClose)
            })
            .catch((error) => {
              ToastComponent(
                'Update Failed',
                error.response.data,
                'warning',
                toast,
              )
            })
        }
      } catch (err) {}
    }
  
    console.log(editData)
  
    useEffect(() => {
      if (editData.id) {
        setValue(
          'formData',
          {
            id: editData.id,
            accountCode: editData?.accountCode,
            accountName: editData?.accountName,
            modifiedBy: currentUser.userName,
          },
          { shouldValidate: true },
        )
      }
    }, [editData])
  
    console.log(watch('formData.id'))
  
    return (
      <>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <form onSubmit={handleSubmit(submitHandler)}>
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">Account Form</DrawerHeader>
              <DrawerCloseButton />
              <DrawerBody>
                <Stack spacing="7px">
                  <Box>
                    <FormLabel>Account Code:</FormLabel>
                    <Input
                      {...register('formData.accountCode')}
                      placeholder="Please enter Account Code"
                      autoComplete="off"
                      autoFocus
                      disabled={disableEdit}
                      readOnly={disableEdit}
                      _disabled={{ color: 'black' }}
                      bgColor={disableEdit && 'gray.300'}
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.accountCode?.message}
                    </Text>
                  </Box>
  
                  <Box>
                    <FormLabel>Account Name:</FormLabel>
                    <Input
                      {...register('formData.accountName')}
                      placeholder="Please enter Account Name"
                      autoComplete="off"
                    />
                    <Text color="red" fontSize="xs">
                      {errors.formData?.accountName?.message}
                    </Text>
                  </Box>
                </Stack>
              </DrawerBody>
              <DrawerFooter borderTopWidth="1px">
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="blue" disabled={!isValid}>
                  Submit
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </form>
        </Drawer>
      </>
    )
  }
  