const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Booking", function () {
  let booking;

  beforeEach(async () => {
    const Booking = await ethers.getContractFactory("Booking");
    booking = await Booking.deploy();
    await booking.deployed();
  });

  it("Should return the list of rooms", async function () {
    const rooms = await booking.listRooms();
    expect(rooms.length).to.equal(20);
  });

  it("Should reserve room if it is available", async function () {
    const roomIdx = 1;
    const timeslotIdx = 8;

    await booking.reserve(roomIdx, timeslotIdx);
    const myBooking = await booking.getMyBooking(roomIdx);
    expect(myBooking).contains(timeslotIdx);
  });
});
