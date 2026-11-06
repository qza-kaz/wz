# Personal Space — React + Vite

A responsive personal profile site inspired by the layout language of minimal Discord profile pages. It is a fresh implementation, not a copy of another site's source.

## 1. Requirements
- Node.js 18.18+ (or a current LTS release)
- npm

## 2. Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## 3. Personalize
Edit `src/config.js`:
- `displayName`, `handle`, `tagline`, `location`
- `avatarUrl`, `coverUrl`
- `socials`
- `musicUrl`, `musicTitle`, `musicArtist`
- `discordUserId` is already set to the ID supplied for this project.

Replace the sample avatar and cover with image URLs you own or are allowed to use. For local images, put them in `public/` and use paths such as `/avatar.jpg`.

## 4. Discord live presence
This starter uses the public Lanyard WebSocket (`wss://api.lanyard.rest/socket`) to subscribe to the configured Discord user ID. It can display:
- Discord avatar, global name / username
- online / idle / DND / offline
- custom status
- game activity (when shared by Discord)
- Spotify activity, track, artist, album art and an estimated progress bar
- desktop/mobile activity flags where provided

**Important setup:** the Discord account must be opted into Lanyard's community/service for its public presence data to be available. Visit https://discord.gg/lanyard and follow its current onboarding instructions. The site cannot read private Discord messages, passwords, or hidden activity. Discord only exposes activity details when the account and activity privacy settings allow it.

Lanyard is a third-party service, not an official Discord API. Its availability and terms can change. The page falls back gracefully when presence data is unavailable.

### What “all Discord activity” can and cannot mean
The page displays the activity fields made available through Discord/Lanyard. It cannot force Discord to expose private presence, hidden games, private Spotify listening, or activities the user has disabled. Spotify details generally appear as a Discord Spotify activity when account connections and sharing settings permit it.

## 5. Spotify
No Spotify password or client secret is needed for the current design: it reads Spotify activity shared through Discord presence. Enable Spotify display / activity sharing in Discord and connect Spotify to Discord. This is not a full Spotify account OAuth integration and does not control Spotify playback.

## 6. Optional Discord server widget
To add a server invite/member widget later:
1. Enable Server Widget in the Discord server's Server Settings.
2. Copy the server ID.
3. Set `discordServerId` in `src/config.js`.
A server widget is separate from personal presence. This starter leaves it optional because no server ID was supplied.

## 7. Build and deploy
```bash
npm run build
```
Deploy the generated `dist/` folder to Vercel, Netlify, or Cloudflare Pages. For Vercel, import the project repository and use:
- Build command: `npm run build`
- Output directory: `dist`

## 8. Security
- Never put Discord bot tokens, OAuth client secrets, or Spotify client secrets in frontend files.
- The provided Discord user ID is a public identifier, not a password.
- Use HTTPS hosting.
