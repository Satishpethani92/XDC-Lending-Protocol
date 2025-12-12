import xdcIcon from "@/assets/images/xdc-icon.webp";
import Footer from "@/components/Footer";
import FormattedCounter from "@/components/ui/Counter/FormattedCounter";
import { useAssetDetails } from "@/hooks/useAssetDetails";
import { useChainConfig } from "@/hooks/useChainConfig";
import Header from "@/pages/Header";
import { ROUTES } from "@/routes/paths";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Menu,
  Portal,
  Spinner,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import ConnectYourWalletContent from "../ConnectYourWalletContent";
import AssetInfo from "./AssetInfo";
import AssetOverview from "./AssetOverview";

const AssetDetails = () => {
  const [tab, setTab] = useState("overview");
  const { network } = useChainConfig();
  const isTabLayout = useBreakpointValue({ base: true, xl: false });
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "xdc";
  const navigate = useNavigate();

  const {
    tokenInfo,
    reserveSize,
    availableLiquidity,
    utilizationRate,
    oraclePrice,
    isLoading,
    cTokenAddress,
    variableDebtTokenAddress,
  } = useAssetDetails(token);

  const { chain, isConnected } = useAccount();

  const handleOpenExplorer = (address: string) => {
    if (!address || !chain?.blockExplorers?.default?.url) return;
    const explorerUrl = `${chain.blockExplorers.default.url}/address/${address}`;
    window.open(explorerUrl, "_blank");
  };

  const addToWallet = async (
    address: string,
    symbol: string,
    decimals: number
  ) => {
    if (!address || address === "") {
      console.error("Invalid token address");
      return;
    }

    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask not detected");
      return;
    }

    try {
      // Don't provide symbol - let MetaMask read it from the contract
      // This avoids symbol mismatch errors with debt tokens
      const result = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: address as `0x${string}`,
            decimals: decimals,
            image: tokenInfo.icon,
          },
        },
      });
      console.log("Add token result:", result);
    } catch (error: any) {
      console.error("Failed to add token to wallet:", error);
      alert(
        "Unable to add token to wallet automatically. Please add it manually using the contract address: " +
          address
      );
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Container
          maxW="container.xl"
          px={{ base: 4, md: 6 }}
          py={4}
          pt="80px"
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Container>
      </>
    );
  }

  if (!isConnected) {
    return (
      <Box display="flex" flexDirection="column" minH="100vh">
        <Header />
        <Box pt={"25px"} pb={"80px"} maxH={"245px"} bg={"#2b2d3c"}>
          <Container
            maxW={{
              base: "100%",
              lg: "container.lg",
              xl: "container.xl",
              "2xl": "container.2xl",
            }}
            px={{ base: "auto", "2xl": "0" }}
            h="100%"
          >
            <Flex alignItems="center" gap="10px" mb="15px">
              <Button
                variant={"plain"}
                className="btn-color-dark-1-hover"
                size="sm"
                onClick={() => navigate(ROUTES.DASHBOARD)}
              >
                <Icon size="md">
                  <IoMdArrowBack />
                </Icon>
                Go Back
              </Button>
              <Flex gap="2" alignItems="center">
                <img
                  src={xdcIcon}
                  alt="XDC"
                  style={{ height: "28px", width: "28px" }}
                />
                <Heading size="lg" className="text-white-1">
                  XDC {network.name.replace(/^XDC\s+/i, "")} Market
                </Heading>
              </Flex>
            </Flex>

            <Flex
              alignItems={{ base: "flex-start", lg: "center" }}
              gap={{ base: "15px", lg: "32px" }}
              flexWrap="wrap"
              flexDirection={{ base: "column", lg: "row" }}
            >
              <Flex gap="3" alignItems="center">
                <Image
                  src={tokenInfo.icon}
                  width="40px"
                  height="40px"
                  alt={tokenInfo.symbol}
                />
                <Flex direction="column">
                  <Heading size="md" className="light-text-2">
                    {tokenInfo.symbol}
                  </Heading>
                  <Flex gap="2" alignItems="center">
                    <Heading
                      size="xl"
                      fontWeight="700"
                      className="text-white-1"
                    >
                      {tokenInfo.fullName}
                    </Heading>
                  </Flex>
                </Flex>
              </Flex>

              <Box
                as="hr"
                borderWidth="1px"
                height="42px"
                borderColor={"#62677b"}
                display={{ base: "none", lg: "block" }}
              />

              <Flex gap={{ base: "15px", md: "32px" }} flexWrap="wrap" flex="1">
                <Flex direction="column">
                  <Box fontSize="sm" className="light-text-1">
                    Reserve Size
                  </Box>
                  <FormattedCounter
                    value={reserveSize}
                    fontSize={21}
                    textColor="#fff"
                    prefix="$"
                    decimalPlaces={2}
                  />
                </Flex>

                <Flex direction="column">
                  <Box fontSize="sm" className="light-text-1">
                    Available liquidity
                  </Box>
                  <FormattedCounter
                    value={availableLiquidity}
                    fontSize={21}
                    textColor="#fff"
                    prefix="$"
                    decimalPlaces={2}
                  />
                </Flex>

                <Flex direction="column">
                  <Box fontSize="sm" className="light-text-1">
                    Utilization Rate
                  </Box>
                  <FormattedCounter
                    value={utilizationRate}
                    fontSize={21}
                    textColor="#fff"
                    suffix="%"
                    decimalPlaces={2}
                  />
                </Flex>

                <Flex direction="column">
                  <Box fontSize="sm" className="light-text-1">
                    Oracle price
                  </Box>
                  <FormattedCounter
                    value={oraclePrice}
                    fontSize={21}
                    textColor="#fff"
                    prefix="$"
                    decimalPlaces={oraclePrice < 10 ? 4 : 2}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Container>
        </Box>
        <Container
          maxW={{
            base: "100%",
            lg: "container.lg",
            xl: "container.xl",
            "2xl": "container.2xl",
          }}
          px={{ base: "auto", "2xl": "0" }}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="60vh"
        >
          <ConnectYourWalletContent />
        </Container>
        <Box mt="auto">
          <Footer />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box pt={"25px"} pb={{ base: "60px", xl: "100px" }} bg={"#2b2d3c"}>
        <Container
          maxW={{
            base: "100%",
            lg: "container.lg",
            xl: "container.xl",
            "2xl": "container.2xl",
          }}
          px={{ base: "auto", "2xl": "0" }}
          h="100%"
        >
          <Flex alignItems="center" gap="10px" mb="15px">
            <Button
              variant={"plain"}
              className="btn-color-dark-1-hover"
              size="sm"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              <Icon size="md">
                <IoMdArrowBack />
              </Icon>
              Go Back
            </Button>
            <Flex gap="2" alignItems="center">
              <img
                src={xdcIcon}
                alt="XDC"
                style={{ height: "28px", width: "28px" }}
              />
              <Heading size="lg" className="text-white-1">
                XDC {network.name.replace(/^XDC\s+/i, "")} Market
              </Heading>
            </Flex>
          </Flex>

          <Flex
            alignItems={{ base: "flex-start", lg: "center" }}
            gap={{ base: "15px", lg: "32px" }}
            flexWrap="wrap"
            flexDirection={{ base: "column", lg: "row" }}
          >
            <Flex gap="3" alignItems="center">
              <Image
                src={tokenInfo.icon}
                width="40px"
                height="40px"
                alt={tokenInfo.symbol}
              />
              <Flex direction="column">
                <Heading size="md" className="light-text-2">
                  {tokenInfo.symbol}
                </Heading>
                <Flex gap="2" alignItems="center">
                  <Heading size="xl" fontWeight="700" className="text-white-1">
                    {tokenInfo.fullName}
                  </Heading>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button
                        width="24px"
                        height="24px"
                        minWidth="auto"
                        p="5px"
                        variant="plain"
                        className="btn-color-dark-1-hover"
                        borderRadius="50%"
                        // onClick={handleOpenExplorer}
                        title="View on Explorer"
                      >
                        <Icon size="sm" className="icon-dark">
                          <FiExternalLink />
                        </Icon>
                      </Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content w={"200px"}>
                          <Menu.ItemGroup>
                            <Menu.ItemGroupLabel>
                              Underlying Token
                            </Menu.ItemGroupLabel>
                            <Menu.Item
                              value={tokenInfo.symbol}
                              cursor={"pointer"}
                              onClick={() =>
                                handleOpenExplorer(tokenInfo.address)
                              }
                            >
                              <Flex gap="2" alignItems="center">
                                <img
                                  src={tokenInfo.icon}
                                  alt={tokenInfo.name}
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </Flex>
                              {tokenInfo.symbol}
                            </Menu.Item>
                          </Menu.ItemGroup>
                          <Menu.Separator />
                          <Menu.ItemGroup>
                            <Menu.ItemGroupLabel>
                              Creditify cToken
                            </Menu.ItemGroupLabel>
                            <Menu.Item
                              value={`c${tokenInfo.symbol}`}
                              cursor={"pointer"}
                              onClick={() =>
                                handleOpenExplorer(cTokenAddress || "")
                              }
                            >
                              <Flex gap="2" alignItems="center">
                                <img
                                  src={tokenInfo.icon}
                                  alt={tokenInfo.name}
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </Flex>
                              {`c${tokenInfo.symbol}`}
                            </Menu.Item>
                          </Menu.ItemGroup>
                          <Menu.Separator />
                          <Menu.ItemGroup>
                            <Menu.ItemGroupLabel>
                              Creditify debt Token
                            </Menu.ItemGroupLabel>
                            <Menu.Item
                              value={`debt${tokenInfo.symbol}`}
                              cursor={"pointer"}
                              onClick={() =>
                                handleOpenExplorer(
                                  variableDebtTokenAddress || ""
                                )
                              }
                            >
                              <Flex gap="2" alignItems="center">
                                <img
                                  src={tokenInfo.icon}
                                  alt={tokenInfo.name}
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </Flex>
                              Variable debt {tokenInfo.symbol}
                            </Menu.Item>
                          </Menu.ItemGroup>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>

                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button
                        width="24px"
                        height="24px"
                        minWidth="auto"
                        p="5px"
                        variant="plain"
                        className="btn-color-dark-1-hover"
                        borderRadius="50%"
                        // onClick={addToWallet}
                        title="Add to Wallet"
                      >
                        <Icon size="sm" className="icon-dark">
                          <IoWalletOutline />
                        </Icon>
                      </Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content w={"200px"}>
                          <Menu.ItemGroup>
                            <Menu.ItemGroupLabel>
                              Underlying Token
                            </Menu.ItemGroupLabel>
                            <Menu.Item
                              value={tokenInfo.symbol}
                              cursor={"pointer"}
                              onClick={() =>
                                addToWallet(
                                  tokenInfo.address,
                                  tokenInfo.symbol,
                                  tokenInfo.decimals
                                )
                              }
                            >
                              <Flex gap="2" alignItems="center">
                                <img
                                  src={tokenInfo.icon}
                                  alt={tokenInfo.name}
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </Flex>
                              {tokenInfo.symbol}
                            </Menu.Item>
                          </Menu.ItemGroup>
                          <Menu.Separator />
                          <Menu.ItemGroup>
                            <Menu.ItemGroupLabel>
                              Creditify cToken
                            </Menu.ItemGroupLabel>
                            <Menu.Item
                              value={`c${tokenInfo.symbol}`}
                              cursor={"pointer"}
                              onClick={() =>
                                addToWallet(
                                  cTokenAddress || "",
                                  `c${tokenInfo.symbol}`,
                                  tokenInfo.decimals
                                )
                              }
                              disabled={!cTokenAddress}
                            >
                              <Flex gap="2" alignItems="center">
                                <img
                                  src={tokenInfo.icon}
                                  alt={tokenInfo.name}
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </Flex>
                              {`c${tokenInfo.symbol}`}
                            </Menu.Item>
                          </Menu.ItemGroup>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Flex>
              </Flex>
            </Flex>

            <Box
              as="hr"
              borderWidth="1px"
              height="42px"
              borderColor={"#62677b"}
              display={{ base: "none", lg: "block" }}
            />

            <Flex gap={{ base: "15px", md: "32px" }} flexWrap="wrap" flex="1">
              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Reserve Size
                </Box>
                <FormattedCounter
                  value={reserveSize}
                  fontSize={21}
                  textColor="#fff"
                  prefix="$"
                  decimalPlaces={2}
                />
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Available liquidity
                </Box>
                <FormattedCounter
                  value={availableLiquidity}
                  fontSize={21}
                  textColor="#fff"
                  prefix="$"
                  decimalPlaces={2}
                />
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Utilization Rate
                </Box>
                <FormattedCounter
                  value={utilizationRate}
                  fontSize={21}
                  textColor="#fff"
                  suffix="%"
                  decimalPlaces={2}
                />
              </Flex>

              <Flex direction="column">
                <Box fontSize="sm" className="light-text-1">
                  Oracle price
                </Box>
                <FormattedCounter
                  value={oraclePrice}
                  fontSize={21}
                  textColor="#fff"
                  prefix="$"
                  decimalPlaces={oraclePrice < 10 ? 4 : 2}
                />
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container
        maxW={{
          base: "100%",
          lg: "container.lg",
          xl: "container.xl",
          "2xl": "container.2xl",
        }}
        px={{ base: "auto", "2xl": "0" }}
        h="100%"
      >
        <Box mt={{ base: "-25px", xl: "-50px" }}>
          {isTabLayout ? (
            <Tabs.Root
              value={tab}
              onValueChange={(val) => setTab(val.value)}
              variant="plain"
              w="100%"
            >
              <Tabs.List
                rounded="l2"
                w={{ base: "100%", md: "50%" }}
                p="2px"
                className="btn-color-dark-1-hover no-hover"
              >
                <Tabs.Trigger
                  value="overview"
                  w="100%"
                  justifyContent="center"
                  className={`info-tab ${tab === "overview" ? "active" : ""}`}
                >
                  Overview
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="info"
                  w="100%"
                  justifyContent="center"
                  className={`info-tab ${tab === "info" ? "active" : ""}`}
                >
                  Your Info
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
              </Tabs.List>

              <Tabs.Content value="overview">
                <AssetOverview token={token} />
              </Tabs.Content>

              <Tabs.Content value="info">
                <AssetInfo token={token} />
              </Tabs.Content>
            </Tabs.Root>
          ) : (
            <Flex gap="4" direction={{ base: "column", xl: "row" }}>
              <AssetOverview token={token} />
              <AssetInfo token={token} />
            </Flex>
          )}
        </Box>
      </Container>
      <Box mt="auto">
        <Footer />
      </Box>
    </Box>
  );
};

export default AssetDetails;
