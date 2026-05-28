const formatUserResponse = (user) => {
  return {
    user: {
      general: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username,
        email: user.email,
        address: user.address,
        city: user.city,
        zipCode: user.zipCode,
      },
      meta: {
        id: user.id, // 👈 CRITICAL: Keeps your dashboard edit checks green!
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString(),
        isAdmin: !!user.isAdmin,
      },
      comments: [],
    },
    activity: {
      requests: [],
      comments: [],
    },
  };
};

module.exports = formatUserResponse;
