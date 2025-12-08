import { ROUTES } from "@/routes/paths";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import creditifyImg from "../../assets/images/landing/landing-creditify-logo.svg";

interface LandingHeaderProps {
  showHowItWorks?: boolean;
}

const LandingHeader = ({ showHowItWorks = true }: LandingHeaderProps) => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box
      as={"header"}
      bg={"#06080E"}
      border="1px solid #ABDEEF4D"
      p={{ base: "15px 10px", sm: "20px" }}
      maxW={{ base: "100%", lg: "537px" }}
      mx={{ base: "15px", lg: "auto" }}
      mt={{ base: "30px", sm: "50px" }}
      borderRadius={"8px"}
      mb={{ base: "20px", md: "50px", lg: "100px" }}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} gap={"25px"}>
        {showHowItWorks && (
          <Box
            as="button"
            onClick={() => scrollToSection("how-creditify-works")}
            className="nav-link"
            cursor="pointer"
            color="#FFFFFF99"
            borderBottomWidth={"1px"}
            borderColor="#FFFFFF99"
            fontSize={{ base: "13px", sm: "16px" }}
          >
            How it Works
          </Box>
        )}
        <Image
          src={creditifyImg}
          maxW={{ base: "100px", sm: "133px" }}
          alt="Creditify-logo"
        />
        <Box
          as="button"
          className="nav-link"
          cursor="pointer"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          color="#FFFFFF99"
          borderBottomWidth={"1px"}
          borderColor="#FFFFFF99"
          fontSize={{ base: "13px", sm: "16px" }}
        >
          Launch Creditify
        </Box>
        {/*<Box className="landing-btn">
          <ConnectButton
            label="Connect Wallet"
            chainStatus="none"
            showBalance={false}
            accountStatus="address"
          />
        </Box> */}
      </Flex>
    </Box>
  );
};

export default LandingHeader;
