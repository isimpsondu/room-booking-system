//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Booking {

  uint64[20] private roomIds;
  mapping(uint64 => Room) private rooms;

  struct Room {
    mapping (uint64 => address) reservations;
  }

  function listRooms() external view returns (uint64[20] memory) {
    return roomIds;
  }
}