# Yarn Setup Guide

This project uses Yarn as the package manager. Please follow these steps to set up the project correctly.

## 🚀 Quick Start

1. **Install Yarn globally** (if not already installed):

   ```bash
   npm install -g yarn
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Start development server**:

   ```bash
   yarn dev
   ```

## 📦 Available Commands

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn install-deps` - Install dependencies
- `yarn clean` - Clean yarn cache
- `yarn type-check` - Run TypeScript type checking

## ⚠️ Important Notes

- **DO NOT** use `npm` commands in this project
- Always use `yarn` instead of `npm`
- The project is configured to use Yarn 1.22.22
- `package-lock.json` is ignored and should not be committed

## 🔧 Yarn Configuration

The project includes:
- `.yarnrc.yml` - Yarn configuration file
- `.npmrc` - Prevents npm usage
- `yarn.lock` - Dependency lock file

## 🚫 Troubleshooting

If you encounter issues:

1. **Clear yarn cache**:

   ```bash
   yarn clean
   ```

2. **Reinstall dependencies**:

   ```bash
   rm -rf node_modules
   yarn install
   ```

3. **Check yarn version**:

   ```bash
   yarn --version
   ```

## 📚 More Information

- [Yarn Documentation](https://yarnpkg.com/getting-started)
- [Yarn Migration Guide](https://yarnpkg.com/getting-started/migration)
