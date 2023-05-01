module.exports = {
    "preset": "ts-jest",
    "setupFilesAfterEnv": ["./jest.setup.js"],
    "moduleNameMapper": {
        "^\\@/(.+)": "<rootDir>/src/$1"
    }
};
