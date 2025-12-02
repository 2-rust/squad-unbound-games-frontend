This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Fighters Unbound**: Display and manage Fighters Unbound NFTs with training functionality
- **Hellraiser NFT Support**: If you own Hellraiser NFTs, they will automatically be detected and displayed with the same functionality as Fighters Unbound

## Configuration

### WalletConnect Project ID (Optional but Recommended)

To avoid 403 errors from WalletConnect API and enable full functionality:

1. Get a free WalletConnect Project ID:
   - Visit https://cloud.walletconnect.com
   - Sign up or log in
   - Create a new project
   - Copy your Project ID

2. Add it to your `.env.local` file in the `web` directory:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

**Note:** The app will work without a Project ID, but you may see 403 errors in the console. These can be safely ignored, but getting a Project ID is recommended for production use.

### Hellraiser NFT Configuration

To enable Hellraiser NFT functionality:

1. Create a `.env.local` file in the `web` directory
2. Add your Hellraiser NFT contract address:
   ```
   NEXT_PUBLIC_HELLRAISER_CONTRACT=0xYourContractAddressHere
   ```
3. The contract must be an ERC721-compatible NFT contract on Ethereum mainnet
4. When a user connects their wallet and owns Hellraiser NFTs, they will be displayed automatically with full functionality (carousel, training, Strava integration, etc.)

### Shape Network Configuration

The app automatically connects to Shape Network when a wallet is connected. To configure Shape Network settings:

1. Add these environment variables to your `.env.local` file:
   ```
   NEXT_PUBLIC_SHAPE_CHAIN_ID=360
   NEXT_PUBLIC_SHAPE_RPC_URL=https://mainnet.shape.network
   NEXT_PUBLIC_SHAPE_EXPLORER_URL=https://shapescan.xyz
   NEXT_PUBLIC_SHAPE_SIGN_MESSAGE=Welcome to Squad Unbound! Please sign this message to authenticate with Shape Network.
   ```

2. When a user connects their wallet:
   - The app automatically switches to Shape Network
   - If Shape Network is not in the wallet, it will be added automatically
   - A signature request will appear for authentication

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
