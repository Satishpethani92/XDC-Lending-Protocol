import { Box, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import trueSignImg from "@/assets/images/landing/trueSignImg.svg";
import shieldImg from "@/assets/images/landing/shieldImg.png";

const RISK_ITEMS = [
  "Mandatory over-collateralization",
  "Decentralized oracles",
  "Automated liquidation mechanisms",
  "Strict security and monitoring procedures",
  "Independent smart contract audits",
];

export default function RiskManagement() {
  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      px={{ base: "20px", sm: "40px", lg: "80px" }}
      py={{ base: "40px", lg: "80px" }}
      borderColor="#D8D8D8"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      textAlign="left"
      position="relative"
      overflow="hidden"
      bg="#FFFFFF"
    >
      {/* Heading */}
      <Box
        as="h2"
        textAlign="center"
        fontSize={{ base: "26px", sm: "36px", md: "48px" }}
        lineHeight={{ base: "34px", sm: "42px", md: "54px" }}
        fontWeight={700}
        color="#0F172A"
        mb={{ base: 8, md: 10 }}
      >
        Risk Management Framework
      </Box>

      {/* Top row */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: 4, md: 6 }}
        mb={{ base: 8, md: 10 }}
      >
        {RISK_ITEMS.slice(0, 3).map((text) => (
          <Box
            key={text}
            borderRadius="16px"
            border="1px solid #D7EBF4"
            bg="#FFFFFF"
            px={{ base: 5, md: 6 }}
            py={{ base: 6, md: 7 }}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Image src={trueSignImg} alt="check" w="24px" h="24px" mb={4} />
            <Box
              as="p"
              fontSize={{ base: "20px", md: "24px" }}
              fontWeight={600}
              color="#0F172A"
            >
              {text}
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* Bottom row */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: 4, md: 6 }}
        alignItems="center"
      >
        {/* Left card */}
        <Box
          borderRadius="16px"
          border="1px solid #D7EBF4"
          bg="#FFFFFF"
          px={{ base: 5, md: 6 }}
          py={{ base: 6, md: 7 }}
        >
          <Image src={trueSignImg} alt="check" w="24px" h="24px" mb={4} />
          <Box
            as="p"
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight={600}
            color="#0F172A"
          >
            {RISK_ITEMS[3]}
          </Box>
        </Box>

        {/* Center shield illustration */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <Image
            src={shieldImg}
            alt="Secure illustration"
            h={{ base: "160px", md: "220px" }}
            w="auto"
          />
        </Box>

        {/* Right card */}
        <Box
          borderRadius="16px"
          border="1px solid #D7EBF4"
          bg="#FFFFFF"
          px={{ base: 5, md: 6 }}
          py={{ base: 6, md: 7 }}
        >
          <Image src={trueSignImg} alt="check" w="24px" h="24px" mb={4} />
          <Box
            as="p"
            fontSize={{ base: "18px", md: "24px" }}
            fontWeight={600}
            color="#0F172A"
          >
            {RISK_ITEMS[4]}
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
