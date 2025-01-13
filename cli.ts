#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';

const program = new Command();

const downloadScreenshotOfUrl = async (url: string, filePath: string) => {
  const imageUrl = `https://api.screenshotone.com/take?
	access_key=uG7PJ3bG_Gxz_A
	&url=${url}
	&format=png
	&block_ads=true
	&block_cookie_banners=true
	&block_banners_by_heuristics=false
	&block_trackers=true
	&delay=10
	&timeout=90
	&response_type=by_format
	&image_quality=80`;
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    fs.writeFileSync(filePath, imageBuffer);
    console.log('Hub image downloaded successfully');
  } catch (imageError) {
    console.error('Error downloading hub image. Do it manually!:', imageError);
  }
}


program
  .name('docs-cli')
  .description('CLI tool for docs configuration')
  .version('1.0.0');

program
  .argument('<rollupsubdomain>', 'subdomain for the rollup')
  .action(async (rollupsubdomain: string) => {
    console.log(`Getting config for: ${rollupsubdomain}`);
    const rawConfigUrl = `https://apechain.hub.caldera.xyz/api/trpc/hub.getRollupBySubdomain?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22subdomain%22%3A%22${rollupsubdomain}%22%7D%7D%7D`
    try {
      const response = await fetch(rawConfigUrl);
      const data = await response.json();
      const rawConfig = data[0].result.data.json; // follows the format of exampleRawConfig

      const templateVariables = {
        "%NETWORK_NAME": rawConfig.displayName,
        "%NETWORK_SLUG": rawConfig.subdomain,
        "%EXPLORER_URL": 'https://' + (rawConfig?.explorer?.customHost || `${rawConfig.subdomain}.explorer.caldera.xyz`),
        "%BRIDGE_URL": 'https://' + (rawConfig?.bridge?.customHost || `${rawConfig.subdomain}.bridge.caldera.xyz`),
        "%HUB_URL": 'https://' + (rawConfig?.hub?.customHost || `${rawConfig.subdomain}.hub.caldera.xyz`),
        "%RPC_URL": rawConfig.customRpcHost ? `https://${rawConfig.customRpcHost}/http` : `https://${rawConfig.rpcHost}/http`,
        "%CHAIN_ID": rawConfig.rollupChainId,
        "%CURRENCY_SYMBOL": rawConfig.rollupNativeTokenSymbol
      };


      fs.writeFileSync('templates.json', JSON.stringify(templateVariables, null, 2));
      console.log('Template variables saved to templates.json');

      console.log('Downloading hub image...')
      if(!process.env.SKIP_IMAGE_DOWNLOAD) {
      await downloadScreenshotOfUrl(`https://${rollupsubdomain}.hub.caldera.xyz`, 'images/hub.png');
      await downloadScreenshotOfUrl(`https://${rollupsubdomain}.bridge.caldera.xyz`, 'images/bridge.png');
      }

      console.log('Now, verify templates.json and images/hub.png for correctness. Make any necessary changes in templates.json')
      console.log('Press enter to continue...');
      await new Promise(resolve => process.stdin.once('data', resolve));
      console.log('Generating docs...')
      
      const templateVariablesFromFile = JSON.parse(fs.readFileSync('templates.json', 'utf8'));
      console.log(templateVariablesFromFile);

      // TODO: lightweight validation

      // Replace template variables in all .mdx and .json files in pages directory
      // @ts-ignore
      const files = fs.readdirSync('pages', { recursive: true }).map(file => `pages/${file}`);
      // Add theme.config.tsx to the list of files to process
      files.push('theme.config.tsx');
      console.log(files);
      for (const file of files) {
        if (!file.endsWith('.mdx') && !file.endsWith('.json') && !file.endsWith('.tsx')) continue;
        
        const filePath = `${file}`;
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace each template variable
        for (const [variable, value] of Object.entries(templateVariablesFromFile)) {
          // @ts-ignore
          content = content.replaceAll(variable, value);
        }

        fs.writeFileSync(filePath, content);
        console.log(`Processed ${filePath}`);
      }

      console.log('Template variables replaced in all pages');

    } catch (error) {
      console.error('Error fetching config:', error);
    }
  });

program.parse();
