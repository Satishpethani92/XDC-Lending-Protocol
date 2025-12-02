import { Box, SimpleGrid } from "@chakra-ui/react";

const CORE_FEATURES = [
  {
    id: 1,
    title: "Smart Collateral Management",
    description:
      "All borrowing is over-collateralized and enforced algorithmically by smart contracts.",
  },
  {
    id: 2,
    title: "Dynamic Interest Rates",
    description:
      "Borrowing and lending rates adjust automatically based on pool utilization, ensuring optimized liquidity.",
  },
  {
    id: 3,
    title: "Liquidation Engine",
    description:
      "Risky positions are automatically liquidated to protect lender funds and maintain market stability.",
  },
  {
    id: 4,
    title: "Price Oracle Integration",
    description:
      "Reliable decentralized oracles provide real-time pricing for XDC, USDC, and CGO.",
  },
  {
    id: 5,
    title: "USDC CCTP v2 Integration",
    description:
      "Creditify leverages Circle's Cross-Chain Transfer Protocol (CCTP v2) to bring native USDC to the XDC Network, enabling deep liquidity and frictionless cross-chain capital mobility.",
  },
];

export default function CoreProtocol() {
  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      px={{ base: "20px", sm: "40px", lg: "120px" }}
      py={{ base: "40px", lg: "60px" }}
      bgGradient="linear(to-br, #020617, #020617)"
      borderColor="#EBE7FF"
      borderTopWidth="1px"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      textAlign="center"
      position="relative"
      overflow="hidden"
      id="features"
    >
      {/* Inner content wrapper */}
      <Box
        bg="#FFFFFF"
        borderRadius="24px"
        px={{ base: 0, md: 10 }}
        py={{ base: 0, md: 14 }}
        textAlign="left"
      >
        {/* Section heading */}
        <Box
          as="h2"
          fontSize={{ base: "26px", sm: "36px", md: "48px" }}
          lineHeight={{ base: "34px", sm: "42px", md: "54px" }}
          fontWeight={700}
          mb={{ base: 8, md: 10 }}
          color="#0F172A"
        >
          Core Protocol
          <br />
          Features
        </Box>

        {/* Features grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
          {CORE_FEATURES.map((feature, index) => (
            <Box
              key={feature.id}
              borderRadius="16px"
              border="1px solid #D7EBF4" // card border color
              bg="#FFFFFF"
              px={{ base: 5, md: 6 }}
              py={{ base: 5, md: 6 }}
              boxShadow="0 4px 10px rgba(15,23,42,0.02)"
              gridColumn={{
                base: "auto",
                md: index === CORE_FEATURES.length - 1 ? "1 / -1" : "auto", // last card full width on md+
              }}
            >
              <Box
                as="h3"
                fontSize={{ base: "18px", md: "24px" }} // card heading 24px
                fontWeight={700}
                mb={2}
                color="#0F172A"
              >
                {feature.title}
              </Box>
              <Box
                as="p"
                fontSize={{ base: "16px", md: "18px" }} // card description 18px
                lineHeight="1.6"
                color="#4B5563"
              >
                {feature.description}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
