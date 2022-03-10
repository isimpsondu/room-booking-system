import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import Booking from "../artifacts/contracts/Booking.sol/Booking.json";
declare var window: any;

const bookingContractAddress = "0x330A9Dd3422a49524a5709c298076E80736254E1";
const bookingContractInterface = new ethers.utils.Interface(Booking.abi);
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new Contract(
  bookingContractAddress,
  bookingContractInterface,
  signer
);

export function useRooms() {
  const rooms =
    useContractCall({
      abi: bookingContractInterface,
      address: bookingContractAddress,
      method: "listRooms",
      args: [],
    }) ?? [];
  console.log(rooms);
  return rooms[0];
}

export function useReserve() {
  const { state, send } = useContractFunction(contract, "reserve", {
    transactionName: "Reserve room booking",
  });
  return { state, send };
}

export function useCancel() {
  const { state, send } = useContractFunction(contract, "cancel", {
    transactionName: "Cancel room booking",
  });
  return { state, send };
}
