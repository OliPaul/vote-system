pragma solidity ^0.8.11 ;

contract Poll {

    struct Voter {
        string name;
        uint voteWeight; // weight for final vote =====> 30% if !isDelegate else 70%
        bool votedForDelegate;  // if true, that person already voted for a delegate
        bool votedForChairPerson;  // if true, that person already voted for the chairperson
        uint vote;   // index of the voted candidate
        bool isDelegate;
        uint voteCount;
    }

    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(address => Voter) public voters;

    Candidate[] public presidentialCandidates;
    Voter[] public delegateCandidates;
    Voter[] public delegates;

    constructor(string[] memory presidentialCandidatesNames) {
        for (uint i = 0; i < presidentialCandidatesNames.length; i++) {
            presidentialCandidates.push(Candidate({
            name: presidentialCandidatesNames[i],
            voteCount: 0
            }));
        }
    }

    function getPresidentialCandidates() public view returns(Candidate[] memory presidentialCandidates_) {
        presidentialCandidates_ = presidentialCandidates;
    }

    function addDelegateCandidate(Voter memory voter) public {
        delegateCandidates.push(voter);
    }

    function getDelegateCandidates() public view returns(Voter[] memory delegateCandidates_) {
        delegateCandidates_ = delegateCandidates;
    }

    function registerAsDelegateCandidate(string memory name) public {
        Voter storage sender = voters[msg.sender];

        require(!sender.isDelegate, "You're already delegate.");
        require(delegateCandidates.length < 5, "You cannot register as delegate.");

        sender.name = name;
        sender.voteWeight = 70;
        sender.votedForDelegate = false;
        sender.votedForChairPerson = false;
        sender.vote = 0;
        sender.isDelegate = true;
        sender.voteCount = 0;

        if (delegateCandidates.length == 0) {
            addDelegateCandidate(sender);
        } else {
            bool isExist = false;
            for (uint i = 0; i < delegateCandidates.length; i++) {
                if(keccak256(abi.encodePacked(delegateCandidates[i].name)) == keccak256(abi.encodePacked(name))) {
                    isExist = true;
                    break;
                }
            }
            if(!isExist) {
                addDelegateCandidate(sender);
            }
        }
    }

    //Create the first ballot to elect the delegate per location
    function delegatesPoll(uint delegateCandidate) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.isDelegate, "You're alse delegate. You cannot vote at this step !");
        require(!sender.votedForDelegate, "You're already voted for your delegate.");
        require(delegateCandidates.length > 1, "Not enough delegates for the vote.");
        sender.votedForDelegate = true;
        sender.vote = delegateCandidate;
        delegateCandidates[delegateCandidate].voteCount += 1;
    }

    function presidentialPoll(uint presidentialCandidate) public {
        Voter storage sender = voters[msg.sender];
        Voter[] memory winningDelegates = winningDelegatesPoll();
        require(!sender.votedForChairPerson, "You're already voted for your delegate.");
        sender.votedForChairPerson = true;
        sender.vote = presidentialCandidate;
        for(uint i = 0; i < winningDelegates.length; i++) {
            if(keccak256(abi.encodePacked(sender.name)) == keccak256(abi.encodePacked(winningDelegates[i].name))) {
                presidentialCandidates[presidentialCandidate].voteCount += winningDelegates[i].voteWeight;
                break;
            } else {
                presidentialCandidates[presidentialCandidate].voteCount += 30;
                break;
            }
        }

    }

    function winningDelegatesPoll() public returns (Voter[] memory winningDelegatesPoll_) {
        Voter[] memory delegatesSorted = sort(delegateCandidates);
        for (uint i = delegatesSorted.length - 1; i > 0; i--) {
            if (i > delegatesSorted.length - 3) {
                delegates.push(delegatesSorted[i]);
            }
        }
        winningDelegatesPoll_ = delegates;
    }

    function winningPresidentialPoll() public view returns (Candidate memory winningPresidentialPoll_) {
        uint voteCount = 0;
        for (uint i = 0; i < presidentialCandidates.length; i++) {
            if (presidentialCandidates[i].voteCount > voteCount) {
                voteCount = presidentialCandidates[i].voteCount;
                winningPresidentialPoll_ = presidentialCandidates[i];
            }
        }
    }

    function sort(Voter[] memory data) public returns(Voter[] memory) {
        quickSort(data, int(0), int(data.length - 1));
        return data;
    }

    function quickSort(Voter[] memory arr, int left, int right) internal {
        int i = left;
        int j = right;
        if(i==j) return;
        Voter memory pivot = arr[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint(i)].voteCount < pivot.voteCount) i++;
            while (pivot.voteCount < arr[uint(j)].voteCount) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

}
