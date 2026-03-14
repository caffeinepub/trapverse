import Array "mo:core/Array";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  module LevelProgress {
    public type T = {
      level : Nat;
      stars : Nat;
      completed : Bool;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.level, b.level);
    };
  };

  var coins = 0;
  var detectorCount = 0;
  var multiplierCount = 0;
  var shieldCount = 0;

  let levelProgress = Map.empty<Nat, LevelProgress.T>();

  // Coin Transactions
  public shared ({ caller }) func addCoins(amount : Nat) : async () {
    coins += amount;
  };

  public shared ({ caller }) func spendCoins(amount : Nat) : async () {
    if (coins < amount) {
      Runtime.trap("Not enough coins");
    };
    coins -= amount;
  };

  // Powerup Purchase
  public shared ({ caller }) func buyDetector() : async () {
    if (coins < 50) {
      Runtime.trap("Not enough coins");
    };
    coins -= 50;
    detectorCount += 1;
  };

  public shared ({ caller }) func buyMultiplier() : async () {
    if (coins < 30) {
      Runtime.trap("Not enough coins");
    };
    coins -= 30;
    multiplierCount += 1;
  };

  public shared ({ caller }) func buyShield() : async () {
    if (coins < 40) {
      Runtime.trap("Not enough coins");
    };
    coins -= 40;
    shieldCount += 1;
  };

  // Use Powerup
  public shared ({ caller }) func useDetector() : async () {
    if (detectorCount == 0) {
      Runtime.trap("No detectors available");
    };
    detectorCount -= 1;
  };

  public shared ({ caller }) func useMultiplier() : async () {
    if (multiplierCount == 0) {
      Runtime.trap("No multipliers available");
    };
    multiplierCount -= 1;
  };

  public shared ({ caller }) func useShield() : async () {
    if (shieldCount == 0) {
      Runtime.trap("No shields available");
    };
    shieldCount -= 1;
  };

  // Level Progress
  public shared ({ caller }) func updateLevelProgress(level : Nat, stars : Nat, completed : Bool) : async () {
    if (level <= 0 or level > 11) {
      Runtime.trap("Invalid level");
    };
    if (stars > 3) {
      Runtime.trap("Invalid number of stars");
    };
    let progress : LevelProgress.T = {
      level;
      stars;
      completed;
    };
    levelProgress.add(level, progress);
  };

  public query ({ caller }) func getCoins() : async Nat {
    coins;
  };

  public query ({ caller }) func getPowerupInventory() : async (Nat, Nat, Nat) {
    (detectorCount, multiplierCount, shieldCount);
  };

  public query ({ caller }) func getLevelProgress(level : Nat) : async LevelProgress.T {
    switch (levelProgress.get(level)) {
      case (null) { Runtime.trap("Level progress not found") };
      case (?progress) { progress };
    };
  };

  public query ({ caller }) func getAllLevelProgress() : async [LevelProgress.T] {
    levelProgress.values().toArray().sort();
  };
};
