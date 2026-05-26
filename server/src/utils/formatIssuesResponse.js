const formatIssuesResponse = (issues) => {
  const issuesArray = Array.isArray(issues) ? issues : [issues];

  return {
    issues: issuesArray.map((issue) => {
      // Safely extract location data if it was eagerly loaded by Sequelize
      const locationData = issue.Location || issue.location || {};

      // Safely map comments if they were eagerly loaded
      const commentsData = Array.isArray(issue.Comments || issue.comments)
        ? (issue.Comments || issue.comments).map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: comment.author
              ? {
                  id: comment.author.id,
                  username: comment.author.username,
                  firstName: comment.author.firstName,
                  lastName: comment.author.lastName,
                }
              : null,
          }))
        : [];

      return {
        meta: {
          id: issue.id,
          authorId: issue.authorId || (issue.author ? issue.author.id : null),
          authorName: issue.author
            ? `${issue.author.firstName} ${issue.author.lastName}`.trim()
            : "Anonymous",
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        },
        general: {
          title: issue.title,
          description: issue.description,
          category: issue.category,
        },
        location: {
          address: issue.address || null,
          city: issue.city || null,
          zipCode: issue.zipCode || null,
          crossStreets: locationData.crossStreets || null, // New clean property for frontend consumption
          coords: {
            lat: locationData.lat ? parseFloat(locationData.lat) : null,
            lng: locationData.lng ? parseFloat(locationData.lng) : null,
          },
        },
        status: {
          isOpen: issue.isOpen ?? true,
          current: issue.current || "Reported",
          urgency: issue.urgency || "Medium",
          lastActionDate: issue.lastActionDate || issue.updatedAt,
        },
        social: {
          upvotes: issue.upvotes || 0,
          tags: issue.tags || [],
          comments: commentsData,
        },
      };
    }),
  };
};

module.exports = formatIssuesResponse;
