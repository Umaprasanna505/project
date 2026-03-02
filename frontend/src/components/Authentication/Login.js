import {
    Button,
    Input,
    VStack,
    Box,
    FormControl,
    FormLabel,
    useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();   // ✅ v2 toast
    const navigate = useNavigate();
    const { setUser } = ChatState();

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);

        if (!email || !password) {
            toast({
                title: "Warning",
                description: "Please fill all the fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post("/api/user/login", {
                email,
                password,
            });

            toast({
                title: "Success",
                description: "Login Successful",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));

            navigate("/chats");
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message || "Login failed",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }

        setLoading(false);
    };

    return (
        <VStack spacing="12px">

            {/* Email */}
            <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            {/* Password */}
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Box display="flex" gap="8px">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </Box>
            </FormControl>

            <Button
                width="100%"
                colorScheme="blue"
                isLoading={loading}
                onClick={submitHandler}
            >
                Login
            </Button>

            <Button
                width="100%"
                colorScheme="red"
                variant="outline"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Use Guest User
            </Button>

        </VStack>
    );
};

export default Login;