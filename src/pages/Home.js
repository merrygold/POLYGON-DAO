import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form } from "web3uikit";
import { Link } from "react-router-dom";

const Moralis = require("moralis").default;

const { EvmChain } = require("@moralisweb3/common-evm-utils");

const Home = () => {
  // const [passRate, setPassRate] = useState(0);
  // const [totalP, setTotalP] = useState(0);
  // const [counted, setCounted] = useState(0);
  // const [voters, setVoters] = useState(0);
  // const { Moralis } = useMoralis();
  console.log("Home Called");
  const [proposals, setProposals] = useState();
  // const [sub, setSub] = useState();

  // * CONSTANTS
  // * Setup Moralis

  // * Setup Chain & Contract Address
  const address = "0x5D3bE0Ed4938930f4d53c7d9b4c560D711f1977b";
  const chain = EvmChain.MUMBAI;

  // * Generic Functions

  // ? getEvent using specific ABI & TOPIC
  const getEvent = async (EventTopic, EventABI) => {
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
  };

  useEffect(() => {
    async function getProposals() {
      await Moralis.start({
        apiKey:
          "GeTBWkWgBzlAZet6dAsd93rvLLEcPW2itAE0uAjNZ5YDsl8fZvkjOojwBfTKgzPc",
        // ...and any other configuration
      });
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
            name: "maxVotes",
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
      const table = await Promise.all(
        results.map(async (e) => [e.data.uid, e.data.description])
      );
      console.log(table);
      setProposals(table);
    }
    getProposals();
    // getPassRate();
  }, []);

  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="DAO">
            {proposals && (
              <div className="tabContent">
                Governance Overview
                <div className="widgets">
                  <Widget
                    info="45"
                    title="Proposals Created"
                    style={{ width: "200%" }}
                  >
                    <div className="extraWidgetInfo">
                      <div className="extraTitle">Pass Rate</div>
                      <div className="progress">
                        <div
                          className="progressPercentage"
                          style={{ width: `${20}%` }}
                        ></div>
                      </div>
                    </div>
                  </Widget>
                </div>
                Recent Proposals
                <div style={{ marginTop: "30px" }}>
                  <Table
                    columnsConfig="10% 70% 20%"
                    data={proposals}
                    header={[
                      <span>ID</span>,
                      <span>Description</span>,
                      <span>Status</span>,
                    ]}
                    pageSize={5}
                  />
                </div>
              </div>
            )}
          </Tab>
          <Tab tabKey={2} tabName="Forum"></Tab>
          <Tab tabKey={3} tabName="Docs"></Tab>
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Home;
