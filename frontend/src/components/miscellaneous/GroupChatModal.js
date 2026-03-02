import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    Box,
    useToast,
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { BASE_URL } from "../../config/api";

const GroupChatModal = ({ children }) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(
                `${BASE_URL}/api/user?search=${query}`,
                config
            );

            setSearchResult(data);
            setLoading(false);
        } catch {
            toast({
                title: "Failed to load search results",
                status: "error",
            });
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length === 0) {
            toast({
                title: "Please fill all fields",
                status: "warning",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                `${BASE_URL}/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );

            setChats([data, ...chats]);
            onClose();

            toast({
                title: "New Group Chat Created!",
                status: "success",
            });
        } catch {
            toast({
                title: "Failed to create chat",
                status: "error",
            });
        }
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Create Group Chat</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl mb={3}>
                            <Input
                                placeholder="Chat Name"
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mb={3}>
                            <Input
                                placeholder="Search Users"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box display="flex" flexWrap="wrap" mb={3}>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>

                        {loading
                            ? "Loading..."
                            : searchResult?.slice(0, 4).map((u) => (
                                <UserListItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleGroup(u)}
                                />
                            ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;