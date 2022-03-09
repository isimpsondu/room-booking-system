//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Booking {

  uint8 private constant MAX_ROOMS = 20;
  uint8 private constant MAX_TIMESLOTS = 24;

  enum BookingState {
    None,
    Reserved,
    Cancelled
  }

  Room[MAX_ROOMS] private rooms;
  mapping(address => mapping(uint8 => BookingState[MAX_TIMESLOTS])) users;

  struct Room {
    address[MAX_TIMESLOTS] reservations;
  }

  modifier isRoomAvailable(uint8 roomIdx, uint8 timeslotIdx) {
    require(roomIdx < MAX_ROOMS &&
      timeslotIdx < MAX_TIMESLOTS &&
      rooms[roomIdx].reservations[timeslotIdx] == address(0), 
      "Room is not available");
    _;
  }

  modifier onlyOwner(uint8 roomIdx, uint8 timeslotIdx){
    require(msg.sender == rooms[roomIdx].reservations[timeslotIdx], 
      "You are not the room owner");
    _;
  }

  event RoomReserved(uint8 indexed roomIdx, 
    uint8 indexed timeslotIdx, 
    address user);
  event RoomCancelled(uint8 indexed roomIdx, 
    uint8 indexed timeslotIdx, 
    address user);
  event UserUpdated(address indexed user, 
    uint8 indexed roomIdx, 
    uint8 indexed timeslotIdx,
    BookingState bookingState);

  function listRooms() external view returns (Room[20] memory) {
    return rooms;
  }

  function getMyBooking(uint8 roomIdx) external view 
    returns (BookingState[MAX_TIMESLOTS] memory) {
    return users[msg.sender][roomIdx];
  }

  function reserve(uint8 roomIdx, uint8 timeslotIdx) external
    isRoomAvailable(roomIdx, timeslotIdx) {
      rooms[roomIdx].reservations[timeslotIdx] = msg.sender;
      emit RoomReserved(roomIdx, timeslotIdx, msg.sender);

      users[msg.sender][roomIdx][timeslotIdx] = BookingState.Reserved;
      emit UserUpdated(msg.sender, roomIdx, timeslotIdx, BookingState.Reserved);
  }

  function cancel(uint8 roomIdx, uint8 timeslotIdx) external 
    onlyOwner(roomIdx, timeslotIdx) {
      rooms[roomIdx].reservations[timeslotIdx] = address(0);
      emit RoomCancelled(roomIdx, timeslotIdx, msg.sender);

      users[msg.sender][roomIdx][timeslotIdx] = BookingState.Cancelled;
      emit UserUpdated(msg.sender, roomIdx, timeslotIdx, BookingState.Cancelled);
  } 
}