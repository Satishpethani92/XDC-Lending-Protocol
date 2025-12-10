import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import logoImg from "../../assets/images/login-logo-img.png";
import usdcIcon from "../../assets/images/login/usdc-icon.png";
import xdcIcon from "../../assets/images/login/xdc-icon.png";
import cgoIcon from "../../assets/images/login/cgo-icon.png";
import upIcon from "../../assets/images/login/up-arrow.png";
import downIcon from "../../assets/images/login/down-arrow.png";
import percentageIcon from "../../assets/images/login/percentage.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const tokens = [
  {
    tokenImg: usdcIcon,
    shortName: "USDC",
    fullName: "Stablecoin Reserve",
    liquidity: "$42.6M",
    supplyApy: "2.43%",
    borrowApr: "3.19%",
    utilisation: "38%",
  },
  {
    tokenImg: xdcIcon,
    shortName: "XDC",
    fullName: "XDC Reserve",
    liquidity: "$42.6M",
    supplyApy: "2.43%",
    borrowApr: "3.19%",
    utilisation: "38%",
  },
  {
    tokenImg: cgoIcon,
    shortName: "CGO",
    fullName: "CGO Reserve",
    liquidity: "$42.6M",
    supplyApy: "2.43%",
    borrowApr: "3.19%",
    utilisation: "38%",
  },
];

const Login = () => {
  return (
    <Box py={{ base: "20px", md: "30px" }} minH="100vh" bg={"#fff"}>
      <Container maxW="1280px" px={{ base: "15px", md: "25px" }}>
        {/* MARKET OVERVIEW TITLE */}
        <Box
          pb={{ base: "15px", md: "20px" }}
          borderBottom={"1px solid #D7EBF4"}
          mb={{ base: "15px", md: "25px" }}
        >
          <Image
            src={logoImg}
            alt="logo-img"
            maxW={"146px"}
            w={"100%"}
            mx={"auto"}
          />
        </Box>
        <Flex
          align="center"
          justify="center"
          gap="16px" // space around the title
          mb="15px"
        >
          {/* LEFT LINE */}
          <Box
            flex="1"
            height="1px"
            bgGradient="to-r"
            gradientFrom="transparent"
            gradientTo="#122029"
          />

          {/* TITLE */}
          <Heading
            className="landing-page-new"
            as="h2"
            letterSpacing="0.18em"
            fontWeight={700}
            fontSize="18px"
            textTransform="uppercase"
            color="#010103"
            textAlign="center"
            whiteSpace="nowrap"
          >
            MARKET OVERVIEW
          </Heading>

          {/* RIGHT LINE */}
          <Box
            flex="1"
            height="1px"
            bgGradient="to-l"
            gradientFrom="transparent"
            gradientTo="#122029"
          />
        </Flex>

        {/* CARDS WRAPPER */}
        <Box
          bg="#030206"
          borderRadius="24px"
          p={{ base: "15px", xl: "25px" }}
          border="1px solid #254459"
        >
          <SimpleGrid
            columns={{ base: 1, lg: 3 }}
            gap={{ base: "15px", xl: "25px" }}
          >
            {tokens.map((token) => (
              <TokenCard key={token.tokenImg} {...token} />
            ))}
          </SimpleGrid>
        </Box>

        {/* CONNECT YOUR WALLET SECTION */}
        <VStack gap={"20px"} mt={{ base: 14, md: "90px" }} textAlign="center">
          <Heading
            fontSize="32px"
            fontWeight="semibold"
            className="landing-page-new"
            color="#000"
          >
            Connect Your Wallet
          </Heading>

          <Text
            fontSize="16px"
            lineHeight={"22px"}
            fontWeight="normal"
            className="font-general-sans"
            color="#040D11"
            maxW={{ base: "100%", lg: "42%" }}
            mx={"auto"}
          >
            Connect your wallet to access your dashboard &amp; start supplying,
            borrowing, &amp; managing your positions on the xdc network
          </Text>

          <Button
            fontSize={"14px"}
            fontWeight={"normal"}
            px={"10px"}
            className="font-general-sans login-page-connect-btn"
            borderRadius="4px"
            bg="#262836"
            color="white"
            _hover={{ bg: "#020617" }}
          >
            <ConnectButton
              label="Connect Wallet"
              chainStatus="none"
              showBalance={false}
              accountStatus="address"
            />
          </Button>

          <Text
            fontSize="16px"
            fontWeight="normal"
            className="font-general-sans"
            color="#040D114D"
          >
            by connecting you agree to terms &amp; conditions
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

type TokenCardProps = {
  tokenImg: string;
  shortName: string;
  fullName: string;
  liquidity: string;
  supplyApy: string;
  borrowApr: string;
  utilisation: string;
};

const TokenCard = ({
  tokenImg,
  shortName,
  fullName,
  liquidity,
  supplyApy,
  borrowApr,
  utilisation,
}: TokenCardProps) => {
  return (
    <Box
      bg="linear-gradient(118.45deg, #000000 6.52%, #172A36 121.29%)"
      borderRadius="24px"
      p={{ base: "15px", xl: "25px" }}
      border="1px solid #252533"
      position="relative"
      overflow="hidden"
    >
      {/* subtle gradient overlay */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="radial(circle at top left, rgba(96,165,250,0.25), transparent 55%)"
        opacity={0.8}
        pointerEvents="none"
      />

      <Stack position="relative" gap={"10px"}>
        {/* TOP: ICON + TOKEN & LIQUIDITY */}
        <Flex
          justify="space-between"
          align="center"
          borderBottom="1px solid #252533"
          pb={"15px"}
        >
          <HStack gap={4}>
            {/* Placeholder circle for token icon */}
            <Image src={tokenImg} w={"49px"} h={"49px"} />
            <Box>
              <Text
                fontSize="20px"
                fontWeight="semibold"
                className="font-general-sans"
                color="#fff"
              >
                {shortName}
              </Text>
              <Text fontSize="14px" className="font-general-sans" color="#fff">
                {fullName}
              </Text>
            </Box>
          </HStack>

          <Box textAlign="left">
            <Text fontSize="14px" className="font-general-sans" color="#fff">
              Liquidity
            </Text>
            <Text
              fontSize={{ base: "18px", md: "20px", xl: "24px" }}
              fontWeight="semibold"
              className="landing-page-new"
              color="#fff"
            >
              {liquidity}
            </Text>
          </Box>
        </Flex>

        {/*  <Divider borderColor="whiteAlpha.200" /> */}

        {/* BOTTOM METRICS */}
        <SimpleGrid columns={3} gap={3}>
          <Metric img={upIcon} label="Supply APY" value={supplyApy} />
          <Metric img={downIcon} label="Borrow APR" value={borrowApr} />
          <Metric
            img={percentageIcon}
            label="Utilisation"
            value={utilisation}
          />
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

const Metric = ({
  img,
  label,
  value,
}: {
  img: string;
  label: string;
  value: string;
}) => (
  <VStack align="flex-start" gap={"15px"}>
    <Image src={img} h={"24px"} w={"24px"} />
    <Text
      fontSize={{ base: "14px", xl: "16px" }}
      lineHeight={{ base: "14px", xl: "16px" }}
      fontWeight="normal"
      className="font-general-sans"
      color="#fff"
    >
      {label}
    </Text>
    <Text
      fontSize={{ base: "18px", md: "20px", xl: "22px" }}
      lineHeight={{ base: "18px", md: "20px", xl: "22px" }}
      fontWeight="semibold"
      className="landing-page-new"
      color="#fff"
    >
      {value}
    </Text>
  </VStack>
);

export default Login;
