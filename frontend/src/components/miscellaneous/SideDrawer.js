import {
    Button,
    Input,
    Box,
    Text,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Tooltip,
    Avatar,
    useToast,
    Spinner,
    useDisclosure,
    Badge,
} from "@chakra-ui/react";

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { BASE_URL } from "../../config/api";

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();

    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something",
                status: "warning",
                duration: 3000,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const { data } = await axios.get(
                `${BASE_URL}/api/user?search=${search}`,
                config
            );

            setSearchResult(data);
            setLoading(false);
        } catch {
            setLoading(false);
            toast({
                title: "Failed to load results",
                status: "error",
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                `${BASE_URL}/api/chat`,
                { userId },
                config
            );

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch {
            setLoadingChat(false);
            toast({
                title: "Error fetching chat",
                status: "error",
            });
        }
    };

    return (
        <>
            {/* NAVBAR */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="10px"
                borderBottomWidth="1px"
            >
                <Tooltip label="Search Users" hasArrow>
                    <Button variant="ghost" onClick={onOpen}>
                        Search User
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontWeight="bold">
                    Talk-A-Tive
                </Text>

                <Box display="flex" alignItems="center" gap={3}>
                    {/* 🔔 Notifications */}
                    <Menu>
                        <MenuButton position="relative">
                            <BellIcon fontSize="24px" />

                            {notification.length > 0 && (
                                <Badge
                                    colorScheme="red"
                                    borderRadius="full"
                                    position="absolute"
                                    top="-2"
                                    right="-2"
                                    fontSize="0.7em"
                                >
                                    {notification.length}
                                </Badge>
                            )}
                        </MenuButton>

                        <MenuList>
                            {!notification.length && <Text px={3}>No new messages</Text>}

                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(
                                            notification.filter((n) => n !== notif)
                                        );
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New message in ${notif.chat.chatName}`
                                        : `New message from ${getSender(
                                            user,
                                            notif.chat.users
                                        )}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    {/* 👤 Profile */}
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" name={user.name} src={user.pic} />
                        </MenuButton>

                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>

                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>

            {/* DRAWER */}
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box display="flex" mb={3}>
                            <Input
                                placeholder="Search user..."
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>

                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}

                        {loadingChat && <Spinner mt={3} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default SideDrawer;