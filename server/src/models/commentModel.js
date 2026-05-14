module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    {
      tableName: "comments",
      underscored: true,
    },
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.Issue, {
      foreignKey: "issue_id",
      onDelete: "CASCADE",
    });
    Comment.belongsTo(models.User, { foreignKey: "author_id", as: "author" });
  };

  return Comment;
};
