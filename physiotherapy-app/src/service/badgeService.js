const Badge = require("./models/Badges");
const User = require("./models/User");

async function checkAndAssignBadges(userId) {
  const user = await User.findById(userId).populate("badges.badgeId"); // Nutzer mit Badges laden
  const badges = await Badge.find(); // Alle Badges laden

  const newBadges = [];

  for (const badge of badges) {
    const { criteria } = badge;

    // Prüfe Bedingungen
    const meetsStreak = criteria.streak ? user.streak >= criteria.streak : true;
    const meetsPoints = criteria.points ? user.points >= criteria.points : true;

    // Prüfe, ob der Nutzer den Badge bereits hat
    const alreadyAwarded = user.badges.some(
      (b) => b.badgeId.toString() === badge._id.toString()
    );

    if (meetsStreak && meetsPoints && !alreadyAwarded) {
      newBadges.push({
        badgeId: badge._id,
        awardedAt: new Date(),
      });
    }
  }

  // Falls neue Badges hinzukommen, Nutzer aktualisieren
  if (newBadges.length > 0) {
    user.badges.push(...newBadges);
    await user.save();
    console.log(`Neue Badges für Nutzer ${userId}:`, newBadges);
  }
}

module.exports = { checkAndAssignBadges };
