import React, {Fragment, useEffect, useState} from "react";
import {Badge, Button, Chip, TextField} from "@mui/material";
import PresidentialDisplay from "./PresidentialDisplay";

const SecondStep = ({step, setStepId, contract, accounts}) => {

    const [registeredDelegates, setRegisteredDelegates] = useState([]);
    const [voteCount, setVoteCount] = useState(0);
    const [voteClosed, setVoteClosed] = useState(false);
    const [delegates, setDelegates] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getRegisteredDelegates();

        setTimeout(() => {
        }, 3000);

        if (voteCount === 4) {
            setVoteClosed(true);
            winningDelegates();
            setStepId(2);
        }
    });


    const getRegisteredDelegates = async () => {
        let voteCount_ = 0
        const registeredDelegates_ = await contract.methods.getDelegateCandidates().call();
        registeredDelegates_.map(rd => {
            voteCount_ += parseInt(rd.voteCount);
        });
        setVoteCount(voteCount_);
        setRegisteredDelegates(registeredDelegates_);
    }

    const voteForDelegate = async (delegateIndex) => {
        await contract.methods.delegatesPoll(delegateIndex).send({from: accounts[0]})
            .then(async (_) => {
                setMessage("Thank you for your vote");
                setVoteCount(voteCount + 1);
                await getRegisteredDelegates();
            })
            .catch((error) => {
                setMessage(error.message);
            });
    }

    const winningDelegates = async () => {
        const delegates_ = await contract.methods.winningDelegatesPoll().call();
        setDelegates(delegates_);
    }

    return (
        <Fragment>
            <div className={"container"}>
                <PresidentialDisplay step={step} contract={contract} accounts={accounts}/>
                {
                    !voteClosed &&
                    <Fragment>
                        <h1>{step.name}</h1>
                        <h3>{step.message}</h3>
                    </Fragment>
                }

                {
                    voteClosed &&
                    <Fragment>
                        <h1>You will be redirect automatically for the big final step, THE PRESIDENTIAL VOTING !!!!</h1>
                    </Fragment>
                }

                <div className={"step-card"}>
                    {
                        !voteClosed &&
                        <div style={{flex: 1}}>
                            <h3>Choose your Delegate</h3>
                            {
                                registeredDelegates.map((registeredDelegate, index) => (
                                    <Fragment>
                                        <Button variant="outlined" onClick={() => voteForDelegate(index)}>
                                            {registeredDelegate.name}&nbsp;&nbsp;&nbsp;&nbsp;<Chip
                                            label={registeredDelegate.voteCount} variant="outlined"/>
                                        </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                    </Fragment>
                                ))
                            }
                            <p>{message}</p>
                        </div>
                    }

                    {
                        voteClosed &&
                        <div style={{flex: 1}}>
                            <h3>Winning Delegates</h3>
                            {
                                delegates.map((delegate, index) => (
                                    <Fragment>
                                        <Badge color="secondary" badgeContent={index + 1}>
                                            <Button variant="outlined" onClick={() => voteForDelegate(index)}>
                                                {delegate.name} with <Chip
                                                label={delegate.voteCount + " vote(s)"} variant="outlined"/>
                                            </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                        </Badge>
                                    </Fragment>
                                ))
                            }
                        </div>
                    }

                </div>
            </div>
            <style>{`
                .container {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    background-color: ${step.color}
                }
                
                .candidates {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    align-items: center;
                    width: 50%;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .register-field {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .step-card {
                    padding: 10px;
                    border: 1px solid gray;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    align-items: center;
                    margin-left: auto;
                    margin-right: auto;
                    width: 50%;
                }
                
            `}</style>
        </Fragment>
    )
}

export default SecondStep;