import { Box, Flex, VStack } from "@chakra-ui/react";
import bgPatternLeft from "../../assets/images/landing/bgPatternLeft.png";

const WHY_XDC_FEATURES = [
  {
    id: 1,
    title: "Instant Finality",
    description: "2-Second Finality ensures instant and reliable execution.",
  },
  {
    id: 2,
    title: "Near-Zero Gas Fees",
    description: "Gas fees < $0.0001 make user transactions nearly free.",
  },
  {
    id: 3,
    title: "Global-Scale Performance",
    description:
      "Scalable & energy-efficient Layer-1 network with global reach.",
  },
  {
    id: 4,
    title: "Enterprise-Ready Architecture",
    description:
      "Hybrid & compliance-ready architecture suitable for enterprise and institutional adoption.",
  },
];

export default function WhyBuildOnXDC() {
  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      px={{ base: "24px", md: "60px", lg: "80px" }}
      py={{ base: "40px", md: "60px", lg: "80px" }}
      borderColor="#254459"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      textAlign="left"
      position="relative"
      overflow="hidden"
    >
      <Box
        w="100%"
        h="100%"
        position="absolute"
        inset={0}
        bgImage={`url(${bgPatternLeft})`}
        bgRepeat="no-repeat"
        bgSize="cover"
        opacity={0.6}
        pointerEvents="none"
        zIndex={0}
      />
      <Box position={"relative"} zIndex={1}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "first" }}
          gap={{ base: 10, md: 16 }}
        >
          {/* Left: main heading */}
          <Box flex={{ base: "none", md: "0 0 40%" }}>
            <Box
              as="h2"
              fontSize={{ base: "30px", md: "36px", lg: "48px" }}
              mt={{ base: 4 }}
              fontWeight={700}
              color="#FFFFFF"
              lineHeight="1.15"
            >
              Why Build On
              <br />
              XDC Network
            </Box>
          </Box>

          <VStack flex="1" align="stretch" gap={{ base: 4, md: 5 }}>
            {WHY_XDC_FEATURES.map((item) => (
              <Box
                key={item.id}
                borderRadius="16px"
                border="1px solid #254459"
                px={{ base: 5, md: 6 }}
                py={{ base: 4, md: 8 }}
              >
                <Box
                  as="h3"
                  fontSize={{ base: "20px", md: "24px", lg: "28px" }} // 28px on lg
                  fontWeight={700}
                  color="#FFFFFF"
                  mb={1}
                >
                  {item.title}
                </Box>
                <Box
                  as="p"
                  fontSize={{ base: "14px", md: "16px", lg: "18px" }} // 18px on lg
                  lineHeight="1.6"
                  color="rgba(226, 232, 240, 0.5)"
                >
                  {item.description}
                </Box>
              </Box>
            ))}
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
