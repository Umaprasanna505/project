import { Stack, Skeleton } from "@chakra-ui/react";

const ChatLoading = () => {
    return (
        <Stack gap="10px">
            {[...Array(12)].map((_, i) => (
                <Skeleton key={i} height="45px" />
            ))}
        </Stack>
    );
};

export default ChatLoading;