import React, {Fragment, useEffect, useState} from "react";
import PresidentialDisplay from "./PresidentialDisplay";

const ThirdStep = ({step, setStepId, contract, accounts}) => {

    const [voteCount, setVoteCount] = useState(0);
    const [presidentialCandidates, setPresidentialCandidates] = useState([]);
    const [voteClosed, setVoteClosed] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getPresidentialCandidates();
        if (voteCount === 7) {
            setVoteClosed(true);
        }
    });

    const getPresidentialCandidates = async () => {
        const candidates = await contract.methods.getPresidentialCandidates().call();
        setPresidentialCandidates(candidates);
    }

    return (
        <Fragment>
            <div className={"container"}>
                <PresidentialDisplay step={step} voteCount={voteCount} setVoteCount={setVoteCount} voteClosed={voteClosed} contract={contract}
                                     accounts={accounts}/>
                {
                    !voteClosed &&
                    <Fragment>
                        <h1>You can choose your PRESIDENT now !</h1>
                        <div className={"step-card"}>
                            {
                                presidentialCandidates.map((candidate, index) => (
                                    <Fragment>
                                        <div style={{flex: 1}}>
                                            <p style={{fontSize: "150px", margin: 0}}>{candidate.voteCount}</p>
                                            <p>Point(s)</p>
                                        </div>
                                    </Fragment>
                                ))
                            }
                        </div>
                    </Fragment>
                }

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

export default ThirdStep;