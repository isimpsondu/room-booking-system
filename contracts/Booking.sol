//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Booking {

  uint8 private constant MAX_ROOMS = 20;
  uint8 private constant MAX_TIMESLOTS = 24;

  Room[MAX_ROOMS] private rooms;
  mapping(address => mapping(uint8 => uint8[])) users;

  struct Room {
    address[MAX_TIMESLOTS] reservations;
  }

  modifier roomNotAvailable(uint8 roomIdx, uint8 timeslotIdx) {
    require(roomIdx < MAX_ROOMS ||
      timeslotIdx < MAX_TIMESLOTS ||
      rooms[roomIdx].reservations[timeslotIdx] == address(0), 
      "Room is not available");
    _;
  }

  event RoomReserved(uint8 indexed roomIdx, uint8 indexed timeslotIdx, address user);
  event UserUpdated(uint8 indexed roomIdx, uint8 indexed timeslotIdx, address user);

  function listRooms() external view returns (Room[20] memory) {
    return rooms;
  }

  function getMyBooking(uint8 roomIdx) external view returns (uint8[] memory) {
    return users[msg.sender][roomIdx];
  }

  function reserve(uint8 roomIdx, uint8 timeslotIdx) public
    roomNotAvailable(roomIdx, timeslotIdx) {
      rooms[roomIdx].reservations[timeslotIdx] = msg.sender;
      emit RoomReserved(roomIdx, timeslotIdx, msg.sender);

      users[msg.sender][roomIdx].push(timeslotIdx);
      emit UserUpdated(roomIdx, timeslotIdx, msg.sender);
  }
}