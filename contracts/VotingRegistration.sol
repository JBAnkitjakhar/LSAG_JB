 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingRegistration {
    uint256 public registrationEndTime;

    // Arrays to store registration data
    string[] public generatedEmails;
    string[] public submittedPublicKeys;

    // Mapping to track generated keys and submitted public keys
    mapping(string => bool) public hasGeneratedKeys;
    mapping(string => bool) public hasSubmittedKey;
    mapping(string => string) public emailToPublicKey;

    event KeysGenerated(string email);
    event PublicKeySubmitted(string email, string publicKey);

    constructor(uint256 _registrationDuration) {
        registrationEndTime = block.timestamp + _registrationDuration;
    }

    modifier registrationOpen() {
        require(block.timestamp < registrationEndTime, "Registration period has ended");
        _;
    }

    function generateKeys(string memory email) external registrationOpen {
        require(!hasGeneratedKeys[email], "Keys already generated for this email");
        require(_validateEmail(email), "Invalid email domain");

        hasGeneratedKeys[email] = true;
        generatedEmails.push(email);

        emit KeysGenerated(email);
    }

    function submitPublicKey(string memory email, string memory publicKey) external registrationOpen {
        require(!hasSubmittedKey[email], "Public key already submitted for this email");
        require(_validateEmail(email), "Invalid email domain");
        require(bytes(publicKey).length > 0, "Public key cannot be empty");

        hasSubmittedKey[email] = true;
        emailToPublicKey[email] = publicKey;
        submittedPublicKeys.push(publicKey);

        emit PublicKeySubmitted(email, publicKey);
    }

    function _validateEmail(string memory email) internal pure returns (bool) {
        // Basic check for @iitbhilai.ac.in domain
        bytes memory emailBytes = bytes(email);
        bytes memory domain = "@iitbhilai.ac.in";

        if (emailBytes.length < domain.length) return false;

        for (uint i = 0; i < domain.length; i++) {
            if (emailBytes[emailBytes.length - domain.length + i] != domain[i]) {
                return false;
            }
        }
        return true;
    }

    function getAllPublicKeys() external view returns (string[] memory) {
        return submittedPublicKeys;
    }

    function getGeneratedEmails() external view returns (string[] memory) {
        return generatedEmails;
    }

    function getPublicKeyByEmail(string memory email) external view returns (string memory) {
        return emailToPublicKey[email];
    }
}