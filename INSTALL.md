# Apple TV-style Home launcher: install on a Samsung KU43UF8030FXKR (Mac)

Files: `HomeLauncher.wgt` (UNSIGNED, needs signing before install), source in this folder, tiles in `js/apps.js`.
Layout: 'Photo List'. Remote: ▲▼ move through the app list, OK opens, ▶ moves to the top-right icons (wallpaper = cycle 3 bundled photos, grid = all installed apps with their IDs, gear = Settings), ◀/▼/Back return to the list.

## 0. Turn off ads and tracking (Settings)
Settings > General (on newer menus: All Settings > General & Privacy) > Terms & Privacy:
- Privacy Choices / Interest-Based Advertisement: Off
- Viewing Information Services: Off
- Voice recognition / data sharing agreements you don't want: decline or withdraw
Also: Settings > General > Smart Features > "Autorun Smart Hub" Off. If your menu has "Autorun Last App", turn it On (see step 4).
Uninstall preloaded apps: Apps > Settings (gear) > select app > Delete. Built-in system apps can't be deleted.

## 1. Developer Mode on the TV
1. Mac and TV on the same Wi-Fi. Get the Mac IP: `ipconfig getifaddr en0`.
2. TV: open **Apps**, enter **1 2 3 4 5** on the remote (or on-screen keypad).
3. Turn **Developer mode On**, enter the Mac IP as **Host PC IP**, press OK.
4. Restart the TV (hold Power until the Samsung logo shows).
5. TV IP: Settings > General > Network > Network Status > IP Settings.

## Option A: Tizen Studio + Samsung certificate (installs as a normal app)
1. Install Tizen Studio (CLI is fine) from developer.samsung.com/smarttv. In Package Manager add **Samsung Certificate Extension** and the **TV Extensions**.
2. Tools > Certificate Manager > + > **Samsung** > TV > create an author cert and a distributor cert (sign in with your Samsung account; it reads the TV's DUID while connected, so connect first, step 3). Name the profile e.g. `stu`.
3. Connect:
   ```bash
   export PATH="$HOME/tizen-studio/tools:$HOME/tizen-studio/tools/ide/bin:$PATH"
   sdb connect <TV_IP>
   sdb devices
   ```
4. Sign and install:
   ```bash
   tizen package -t wgt -s stu -o ./signed -- HomeLauncher.wgt
   tizen install -n ./signed/HomeLauncher.wgt -t $(sdb devices | awk 'NR==2{print $3}')
   ```
5. "Home" now appears in the Apps list. Pin it to the first slot of the home bar.
Tizen 7+ TVs (this 2026 TV) require a **Samsung** certificate whose distributor cert includes this TV's DUID; a plain Tizen certificate will fail to install.

## Option B: TizenBrew (no Tizen Studio, supports autolaunch)
TizenBrew runs "modules": web apps it loads from npm or GitHub via jsDelivr. This folder already has the `package.json` it needs (`packageType: "app"`, `appPath: "index.html"`).
1. Developer Mode with Host PC IP = your Mac (step 1).
2. Download **TizenBrew Installer** for macOS from github.com/reisxd/TizenBrewInstaller/releases/latest, then in Terminal:
   `chmod +x tizenbrew-installer-*` and run it. Click **Install TizenBrew**. On Tizen 7+ it asks you to sign in to a Samsung account to create the certificate.
3. Per the TizenBrew guide, set Host PC IP back to **127.0.0.1** afterwards and restart the TV (TizenBrew needs its own debug connection).
4. Publish this folder as a public GitHub repo (e.g. `stu/tv-home-launcher`), or to npm.
5. On the TV open TizenBrew > **GREEN** button (Module Manager) > **Add GitHub Module** > `stu/tv-home-launcher` (or Add NPM Module).
6. Autolaunch: TizenBrew Settings > **Autolaunch Settings** > choose "Home". It now opens straight into the launcher whenever TizenBrew starts.

## Opening on startup: what actually works
- TizenBrew autolaunch starts the module **when TizenBrew starts**. It does not make the TV boot into TizenBrew.
- For power-on: put "Home" (Option A) or TizenBrew (Option B) first on the Smart Hub bar, and turn on **Autorun Last App** if your firmware has it, so the TV reopens it after power-on. The stock Smart Hub can't be fully replaced without root.

## Editing tiles
Edit `js/apps.js`, then re-zip (`cd tv-launcher && zip -r HomeLauncher.wgt config.xml index.html icon.png css js img`) and re-sign (Option A), or push to GitHub (Option B; jsDelivr can cache for up to ~12 h, so tag a new version).
