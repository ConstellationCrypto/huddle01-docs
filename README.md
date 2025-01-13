## Using this template

Install all dependencies and dev dependencies:

```bash
pnpm i
```

From the root of the directory, run the script with the rollup subdomain as an argument to generate the docs:

```bash
pnpm run cli <rollup-subdomain>
```

Then, follow the instructions in the terminal to generate the docs.

After the script is finished, you should have a new set of docs. Run `pnpm dev` to start the development server and visit localhost:3000 to see the docs.

**It is recommended to delete the cli.ts and templates.json files before handoff to avoid confusion. Once the script is run, it cannot be undone or run again.**

Then, add `logo.svg` to the images folder, and updated the TODO with a chain description in `pages/index.mdx`.

## Template Variables

| Variable | Description |
|----------|-------------|
| %NETWORK_NAME | The name of the network |
| %NETWORK_SLUG | The slug of the network - used for hardhat/foundry network names. No spaces, lowercase |
| %EXPLORER_URL | The URL of the network's explorer |
| %BRIDGE_URL | The URL of the network's bridge UI |
| %HUB_URL | The URL of the network's hub page |
| %RPC_URL | The URL of the network's RPC |
| %CHAIN_ID | The chain ID of the network |
| %CURRENCY_SYMBOL | The currency symbol of the network |

### Assets
Note: the script also replaces  `images/hub.png` with screenshots from the network's hub page. Make sure to verify

## Local Development

First, run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit localhost:3000.
