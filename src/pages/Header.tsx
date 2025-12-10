import * as Menu from "@/components/ui/menu";
import { ROUTES } from "@/routes/paths";
import { Box, Flex, IconButton, Switch, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LuSettings } from "react-icons/lu";
import { NavLink } from "react-router";
import creditify from "src/assets/images/creditify logo light.svg";
import { useAccount, useSwitchChain } from "wagmi";
import { xdc, xdcTestnet } from "wagmi/chains";

const Header = () => {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();

  const isTestnet = chain?.id === xdcTestnet.id;

  const handleNetworkToggle = (checked: boolean) => {
    const targetChainId = checked ? xdcTestnet.id : xdc.id;
    switchChain({ chainId: targetChainId });
  };

  return (
    <>
      <Box
        position="sticky"
        top="0"
        py={"15px"}
        right="0"
        left={"0"}
        zIndex="1000"
        bg={"#2b2d3c"}
      >
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          px={"20px"}
        >
          <NavLink to={ROUTES.HOME}>
            <Box width={{ base: "160px", md: "170px" }} cursor="pointer">
              <img src={creditify} alt="Creditify Logo" />
            </Box>
          </NavLink>
          <Flex alignItems="center" gap="12px">
            <ConnectButton
              label="Connect Wallet"
              chainStatus="none"
              showBalance={false}
              accountStatus="address"
            />
            <Menu.MenuRoot>
              <Menu.MenuTrigger asChild>
                <IconButton variant="subtle" size="sm" aria-label="Settings">
                  <LuSettings />
                </IconButton>
              </Menu.MenuTrigger>
              <Menu.MenuContent minW="180px">
                <Menu.MenuItem
                  value="testnet"
                  closeOnSelect={false}
                  justifyContent="space-between"
                >
                  <Text>Apothem Network</Text>
                  <Switch.Root
                    size="sm"
                    checked={isTestnet}
                    onCheckedChange={(e) => handleNetworkToggle(e.checked)}
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                </Menu.MenuItem>
              </Menu.MenuContent>
            </Menu.MenuRoot>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
