import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Form, Table, Button } from "web3uikit";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from "ethers";
import { ChevronLeft, Matic, CrossCircle } from "@web3uikit/icons";

import { useAccount } from "wagmi";
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const Proposal = () => {


  const { state: proposalDetails } = useLocation();
  const [latestVote, setLatestVote] = useState();
  const [percUp, setPercUp] = useState(0);
  const [percDown, setPercDown] = useState(0);
  const [votes, setVotes] = useState([]);
  

  // * User Voting status
  const [hasVoted, setHasVoted] = useState(false)

  // * Proposal Status
  const [countDone, setCountDone] = useState(false)

  // * Voting Status
  const [sub, setSub] = useState(false);

  // * Counting Status
  const [counting, setCounting] = useState(false)

  // * Loading Data
  const [loading, setLoading] = useState(false)

  // ** TOASTER
  // * Polygon Scan URL
  const [polygonScan, setPolygonScan] = useState("");

  const CloseButton = ({ closeToast }) => (
    <button style={{ borderRadius:"20px" , backgroundColor:"green" , border:"solid 2px black"}}> <a style={{color: "white" , textDecoration: "none"}} href={polygonScan} onClick={closeToast}>Watch on Scan</a> </button>
   );

   const BaseUrl = "https://mumbai.polygonscan.com/tx/"


  // * Check if isOwner
  const [isOwner, setIsOwner] = useState(false);

  // * Check if isMember
  const [isMember, setIsMember] = useState(false);

  // * Deadline of the Proposal
  const [deadline, setDeadline] = useState(false)

  const [status, setStatus] = useState({})

  // * Get Current User
  const { isConnected, address: userAddress } = useAccount();

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

  useEffect(() => {
    if (isConnected) {
      window.scrollTo(0, 100)
      if (deadline === true) {
        window.scrollTo(0, 100)
      } 
      else {
        window.scrollTo(0, 70)
      }
      
      async function main() {
        async function configMoralis() {
          let moralisInitialized = await Moralis.Core.isStarted;

          try {
            if (!moralisInitialized) {
              console.log("Moralis Configured");
              await Moralis.start({
                apiKey:
                  "zLYFqOyS9Mc6G8jzDjx3PEPj8WrcktAYrdyt3QTf2ogr4tU5kUSSE1xsTkF4Idyn",
                // "0KEpH3iOcb7NF49r9hh40AvjYWeFjxfAY15Zf7mzayVEfM9UW1Bt8ZJpcZbV1N2C",
                // ...and any other configuration
              });
            }
          } catch (error) {
            console.log(error)
          }
          
        }
        // ? Get Votes of current Proposal
        async function getVotes() {
          // * Getting ProposalCreated Event
          const voteEventABI = {
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
          };

          const topic =
            "0x97a3ed91f0b116dc155f238ac92aa5b825720a7bb096f53156e05d9c8ab6a30a";

          const EventOptions = {
            chain: chain,
            address: address,
            topic: topic,
            abi: voteEventABI,
            // fromBlock: 16162627
          };

          const responseEvents = await Moralis.EvmApi.events.getContractEvents(
            EventOptions
          );
          const EveryProposalVotes = responseEvents?.toJSON().result;

          const results = [];

          for (let i = 0; i < EveryProposalVotes.length; i++) {
            if (
              Number(EveryProposalVotes[i].data.proposal) === proposalDetails.id && Number(EveryProposalVotes[i].data.voter) === userAddress
            ) {
              setHasVoted(true)
            }

            if (
              Number(EveryProposalVotes[i].data.proposal) === proposalDetails.id
            ) {
              results.push(EveryProposalVotes[i]);
            }
          }

          for (let i = 0; i < results.length; i++) {
            console.log(results[i])
           
          }

          if (results.length > 0) {
            setLatestVote(results[0].data);
            setPercDown(
              (
                (Number(results[0].data.votesDown) /
                  (Number(results[0].data.votesDown) +
                    Number(results[0].data.votesUp))) *
                100
              ).toFixed(0)
            );
            setPercUp(
              (
                (Number(results[0].data.votesUp) /
                  (Number(results[0].data.votesDown) +
                    Number(results[0].data.votesUp))) *
                100
              ).toFixed(0)
            );
          }

          const votesDirection = results.map((e) => [
            e.data.voter,
            e.data.votedFor ? (
              <Matic fontSize="24px" />
            ) : (
              <CrossCircle color="red" fontSize="24px" />
            ),
          ]);

          setVotes(votesDirection);
        }

        // ? Get Verification of Current User
        async function getUserVerify() {
          const ownerFunc = "DAOowner";

          const ownerOpt = {
            abi: ContractABI,
            functionName: ownerFunc,
            address: address,
            chain: chain,
          };

          const ownerStatus = await Moralis.EvmApi.utils.runContractFunction(
            ownerOpt
          );
          const ownerAddress = ownerStatus?.toJSON();

          if (ownerAddress === userAddress) {
            setIsOwner(true);
            setIsMember(true);
            console.log(ownerAddress === userAddress)
          } else {
            setIsOwner(false)
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

            setIsMember(status);
            console.log(status)
          }
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

          let color = ''
          let text = ''
          if (result.countConducted && result.passed) {
            setCountDone(true)
            color = 'green'
            text = 'Passed'
          } else if (result.countConducted && !result.passed) {
            setCountDone(true)
            color = 'red'
            text = 'Rejected'
          } else {
            setCountDone(false)
            color = 'blue'
            text = 'Ongoing'
          }
          setStatus({ color: color, text: text })
        }

        // ? Get Deadline of a Proposal
        async function getDeadline(proposalId) {
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
          const proposal = proposalDetails?.toJSON();

          const provider = (new ethers.providers.Web3Provider(window.ethereum))
          const currentBlockNum = await provider.getBlockNumber()

          if (proposal.deadline <= currentBlockNum) {
            setDeadline(true)
          }
        }
        setLoading(true)
        await configMoralis();
        await getUserVerify();
        

          await getDeadline(proposalDetails.id);
          await getStatus(proposalDetails.id)
          await getVotes();
          setLoading(false)
        
      }
      main();
    }
  }, [isConnected, userAddress, sub, counting]);

  async function castVote(upDown) {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum).getSigner();

    const daoVerifier = new ethers.Contract(address, ContractABI, signer);

    try {
      const voteTxn = await daoVerifier.voteOnProposal(
        proposalDetails.id,
        upDown
      );
      await voteTxn.wait();
      console.log("Vote Cast Succesfully");

      const HASH = voteTxn.hash
      const url = BaseUrl + HASH
      setPolygonScan(url)
      toast.success("Vote Casted Succesfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setSub(false);
    } catch (error) {

      toast.error('Transaction Failed!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      alert(error.data.message);
      setSub(false);
    }
  }

  async function countVotes(id) {

    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()

    const daoVerifier = new ethers.Contract(address, ContractABI, signer)

    const countTxn = await daoVerifier.countVotes(id)
    await countTxn.wait(2)

    setCounting(false)
  }

  return (
    <>
    <ToastContainer  closeButton={CloseButton}/>
      {isConnected && isMember &&
        <div className="contentProposal">
          <div className="proposal">
            <Link className="linkBackHome" to="/">
              <div className="backHome">
                <ChevronLeft fill="#ffffff" fontSize="20px" />
                Overview
              </div>
            </Link>

            <div>{proposalDetails.description}</div>
            <div className="proposalOverview">
              <Tag color={status.color} text={status.text} />
              <div className="proposer">
                <span>Proposed By </span>
                <Tooltip content={proposalDetails.proposer}>
                  <Blockie seed={proposalDetails.proposer} />
                </Tooltip>
              </div>
            </div>
          </div>


          <div className="buttons-Wrapper">
            {deadline &&
              <div className="deadlineButton">
                <Button
                  color="red"
                  text={`Deadline: ${deadline}`}
                  theme="colored"
                  loadingText="Calculating"
                />

              </div>
            }
            {isOwner && deadline && !countDone &&
              <div className="countButton">
                <Button
                  disabled={!isOwner || counting || loading}
                  color="blue"
                  onClick={() => {
                    setCounting(true)
                    countVotes(proposalDetails.id)
                  }}
                  text={!counting ? "Count Votes" : "Counting..."}
                  theme="colored"
                  loadingText="Counting"
                />
              </div>
            }

            {countDone && 
              <div className="countButton">
                <Button
                  disabled={true}
                  color="blue"
                  text={"Count Done!"}
                  theme="colored"
                />
              </div>
            }

          </div>

          {latestVote && (
            <div className="widgets">
              <Widget info={latestVote.votesUp} title="Votes For">
                <div className="extraWidgetInfo">
                  <div className="extraTitle">{percUp}%</div>
                  <div className="progress">
                    <div
                      className="progressPercentage"
                      style={{ width: `${percUp}%` }}
                    ></div>
                  </div>
                </div>
              </Widget>
              <Widget info={latestVote.votesDown} title="Votes Against">
                <div className="extraWidgetInfo">
                  <div className="extraTitle">{percDown}%</div>
                  <div className="progress">
                    <div
                      className="progressPercentage"
                      style={{ width: `${percDown}%` }}
                    ></div>
                  </div>
                </div>
              </Widget>
            </div>
          )}

          <div className="votesDiv">
            <Table
              style={{ width: "60%" }}
              columnsConfig="90% 10%"
              data={votes}
              header={[<span>Address</span>, <span>Vote</span>]}
              pageSize={5}
            />

            <Form
              isDisabled={deadline || hasVoted || loading}
              style={{
                width: "30%",
                height: "250px",
                border: "1px solid rgba(6, 158, 252, 0.2)",
              }}
              buttonConfig={{
                isLoading: sub,
                loadingText: "Casting Vote",
                text: "Vote",
                theme: "secondary",
              }}
              data={[
                {
                  inputWidth: "100%",
                  name: "Cast Vote",
                  options: ["For", "Against"],
                  type: "radios",
                  validation: {
                    required: true,
                  },
                },
              ]}
              onSubmit={(e) => {
                if (e.data[0].inputResult[0] === "For") {
                  console.log("For");
                  castVote(true);
                } else {
                  castVote(false);
                }
                setSub(true);
              }}
              title="Cast Vote"
            />
                 
          </div>


        </div>
      }
      <></>
      <div className="voting"></div>
    </>
  );
};

export default Proposal;
