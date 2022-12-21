### `Follow the Instructions in ContractCode folder's Readme for Verification of your Eth Address`
# Live Contract Link: https://mumbai.polygonscan.com/address/0x80a6b117511c6527e57f25d04d9adfee23ae1b0e
# Live DApp Link: https://polygon-dao.vercel.app/

### `Ghost DAO`

-> Member creates a Proposal and present it to the DAO
-> DAO members vote for/against on the proposal
-> After the Deadline for voting has passed, the OWNER can countVotes and end the proposal
-> If Passed: The Required Amount is transfered to the Proposer. And if Rejected: Proposer get's nothing

## Things to Try

### `You can:`

-> Create Proposals
![image](https://user-images.githubusercontent.com/69587947/208856177-a23ef252-71bf-4724-86e4-110520437b69.png)

-> Vote on Proposals
![image](https://user-images.githubusercontent.com/69587947/208856244-ccc88dce-e56c-4c82-9cc7-bd93419fdb37.png)

-> Donate to the DAO
![image](https://user-images.githubusercontent.com/69587947/208856319-a2ad1784-29a2-4d74-88b2-80ca5e4067fd.png)

### `Only Owner:`

1. All the above, and
2. Count Votes (Change the Proposal Status to Rejected/Passed)
![image](https://user-images.githubusercontent.com/69587947/208856694-da4bb42a-c8f6-4cb1-a3a7-43f8e8082120.png)
![image](https://user-images.githubusercontent.com/69587947/208860188-18fa4697-6dee-4fe4-801a-7493005f09a5.png)

### DAO transfered the "Required Amount" to the Proposer
![image](https://user-images.githubusercontent.com/69587947/208860405-6daec327-e266-4c5d-840b-a17d1daf147f.png)

# `3. Owner Also gets an Owner Panel`

### Owner Panel:
![image](https://user-images.githubusercontent.com/69587947/208857154-7e0b13ba-311c-4d1c-abd5-9b2135128f42.png)

1. A `"Withdraw"` button for withdrawing all funds in the DAO (A multisig can be added for security but since we have the ID of the Owner its not an issue)

2. `"Issue New Membership"` , Enter a User's PID(in uint256, you can find it in the Event Logs named "userRegistered" Event) with which the user registered an Eth Address. And "Remove" both (PID & Eth Address) from already registered. Hence, issuing a New Membership because that PID can now register a new Eth Address.

3. `"Revoke Membership"` , Enter an Eth Address to kick him from the DAO's verified Members. Since, the PID is not removed from the registered PID's. This user can't register a new Eth Address.

## Verification Checks

1. One PID can't register more than one Eth Address (unless issued a New Membership)
![image](https://user-images.githubusercontent.com/69587947/208858843-0b5aa396-fa01-4794-93ce-82d73de2bec1.png)

2. If someone else tries to issue a NewMembership
![image](https://user-images.githubusercontent.com/69587947/208859500-20f1d19d-3372-499c-ae69-dc23852076a7.png)

3. Duplicate Registration Check
![image](https://user-images.githubusercontent.com/69587947/208859716-030c555d-aebb-411a-ad11-1cdffc526b4d.png)
