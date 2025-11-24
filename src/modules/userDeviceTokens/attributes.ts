import { DataTypes } from "sequelize";

const tableName = "userDeviceTokens";

const attributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  deviceToken: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  sessionId: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { tableName, attributes };
