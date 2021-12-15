pragma solidity 0.8.10;

contract Poll {

    struct Voter {
        bytes32 name;
        uint voteWeight; // weight for final vote =====> 30% if !isDelegate else 70%
        bool votedForDelegate;  // if true, that person already voted for a delegate
        bool votedForChairPerson;  // if true, that person already voted for the chairperson
        string location; // location of voter
        uint vote;   // index of the voted candidate
        bool isDelegate;
        uint voteCount;
    }

    struct Candidate {
        bytes32 name;
        uint voteCount;
    }

    mapping(address => Voter) public voters;

    Candidate[] public presidentialCandidates;
    Voter[] public delegateCandidates;

    function addDelegateCandidate(Voter voter) public {
        delegateCandidates.push(voter);
    }

    function registerAsDelegateCandidate(string name, string location) public {
        Voter voter = Voter({
            name : name,
            voteWeight: 0.7,
            votedForDelegate: false,
            votedForChairPerson: false,
            location: "",
            vote: 0,
            isDelegate: false,
            voteCount: 0
        });

        if (delegateCandidates.length == 0) {
            addDelegateCandidate(voter);
        } else {
            for (uint i = 0; i < delegateCandidates.length; i++) {
                if(delegateCandidates[i].name != name) {
                    addDelegateCandidate(voter);
                }
            }
        }
    }

    //Create the first ballot to elect the delegate per location
    function delegatesPoll(uint delegateCandidate) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.votedForDelegate, "You're already voted for your delegate.");
        require(sender.location != delegateCandidates[delegateCandidate].location,
            "You cannot vote for delegate that's not candidate in your location");
        sender.votedForDelegate = true;
        sender.vote = delegateCandidate;
        delegateCandidates[delegateCandidate].voteCount += sender.weight;
    }

    //function winningDelegatesPoll() public view returns (uint winning)

    function Poll(){

    }
}
