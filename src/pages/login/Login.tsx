import Footer from "@/components/Footer";
import { getTokenLogo } from "@/config/tokenLogos";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { useChainConfig } from "@/hooks/useChainConfig";
import { useProtocolReserveData } from "@/hooks/useProtocolReserveData";
import { useReserveLiquidity } from "@/hooks/useReserveLiquidity";
import { ROUTES } from "@/routes/paths";
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import logoImg from "../../assets/images/login-logo-img.png";
import downIcon from "../../assets/images/login/down-arrow.png";
import percentageIcon from "../../assets/images/login/percentage.png";
import upIcon from "../../assets/images/login/up-arrow.png";

const Login = () => {
  const { tokens } = useChainConfig();
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  // Redirect to dashboard when wallet is connected
  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  // Fetch reserve data for each token
  const usdcReserveData = useProtocolReserveData(tokens.usdc.address);
  const wxdcReserveData = useProtocolReserveData(tokens.wrappedNative.address);
  const cgoReserveData = useProtocolReserveData(tokens.cgo.address);

  // Fetch liquidity for each token
  const usdcLiquidity = useReserveLiquidity(
    tokens.usdc.address,
    tokens.usdc.decimals
  );
  const wxdcLiquidity = useReserveLiquidity(
    tokens.wrappedNative.address,
    tokens.wrappedNative.decimals
  );
  const cgoLiquidity = useReserveLiquidity(
    tokens.cgo.address,
    tokens.cgo.decimals
  );

  // Fetch prices for each token
  const { price: usdcPrice } = useAssetPrice(tokens.usdc.address);
  const { price: xdcPrice } = useAssetPrice(tokens.wrappedNative.address);
  const { price: cgoPrice } = useAssetPrice(tokens.cgo.address);

  // Calculate utilization rate: totalBorrowed / (totalBorrowed + availableLiquidity) * 100
  const calculateUtilization = (
    totalVariableDebt: bigint,
    availableLiquidityRaw: bigint
  ): string => {
    const total = totalVariableDebt + availableLiquidityRaw;
    if (total === 0n) return "0";
    return ((Number(totalVariableDebt) / Number(total)) * 100).toFixed(0);
  };

  // Format liquidity in USD
  const formatLiquidityUsd = (liquidity: string, price: number): string => {
    const value = parseFloat(liquidity) * price;
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const isLoading =
    usdcReserveData.isLoading ||
    wxdcReserveData.isLoading ||
    cgoReserveData.isLoading ||
    usdcLiquidity.isLoading ||
    wxdcLiquidity.isLoading ||
    cgoLiquidity.isLoading;

  const tokensData = [
    {
      tokenImg: getTokenLogo(tokens.usdc.symbol),
      shortName: tokens.usdc.symbol,
      fullName: "Stablecoin Reserve",
      liquidity: formatLiquidityUsd(
        usdcLiquidity.availableLiquidity,
        usdcPrice
      ),
      supplyApy: `${usdcReserveData.supplyApy}%`,
      borrowApr: `${usdcReserveData.borrowApy}%`,
      utilisation: `${calculateUtilization(usdcReserveData.totalVariableDebt, usdcLiquidity.availableLiquidityRaw)}%`,
      isLoading,
    },
    {
      tokenImg: getTokenLogo(tokens.wrappedNative.symbol),
      shortName: tokens.wrappedNative.symbol,
      fullName: "XDC Reserve",
      liquidity: formatLiquidityUsd(wxdcLiquidity.availableLiquidity, xdcPrice),
      supplyApy: `${wxdcReserveData.supplyApy}%`,
      borrowApr: `${wxdcReserveData.borrowApy}%`,
      utilisation: `${calculateUtilization(wxdcReserveData.totalVariableDebt, wxdcLiquidity.availableLiquidityRaw)}%`,
      isLoading,
    },
    {
      tokenImg: getTokenLogo(tokens.cgo.symbol),
      shortName: tokens.cgo.symbol,
      fullName: "CGO Reserve",
      liquidity: formatLiquidityUsd(cgoLiquidity.availableLiquidity, cgoPrice),
      supplyApy: `${cgoReserveData.supplyApy}%`,
      borrowApr: `${cgoReserveData.borrowApy}%`,
      utilisation: `${calculateUtilization(cgoReserveData.totalVariableDebt, cgoLiquidity.availableLiquidityRaw)}%`,
      isLoading,
    },
  ];

  return (
    <Box display="flex" flexDirection="column" minH="100vh" bg={"#fff"}>
      <Container maxW="1280px" px={{ base: "15px", md: "25px" }} py={{ base: "20px", md: "30px" }}>
        {/* MARKET OVERVIEW TITLE */}
        <Box
          pb={{ base: "15px", md: "20px" }}
          borderBottom={"1px solid #D7EBF4"}
          mb={{ base: "15px", md: "25px" }}
        >
          <NavLink to={ROUTES.HOME}>
            <Image
              src={logoImg}
              alt="logo-img"
              maxW={"146px"}
              w={"100%"}
              mx={"auto"}
              cursor="pointer"
            />
          </NavLink>
        </Box>
        <Flex align="center" justify="center" gap="16px" mb="15px">
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
            {tokensData.map((token) => (
              <TokenCard key={token.shortName} {...token} />
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

          <ConnectButton
            label="Connect Wallet"
            chainStatus="none"
            showBalance={false}
            accountStatus="address"
          />

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
      <Box mt="auto">
        <Footer />
      </Box>
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
  isLoading?: boolean;
};

const TokenCard = ({
  tokenImg,
  shortName,
  fullName,
  liquidity,
  supplyApy,
  borrowApr,
  utilisation,
  isLoading,
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
            <Image src={tokenImg} w={"49px"} h={"49px"} borderRadius="full" />
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
            {isLoading ? (
              <Skeleton height="28px" width="80px" />
            ) : (
              <Text
                fontSize={{ base: "18px", md: "20px", xl: "24px" }}
                fontWeight="semibold"
                className="landing-page-new"
                color="#fff"
              >
                {liquidity}
              </Text>
            )}
          </Box>
        </Flex>

        {/* BOTTOM METRICS */}
        <SimpleGrid columns={3} gap={3}>
          <Metric
            img={upIcon}
            label="Supply APY"
            value={supplyApy}
            isLoading={isLoading}
          />
          <Metric
            img={downIcon}
            label="Borrow APR"
            value={borrowApr}
            isLoading={isLoading}
          />
          <Metric
            img={percentageIcon}
            label="Utilisation"
            value={utilisation}
            isLoading={isLoading}
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
  isLoading,
}: {
  img: string;
  label: string;
  value: string;
  isLoading?: boolean;
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
    {isLoading ? (
      <Skeleton height="22px" width="60px" />
    ) : (
      <Text
        fontSize={{ base: "18px", md: "20px", xl: "22px" }}
        lineHeight={{ base: "18px", md: "20px", xl: "22px" }}
        fontWeight="semibold"
        className="landing-page-new"
        color="#fff"
      >
        {value}
      </Text>
    )}
  </VStack>
);

export default Login;
