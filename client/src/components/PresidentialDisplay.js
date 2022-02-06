import React, {Fragment, useEffect, useState} from "react";
import {Avatar, Button} from "@mui/material";

const PresidentialDisplay = ({step, setVoteCount, voteCount = 0, voteClosed = false, contract, accounts}) => {

    const [presidentialCandidates, setPresidentialCandidates] = useState([]);
    const [president, setPresident] = useState();
    const [message, setMessage] = useState("");

    useEffect(() => {
        getPresidentialCandidates();
        if(voteClosed){
            winningPresidential()
        }
    }, [voteClosed]);

    const getPresidentialCandidates = async () => {
        const candidates = await contract.methods.getPresidentialCandidates().call();
        setPresidentialCandidates(candidates);
    }

    const voteForPresident = async (presidentIndex) => {
        await contract.methods.presidentialPoll(presidentIndex).send({from: accounts[0]})
            .then(async (_) => {
                setMessage("Thank you for your vote");
                setVoteCount(voteCount + 1)
                await getPresidentialCandidates();
            })
            .catch((error) => {
                setMessage(error.message);
            });
    }

    const winningPresidential = async () => {
        const presidential_ = await contract.methods.winningDelegatesPoll().call();
        setPresident(presidential_);
    }

    return (
        <Fragment>
            {
                !voteClosed &&
                <Fragment>
                    <h1>Presidential Voting</h1>
                    <div className={"candidates"}>
                        {
                            presidentialCandidates.map((candidate, index) => {
                                if (index < 1)
                                    return <Fragment>
                                        <div>
                                            <Avatar
                                                alt={candidate.name}
                                                src="man.jpg"
                                                sx={{width: 200, height: 200}}
                                            />
                                            <h2>{candidate.name}</h2>
                                            {
                                                step.id === 2 &&
                                                <Button onClick={() => voteForPresident(index)} variant={"contained"}>vote</Button>
                                            }
                                        </div>
                                        <h3>VS</h3>
                                    </Fragment>

                                return <div>
                                    <Avatar
                                        alt={candidate.name}
                                        src="woman.png"
                                        sx={{width: 200, height: 200}}
                                    />
                                    <h2>{candidate.name}</h2>
                                    {
                                        step.id === 2 &&
                                        <Button onClick={() => voteForPresident(index)} variant={"contained"}>vote</Button>
                                    }
                                </div>
                            })
                        }

                    </div>
                </Fragment>
            }
            {
                voteClosed &&
                <Fragment>
                    <h1>The PRESIDENT of Republic</h1>
                    <div className={"candidates"}>
                        {
                            presidentialCandidates.map((candidate, index) => {
                                if (index < 1 && candidate.name === president.name)
                                    return <Fragment>
                                        <div>
                                            <Avatar
                                                alt={candidate.name}
                                                src="man.jpg"
                                                sx={{width: 200, height: 200}}
                                            />
                                            <h2>{candidate.name}</h2>
                                        </div>
                                    </Fragment>
                                else
                                    return <div>
                                        <Avatar
                                            alt={candidate.name}
                                            src="woman.png"
                                            sx={{width: 200, height: 200}}
                                        />
                                        <h2>{candidate.name}</h2>
                                    </div>
                            })
                        }

                    </div>
                </Fragment>
            }
            <style>{`
                
                .candidates {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    align-items: center;
                    width: 50%;
                    margin-left: auto;
                    margin-right: auto;
                }
                
            `}</style>
        </Fragment>
    );
}

export default PresidentialDisplay;