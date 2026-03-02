import {
    Button,
    Input,
    VStack,
    Box,
    FormControl,
    FormLabel,
    useToast,
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const toast = useToast(); // updated

    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        if (!name || !email || !password || !confirmpassword) {
            toast({
                description: "Please fill all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (password !== confirmpassword) {
            toast({
                description: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post("/api/user", { name, email, password, pic });
            toast({
                description: "Registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/chats");
        } catch (error) {
            toast({
                description: error?.response?.data?.message || "Signup failed",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    const postDetails = (file) => {
        if (!file) return;
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "piyushproj");

        fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => setPic(data.url))
            .catch(console.error);
    };

    return (
        <VStack gap="12px">

            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Box display="flex" gap="8px">
                    <Input
                        type={show ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </Box>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                    type={show ? "text" : "password"}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                />
            </FormControl>

            <FormControl>
                <FormLabel>Profile Picture</FormLabel>
                <Input type="file" accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>

            <Button colorScheme="blue" width="100%" isLoading={loading} onClick={submitHandler}>
                Sign Up
            </Button>

        </VStack>
    );
};

export default Signup;