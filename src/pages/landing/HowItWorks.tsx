import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import bgPatternLeft from "../../assets/images/landing/bgPatternLeft.png";
import bgPatternRight from "../../assets/images/landing/bgPatternRight.png";

const earnYieldSteps = [
  {
    id: 1,
    label: "STEP 1",
    text: "Deposit USDC into the lending pool.",
  },
  {
    id: 2,
    label: "STEP 2",
    text: "Earn interest in real time, denominated in XDC.",
  },
  {
    id: 3,
    label: "STEP 3",
    text: "Withdraw funds at any time with sub-cent gas fees.",
  },
];
const borrowSteps = [
  {
    id: 1,
    label: "STEP 1",
    text: "Post collateral (XDC or CGO) to borrow USDC.",
  },
  {
    id: 2,
    label: "STEP 2",
    text: "Repay loan + interest to unlock collateral.",
  },
];

export default function HowItWorks() {
  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      bgGradient="linear(to-br, #020617, #020617)"
      borderColor="#EBE7FF"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      borderTopWidth="1px"
      textAlign="center"
      position="relative"
      overflow="hidden"
      id="how-creditify-works"
    >
      <Box overflow="hidden" boxShadow="0 24px 60px rgba(15, 23, 42, 0.18)">
        {/* Top half */}
        <Box
          bg="linear-gradient(180deg, #FFFFFF 0%, #EFFAFF 100%)"
          pt={{ base: 6, md: 10 }}
          px={{ base: "20px", sm: "40px", md: "60px", lg: "180px" }}
        >
          <Box
            as="h2"
            fontSize={{ base: "26px", sm: "36px", md: "48px" }}
            lineHeight={{ base: "34px", sm: "42px", md: "54px" }}
            mb={{ base: "20px", sm: 12 }}
            py={{ base: 5, md: "8" }}
            fontWeight={700}
            color="#0F172A"
          >
            How It Works?
          </Box>
          <Box
            bg="#040209"
            color="#FFFFFF"
            borderRadius="24px"
            px={{ base: 5, md: 8 }}
            py={{ base: 7, md: 9 }}
            textAlign="left"
            position={"relative"}
            overflow={"hidden"}
          >
            <Box
              w="100%"
              h="100%"
              position="absolute"
              inset={0}
              bgImage={`url(${bgPatternRight})`}
              bgRepeat="no-repeat"
              bgSize="cover"
              opacity={1}
              pointerEvents="none"
              zIndex={0}
            />
            <Box position="relative" zIndex={1}>
              <Box
                as="h4"
                color="#FFFFFF"
                fontSize={{ base: "18px", md: "39px" }}
                fontWeight={700}
                mb={{ base: 5, md: 6 }}
              >
                Earn Yield
              </Box>

              <Flex
                direction={{ base: "column", md: "row" }}
                align="stretch"
                gap={{ base: 4, md: 3 }}
              >
                {earnYieldSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <Box
                      flex="1"
                      borderRadius="18px"
                      border="1px solid #1E293B"
                      px={{ base: 4, md: 6 }}
                      py={{ base: 4, md: 5 }}
                    >
                      <Box
                        as="span"
                        display="block"
                        fontSize="15px"
                        letterSpacing="0.18em"
                        color="#38BDF8"
                        fontWeight={600}
                        mb={2}
                      >
                        {step.label}
                      </Box>
                      <Box
                        as="p"
                        fontSize={{ base: "14px", md: "16px" }}
                        color="rgba(241,245,249,0.9)"
                      >
                        {step.text}
                      </Box>
                    </Box>

                    {/* Arrow between steps (desktop only) */}
                    {index < earnYieldSteps.length - 1 && (
                      <Box
                        display={{ base: "none", md: "flex" }}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box as="span" fontSize="20px">
                          →
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>

        {/* Bottom half */}
        <Box
          bg="linear-gradient(180deg, #D9E7F5 0%, #FFFFFF 100%)"
          pt={{ base: 1 }}
          pb={{ base: 10, sm: 16, md: 32 }}
          px={{ base: "20px", sm: "40px", md: "60px", lg: "180px" }}
        >
          <Box
            bg="#040209"
            color="#FFFFFF"
            borderRadius="24px"
            px={{ base: 5, md: 8 }}
            py={{ base: 7, md: 9 }}
            textAlign="left"
            position={"relative"}
            overflow={"hidden"}
          >
            <Box
              w="100%"
              h="100%"
              position="absolute"
              inset={0}
              bgImage={`url(${bgPatternLeft})`}
              bgRepeat="no-repeat"
              bgSize="cover"
              opacity={1}
              pointerEvents="none"
              zIndex={0}
            />
            <Box position={"relative"} zIndex={1}>
              <Box
                as="h4"
                fontSize={{ base: "18px", md: "39px" }}
                fontWeight={700}
                mb={{ base: 5, md: 6 }}
                textAlign={"right"}
              >
                Borrow USDC
              </Box>

              <Flex
                direction={{ base: "column", md: "row" }}
                align="stretch"
                gap={{ base: 4, md: 6 }}
              >
                {borrowSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    {/* step card */}
                    <Box
                      flex="1"
                      borderRadius="18px"
                      border="1px solid #1E293B"
                      px={{ base: 4, md: 6 }}
                      py={{ base: 4, md: 5 }}
                    >
                      <Box
                        as="span"
                        display="block"
                        fontSize="15px"
                        letterSpacing="0.18em"
                        color="#38BDF8"
                        fontWeight={600}
                        mb={2}
                      >
                        {step.label}
                      </Box>
                      <Box
                        as="p"
                        fontSize={{ base: "14px", md: "16px" }}
                        color="rgba(241,245,249,0.9)"
                      >
                        {step.text}
                      </Box>
                    </Box>
                    {index < borrowSteps.length - 1 && (
                      <Box
                        display={{ base: "none", md: "flex" }}
                        alignItems="center"
                        justifyContent="center"
                        px={1}
                      >
                        <Box as="span" fontSize="20px">
                          →
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
