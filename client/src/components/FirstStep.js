import React, {Fragment, useEffect, useState} from "react";
import {Button, Input, TextField} from "@mui/material";
import PresidentialDisplay from "./PresidentialDisplay";

const FirstStep = ({step, setStepId, contract, accounts}) => {

    const [registeredDelegates, setRegisteredDelegates] = useState([]);
    const [delegateName, setDelegateName] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getRegisteredDelegates();

        setTimeout(() => {}, 3000);

        if (registeredDelegates.length === 3) {
            setStepId(1);
        }
    });


    const getRegisteredDelegates = async () => {
        const registeredDelegates_ = await contract.methods.getDelegateCandidates().call();
        setRegisteredDelegates(registeredDelegates_);
    }

    const registerAsDelegate = async () => {
        await contract.methods.registerAsDelegateCandidate(delegateName).send({from: accounts[0]})
            .then(async (_) => {
                setMessage("Thank you for your registration as delegate.");
                await getRegisteredDelegates();

                if(registeredDelegates.length === 3) {
                    setStepId(1);
                }
            })
            .catch((error) => {
                setMessage(error.message);
            });

    }

    const handleDelegateNameChange = (e) => {
        setDelegateName(e.target.value);
    }

    const voteForDelegate = async (delegateIndex) => {
        await contract.methods.delegatesPoll(delegateIndex).send({from: accounts[0]})
            .then(async (_) => {
                setMessage("Thank you for your vote");
                await getRegisteredDelegates();
            })
            .catch((error) => {
                setMessage(error.message);
            });
    }

    return (
        <Fragment>
            <div className={"container"}>
                <PresidentialDisplay step={step} contract={contract} accounts={accounts}/>

                <h1>{step.name}</h1>
                <h3>{step.message}</h3>
                <div className={"step-card"}>
                    <div style={{flex: 1}}>
                        <p>Note : When you are delegate, your vote weight is <b>70% (70 points)</b> for presidential voting.
                            For others vote weight will be <b>30% (30 points)</b>.</p>
                        <div className={"register-field"}>
                            <TextField label="Your name" size="small" variant="outlined" value={delegateName}
                                       onChange={handleDelegateNameChange}/>
                            &nbsp;&nbsp;
                            <Button variant="contained" onClick={registerAsDelegate}>Register</Button>
                        </div>
                        <p>{message}</p>
                    </div>

                    <div style={{flex: 1}}>
                        <h3>Registered Delegates</h3>
                        {
                            registeredDelegates.map((registeredDelegate, index) => (
                                <Fragment>
                                    <Button variant="outlined" onClick={() => voteForDelegate(index)} disabled={step !== 1}>
                                    {registeredDelegate.name}
                                </Button>&nbsp;
                                </Fragment>
                            ))
                        }
                    </div>
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

export default FirstStep;