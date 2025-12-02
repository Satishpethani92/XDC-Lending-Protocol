import { Box, Flex, Text, VStack } from "@chakra-ui/react";

const RIGHT_PARAGRAPHS = [
  "Interest paid by borrowers distributes yield to lenders.",
  "A protocol fee is charged on earned interest.",
  "Incentives for liquidators maintain system stability.",
];

export default function BusinessModel() {
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
      borderTopWidth="1px"
      textAlign="left"
      position="relative"
      overflow="hidden"
      bg="#FFFFFF"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        gap={{ base: 8, md: 16 }}
      >
        {/* Left side: heading + description */}
        <Box flex={{ base: "unset", md: "1 1 0" }} maxW={{ md: "460px" }}>
          <Text
            as="h2"
            fontSize={{ base: "26px", md: "32px", xl: "48px" }}
            lineHeight={{ base: "34px", md: "38px", xl: "54px" }}
            fontWeight={700}
            color="#111827"
            mb={{ base: 4, md: 6 }}
          >
            Business Model
          </Text>

          <Text
            fontSize={{ base: "16px", md: "18px" }} // other text 18px
            lineHeight="1.7"
            color="#4B5563"
          >
            Alignment with institutional DeFi use cases such as trade finance,
            tokenized assets, and cross-border credit lines.
          </Text>
        </Box>

        {/* Right side: card with three paragraphs */}
        <Box
          flex={{ base: "unset", md: "1 1 0" }}
          border="1px solid #D7EBF4" // inner item border color
          borderRadius="16px"
          bg="#FFFFFF"
          px={{ base: 5, md: 8 }} // little padding
          py={{ base: 5, md: 7 }}
        >
          <VStack align="flex-start">
            {RIGHT_PARAGRAPHS.map((text) => (
              <Text
                key={text}
                fontSize={{ base: "16px", md: "18px" }}
                lineHeight="1.7"
                color="#374151"
              >
                {text}
              </Text>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
