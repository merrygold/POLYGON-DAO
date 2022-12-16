import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, Button } from "web3uikit";
import { Link } from "react-router-dom";
import matic from "../images/Polygon_Faucet.png";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const Home2 = () => {
  console.log("Home Root");

  const [daoBalance, setDaoBalance] = useState(0);
  const [donation, setDonation] = useState(0);

  // * Check if User verified or Not
  const [isVerified, setIsVerified] = useState(false);

  const [passRate, setPassRate] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [proposals, setProposals] = useState();

  const [isLoading, setLoading] = useState(false);

  const [sub, setSub] = useState(false);

  const { isConnected, isDisconnected, address: userAddress } = useAccount();

  // * CONSTANTS
  // * Setup Moralis

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

  // * Setup Chain & Contract Address
  const address = "0x397D9b8880c91906F794355AdaA81Bd93f69eBdb";
  const chain = EvmChain.MUMBAI;

  // * Generic Functions

  // ? getEvent using specific ABI & TOPIC
  async function getEvent(EventTopic, EventABI) {
    const EventOptions = {
      chain: chain,
      address: address,
      topic: EventTopic,
      abi: EventABI,
      // fromBlock: 16162627
    };
    const responseEvents = await Moralis.EvmApi.events.getContractEvents(
      EventOptions
    );
    return responseEvents?.toJSON().result;
  }

  // ? Get Status of a proposal
  async function getStatus(proposalId) {
    const functionName = "Proposals";

    const proposalOptions = {
      abi: ContractABI,
      functionName: functionName,
      address: address,
      chain: chain,
      params: {
        "": proposalId,
      },
    };
    const proposalDetails = await Moralis.EvmApi.utils.runContractFunction(
      proposalOptions
    );

    const result = proposalDetails?.toJSON();

    if (result.countConducted && result.passed) {
      return { color: "green", text: "Passed" };
    } else if (result.countConducted && !result.passed) {
      return { color: "red", text: "Rejected" };
    } else {
      return { color: "blue", text: "Ongoing" };
    }
  }

  // ? Create a new proposal
  async function createProposal(description, requiredAmount) {
    const functionName = "createProposal";

    const options = {
      abi: ContractABI,
      functionName: functionName,
      address: address,
      chain: chain,
      params: {
        _description: description,
        _requiredAmount: requiredAmount
      },
    };
    // const proposalDetails =
    //   await Moralis.EvmApi.utils.runContractFunction(options);
    console.log()

    setSub(false)
  }

  // * For Moralis Configuration (Must be Executed "ONLY ONCE")

  useEffect(() => {
    if (isConnected) {
      async function main() {
        async function configMoralis() {
          let moralisInitialized = await Moralis.Core.isStarted;
          if (!moralisInitialized) {
            console.log("Moralis Configured");
            await Moralis.start({
              apiKey:
              "zLYFqOyS9Mc6G8jzDjx3PEPj8WrcktAYrdyt3QTf2ogr4tU5kUSSE1xsTkF4Idyn"
                // "0KEpH3iOcb7NF49r9hh40AvjYWeFjxfAY15Zf7mzayVEfM9UW1Bt8ZJpcZbV1N2C",
              // ...and any other configuration
            });
          }
        }

        async function getProposals() {
          console.log("Get Proposals");

          // * Getting ProposalCreated Event
          const Proposal_Created_Event_ABI = {
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
          };

          const Proposal_Created_Event_TOPIC =
            "0x3ec21697eb8018b62928e5f290d2bccf3af51e8b6cdf71fceab712977647bba9";
          const results = await getEvent(
            Proposal_Created_Event_TOPIC,
            Proposal_Created_Event_ABI
          );
          for (let i=0; i <results.length; i++) {
            if (results[i].RequiredAmount > 10) {
              results.splice(i, 1)
            }
          }
          const table = await Promise.all(
            results.map(async (e) => [
              e.data.uid,
              e.data.description,
              <div className="flex">
                <div>{e.data.requiredAmount}</div>{" "}
                <img
                  style={{ marginLeft: "4px" }}
                  width={"25px"}
                  height={"25px"}
                  src={matic}
                  alt="Logo"
                />
              </div>,
              <Link
                to="/proposal"
                style={{ textDecoration: "none" }}
                state={{
                  description: e.data.description,
                  color: (await getStatus(e.data.uid)).color,
                  text: (await getStatus(e.data.uid)).text,
                  id: e.data.uid,
                  proposer: e.data.proposer,
                }}
              >
                <Tag
                  color={(await getStatus(e.data.uid)).color}
                  text={(await getStatus(e.data.uid)).text}
                />
              </Link>,
            ])
          );
          console.log("Hooks Updated");
          setProposals(table);
          setTotalP(results.length);
        }

        async function getDaoBalance() {
          const response = await Moralis.EvmApi.balance.getNativeBalance({
            address,
            chain,
          });
          const balanceStr = ethers.utils.formatEther(
            response?.toJSON().balance
          );
          const balance = Number(balanceStr).toFixed(4);

          setDaoBalance(balance);
        }

        async function getUserDonation() {
          const functionName = "addressToDonation";

          const options = {
            abi: ContractABI,
            functionName: functionName,
            address: address,
            chain: chain,
            params: {
              "": userAddress,
            },
          };
          const donationDetails =
            await Moralis.EvmApi.utils.runContractFunction(options);
          const result = Number(
            ethers.utils.formatEther(donationDetails?.toJSON())
          ).toFixed(4);
          console.log(result);
          setDonation(result);
        }

        async function getUserVerify() {
          console.log("userVerify")
          const functionName = "isMember";

          const options = {
            abi: ContractABI,
            functionName: functionName,
            address: address,
            chain: chain,
            params: {
              "": userAddress,
            },
          };
          const statusRaw = await Moralis.EvmApi.utils.runContractFunction(
            options
          );
          const status = statusRaw?.toJSON();

          setIsVerified(status);
          return status
        }

        async function getPassRate() {
          // * Getting ProposalCount Event
          const countEventABI = {
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
                internalType: "bool",
                name: "passed",
                type: "bool",
              },
            ],
            name: "proposalCount",
            type: "event",
          };

          const topic =
            "0x4556fcf667ee704924eea359363d28f06708b744ad113340982b07ef9919fb91";

          const EventOptions = {
            chain: chain,
            address: address,
            topic: topic,
            abi: countEventABI,
            // fromBlock: 16162627
          };

          const responseEvents = await Moralis.EvmApi.events.getContractEvents(
            EventOptions
          );
          const eventArray = responseEvents?.toJSON().result;

          console.log(eventArray);

          let won = 0;
          //   * Getting Proposal Details
          for (let i = 0; i < eventArray.length; i++) {
            if (eventArray[i].data.passed == true) {
              won++;
            }
          }
          const passRateRaw = (won / eventArray.length) * 100;
          const passRate = passRateRaw.toFixed(0);
          setPassRate(passRate);
        }

        setLoading(true);
        await configMoralis();

        await getUserVerify();

        if (isVerified) {
          console.log(isVerified)
          await getUserDonation();
          await getDaoBalance();

          await getProposals();
          await getPassRate();
          setLoading(false);
        }
      }
      main();
    }
  }, [isConnected, isVerified, userAddress]);

  return (
    <>
   
      <div className="content">
      <div style={{ alignContent: "center" , marginRight: "7px"}}>
        {!isVerified && (
         <Link style={{ textDecoration: "none" }} to="/qr">
          <Button
            onClick={function noRefCheck() {}}
            text="Please Verify"
            theme="primary"
            size="large"
          />
          </Link>
        )}
      </div>
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="DAO">
            <div className="tabContent">
              Governance Overview
              <div className="widgets">
                <Widget
                  isLoading={isDisconnected || isLoading}
                  info={totalP}
                  title="Proposals Created"
                  style={{ width: "200%" }}
                >
                  {!isLoading && isConnected && isVerified && 
                      <div className="extraWidgetInfo">
                        <div className="extraTitle">Pass Rate</div>
                        <div className="progress">
                          <div
                            className="progressPercentage"
                            style={{ width: `${passRate}%` }}
                          ></div>
                        </div>
                      </div>
                    }
                </Widget>

                <Widget
                  isLoading={isDisconnected || isLoading}
                  info={daoBalance}
                  title="DAO Treasury Balance"
                >
                  <img
                    style={{ marginRight: "80px", marginTop: "30px" }}
                    width={"25px"}
                    height={"25px"}
                    src={matic}
                    alt="Logo"
                  />
                </Widget>

                <Widget
                  isLoading={isDisconnected || isLoading}
                  info={donation}
                  title="Your Donations:"
                />
              </div>
              Recent Proposals
              <div style={{ marginTop: "30px" }}>
                <Table
                  isLoading={isDisconnected || isLoading}
                  id={1}
                  columnsConfig="10% 50% 20% 20%"
                  data={proposals}
                  header={[
                    <span>ID</span>,
                    <span>Description</span>,
                    <span>Required Amount </span>,
                    <span>Status</span>,
                  ]}
                  pageSize={5}
                />
              </div>
              {isVerified && isConnected && (
                <Form
                  buttonConfig={{
                    isLoading: sub,
                    loadingText: "Submitting Proposal",
                    text: "Submit",
                    theme: "secondary",
                  }}
                  data={[
                    {
                      inputWidth: "50%",
                      name: "Description",
                      type: "text",
                      validation: {
                        required: true,
                      },
                      value: "",
                    },
                    {
                      inputWidth: "30%",
                      name: "Required Amount",
                      type: "number",
                      validation: {
                        required: true,
                      },
                      value: ""
                    }
                  ]}
                  onSubmit={(e) => {
                    setSub(true);
                    createProposal(e.data[0].inputResult, e.data[1].inputResult)
                  }}
                  title="Create a New Proposal"
                />
              )}
            </div>

            <div></div>
          </Tab>
          <Tab tabKey={2} tabName="Forum"></Tab>
          <Tab tabKey={3} tabName="Docs"></Tab>
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Home2;