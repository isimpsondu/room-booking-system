const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Booking", function () {
  let booking;

  beforeEach(async () => {
    const Booking = await ethers.getContractFactory("Booking");
    booking = await Booking.deploy();
    await booking.deployed();
  });

  it("Should be able to return the list of rooms", async function () {
    const rooms = await booking.listRooms();
    expect(rooms.length).to.equal(20);
  });

  it("Should be able to reserve room if it is available", async function () {
    const roomIdx = 1;
    const timeslotIdx = 8;

    await booking.reserve(roomIdx, timeslotIdx);
    const myBooking = await booking.getMyBooking(roomIdx);
    expect(myBooking[timeslotIdx]).to.equal(1);
  });

  it("Should revert if the room is not available", async function () {
    const roomIdx = 1;
    const timeslotIdx = 8;

    await booking.reserve(roomIdx, timeslotIdx);
    await expect (
      booking.reserve(roomIdx, timeslotIdx)
    ).to.be.revertedWith("Room is not available");
  });

  it("Should not cancel the room if you are not the owner", async function () {
    const roomIdx = 2;
    const timeslotIdx = 10;

    await expect(booking.cancel(roomIdx, timeslotIdx)).to.be.revertedWith(
      "You are not the room owner"
    );
  });

  it("Should be able to cancel the room if you are the owner", async function () {
    const roomIdx = 2;
    const timeslotIdx = 10;

    await booking.reserve(roomIdx, timeslotIdx);
    await booking.cancel(roomIdx, timeslotIdx);

    const myBooking = await booking.getMyBooking(roomIdx);
    expect(myBooking[timeslotIdx]).to.equal(2);
  });
});
