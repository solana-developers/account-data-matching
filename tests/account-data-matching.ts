import * as anchor from "@project-serum/anchor"
import * as spl from "@solana/spl-token"
import { Program } from "@project-serum/anchor"
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey"
import { AccountDataMatching } from "../target/types/account_data_matching"
import { expect } from "chai"

describe("account-data-matching", () => {
  anchor.setProvider(anchor.AnchorProvider.env())

  const connection = anchor.getProvider().connection
  const wallet = anchor.workspace.AccountDataMatching.provider.wallet
  const walletFake = anchor.web3.Keypair.generate()

  const program = anchor.workspace
    .AccountDataMatching as Program<AccountDataMatching>

  const [vaultPDA] = findProgramAddressSync(
    [Buffer.from("vault")],
    program.programId
  )

  const [tokenPDA] = findProgramAddressSync(
    [Buffer.from("token")],
    program.programId
  )

  let mint: anchor.web3.PublicKey
  let withdrawDestination: anchor.web3.PublicKey
  let withdrawDestinationFake: anchor.web3.PublicKey

  before(async () => {
    mint = await spl.createMint(
      connection,
      wallet.payer,
      wallet.publicKey,
      null,
      0
    )

    withdrawDestination = await spl.createAccount(
      connection,
      wallet.payer,
      mint,
      wallet.publicKey
    )

    withdrawDestinationFake = await spl.createAccount(
      connection,
      wallet.payer,
      mint,
      walletFake.publicKey
    )

    await connection.confirmTransaction(
      await connection.requestAirdrop(
        walletFake.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      ),
      "confirmed"
    )
  })

  it("Initialize Vault", async () => {
    await program.methods
      .initializeVault()
      .accounts({
        vault: vaultPDA,
        tokenAccount: tokenPDA,
        withdrawDestination: withdrawDestination,
        mint: mint,
        authority: wallet.publicKey,
      })
      .rpc()

    await spl.mintTo(
      connection,
      wallet.payer,
      mint,
      tokenPDA,
      wallet.payer,
      100
    )

    const balance = await connection.getTokenAccountBalance(tokenPDA)
    expect(balance.value.uiAmount).to.eq(100)
  })
})
