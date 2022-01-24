pragma solidity ^0.8.11 ;

contract Poll {

    struct Voter {
        bytes32 name;
        uint voteWeight; // weight for final vote =====> 30% if !isDelegate else 70%
        bool votedForDelegate;  // if true, that person already voted for a delegate
        bool votedForChairPerson;  // if true, that person already voted for the chairperson
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

    function addDelegateCandidate(Voter memory voter) public {
        delegateCandidates.push(voter);
    }

    function registerAsDelegateCandidate(bytes32 name) public {
        Voter memory voter = Voter({
            name : name,
            voteWeight: 70,
            votedForDelegate: false,
            votedForChairPerson: false,
            vote: 0,
            isDelegate: false,
            voteCount: 0
        });

        require(delegateCandidates.length == 5, "You cannot register as delegate. List is full.");

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
        require(delegateCandidates.length > 2, "Not enough delegates for the vote.");
        sender.votedForDelegate = true;
        sender.vote = delegateCandidate;
        delegateCandidates[delegateCandidate].voteCount += 1;
    }

    function presidentialPoll(uint presidentialCandidate) public {
        Voter storage sender = voters[msg.sender];
        Voter[] winningDelegates = winningDelegatesPoll();
        require(!sender.votedForChairPerson, "You're already voted for your delegate.");
        sender.votedForChairPerson = true;
        sender.vote = presidentialCandidate;
        for(uint i = 0; i < winningDelegates.length; i++) {
            if(sender.name == winningDelegates[i].name) {
                presidentialCandidates[presidentialCandidate].voteCount += winningDelegates[i].voteWeight / 100;
            } else {
                presidentialCandidates[presidentialCandidate].voteCount += 0.3;
            }
        }

    }

    function winningDelegatesPoll() public view returns (Voter[] winningDelegatesPoll_) {
        Voter[] winningDelegates;
        Voter[] delegatesSorted = sort(delegateCandidates);
        for (uint i = delegatesSorted.length - 1; i > 0; i--) {
            if (i > delegatesSorted.length - 3) {
                winningDelegates.push(delegatesSorted[i]);
            }
        }
        winningDelegatesPoll_ = winningDelegates;
    }

    function winningPresidentialPoll() public view returns (Candidate winningPresidentialPoll_) {
        uint voteCount = 0;
        for (uint i = 0; i < presidentialCandidates.length; i++) {
            if (presidentialCandidates[i].voteCount > voteCount) {
                voteCount = presidentialCandidates[i].voteCount;
                winningPresidentialPoll_ = presidentialCandidates[i];
            }
        }
    }

    function sort(Voter[] data) public constant returns(Voter[]) {
        quickSort(data, int(0), int(data.length - 1));
        return data;
    }

    function quickSort(Voter[] memory arr, int left, int right) internal{
        int i = left;
        int j = right;
        if(i==j) return;
        Voter pivot = arr[uint(left + (right - left) / 2)];
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
