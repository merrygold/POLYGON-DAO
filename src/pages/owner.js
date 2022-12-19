import "./pages.css";
import React, { useState } from "react";
import "./pages.css";
import { Form, Button } from "web3uikit";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Owner = () => {
  // * Function for POLYGONSCAN
  const CloseButton = ({ closeToast }) => (
    <button
      style={{
        borderRadius: "20px",
        backgroundColor: "green",
        border: "solid 2px black",
      }}
    >
      {" "}
      <a
        style={{ color: "white", textDecoration: "none" }}
        href={polygonScan}
        onClick={closeToast}
      >
        Watch on Scan
      </a>{" "}
    </button>
  );

  // * State Management
  const [withdrawLoading, setWithDrawLoading] = useState(false);
  // * State for PolygonScan Management
  const [polygonScan, setPolygonScan] = useState("");

  // * State for New Member
  const [subNewMember, setSubNewMember] = useState(false);

  // * State for Revoke Member
  const [subRevokeMember, setSubRevokeMember] = useState(false);
  // * Using Wagmi Hook
  const { isConnected } = useAccount();

  // * CONTRACT ABI
  const ContractABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "votesUp",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "votesDown",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "voter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "proposal",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "votedFor",
          type: "bool",
        },
      ],
      name: "newVote",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        { indexed: false, internalType: "bool", name: "passed", type: "bool" },
      ],
      name: "proposalCount",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "requiredAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "proposer",
          type: "address",
        },
      ],
      name: "proposalCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "userPID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "userAddress",
          type: "address",
        },
        { indexed: false, internalType: "bool", name: "added", type: "bool" },
        { indexed: false, internalType: "bool", name: "removed", type: "bool" },
      ],
      name: "userRegistered",
      type: "event",
    },
    {
      inputs: [],
      name: "DAOowner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "Donate",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "IdToAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "IdToRegistered",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MEMBER_REQUEST_ID",
      outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "OWNER_REQUEST_ID",
      outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "Proposals",
      outputs: [
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "bool", name: "exists", type: "bool" },
        { internalType: "string", name: "description", type: "string" },
        { internalType: "uint256", name: "RequiredAmount", type: "uint256" },
        { internalType: "address", name: "proposer", type: "address" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "uint256", name: "votesUp", type: "uint256" },
        { internalType: "uint256", name: "votesDown", type: "uint256" },
        { internalType: "bool", name: "countConducted", type: "bool" },
        { internalType: "bool", name: "passed", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "addressToDonation",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "addressToId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
      name: "countVotes",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_description", type: "string" },
        { internalType: "uint256", name: "_requiredAmount", type: "uint256" },
      ],
      name: "createProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getDaoBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getSupportedRequests",
      outputs: [{ internalType: "uint64[]", name: "arr", type: "uint64[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint64", name: "requestId", type: "uint64" }],
      name: "getZKPRequest",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "schema", type: "uint256" },
            { internalType: "uint256", name: "slotIndex", type: "uint256" },
            { internalType: "uint256", name: "operator", type: "uint256" },
            { internalType: "uint256[]", name: "value", type: "uint256[]" },
            { internalType: "string", name: "circuitId", type: "string" },
          ],
          internalType: "struct ICircuitValidator.CircuitQuery",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "isMember",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_userPID", type: "uint256" }],
      name: "newMembership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint64", name: "", type: "uint64" },
      ],
      name: "proofs",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "proposalId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      name: "requestQueries",
      outputs: [
        { internalType: "uint256", name: "schema", type: "uint256" },
        { internalType: "uint256", name: "slotIndex", type: "uint256" },
        { internalType: "uint256", name: "operator", type: "uint256" },
        { internalType: "string", name: "circuitId", type: "string" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      name: "requestValidators",
      outputs: [
        {
          internalType: "contract ICircuitValidator",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_memberAddress", type: "address" },
      ],
      name: "revokeMembership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint64", name: "requestId", type: "uint64" },
        {
          internalType: "contract ICircuitValidator",
          name: "validator",
          type: "address",
        },
        {
          components: [
            { internalType: "uint256", name: "schema", type: "uint256" },
            { internalType: "uint256", name: "slotIndex", type: "uint256" },
            { internalType: "uint256", name: "operator", type: "uint256" },
            { internalType: "uint256[]", name: "value", type: "uint256[]" },
            { internalType: "string", name: "circuitId", type: "string" },
          ],
          internalType: "struct ICircuitValidator.CircuitQuery",
          name: "query",
          type: "tuple",
        },
      ],
      name: "setZKPRequest",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint64", name: "requestId", type: "uint64" },
        { internalType: "uint256[]", name: "inputs", type: "uint256[]" },
        { internalType: "uint256[2]", name: "a", type: "uint256[2]" },
        { internalType: "uint256[2][2]", name: "b", type: "uint256[2][2]" },
        { internalType: "uint256[2]", name: "c", type: "uint256[2]" },
      ],
      name: "submitZKPResponse",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "supportedRequests",
      outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_id", type: "uint256" },
        { internalType: "bool", name: "_vote", type: "bool" },
      ],
      name: "voteOnProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  // * BASE URL
  const BaseUrl = "https://mumbai.polygonscan.com/tx/";

  // * Setup Chain & Contract Address
  const address = "0x80A6B117511c6527E57F25D04D9adfee23Ae1B0E";

  async function withDrawFunds() {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    const daoVerifier = new ethers.Contract(address, ContractABI, signer);
    // * Gas Calculation
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: "get",
        url: "https://gasstation-mumbai.matic.today/v2",
      });
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + "",
        "gwei"
      );
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + "",
        "gwei"
      );
    } catch {
      // ignore
    }

    try {
      const donateTxn = await daoVerifier.withdrawAll({
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000",
      });
      await donateTxn.wait(2);
      const HASH = donateTxn.hash;
      const URL = BaseUrl + HASH;
      setPolygonScan(URL);
      toast.success("WithDrawl is Succesfull", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setWithDrawLoading(false);
    } catch (error) {
      toast.error("Transaction Failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    

      setWithDrawLoading(false);
    }
  }

  async function createNewMember(userPID) {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    const daoVerifier = new ethers.Contract(address, ContractABI, signer);
    // * Gas Calculation
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: "get",
        url: "https://gasstation-mumbai.matic.today/v2",
      });
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + "",
        "gwei"
      );
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + "",
        "gwei"
      );
    } catch {
      // ignore
    }

    try {
      const donateTxn = await daoVerifier.newMembership(userPID, {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000",
      });
      await donateTxn.wait(2);
      const HASH = donateTxn.hash;
      const URL = BaseUrl + HASH;
      setPolygonScan(URL);
      toast.success("New Membership Succesfull", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSubNewMember(false);
    } catch (error) {
      toast.error("Transaction Failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });


      setSubNewMember(false);
    }
  }

  async function rewokeMember(revokeAddress) {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();

    const daoVerifier = new ethers.Contract(address, ContractABI, signer);
    // * Gas Calculation
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: "get",
        url: "https://gasstation-mumbai.matic.today/v2",
      });
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + "",
        "gwei"
      );
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + "",
        "gwei"
      );
    } catch {
      // ignore
    }

    try {
      const donateTxn = await daoVerifier.revokeMembership(revokeAddress, {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000",
      });
      await donateTxn.wait(2);
      const HASH = donateTxn.hash;
      const URL = BaseUrl + HASH;
      setPolygonScan(URL);
      toast.success("Membership Revoked Succesfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setSubRevokeMember(false);
    } catch (error) {
      toast.error("Transaction Failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      

      setSubRevokeMember(false);
    }
  }

  return (
    <>
      <ToastContainer closeButton={CloseButton} />
      <div className="contentProposal">
        <div className="qr-flex ">
          <div className="flex qr_margin">
            <Button
              onClick={withDrawFunds}
              text="Withdraw"
              theme="primary"
              size="large"
              disabled={withdrawLoading}
            />

            <div className="margin-30">
              <div>
                {isConnected && !subNewMember && (
                  <Form
                    // isDisabled={}
                    buttonConfig={{
                      isLoading: subNewMember,
                      loadingText: "Sending...",
                      text: "New Membership",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the User PID",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubNewMember(true);
                      createNewMember(e.data[0].inputResult);
                    }}
                    title="New MemberShip"
                  />
                )}

                {/* Substitue Form */}
                {subNewMember && (
                  <Form
                    isDisabled={true}
                    buttonConfig={{
                      text: "Assigning...",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the User PID",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubNewMember(true);
                      createNewMember(e.data[0].inputResult);
                    }}
                    title="New MemberShip"
                  />
                )}
              </div>
            </div>

            <div className="margin-30">
              <div>
                {isConnected && !subRevokeMember && (
                  <Form
                    // isDisabled={}
                    buttonConfig={{
                      isLoading: subRevokeMember,
                      loadingText: "Sending...",
                      text: "Rewoke Membership",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the Address",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubRevokeMember(true);
                      rewokeMember(e.data[0].inputResult);
                    }}
                    title="Revoke MemberShip"
                  />
                )}

                {/* Substitue Form */}
                {subRevokeMember && (
                  <Form
                    isDisabled={true}
                    buttonConfig={{
                      text: "Rewoking membership...",
                      theme: "secondary",
                    }}
                    data={[
                      {
                        inputWidth: "100%",
                        name: "Enter the Address",
                        type: "text",
                        validation: {
                          required: true,
                        },
                        value: "",
                      },
                    ]}
                    onSubmit={(e) => {
                      setSubRevokeMember(true);
                      rewokeMember(e.data[0].inputResult);
                    }}
                    title="Revoke MemberShip"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Owner;
