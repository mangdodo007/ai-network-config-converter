// GitHub Update Service
export class UpdateService {
    constructor() {
        // GitHub repository details (now public)
        this.repoOwner = 'mangdodo007'; // GitHub username
        this.repoName = 'ai-network-config-converter';
        this.currentVersion = '1.1.0'; // Current version with update features
        this.githubUrl = `https://github.com/${this.repoOwner}/${this.repoName}`;
    }

    async checkForUpdates() {
        try {
            // Get the latest release from public GitHub API
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/releases/latest`);

            if (response.status === 404) {
                // Repository exists but has no releases yet
                return {
                    hasUpdate: false,
                    currentVersion: this.currentVersion,
                    message: 'Repository exists - No releases available yet'
                };
            }

            if (!response.ok) {
                throw new Error('Failed to check for updates');
            }

            const latestRelease = await response.json();
            const latestVersion = latestRelease.tag_name.replace('v', '');

            // Compare versions
            if (this.isNewerVersion(latestVersion, this.currentVersion)) {
                return {
                    hasUpdate: true,
                    latestVersion,
                    currentVersion: this.currentVersion,
                    releaseNotes: latestRelease.body,
                    releaseUrl: latestRelease.html_url,
                    downloadUrl: latestRelease.zipball_url,
                    publishedAt: latestRelease.published_at
                };
            }

            return {
                hasUpdate: false,
                latestVersion,
                currentVersion: this.currentVersion
            };

        } catch (error) {
            console.error('Error checking for updates:', error);
            return {
                hasUpdate: false,
                currentVersion: this.currentVersion,
                error: error.message
            };
        }
    }

    isNewerVersion(latest, current) {
        const latestParts = latest.split('.').map(Number);
        const currentParts = current.split('.').map(Number);

        for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
            const latestPart = latestParts[i] || 0;
            const currentPart = currentParts[i] || 0;

            if (latestPart > currentPart) return true;
            if (latestPart < currentPart) return false;
        }

        return false;
    }

    formatUpdateSummary(updateInfo) {
        return `
**🚀 Update Available!**

**Version:** ${updateInfo.currentVersion} → ${updateInfo.latestVersion}
**Published:** ${new Date(updateInfo.publishedAt).toLocaleDateString()}

**📋 What's New:**
${updateInfo.releaseNotes || 'No release notes available.'}

## 📖 Simple Update Instructions:

**Step 1: Download & Extract**
- Go to the [GitHub Releases page](${updateInfo.releaseUrl})
- Download the ZIP file for version ${updateInfo.latestVersion}
- Extract all files from the ZIP

**Step 2: Copy Files**
- Copy all extracted files to your application directory
- This replaces the old files with the new version

**Step 3: Configure API**
- Edit \`js/config.js\`
- Add your Gemini API token: \`API_KEY: 'your-token-here'\`

**Step 4: Run Application**
- Use \`run.sh\` (Linux/Mac) or \`run.bat\` (Windows)
- Or run: \`python3 server.py\`

**🔗 Quick Links:**
- [View Release on GitHub](${updateInfo.releaseUrl})
- [Download ZIP File](${updateInfo.downloadUrl})
- [Repository Homepage](${this.githubUrl})
        `.trim();
    }
}