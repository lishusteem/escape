# Crypto Escape Room - Camera Entry System

A React TypeScript application built with Vite for a crypto-themed escape room experience with MetaMask integration.

## 🎯 Project Overview

This is the entry system for a crypto-themed escape room that requires users to:
- Connect their MetaMask wallet
- Switch to Sepolia testnet
- Have sufficient ETH for gas fees
- Complete verification before entering the main game

## 🔧 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Blockchain**: Ethereum Sepolia Testnet
- **Wallet**: MetaMask Integration

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MetaMask browser extension
- Some Sepolia ETH for testing (can be obtained from faucets)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔗 Blockchain Integration

### Sepolia Testnet Configuration
- **Chain ID**: 11155111 (0xaa36a7)
- **Network Name**: Sepolia Test Network
- **Minimum ETH Required**: 0.005 ETH

### Faucets for Test ETH
- [Chainlink Faucet](https://faucets.chain.link/sepolia) (Recommended)
- [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

## 🎮 Features

- **Wallet Connection**: MetaMask integration with connection status
- **Network Verification**: Automatic Sepolia network detection and switching
- **Balance Checking**: ETH balance verification for gas fees
- **Romanian Language**: UI text in Romanian for local users
- **Responsive Design**: Modern, crypto-themed interface
- **Loading States**: Proper loading indicators for blockchain operations

## 📁 Project Structure

```
src/
├── CameraEntry.tsx     # Main entry component
├── types/
│   └── ethereum.d.ts   # TypeScript definitions for MetaMask
├── App.tsx            # App component
└── main.tsx           # Entry point
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### VS Code Tasks

A development server task is configured in `.vscode/tasks.json` for easy development within VS Code.

## 🔒 Security Considerations

- Always verify you're on the correct network (Sepolia for testing)
- Never share your private keys or seed phrases
- This is for testnet use only - do not use real ETH

## 📱 User Flow

1. User opens the application
2. System checks for MetaMask installation
3. User connects wallet
4. System verifies Sepolia network (prompts to switch if needed)
5. System checks ETH balance
6. Once all requirements are met, user can enter the crypto room

## 🤝 Contributing

This project uses Romanian language for user-facing text to match the local audience. When contributing:
- Maintain TypeScript strict mode
- Follow React hooks best practices
- Use Tailwind CSS for styling
- Handle blockchain errors gracefully
