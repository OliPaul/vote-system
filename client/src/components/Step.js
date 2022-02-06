import React, {Fragment, useEffect, useState} from 'react';
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

const Step = ({ stepId, setStepId, accounts, contract }) => {

    const [currentStep, setCurrentStep] = useState({});

    useEffect(() => {
        const stepsObj = {
            0: {
                id: 0,
                name: "Delegate Registration",
                message: "You can register as delegate now !",
                color: "#D9E2E2"
            },
            1: {
                id: 1,
                name: "Delegate Voting",
                message: "The Delegate Voting is open ! You can vote for your Delegate now.",
                color: "#3A506B"
            },
            2: {
                id: 2,
                name: "Presidential Voting",
                message: "Who will be the next President of our republic",
                color: "#EB7E7E"
            }
        }
        setCurrentStep(stepsObj[stepId]);
    }, [stepId]);

    return (
        <Fragment>
            {
                stepId === 0 &&
                    <FirstStep step={currentStep} setStepId={setStepId} accounts={accounts} contract={contract} />
            }

            {
                stepId === 1 &&
                <SecondStep step={currentStep} setStepId={setStepId} accounts={accounts} contract={contract} />
            }

            {
                stepId === 2 &&
                <ThirdStep step={currentStep} setStepId={setStepId} accounts={accounts} contract={contract} />
            }
        </Fragment>
    );
}

export default Step;