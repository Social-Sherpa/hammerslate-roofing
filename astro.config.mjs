import { defineConfig } from 'astro/config';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGitHubPages
    ? 'https://social-sherpa.github.io'
    : 'https://get.hammerslateroofing.co.uk',
  base: isGitHubPages ? '/hammerslate-roofing' : '/',
});
