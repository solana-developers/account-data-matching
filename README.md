

# Account Data Matching

A demonstration to show importance of account checks in [account-data-matchin]https://solana.com/developers/courses/program-security/account-data-matching. This project demonstrates secure account data matching using Anchor and Solana. It implements a vault system with token management and withdrawal functionality.

```bash
npx create-solana-dapp my-project --template account-data-matching
```

## Prerequisites

- Rust and Cargo
- Solana CLI tools
- Node.js and Yarn
- Anchor Framework

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/solana-developers/solana-account-data-matching
   cd account-data-matching
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Build the project:
   ```
   anchor build
   ```

4. Run tests:
   ```
   anchor test
   ```

## Project Structure

- `programs/account-data-matching/src/lib.rs`: Main program logic for the vault system
- `tests/account-data-matching.ts`: Comprehensive test suite
- `Anchor.toml`: Anchor configuration and deployment settings
- `Cargo.toml`: Rust dependencies
- `migrations/deploy.ts`: Deployment script

## Key Features

- Secure vault initialization
- Token account management
- Withdrawal functionality with proper authorization checks

## Usage

1. Initialize the vault:
   ```typescript
   await program.methods.initializeVault()
     .accounts({
       vault: vaultPDA,
       tokenAccount: tokenPDA,
       withdrawDestination: withdrawDestination,
       mint: mint,
       authority: wallet.publicKey,
     })
     .rpc()
   ```

2. Perform a withdrawal (ensure proper authorization):
   ```typescript
   await program.methods.insecureWithdraw()
     .accounts({
       vault: vaultPDA,
       tokenAccount: tokenPDA,
       withdrawDestination: withdrawDestination,
       authority: wallet.publicKey,
     })
     .rpc()
   ```


## Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/solana-foundation/developer-content/blob/main/CONTRIBUTING.md) for more details.

>>>>>>> Stashed changes
