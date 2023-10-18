import { createStandaloneToast, extendTheme, withDefaultColorScheme, withDefaultVariant } from '@chakra-ui/react'


const breakpoints = {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  }
const theme = extendTheme({
    breakpoints,
    components: {
        Input: {
            baseStyle: {
                borderRadius: "none",
            },
            variants: {
                filled: {
                    field: {
                        borderRadius: "none",
                        backgroundColor: "secondary",
                        color: 'white',
                        _focus: {
                            borderColor: "accent",
                        },
                        _active: {
                            borderColor: "accent",
                        },
                        _hover: {
                            backgroundColor: "secondary",
                            borderColor: "accent",
                        }
                    },
                },
                outline: {
                    field: {
                        borderRadius: "none",
                        _focus: {
                            borderColor: "purple.500",
                        },
                        _active: {
                            borderColor: "purple.500",
                        },
                    },
                },
            },
        },
        Button: {
            baseStyle: {
                borderRadius: "none"
            },
        },
        Select: {
            variants: {
                outline: {
                    field: {
                        borderRadius: "1px",
                    },
                },
            },

        },
    },

}, withDefaultVariant({
    variant: "outline",
    components: ["Input", "Select"],
}))