const Badge = require("./models/Badges");
const User = require("./models/User");

async function checkAndAssignBadges(userId) {
  const user = await User.findById(userId).populate("badges.badgeId"); 
  const badges = await Badge.find(); 

  const newBadges = [];

  for (const badge of badges) {
    const { criteria } = badge;

    const meetsStreak = criteria.streak ? user.streak >= criteria.streak : true;
    const meetsPoints = criteria.points ? user.points >= criteria.points : true;

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

  
  if (newBadges.length > 0) {
    user.badges.push(...newBadges);
    await user.save();
  }
}

module.exports = { checkAndAssignBadges };
