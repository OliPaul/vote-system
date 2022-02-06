import React, {Fragment, useEffect, useState} from "react";
import Step from "../components/Step";
import {Button, Input} from "@mui/material";

const Main = ({ accounts, contract }) => {

    const [step, setStep] = useState(0);
    const [presidentialCandidates, setPresidentialCandidates] = useState([]);
    const [delegates, setDelegates] = useState([]);
    const [registeredDelegates, setRegisteredDelegates] = useState([]);
    const [delegateName, setDelegateName] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getRegisteredDelegates();
        winningDelegates();
        getPresidentialCandidates();
    }, [])

    const registerAsDelegate = async () => {
        await contract.methods.registerAsDelegateCandidate(delegateName).send({from: accounts[0]})
            .then(async (_) => {
                setMessage("Thank you for your registration as delegate.");
                await getRegisteredDelegates();
            })
            .catch((error) => {
                setMessage(error.message);
        });

    }

    const handleDelegateNameChange = (e) => {
        setDelegateName(e.target.value);
    }

    const getPresidentialCandidates = async () => {
        const candidates = await contract.methods.getPresidentialCandidates().call();
        setPresidentialCandidates(candidates);
    }

    const getRegisteredDelegates = async () => {
        const registeredDelegates_ = await contract.methods.getDelegateCandidates().call();
        setRegisteredDelegates(registeredDelegates_);
    }

    const voteForDelegate = async (delegateIndex) => {
        await contract.methods.delegatesPoll(delegateIndex).send({from: accounts[0]})
            .then(async (_) => {
                setMessage("Thank you for your vote");
                await getRegisteredDelegates();
                await winningDelegates();
            })
            .catch((error) => {
                setMessage(error.message);
            });
    }

    const winningDelegates = async () => {
        const delegates_ = await contract.methods.winningDelegatesPoll().call();
        setDelegates(delegates_);
    }

    const voteForPresident = async (presidentIndex) => {
        await contract.methods.presidentialPoll(presidentIndex).send({from: accounts[0]})
            .then(async (_) => {
                setMessage("Thank you for your vote");
                await getPresidentialCandidates();
            })
            .catch((error) => {
                setMessage(error.message);
            });
    }

    return (
      <Fragment>
          <Step stepId={step} setStepId={setStep} accounts={accounts} contract={contract} />

          <div>
              <h3>Delegates</h3>
              {
                  delegates.map(delegate => (
                      <div>
                          {delegate.name}
                      </div>
                  ))
              }
          </div>

      </Fragment>
    );
}

export default Main;