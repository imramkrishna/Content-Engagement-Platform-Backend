import { DataTypes } from "sequelize";

const streakAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  streakCount: {
    type: DataTypes.INTEGER,
    default: 2,
  },
  todayScrolls: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  lastUpdatedDate: { type: DataTypes.DATE },
  streakAwardedToday: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  highestStreak: { type: DataTypes.INTEGER, defaultValue: 0 }, // new
  streakThisMonth: { type: DataTypes.INTEGER, defaultValue: 0 }, // new
  day: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { streakAttributes };
