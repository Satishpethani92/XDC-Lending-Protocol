import arrowDown from "@/assets/images/landing/arrowDown.svg";
import arrowSwap from "@/assets/images/landing/arrowSwap.svg";
import arrowUp from "@/assets/images/landing/arrowUp.svg";
import { Box, SimpleGrid } from "@chakra-ui/react";

const featureCards = [
  {
    key: "borrow",
    title: "Borrow USDC",
    description:
      "Use XDC or tokenized gold (CGO) as collateral and borrow USDC instantly. Smart contracts enforce safe, over-collateralized positions at all times.",
    icon: arrowDown,
    alt: "arrow down",
  },

  {
    key: "lend",
    title: "Lend USDC",
    description:
      "Deposit USDC into Creditify’s lending pools and earn yield generated from borrower demand. Withdraw anytime with minimal gas fees.",
    icon: arrowUp,
    alt: "arrow up",
  },

  {
    key: "swap",
    title: "SWAP",
    description:
      "SWAP major tokens like BTC, ETH, XRP, USDT, USDC to XDC or USDC on XDC chain.",
    icon: arrowSwap,
    alt: "arrow swap",
  },
];

export default function WhatCanYouDo() {
  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      px={{ base: "20px", sm: "40px", lg: "80px", xl: "120px" }}
      py={{ base: "40px", lg: "70px" }}
      bgGradient="linear(to-br, #020617, #020617)"
      borderColor="#D7EBF4"
      borderTopWidth="1px"
      borderLeftWidth="1px"
      borderRightWidth="1px"
      textAlign="center"
      position="relative"
      overflow="hidden"
    >
      {/* heading */}
      <Box
        as="h2"
        textAlign="center"
        fontSize={{ base: "26px", sm: "36px", md: "48px" }}
        lineHeight={{ base: "34px", sm: "42px", md: "54px" }}
        mb={{ base: "20px", sm: 12 }}
        fontWeight={600}
        color="#0F172A"
      >
        What Can You Do On Creditify?
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={{ base: 6, md: 8 }}>
        {featureCards.map((card) => (
          <Box
            key={card.key}
            borderRadius="20px"
            border="1px solid"
            borderColor="#D7EBF4"
            bg="#FFFFFF"
            px={{ base: 6, md: 7 }}
            py={{ base: 7, md: 8 }}
          >
            <Box
              w="48px"
              h="48px"
              borderRadius="12px"
              bgGradient="linear(to-b, #E0F2FE, #F9FAFF)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={5}
            >
              <img src={card.icon} alt={card.alt} />
            </Box>

            <Box
              as="h3"
              fontSize={{ base: "20px", md: "24px" }}
              fontWeight={700}
              mb={3}
              color="#0F172A"
              textAlign="left"
            >
              {card.title}
            </Box>

            <Box
              as="p"
              fontSize={{ base: "16px", md: "18px" }}
              lineHeight="1.7"
              color="#4B5563"
              textAlign="left"
            >
              {card.description}
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
