import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { SkillBoard } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("SkillBoard Smart Contract", function () {
  let skillBoard: SkillBoard;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let charlie: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob, charlie] = await ethers.getSigners();
    const SkillBoardFactory = await ethers.getContractFactory("SkillBoard");
    skillBoard = await SkillBoardFactory.deploy();
    await skillBoard.waitForDeployment();
  });

  describe("Profile Creation & Management", function () {
    it("should allow a user to create a profile", async function () {
      await expect(skillBoard.connect(alice).createProfile("alice_dev", "Full-stack Web3 builder"))
        .to.emit(skillBoard, "ProfileCreated");

      const profile = await skillBoard.getProfile(alice.address);
      expect(profile[0]).to.equal("alice_dev");
      expect(profile[1]).to.equal("Full-stack Web3 builder");
      expect(profile[2]).to.equal(alice.address);
      expect(profile[3].length).to.equal(0);
      expect(profile[4].length).to.equal(0);
      expect(profile[5]).to.be.gt(0);

      const hasProf = await skillBoard.hasProfile(alice.address);
      expect(hasProf).to.be.true;
    });

    it("should reject empty username", async function () {
      await expect(
        skillBoard.connect(alice).createProfile("", "Short bio")
      ).to.be.revertedWithCustomError(skillBoard, "EmptyUsername");
    });

    it("should reject username exceeding max length", async function () {
      const longUsername = "a".repeat(33);
      await expect(
        skillBoard.connect(alice).createProfile(longUsername, "Bio")
      ).to.be.revertedWithCustomError(skillBoard, "UsernameTooLong");
    });

    it("should prevent duplicate profile creation for same wallet", async function () {
      await skillBoard.connect(alice).createProfile("alice_dev", "Bio 1");

      await expect(
        skillBoard.connect(alice).createProfile("alice_2", "Bio 2")
      ).to.be.revertedWithCustomError(skillBoard, "ProfileAlreadyExists");
    });

    it("should allow a profile owner to update their profile", async function () {
      await skillBoard.connect(alice).createProfile("alice_dev", "Old bio");

      await expect(skillBoard.connect(alice).updateProfile("alice_new", "Updated bio"))
        .to.emit(skillBoard, "ProfileUpdated")
        .withArgs(alice.address, "alice_new", "Updated bio");

      const profile = await skillBoard.getProfile(alice.address);
      expect(profile[0]).to.equal("alice_new");
      expect(profile[1]).to.equal("Updated bio");
    });

    it("should reject updateProfile if profile does not exist", async function () {
      await expect(
        skillBoard.connect(bob).updateProfile("bob_name", "Bio")
      ).to.be.revertedWithCustomError(skillBoard, "ProfileDoesNotExist");
    });

    it("should revert getProfile for non-existent profile", async function () {
      await expect(
        skillBoard.getProfile(bob.address)
      ).to.be.revertedWithCustomError(skillBoard, "ProfileDoesNotExist");
    });
  });

  describe("Skill Management", function () {
    beforeEach(async function () {
      await skillBoard.connect(alice).createProfile("alice_dev", "Web3 engineer");
    });

    it("should allow profile owner to add skills", async function () {
      await expect(skillBoard.connect(alice).addSkill("Solidity"))
        .to.emit(skillBoard, "SkillAdded")
        .withArgs(alice.address, "Solidity");

      await skillBoard.connect(alice).addSkill("React");

      const profile = await skillBoard.getProfile(alice.address);
      expect(profile[3]).to.deep.equal(["Solidity", "React"]);
    });

    it("should reject adding empty skill", async function () {
      await expect(
        skillBoard.connect(alice).addSkill("")
      ).to.be.revertedWithCustomError(skillBoard, "EmptySkill");
    });

    it("should reject duplicate skills for the same profile", async function () {
      await skillBoard.connect(alice).addSkill("Solidity");

      await expect(
        skillBoard.connect(alice).addSkill("Solidity")
      ).to.be.revertedWithCustomError(skillBoard, "SkillAlreadyExists");
    });

    it("should enforce maximum of 10 skills per profile", async function () {
      for (let i = 1; i <= 10; i++) {
        await skillBoard.connect(alice).addSkill(`Skill_${i}`);
      }

      await expect(
        skillBoard.connect(alice).addSkill("Skill_11")
      ).to.be.revertedWithCustomError(skillBoard, "MaxSkillsReached");
    });

    it("should reject skill management for unregistered user", async function () {
      await expect(
        skillBoard.connect(bob).addSkill("Solidity")
      ).to.be.revertedWithCustomError(skillBoard, "ProfileDoesNotExist");
    });

    it("should allow profile owner to remove skills", async function () {
      await skillBoard.connect(alice).addSkill("Solidity");
      await skillBoard.connect(alice).addSkill("TypeScript");

      await expect(skillBoard.connect(alice).removeSkill("Solidity"))
        .to.emit(skillBoard, "SkillRemoved")
        .withArgs(alice.address, "Solidity");

      const profile = await skillBoard.getProfile(alice.address);
      expect(profile[3]).to.deep.equal(["TypeScript"]);
    });

    it("should reject removing a non-existent skill", async function () {
      await skillBoard.connect(alice).addSkill("Solidity");

      await expect(
        skillBoard.connect(alice).removeSkill("Python")
      ).to.be.revertedWithCustomError(skillBoard, "SkillNotFound");
    });
  });

  describe("Endorsements", function () {
    beforeEach(async function () {
      await skillBoard.connect(alice).createProfile("alice_dev", "Web3 dev");
      await skillBoard.connect(alice).addSkill("Solidity");
      await skillBoard.connect(alice).addSkill("Next.js");

      await skillBoard.connect(bob).createProfile("bob_builder", "Rust dev");
      await skillBoard.connect(bob).addSkill("Rust");
    });

    it("should allow another user to endorse a skill", async function () {
      await expect(skillBoard.connect(bob).endorseSkill(alice.address, "Solidity"))
        .to.emit(skillBoard, "SkillEndorsed")
        .withArgs(bob.address, alice.address, "Solidity", 1);

      const count = await skillBoard.getSkillEndorsements(alice.address, "Solidity");
      expect(count).to.equal(1);

      const hasEndorsed = await skillBoard.hasEndorsed(bob.address, alice.address, "Solidity");
      expect(hasEndorsed).to.be.true;
    });

    it("should prevent self-endorsement", async function () {
      await expect(
        skillBoard.connect(alice).endorseSkill(alice.address, "Solidity")
      ).to.be.revertedWithCustomError(skillBoard, "CannotEndorseSelf");
    });

    it("should prevent endorsing the same skill twice by the same wallet", async function () {
      await skillBoard.connect(bob).endorseSkill(alice.address, "Solidity");

      await expect(
        skillBoard.connect(bob).endorseSkill(alice.address, "Solidity")
      ).to.be.revertedWithCustomError(skillBoard, "AlreadyEndorsed");
    });

    it("should allow multiple different users to endorse the same skill", async function () {
      await skillBoard.connect(bob).endorseSkill(alice.address, "Solidity");
      await skillBoard.connect(charlie).endorseSkill(alice.address, "Solidity");

      const count = await skillBoard.getSkillEndorsements(alice.address, "Solidity");
      expect(count).to.equal(2);
    });

    it("should revert endorsement if target profile does not have the skill", async function () {
      await expect(
        skillBoard.connect(bob).endorseSkill(alice.address, "Python")
      ).to.be.revertedWithCustomError(skillBoard, "SkillNotFound");
    });
  });

  describe("Profile Discovery & Views", function () {
    it("should retrieve all profiles with getAllProfiles", async function () {
      await skillBoard.connect(alice).createProfile("alice_dev", "Bio 1");
      await skillBoard.connect(alice).addSkill("Solidity");

      await skillBoard.connect(bob).createProfile("bob_builder", "Bio 2");
      await skillBoard.connect(bob).addSkill("Rust");
      await skillBoard.connect(bob).addSkill("Go");

      // Alice endorses Bob's Rust
      await skillBoard.connect(alice).endorseSkill(bob.address, "Rust");

      const all = await skillBoard.getAllProfiles();
      expect(all.length).to.equal(2);

      expect(all[0].username).to.equal("alice_dev");
      expect(all[0].wallet).to.equal(alice.address);
      expect(all[0].skills).to.deep.equal(["Solidity"]);
      expect(all[0].skillEndorsements[0]).to.equal(0);

      expect(all[1].username).to.equal("bob_builder");
      expect(all[1].wallet).to.equal(bob.address);
      expect(all[1].skills).to.deep.equal(["Rust", "Go"]);
      expect(all[1].skillEndorsements[0]).to.equal(1);
      expect(all[1].skillEndorsements[1]).to.equal(0);

      const total = await skillBoard.getTotalProfiles();
      expect(total).to.equal(2);
    });
  });
});
