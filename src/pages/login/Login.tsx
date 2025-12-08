// LoginLayout.tsx
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  Image,
  Field,
} from "@chakra-ui/react";
import loginBgImg from "../../assets/images/login-bg-img.png";
import logoImg from "../../assets/images/login-logo-img.png";

const Login = () => {
  return (
    <Box minH="100vh" bg={"#fff"} display="flex" alignItems={"center"}>
      <Container maxW="1280px" w={"100%"}>
        <Flex
          justifyContent={"center"}
          alignItems={{ base: "center", lg: "flex-end" }}
          direction={{ base: "column-reverse", md: "row" }}
          gap={{ base: "30px", md: "0" }}
          py={{ base: "30px", lg: "0" }}
        >
          <Box
            w={{ base: "100%", md: "45%", lg: "38%" }}
            px={{ base: 0, md: "15px", lg: 8, xl: 12 }}
          >
            {/* Logo */}
            <Box mb={{ base: "20px", md: "15px", lg: "30px", xl: "40px" }}>
              <Image src={logoImg} alt="logo-img" maxW={"188px"} w={"100%"} />
            </Box>

            {/* Heading + Fields */}
            <VStack align="flex-start" gap={"20px"}>
              <Box>
                <Heading
                  className="landing-page-new"
                  as="h1"
                  fontSize="22px"
                  color="#191D23"
                  fontWeight="700"
                >
                  Log In
                </Heading>
              </Box>

              {/* Email */}
              <Field.Root id="email">
                <Field.Label
                  className="font-general-sans"
                  fontSize="14px"
                  fontWeight={"500"}
                  color="#191D23"
                >
                  Email Address
                </Field.Label>
                <Input
                  placeholder="Enter your email"
                  size="md"
                  borderRadius="4px"
                  borderColor="#D0D5DD"
                />
              </Field.Root>

              {/* Password */}
              <Field.Root id="password">
                <Field.Label
                  className="font-general-sans"
                  fontSize="14px"
                  fontWeight={"500"}
                  color="#191D23"
                >
                  Password
                </Field.Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  size="md"
                  borderRadius="4px"
                  borderColor="#D0D5DD"
                />
              </Field.Root>

              {/* Button */}
              <Button
                w="100%"
                size="lg"
                bg="#262836"
                color="white"
                borderRadius="4px"
                fontWeight="600"
                _hover={{ bg: "#101320" }}
              >
                Log In
              </Button>

              {/* Bottom text */}
              <Box pt={{ base: "10px", md: "10px", lg: "50px", xl: "100px" }}>
                <Text
                  className="font-general-sans"
                  fontSize="12px"
                  color="#262836"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                  mb={3}
                >
                  Why Build on XDC
                </Text>
                <VStack
                  gap={1}
                  align="flex-start"
                  fontSize="12px"
                  fontWeight={"500"}
                  color="#828B99"
                >
                  <Text>2-Second Instant Finality</Text>
                  <Text>Near-Zero Gas Fees</Text>
                  <Text>Global-Scale Performance</Text>
                  <Text>Enterprise-Ready Architecture</Text>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Box
            w={{ base: "100%", md: "55%", lg: "62%" }}
            px={{ base: 0, md: "15px", lg: 8, xl: 12 }}
          >
            <Image
              maxW={{ base: "100%", md: "665px" }}
              mx={"auto"}
              maxH={"684px"}
              src={loginBgImg}
              alt="Creditify login bg"
              w="100%"
              h="100%"
              borderRadius={"24px"}
              objectFit={"cover"}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Login;
