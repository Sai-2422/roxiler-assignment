// transaction.repository.js

import transactionModel from "./transaction.schema.js";

export const findTransactions = (searchConfig, skip, limit) => {
    return transactionModel.find(searchConfig).skip(skip).limit(limit);
};

export const countTransactions = (searchConfig) => {
    return transactionModel.countDocuments(searchConfig);
};

export const findStatistics = (monthQuery, projectQuery) => {
    return transactionModel.find(monthQuery, projectQuery);
};

export const findPriceRange = (monthQuery, projectQuery) => {
    return transactionModel.find(monthQuery, projectQuery);
};

export const findCategoryDistribution = (monthQuery, projectQuery) => {
    return transactionModel.find(monthQuery, projectQuery);
};
