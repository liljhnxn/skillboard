// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SkillBoard
 * @dev Simple on-chain talent showcase and skill endorsement contract.
 * Exactly one contract powering the entire SkillBoard dApp.
 */
contract SkillBoard {
    // Custom Errors
    error ProfileAlreadyExists();
    error ProfileDoesNotExist();
    error EmptyUsername();
    error UsernameTooLong();
    error BioTooLong();
    error EmptySkill();
    error SkillTooLong();
    error MaxSkillsReached();
    error SkillAlreadyExists();
    error SkillNotFound();
    error CannotEndorseSelf();
    error AlreadyEndorsed();

    // Structs
    struct Profile {
        string username;
        string bio;
        address wallet;
        string[] skills;
        uint256 createdAt;
        bool exists;
    }

    struct ProfileView {
        address wallet;
        string username;
        string bio;
        string[] skills;
        uint256[] skillEndorsements;
        uint256 createdAt;
    }

    // Constants
    uint256 public constant MAX_SKILLS = 10;
    uint256 public constant MAX_USERNAME_LENGTH = 32;
    uint256 public constant MAX_BIO_LENGTH = 280;
    uint256 public constant MAX_SKILL_LENGTH = 32;

    // Storage
    mapping(address => Profile) private profiles;
    address[] private profileAddresses;

    // user => skill => endorsement count
    mapping(address => mapping(string => uint256)) private skillEndorsements;

    // user => skill => endorser => bool
    mapping(address => mapping(string => mapping(address => bool))) private endorsements;

    // Events
    event ProfileCreated(
        address indexed user,
        string username,
        string bio,
        uint256 timestamp
    );
    event ProfileUpdated(
        address indexed user,
        string username,
        string bio
    );
    event SkillAdded(
        address indexed user,
        string skill
    );
    event SkillRemoved(
        address indexed user,
        string skill
    );
    event SkillEndorsed(
        address indexed endorser,
        address indexed user,
        string skill,
        uint256 newCount
    );

    /**
     * @notice Create a new talent profile
     * @param username The display name for the profile
     * @param bio A short biography
     */
    function createProfile(string calldata username, string calldata bio) external {
        if (profiles[msg.sender].exists) revert ProfileAlreadyExists();
        bytes memory userBytes = bytes(username);
        if (userBytes.length == 0) revert EmptyUsername();
        if (userBytes.length > MAX_USERNAME_LENGTH) revert UsernameTooLong();
        if (bytes(bio).length > MAX_BIO_LENGTH) revert BioTooLong();

        Profile storage p = profiles[msg.sender];
        p.username = username;
        p.bio = bio;
        p.wallet = msg.sender;
        p.createdAt = block.timestamp;
        p.exists = true;

        profileAddresses.push(msg.sender);

        emit ProfileCreated(msg.sender, username, bio, block.timestamp);
    }

    /**
     * @notice Update profile username and bio
     * @param username New display name
     * @param bio New biography
     */
    function updateProfile(string calldata username, string calldata bio) external {
        if (!profiles[msg.sender].exists) revert ProfileDoesNotExist();
        bytes memory userBytes = bytes(username);
        if (userBytes.length == 0) revert EmptyUsername();
        if (userBytes.length > MAX_USERNAME_LENGTH) revert UsernameTooLong();
        if (bytes(bio).length > MAX_BIO_LENGTH) revert BioTooLong();

        Profile storage p = profiles[msg.sender];
        p.username = username;
        p.bio = bio;

        emit ProfileUpdated(msg.sender, username, bio);
    }

    /**
     * @notice Add a new skill to caller's profile
     * @param skill The name of the skill to add
     */
    function addSkill(string calldata skill) external {
        if (!profiles[msg.sender].exists) revert ProfileDoesNotExist();
        bytes memory skillBytes = bytes(skill);
        if (skillBytes.length == 0) revert EmptySkill();
        if (skillBytes.length > MAX_SKILL_LENGTH) revert SkillTooLong();

        Profile storage p = profiles[msg.sender];
        if (p.skills.length >= MAX_SKILLS) revert MaxSkillsReached();

        bytes32 skillHash = keccak256(skillBytes);
        for (uint256 i = 0; i < p.skills.length; i++) {
            if (keccak256(bytes(p.skills[i])) == skillHash) {
                revert SkillAlreadyExists();
            }
        }

        p.skills.push(skill);
        emit SkillAdded(msg.sender, skill);
    }

    /**
     * @notice Remove a skill from caller's profile
     * @param skill The name of the skill to remove
     */
    function removeSkill(string calldata skill) external {
        if (!profiles[msg.sender].exists) revert ProfileDoesNotExist();
        bytes memory skillBytes = bytes(skill);
        if (skillBytes.length == 0) revert EmptySkill();

        Profile storage p = profiles[msg.sender];
        bytes32 skillHash = keccak256(skillBytes);
        uint256 skillCount = p.skills.length;
        bool found = false;
        uint256 foundIndex = 0;

        for (uint256 i = 0; i < skillCount; i++) {
            if (keccak256(bytes(p.skills[i])) == skillHash) {
                found = true;
                foundIndex = i;
                break;
            }
        }

        if (!found) revert SkillNotFound();

        // Swap and pop to remove skill
        p.skills[foundIndex] = p.skills[skillCount - 1];
        p.skills.pop();

        emit SkillRemoved(msg.sender, skill);
    }

    /**
     * @notice Endorse a skill of another user
     * @param user The address of the talent being endorsed
     * @param skill The specific skill being endorsed
     */
    function endorseSkill(address user, string calldata skill) external {
        if (msg.sender == user) revert CannotEndorseSelf();
        if (!profiles[user].exists) revert ProfileDoesNotExist();
        bytes memory skillBytes = bytes(skill);
        if (skillBytes.length == 0) revert EmptySkill();

        // Check if user actually has this skill
        Profile storage p = profiles[user];
        bytes32 skillHash = keccak256(skillBytes);
        bool skillExists = false;
        for (uint256 i = 0; i < p.skills.length; i++) {
            if (keccak256(bytes(p.skills[i])) == skillHash) {
                skillExists = true;
                break;
            }
        }
        if (!skillExists) revert SkillNotFound();

        if (endorsements[user][skill][msg.sender]) revert AlreadyEndorsed();

        endorsements[user][skill][msg.sender] = true;
        skillEndorsements[user][skill] += 1;
        uint256 newCount = skillEndorsements[user][skill];

        emit SkillEndorsed(msg.sender, user, skill, newCount);
    }

    /**
     * @notice Check whether caller/address has endorsed a particular skill
     * @param endorser The address who might have endorsed
     * @param user The profile owner
     * @param skill The skill name
     */
    function hasEndorsed(
        address endorser,
        address user,
        string calldata skill
    ) external view returns (bool) {
        return endorsements[user][skill][endorser];
    }

    /**
     * @notice Get endorsement count for a skill
     * @param user The profile owner
     * @param skill The skill name
     */
    function getSkillEndorsements(
        address user,
        string calldata skill
    ) external view returns (uint256) {
        return skillEndorsements[user][skill];
    }

    /**
     * @notice Check if a profile exists
     * @param user The address to query
     */
    function hasProfile(address user) external view returns (bool) {
        return profiles[user].exists;
    }

    /**
     * @notice Get a single profile
     * @param user The address of the profile to fetch
     */
    function getProfile(address user) external view returns (
        string memory username,
        string memory bio,
        address wallet,
        string[] memory skills,
        uint256[] memory endorsementsCount,
        uint256 createdAt
    ) {
        if (!profiles[user].exists) revert ProfileDoesNotExist();
        Profile storage p = profiles[user];
        uint256 skillCount = p.skills.length;
        uint256[] memory counts = new uint256[](skillCount);
        for (uint256 i = 0; i < skillCount; i++) {
            counts[i] = skillEndorsements[user][p.skills[i]];
        }
        return (p.username, p.bio, p.wallet, p.skills, counts, p.createdAt);
    }

    /**
     * @notice Get total number of registered profiles
     */
    function getTotalProfiles() external view returns (uint256) {
        return profileAddresses.length;
    }

    /**
     * @notice Get all profile addresses
     */
    function getProfileAddresses() external view returns (address[] memory) {
        return profileAddresses;
    }

    /**
     * @notice Retrieve all registered profiles with full skill and endorsement information
     */
    function getAllProfiles() external view returns (ProfileView[] memory) {
        uint256 total = profileAddresses.length;
        ProfileView[] memory all = new ProfileView[](total);

        for (uint256 i = 0; i < total; i++) {
            address addr = profileAddresses[i];
            Profile storage p = profiles[addr];
            uint256 skillCount = p.skills.length;
            uint256[] memory counts = new uint256[](skillCount);

            for (uint256 j = 0; j < skillCount; j++) {
                counts[j] = skillEndorsements[addr][p.skills[j]];
            }

            all[i] = ProfileView({
                wallet: p.wallet,
                username: p.username,
                bio: p.bio,
                skills: p.skills,
                skillEndorsements: counts,
                createdAt: p.createdAt
            });
        }

        return all;
    }
}

