import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AccountDataMatching } from "../target/types/account_data_matching";
import {
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { expect } from "chai";
import { airdropIfRequired } from "@solana-developers/helpers";

describe("Account Data Matching", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace
    .AccountDataMatching as Program<AccountDataMatching>;

  const wallet = provider.wallet as anchor.Wallet;
  const fakeWallet = Keypair.generate();

  const [vaultPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    program.programId,
  );
  const [tokenPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("token")],
    program.programId,
  );

  let mint: PublicKey;
  let withdrawDestination: PublicKey;
  let fakeWithdrawDestination: PublicKey;

  before(async () => {
    try {
      mint = await createMint(
        provider.connection,
        wallet.payer,
        wallet.publicKey,
        null,
        0,
      );

      withdrawDestination = await createAccount(
        provider.connection,
        wallet.payer,
        mint,
        wallet.publicKey,
      );

      fakeWithdrawDestination = await createAccount(
        provider.connection,
        wallet.payer,
        mint,
        fakeWallet.publicKey,
      );

      await airdropIfRequired(
        connection,
        fakeWallet.publicKey,
        1 * LAMPORTS_PER_SOL,
        1 * LAMPORTS_PER_SOL,
      );
    } catch (error) {
      throw new Error(`Failed to set up test environment: ${error.message}`);
    }
  });

  it("initializes the vault and mints tokens", async () => {
    try {
      await program.methods
        .initializeVault()
        .accounts({
          vault: vaultPDA,
          tokenAccount: tokenPDA,
          withdrawDestination,
          mint,
          authority: wallet.publicKey,
        })
        .rpc();

      await mintTo(
        provider.connection,
        wallet.payer,
        mint,
        tokenPDA,
        wallet.payer,
        100,
      );

      const tokenAccount = await getAccount(provider.connection, tokenPDA);
      expect(Number(tokenAccount.amount)).to.equal(100);
    } catch (error) {
      throw new Error(
        `Failed to initialize vault and mint tokens: ${error.message}`,
      );
    }
  });
});
