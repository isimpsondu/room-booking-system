const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Booking", function () {
  it("Should return the list of rooms", async function () {
    const Booking = await ethers.getContractFactory("Booking");
    const booking = await Booking.deploy();
    await booking.deployed();

    const rooms = await booking.listRooms();
    expect(rooms.length).to.equal(20);
  });
});
