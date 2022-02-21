const Poll = artifacts.require("./Poll.sol");

contract("Poll", accounts => {

  let pollInstance;

  beforeEach('should setup the contract instance', async () => {
    pollInstance = await Poll.deployed();
  });


  it("Should return list with new delegate registered", async () => {
    //Register new delegate
    await pollInstance.registerAsDelegateCandidate("Paul", { from: accounts[0] });

    //Get registered delegates value
    const delegateRegistered = await pollInstance.getDelegateCandidates.call();

    assert.equal(delegateRegistered[0].name, "Paul");
  });

  it("Should return error when we have max delegates registered", async () => {

    let hasError = false;
    try {
      //Register new delegates
      await pollInstance.registerAsDelegateCandidate("Test", { from: accounts[1] });
      await pollInstance.registerAsDelegateCandidate("Test 1", { from: accounts[2] });
      await pollInstance.registerAsDelegateCandidate("Test 2", { from: accounts[3] });
      await pollInstance.registerAsDelegateCandidate("Test 3", { from: accounts[4] });
      await pollInstance.registerAsDelegateCandidate("Test 4", { from: accounts[5] });

      // Delegate list is full so this new registering will fail
      await pollInstance.registerAsDelegateCandidate("Test 5", { from: accounts[5] });
    } catch (e) {
        hasError = true;
    }

    assert.equal(hasError, true);
  });

  it("Should return first delegate with vote count incremented when an user vote", async () => {
    //Register new delegate
    await pollInstance.registerAsDelegateCandidate("Test", { from: accounts[1] });
    await pollInstance.registerAsDelegateCandidate("Test 1", { from: accounts[2] });
    await pollInstance.registerAsDelegateCandidate("Test 2", { from: accounts[3] });
    await pollInstance.registerAsDelegateCandidate("Test 3", { from: accounts[4] });
    await pollInstance.registerAsDelegateCandidate("Test 4", { from: accounts[5] });

    await pollInstance.registerAsDelegateCandidate("Paul", { from: accounts[0] });

    //Get registered delegates value
    const delegateRegistered = await pollInstance.getDelegateCandidates.call();

    assert.equal(delegateRegistered[0].name, "Paul");
  });

  it("Should return first delegate with vote count incremented when an user vote", async () => {
    //Register new delegate
    await pollInstance.registerAsDelegateCandidate("Test", { from: accounts[1] });
    await pollInstance.registerAsDelegateCandidate("Test 1", { from: accounts[2] });
    await pollInstance.registerAsDelegateCandidate("Test 2", { from: accounts[3] });
    await pollInstance.registerAsDelegateCandidate("Test 3", { from: accounts[4] });
    await pollInstance.registerAsDelegateCandidate("Test 4", { from: accounts[5] });

    await pollInstance.registerAsDelegateCandidate("Paul", { from: accounts[0] });

    //Get registered delegates value
    const delegateRegistered = await pollInstance.getDelegateCandidates.call();

    assert.equal(delegateRegistered[0].name, "Paul");
  });
});