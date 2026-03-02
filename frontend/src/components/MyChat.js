import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { BASE_URL } from "../config/api";

const MyChats = ({ fetchAgain }) => {
    const toast = useToast();
    const [loggedUser, setLoggedUser] = useState();

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${BASE_URL}/api/chat`, config);
            setChats(data);
        } catch (error) {
            toast({
                title: "Failed to load chats",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            p={3}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            w={{ base: "100%", md: "31%" }}
        >
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Text fontWeight="bold">My Chats</Text>

                <GroupChatModal>
                    <Button rightIcon={<AddIcon />}>New Group Chat</Button>
                </GroupChatModal>
            </Box>

            <Box bg="#F8F8F8" borderRadius="lg" p={3}>
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                key={chat._id}
                                cursor="pointer"
                                onClick={() => setSelectedChat(chat)}
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;