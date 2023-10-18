import { Box, Flex, HStack, Input, Stack, Text } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { GoCheck } from 'react-icons/go';
import { ImCross } from 'react-icons/im';
import { BsSlashLg } from 'react-icons/bs'
import { ReceivingContext } from '../../../components/context/ReceivingContext'

const EditModalChecklist = () => {
    const { setSubmitDataThree } = useContext(ReceivingContext)

    const [truckInspectionOne, setTruckInspectionOne] = useState(null)
    const [truckInspectionRemarksOne, setTruckInspectionRemarksOne] = useState(null)
    const [truckInspectionTwo, setTruckInspectionTwo] = useState(null)
    const [truckInspectionRemarksTwo, setTruckInspectionRemarksTwo] = useState(null)
    const [truckInspectionThree, setTruckInspectionThree] = useState(null)
    const [truckInspectionThreeRemarks, setTruckInspectionThreeRemarks] = useState(null)
    const [truckInspectionFour, setTruckInspectionFour] = useState(null)
    const [truckInspectionFourRemarks, setTruckInspectionFourRemarks] = useState(null)

    const [unloadingRawMatsOne, setUnloadingRawMatsOne] = useState(null)
    const [unloadingRawMatsOneRemarks, setUnloadingRawMatsOneRemarks] = useState(null)
    const [unloadingRawMatsTwo, setUnloadingRawMatsTwo] = useState(null)
    const [unloadingRawMatsTwoRemarks, setUnloadingRawMatsTwoRemarks] = useState(null)
    const [unloadingRawMatsThree, setUnloadingRawMatsThree] = useState(null)
    const [unloadingRawMatsThreeRemarks, setUnloadingRawMatsThreeRemarks] = useState(null)
    const [unloadingRawMatsFour, setUnloadingRawMatsFour] = useState(null)
    const [unloadingRawMatsFourRemarks, setUnloadingRawMatsFourRemarks] = useState(null)

    useEffect(() => {
        let submitDataThree = {

            truck_Approval1: truckInspectionOne,
            truck_Approval1_Remarks: truckInspectionRemarksOne,
            truck_Approval2: truckInspectionTwo,
            truck_Approval2_Remarks: truckInspectionRemarksTwo,
            truck_Approval3: truckInspectionThree,
            truck_Approval3_Remarks: truckInspectionThreeRemarks,
            truck_Approval4: truckInspectionFour,
            truck_Approval4_Remarks: truckInspectionFourRemarks,
            unloading_Approval1: unloadingRawMatsOne,
            unloading_Approval1_Remarks: unloadingRawMatsOneRemarks,
            unloading_Approval2: unloadingRawMatsTwo,
            unloading_Approval2_Remarks: unloadingRawMatsTwoRemarks,
            unloading_Approval3: unloadingRawMatsThree,
            unloading_Approval3_Remarks: unloadingRawMatsThreeRemarks,
            unloading_Approval4: unloadingRawMatsFour,
            unloading_Approval4_Remarks: unloadingRawMatsFourRemarks,
        }
        setSubmitDataThree(submitDataThree)
    },
        [
            truckInspectionOne,
            truckInspectionRemarksOne,
            truckInspectionTwo,
            truckInspectionRemarksTwo,
            truckInspectionThree,
            truckInspectionThreeRemarks,
            truckInspectionFour,
            truckInspectionFourRemarks,
            unloadingRawMatsOne,
            unloadingRawMatsOneRemarks,
            unloadingRawMatsTwo,
            unloadingRawMatsTwoRemarks,
            unloadingRawMatsThree,
            unloadingRawMatsThreeRemarks,
            unloadingRawMatsFour,
            unloadingRawMatsFourRemarks,
        ]
    )

    // Truck inspections data
    const truckInspection1 = (data) => {
        setTruckInspectionOne(data)
    }
    const truckInspection1Remarks = (remarks) => {
        setTruckInspectionRemarksOne(remarks)
    }
    const truckInspection2 = (data) => {
        setTruckInspectionTwo(data)
    }
    const truckInspection2Remarks = (remarks) => {
        setTruckInspectionRemarksTwo(remarks)
    }
    const truckInspection3 = (data) => {
        setTruckInspectionThree(data)
    }
    const truckInspection3Remarks = (remarks) => {
        setTruckInspectionThreeRemarks(remarks)
    }
    const truckInspection4 = (data) => {
        setTruckInspectionFour(data)
    }
    const truckInspection4Remarks = (remarks) => {
        setTruckInspectionFourRemarks(remarks)
    }

    // Unloading of raw mats data
    const unloadingRM1 = (data) => {
        setUnloadingRawMatsOne(data)
    }
    const unloadingRM1Remarks = (remarks) => {
        setUnloadingRawMatsOneRemarks(remarks)
    }
    const unloadingRM2 = (data) => {
        setUnloadingRawMatsTwo(data)
    }
    const unloadingRM2Remarks = (remarks) => {
        setUnloadingRawMatsTwoRemarks(remarks)
    }
    const unloadingRM3 = (data) => {
        setUnloadingRawMatsThree(data)
    }
    const unloadingRM3Remarks = (remarks) => {
        setUnloadingRawMatsThreeRemarks(remarks)
    }
    const unloadingRM4 = (data) => {
        setUnloadingRawMatsFour(data)
    }
    const unloadingRM4Remarks = (remarks) => {
        setUnloadingRawMatsFourRemarks(remarks)
    }


    return (
        <Stack>

            {/* TRUCK INSPECTION */}


            <Box>
                <Flex justifyContent='space-between' color='white' bgColor='primary'>
                    <Text p={1} fontSize="13px" fontWeight="semibold">TRUCK INSPECTION</Text>
                    <Flex>
                        <HStack spacing={4}>
                            <GoCheck fontSize='15px' /> <BsSlashLg fontSize='17px' />
                            <ImCross fontSize='10px' />
                        </HStack>
                        <Text p={1} ml='200px' mr='70px' fontSize="13px" fontWeight="semibold">REMARKS</Text>
                    </Flex>
                </Flex>

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">The trucks are covered and closed</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => truckInspection1(JSON.parse(e.target.value))}>
                            <input type="radio" id="tc1" name="truck-inspection1" value={true} />
                            <label htmlFor="tc1"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="tx1" name="truck-inspection1" value={false} />
                            <label htmlFor="tc2"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            placeholder='Optional'
                            onChange={(e) => truckInspection1Remarks(e.target.value)}
                        />
                    </HStack>
                </Flex>
                {/* {truckInspectionOne === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">Floorboards are dry and clean</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => truckInspection2(JSON.parse(e.target.value))}>
                            <input type="radio" id="tc2" name="truck-inspection2" value={true} disabled={truckInspectionOne != null ? false : true} />
                            <label htmlFor="tc2"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="tx2" name="truck-inspection2" value={false} disabled={truckInspectionOne != null ? false : true} />
                            <label htmlFor="tx2"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            onChange={(e) => truckInspection2Remarks(e.target.value)}
                            placeholder='Optional'
                        />
                    </HStack>
                </Flex>
                {/* {truckInspectionTwo === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">No evidence of chemical pills, garbage, waste or spoiled foods</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => truckInspection3(JSON.parse(e.target.value))}>
                            <input type="radio" id="tc3" name="truck-inspection3" value={true} disabled={truckInspectionTwo != null ? false : true} />
                            <label htmlFor="tc3"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="tx3" name="truck-inspection3" value={false} disabled={truckInspectionTwo != null ? false : true} />
                            <label htmlFor="tx3"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            onChange={(e) => truckInspection3Remarks(e.target.value)}
                            placeholder='Optional'
                        />
                    </HStack>
                </Flex>
                {/* {truckInspectionThree === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">No insect and rodent activity</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => truckInspection4(JSON.parse(e.target.value))}>
                            <input type="radio" id="tc4" name="truck-inspection4" value={true} disabled={truckInspectionThree != null ? false : true} />
                            <label htmlFor="tc2"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="tx4" name="truck-inspection4" value={false} disabled={truckInspectionThree != null ? false : true} />
                            <label htmlFor="tx4"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            onChange={(e) => truckInspection4Remarks(e.target.value)}
                            placeholder='Optional'
                        />
                    </HStack>
                </Flex>
                {/* {truckInspectionFour === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

            </Box>

            {/* UNLOADING OF RAW MATERIALS */}

            <Box>
                <Flex justifyContent='space-between' color='white' bgColor='primary'>
                    <Text p={1} fontSize="13px" fontWeight="semibold">UNLOADING OF RAW MATERIALS</Text>
                    <Flex>
                        <HStack spacing={4}>
                            <GoCheck fontSize='15px' /> <BsSlashLg fontSize='17px' />
                            <ImCross fontSize='10px' />
                        </HStack>
                        <Text p={1} ml='200px' mr='70px' fontSize="13px" fontWeight="semibold">REMARKS</Text>
                    </Flex>
                </Flex>

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">All products are on clean pallets (if applicable)</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => unloadingRM1(JSON.parse(e.target.value))}>
                            <input type="radio" id="uorwc1" name="unloading-of-raw-materials1" value={true} disabled={truckInspectionFour != null ? false : true} />
                            <label htmlFor="uorwc1"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="uorwx1" name="unloading-of-raw-materials1" value={false} disabled={truckInspectionFour != null ? false : true} />
                            <label htmlFor="uorwx1"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            onChange={(e) => unloadingRM1Remarks(e.target.value)}
                            placeholder='Optional'
                        />
                    </HStack>
                </Flex>
                {/* {unloadingRawMatsOne === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">No damage packaging</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => unloadingRM2(JSON.parse(e.target.value))}>
                            <input type="radio" id="uorwc2" name="unloading-of-raw-materials2" value={true} disabled={unloadingRawMatsOne != null ? false : true} />
                            <label htmlFor="uorwc2"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="uorwx2" name="unloading-of-raw-materials2" value={false} disabled={unloadingRawMatsOne != null ? false : true} />
                            <label htmlFor="uorwx2"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            onChange={(e) => unloadingRM2Remarks(e.target.value)}
                            placeholder='Optional'
                        />
                    </HStack>
                </Flex>
                {/* {unloadingRawMatsTwo === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">All packing are clean</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => unloadingRM3(JSON.parse(e.target.value))}>
                            <input type="radio" id="uorwc3" name="unloading-of-raw-materials3" value={true} disabled={unloadingRawMatsTwo != null ? false : true} />
                            <label htmlFor="uorwc3"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="uorwx3" name="unloading-of-raw-materials3" value={false} disabled={unloadingRawMatsTwo != null ? false : true} />
                            <label htmlFor="uorwx3"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            onChange={(e) => unloadingRM3Remarks(e.target.value)}
                            placeholder='Optional'
                        />
                    </HStack>
                </Flex>
                {/* {unloadingRawMatsThree === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

                <Flex justifyContent='space-between' mt={2}>
                    <Text pl={1} w='40%' fontSize="13px">Batch number, manufacturing date and expiry date are same as written in the Certificate of Analysis (COA) provided by supplier</Text>
                    <HStack mr={2}>
                        <HStack mr='127.5px' onChange={(e) => unloadingRM4(JSON.parse(e.target.value))}>
                            <input type="radio" id="uorwc4" name="unloading-of-raw-materials4" value={true} disabled={unloadingRawMatsThree != null ? false : true} />
                            <label htmlFor="uorwc4"><GoCheck fontSize='15px' /></label>
                            <input type="radio" id="uorwx4" name="unloading-of-raw-materials4" value={false} disabled={unloadingRawMatsThree != null ? false : true} />
                            <label htmlFor="uorwx4"><ImCross fontSize='10px' /></label>
                        </HStack>
                        <Input
                            border="1px"
                            borderColor="gray.400"
                            size="sm"
                            onChange={(e) => unloadingRM4Remarks(e.target.value)}
                            placeholder='Optional'
                        />
                    </HStack>
                </Flex>
                {/* {unloadingRawMatsFour === false ? <Text textAlign='end' mt={-1} mr='113px' color='danger' fontSize='sm'>Remarks required</Text> : ""} */}

            </Box>
        </Stack>
    )
}

export default EditModalChecklist