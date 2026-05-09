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
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString(),
        isAdmin: !!user.isAdmin,
      },
    },
    activity: { requests: [], comments: [] },
  };
};

const formatIssuesResponse = (issues) => {
  return {};
};

module.exports = formatUserResponse;
