import React from "react";
import { Button, Box, HStack } from "@chakra-ui/react";
import useSocket from "../context/SocketProvider";

const RoomItem = (props) => {
  const { name, onDelete, onJoinRoom, userId, players } = props;

  let color;
  if (players.length >= 2) {
    color = "red";
  } else {
    color = "green";
  }

  return (
    <li>
      <HStack width="320px" justify="space-between">
        <Box color="#487085" fontWeight="bolder" width="120px">
          {name}
        </Box>

        <Box justify="space-between" marginLeft="20px">
          <Button
            backgroundColor="burlywood"
            borderRadius="none"
            color="#487085"
            fontWeight="bold"
            marginRight="5px"
            size="sx"
            fontSize="xs"
            p="0.3rem"
            onClick={() => onJoinRoom(name, userId)}
          >
            Join room
          </Button>

          <Button
            backgroundColor="#487085;"
            borderRadius="none"
            color="burlywood"
            fontWeight="bold"
            marginLeft="5px"
            colorScheme="red"
            size="sx"
            fontSize="xs"
            p="0.3rem"
            onClick={() => onDelete(name)}
          >
            Delete room
          </Button>
        </Box>
        <Box color={`${color}`} fontWeight="bold">
          {players.length}/2
        </Box>
      </HStack>
    </li>
  );
};

export default RoomItem;
