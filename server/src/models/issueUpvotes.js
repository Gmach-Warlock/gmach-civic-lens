module.exports = (sequelize, DataTypes) => {
  const IssueUpvote = sequelize.define(
    "IssueUpvote",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      issue_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "issue_upvotes",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "issue_id"], // Enforces strict unique pairs at the DB layer
        },
      ],
    },
  );

  return IssueUpvote;
};
