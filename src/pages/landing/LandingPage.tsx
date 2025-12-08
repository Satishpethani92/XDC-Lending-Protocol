import credibilityHeroImg from "@/assets/images/landing/creditify-1.svg";
import {
  formatCurrency,
  formatPercentage,
  useMainnetAssetDetails,
} from "@/hooks/useMainnetAssetDetails";
import { landingSystem } from "@/landingSystem";
import { ROUTES } from "@/routes/paths";
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bgPatternRight from "../../assets/images/landing/bgPatternRight.png";
import xdcMiniIcon from "../../assets/images/landing/xdc-mini-icon.png";
import usdcIcon from "../../assets/images/usdc.svg";
import BusinessModel from "./BusinessModel";
import CoreProtocol from "./CoreProtocol";
import Footer from "./Footer";
import HowItWorks from "./HowItWorks";
import LandingHeader from "./LandingHeader";
import RiskManagement from "./RiskManagement";
import type { TokenDetailsDTO } from "./types/type";
import WhatCanYouDoOn from "./WhatCanYouDo";
import WhyBuildOnXDC from "./WhyBuildOnXDC";

const LandingPage = () => {
  const navigate = useNavigate();
  // Fetch data for landing page (XDC mainnet by default, or Apothem if VITE_APOTHEM=true)
  const {
    availableLiquidity: wxdcLiquidity,
    utilizationRate: wxdcUtilizationRate,
    supplyApy: wxdcSupplyApy,
    borrowApy: wxdcBorrowApy,
    totalSuppliedUsd: wxdcTvl,
  } = useMainnetAssetDetails("wxdc");

  const {
    availableLiquidity: usdcLiquidity,
    utilizationRate: usdcUtilizationRate,
    supplyApy: usdcSupplyApy,
    borrowApy: usdcBorrowApy,
    totalSuppliedUsd: usdcTvl,
  } = useMainnetAssetDetails("usdc");

  const {
    availableLiquidity: cgoLiquidity,
    utilizationRate: cgoUtilizationRate,
    supplyApy: cgoSupplyApy,
    borrowApy: cgoBorrowApy,
    totalSuppliedUsd: cgoTvl,
  } = useMainnetAssetDetails("cgo");

  const tokenDetails: TokenDetailsDTO[] = [
    {
      symbol: "US",
      shortName: "USDC",
      fullName: "Stablecoin Reserve",
      icon: usdcIcon,
      tvl: usdcTvl,
      tokenInfo: [
        {
          label: "Supply APY",
          value: formatPercentage(parseFloat(usdcSupplyApy)),
        },
        {
          label: "Borrow APY",
          value: formatPercentage(parseFloat(usdcBorrowApy)),
        },
        {
          label: "Liquidity",
          value: formatCurrency(usdcLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(usdcUtilizationRate),
        },
      ],
    },
    {
      symbol: "XDC",
      shortName: "XDC",
      fullName: "XDC Network Reserve",
      icon: xdcMiniIcon,
      tvl: wxdcTvl,
      tokenInfo: [
        {
          label: "Supply APY",
          value: formatPercentage(parseFloat(wxdcSupplyApy)),
        },
        {
          label: "Borrow APY",
          value: formatPercentage(parseFloat(wxdcBorrowApy)),
        },
        {
          label: "Liquidity",
          value: formatCurrency(wxdcLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(wxdcUtilizationRate),
        },
      ],
    },
    /* {
      symbol: "CG",
      shortName: "CGO",
      fullName: "CGO Reserve",
      icon: getTokenLogo("CGO"),
      tvl: cgoTvl,
      tokenInfo: [
        {
          label: "Supply APY",
          value: formatPercentage(parseFloat(cgoSupplyApy)),
        },
        {
          label: "Borrow APY",
          value: formatPercentage(parseFloat(cgoBorrowApy)),
        },
        {
          label: "Available Liquidity",
          value: formatCurrency(cgoLiquidity),
        },
        {
          label: "Utilization",
          value: formatPercentage(cgoUtilizationRate),
        },
      ],
    }, */
  ];

  return (
    <ChakraProvider value={landingSystem}>
      <Box bg="#FFFFFF" minH="100vh" className="landing-page-new">
        <Container fluid backgroundColor="#010006">
          <Container maxW="1400px" h="100%" px={{ base: "0", lg: "inherit" }}>
            {/* LANDING HERO SECTION */}
            <Flex
              as="section"
              alignItems="center"
              justify="center"
              className="hero-section"
            >
              {/* Hero card */}
              <Box
                w="100%"
                maxW="1280px"
                mx="auto"
                bgGradient="linear(to-br, #020617, #020617)"
                borderColor="#2B2D3C"
                borderLeftWidth="1px"
                borderRightWidth="1px"
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left="50%"
                  transform="translateX(-50%)"
                  w="100%"
                  h="400px"
                  bgImage={`url(${bgPatternRight})`}
                  bgRepeat="no-repeat"
                  backgroundPosition="top right"
                  bgSize="cover"
                  opacity={0.6}
                  pointerEvents="none"
                  zIndex={0}
                />
                <Box position={"relative"} zIndex={1}>
                  <LandingHeader />
                  <Box position="relative" zIndex={1}>
                    {/* main heading */}
                    <Box
                      as="h1"
                      fontFamily="system-ui"
                      fontWeight={500}
                      fontSize={{ base: "28px", md: "42px", lg: "52px" }}
                      lineHeight={{ base: "1.2", md: "1.2" }}
                      color="#FFFFFF"
                      mb={{ base: 6, md: 8 }}
                    >
                      Get USDC Loans
                      <br />
                      Using XDC Or CGO
                    </Box>

                    {/* dark pill CTA */}
                    <Box mb={{ base: 6, md: 8 }}>
                      <Box
                        as="button"
                        bg="#ABDEEF33"
                        color="#FFFFFF"
                        borderRadius="md"
                        px={{ base: 4, md: 8 }}
                        py={{ base: 2, md: 3 }}
                        fontSize={{ base: "12px", md: "16px" }}
                        fontWeight={600}
                        boxShadow="0 12px 30px rgba(0,0,0,0.4)"
                        cursor="pointer"
                        _hover={{ bg: "#ABDEEF4D" }}
                        transition="background-color 0.2s"
                        onClick={() =>
                          navigate(`${ROUTES.DASHBOARD}?openSupplyModal=usdc`)
                        }
                      >
                        + And Earn Yield On Idle USDC
                      </Box>
                    </Box>

                    {/* description text */}
                    <Box
                      as="p"
                      maxW={{ base: "100%", md: "560px" }}
                      mx="auto"
                      px={{ base: 4, md: 0 }}
                      fontSize={{ base: "13px", md: "14px" }}
                      lineHeight={{ base: "1.5", md: "1.6" }}
                      color="rgba(255,255,255,0.7)"
                      mb={{ base: 6, md: 8 }}
                    >
                      Creditify is a decentralized lending and borrowing
                      protocol built on the XDC Network, designed for fast,
                      low-cost, and secure access to digital credit.
                    </Box>

                    <Box mb={{ base: 8, md: 12 }}>
                      <Button
                        bg="#ABDFEF"
                        color="#0B1120"
                        borderRadius="999px"
                        px={{ base: 6, md: 10 }}
                        py={{ base: 2, md: 3 }}
                        fontSize={{ base: "13px", md: "15px" }}
                        fontWeight={600}
                        boxShadow="0 16px 40px rgba(56,189,248,0.35)"
                        _hover={{ bg: "#59afc9ff" }}
                        _active={{ bg: "#8fd3e7" }}
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                      >
                        Launch Creditify
                      </Button>
                    </Box>
                  </Box>
                  <Image
                    src={credibilityHeroImg}
                    alt="credetify dashboard illustration"
                    mt={{ base: "-36" }}
                  />
                </Box>
              </Box>
            </Flex>
          </Container>
        </Container>
        <Container fluid>
          <Container maxW="1400px" h="100%" px={{ base: "0", lg: "inherit" }}>
            <WhatCanYouDoOn />
            <HowItWorks />
            <CoreProtocol />
          </Container>
        </Container>
        <Container fluid backgroundColor="#010006">
          <Container maxW="1400px" h="100%" px={{ base: "0", lg: "inherit" }}>
            <WhyBuildOnXDC />
          </Container>
        </Container>
        <Container fluid>
          <Container maxW="1400px" h="100%" px={{ base: "0", lg: "inherit" }}>
            <RiskManagement />
            <BusinessModel />
          </Container>
        </Container>
        <Container fluid backgroundColor="#010006">
          <Container maxW="1400px" h="100%" px={{ base: "0", lg: "inherit" }}>
            <Footer />
          </Container>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
