import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import footerBgImg from "@/assets/images/landing/footerBgImage.png";

export default function Footer() {
  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      px={{ base: "20px", sm: "40px", lg: "80px" }}
      py={{ base: "20px", lg: "40px" }}
      borderLeftWidth="1px"
      borderRightWidth="1px"
      borderColor="#254459"
      textAlign="center"
      position="relative"
      overflow="hidden"
      zIndex={1}
    >
      <Box
        position="absolute"
        inset={0} // top:0, right:0, bottom:0, left:0
        bgImage={`url(${footerBgImg})`}
        bgRepeat="no-repeat"
        backgroundPosition="center"
        bgSize="cover"
        opacity={0.6}
        pointerEvents="none"
        zIndex={0}
      />
      <Box position={"relative"} zIndex={1}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="220px"
          gap={4}
        >
          {/* Big brand title */}
          <Text
            as="h2"
            fontSize={{ base: "45px", sm: "60px", md: "120px", lg: "165px" }}
            mt={{ base: 5, md: 10 }}
            fontWeight={700}
            lineHeight="0.9"
            color="#002B3D"
          >
            Creditify
          </Text>

          {/* Small footer text */}
          <Box
            mt={{ base: 4, md: 6 }}
            display="flex"
            direction={{ base: "column", sm: "row" }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={{ base: 5 }}
          >
            <Text fontSize={{ base: "14px", lg: "16px" }} color="#FFFFFF">
              © Creditify • Built for DeFi • Non-custodial
            </Text>
            <Box
              as="button"
              className="nav-link"
              fontSize={{ base: "14px", sm: "16px" }}
              cursor="pointer"
              color="#FFFFFF"
              borderBottomWidth={"1px"}
              borderColor="#FFFFFF"
            >
              Contact us
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
