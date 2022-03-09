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
  mapping(address => 
    mapping(uint8 => BookingState[MAX_TIMESLOTS])) 
      private users;

  struct Room {
    address[MAX_TIMESLOTS] reservations;
  }

  function isTimeslotAvailable(uint8 roomIdx, uint8 timeslotIdx, uint8 countInHour) 
    private view returns (bool) {
      if (timeslotIdx + countInHour > MAX_TIMESLOTS) {
        return false;
      }
      for (uint8 i = timeslotIdx; i < countInHour; i++) {
        if (rooms[roomIdx].reservations[i] != address(0)) {
          return false;
        }
      }
      return true;
  }

  modifier isRoomAvailable(uint8 roomIdx, uint8 timeslotIdx, uint8 countInHour) {
    require(roomIdx < MAX_ROOMS &&
      timeslotIdx < MAX_TIMESLOTS &&
      rooms[roomIdx].reservations[timeslotIdx] == address(0) && 
      isTimeslotAvailable(roomIdx, timeslotIdx, countInHour), 
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
    uint8 countInHour,
    address user);
  event RoomCancelled(uint8 indexed roomIdx, 
    uint8 indexed timeslotIdx, 
    uint8 countInHour,
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

  function reserveRoom(uint8 roomIdx, uint8 timeslotIdx, uint8 countInHour) 
    private {
      for (uint8 i = 0; i < countInHour; i++) {
        rooms[roomIdx].reservations[timeslotIdx +i] = msg.sender;
      }
      emit RoomReserved(roomIdx, timeslotIdx, countInHour, msg.sender);
  }

  function cancelRoom(uint8 roomIdx, uint8 timeslotIdx) 
    private returns (uint8, uint8) {
      uint8 i = timeslotIdx;
      while (i >= 0 && rooms[roomIdx].reservations[i] == msg.sender) {
        i--;
      }
      uint8 startTimeslotIdx = i + 1;
      uint8 j = startTimeslotIdx;
      do {
        rooms[roomIdx].reservations[j] = address(0);
        j++;
      } while (j < MAX_TIMESLOTS && 
        rooms[roomIdx].reservations[j] == msg.sender);
      uint8 countInHour = j - startTimeslotIdx;
      emit RoomCancelled(roomIdx, timeslotIdx, countInHour, msg.sender);
      return (startTimeslotIdx, countInHour);
  }

  function updateUser(uint8 roomIdx, uint8 timeslotIdx, uint8 count, 
    BookingState bookingState) 
    private {
      for (uint8 i = 0; i < count; i++) {
        users[msg.sender][roomIdx][timeslotIdx + i] = bookingState;
      }
      emit UserUpdated(msg.sender, roomIdx, timeslotIdx, 
        bookingState);
  }

  function reserve(uint8 roomIdx, uint8 timeslotIdx, uint8 countInHour) 
    external
    isRoomAvailable(roomIdx, timeslotIdx, countInHour) {
      reserveRoom(roomIdx, timeslotIdx, countInHour);
      updateUser(roomIdx, timeslotIdx, countInHour, 
        BookingState.Reserved);
  }

  function cancel(uint8 roomIdx, uint8 timeslotIdx) external 
    onlyOwner(roomIdx, timeslotIdx) 
    returns (uint8) {
      (uint8 startTimeslotIdx, uint8 countInHour) = cancelRoom(
        roomIdx, timeslotIdx);
      updateUser(roomIdx, startTimeslotIdx, countInHour, 
        BookingState.Cancelled);
      return countInHour;
  } 
}