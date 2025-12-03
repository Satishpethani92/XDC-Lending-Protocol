import { Box, Button, Dialog, Icon, Portal, Text } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ContactUsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const handleMailClick = () => {
    window.location.href = "mailto:info@creditify.co";
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          onClose();
        }
      }}
      placement="center"
      motionPreset="slide-in-bottom"
      size="xs"
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="#FFFFFF"
            borderColor="#E0E0E0"
            borderWidth="1px"
            borderRadius="32px"
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
            overflow="hidden"
          >
            <Dialog.Header
              justifyContent="space-between"
              borderBottomWidth="1px"
              borderColor="#F0F0F0"
              bg="#FFFFFF"
            >
              <Dialog.Title color="#0F172A" fontSize="20px" fontWeight={700}>
                Get In Touch
              </Dialog.Title>
              <Dialog.CloseTrigger asChild pos="static">
                <Icon size="xl" cursor="pointer" color="#0F172A">
                  <IoMdClose />
                </Icon>
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body py="30px" color="#0F172A" bg="#FFFFFF">
              <Text
                fontSize={{ base: "14px", md: "16px" }}
                color="#4B5563"
                mb="20px"
                lineHeight="1.6"
              >
                Have questions or feedback? We'd love to hear from you.
              </Text>
              <Box
                bg="rgba(171, 222, 239, 0.1)"
                borderRadius="16px"
                p="15px"
                mb="20px"
                border="1px solid rgba(171, 222, 239, 0.3)"
              >
                <Text
                  fontSize={{ base: "13px", md: "14px" }}
                  color="#0F172A"
                  fontWeight={500}
                >
                  Mail us at
                </Text>
                <Text
                  fontSize={{ base: "16px", md: "18px" }}
                  fontWeight={700}
                  color="#0284C7"
                  mt="8px"
                >
                  info@creditify.co
                </Text>
              </Box>
            </Dialog.Body>
            <Dialog.Footer
              borderTopWidth="1px"
              borderColor="#F0F0F0"
              flexDirection="column"
              gap="12px"
              bg="#FFFFFF"
            >
              <Button
                bg="#ABDFEF"
                color="#0B1120"
                borderRadius="16px"
                fontWeight={600}
                w="100%"
                fontSize={{ base: "14px", md: "15px" }}
                boxShadow="0 4px 12px rgba(171, 222, 239, 0.3)"
                _hover={{ bg: "#59afc9ff" }}
                _active={{ bg: "#8fd3e7" }}
                onClick={handleMailClick}
              >
                Send Email
              </Button>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  borderColor="#E0E0E0"
                  color="#0F172A"
                  borderRadius="16px"
                  fontWeight={600}
                  w="100%"
                  fontSize={{ base: "14px", md: "15px" }}
                  _hover={{ bg: "#F5F5F5" }}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ContactUsModal;
