// Helper to format the user data for Redux
const formatUserResponse = (user) => {
  const [firstName, ...lastNameParts] = (user.name || "").split(" ");
  return {
    user: {
      general: {
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        username: user.username,
        email: user.email,
        address: user.address,
      },
      meta: {
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString(),
        isAdmin: !!user.isAdmin,
      },
    },
    activity: { requests: [], comments: [] },
  };
};

module.exports = formatUserResponse;
