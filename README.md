# Cloudflare Maintenance Mode Worker

A simple, customizable Cloudflare Worker that displays a maintenance page for your website. Easy to toggle on and off via environment variables with no DNS propagation delays.

## Features

- **Instant toggle**: No DNS propagation delays
- **503 status code**: Proper HTTP status for maintenance
- **Cache headers**: Prevents caching of maintenance page
- **Retry-After header**: Suggests clients retry after 1 hour
- **Optional bypass**: Allow specific access during maintenance
- **Zero downtime**: Worker runs at the edge before reaching your origin server
- **Customizable**: Easy to modify colors, text, and styling

## Prerequisites

- A Cloudflare account with a domain added
- Node.js installed (for Wrangler CLI)
- Your domain must be active on Cloudflare

## Initial Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 3. Configure Routes in wrangler.toml

Open `wrangler.toml` and update the routes section with your domain:

```toml
[env.production]
main = "worker.js"
vars = { MAINTENANCE_MODE = "false" }
routes = [
  { pattern = "yourdomain.com/*", zone_name = "yourdomain.com" },
  { pattern = "www.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

**Important**: Replace `yourdomain.com` with your actual domain. You can add multiple route patterns for different subdomains (e.g., `app.yourdomain.com`, `api.yourdomain.com`).

### 4. Customize the Maintenance Page (Optional)

You can customize the appearance by editing `worker.js`:

- **Background color**: Change `background-color: #1e293b;` (line 18)
- **Icon color**: Modify the SVG `stroke="white"` attributes (lines 70-71)
- **Text content**: Update the heading and paragraph (lines 73-74)
- **Icon**: Replace the SVG with your own logo or icon

### 5. Deploy the Worker

```bash
wrangler deploy --env=production
```

The worker is now deployed and will pass all traffic through to your origin server (maintenance mode is off by default).

## Usage

### Quick Toggle via Wrangler CLI

**Enable maintenance mode:**

```bash
wrangler deploy --var MAINTENANCE_MODE:true --env=production
```

**Disable maintenance mode:**

```bash
wrangler deploy --var MAINTENANCE_MODE:false --env=production
```

### Toggle via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Click on your `maintenance-mode` worker
3. Go to Settings → Variables → Environment Variables
4. Edit `MAINTENANCE_MODE` and set to `true` or `false`
5. Click "Save and Deploy"

### Bypass Maintenance Mode (Optional)

You can set a bypass token to allow access even when maintenance mode is enabled:

1. Set the bypass token as a secret:

```bash
wrangler secret put BYPASS_TOKEN --env=production
# Enter your secret token when prompted (e.g., a random UUID)
```

2. Access the site with the bypass token:

```
https://yourdomain.com?bypass=your-secret-token-here
```

This is useful for:
- Testing during maintenance
- Allowing specific users/staff access
- Monitoring tools to verify the site is still running

## Testing Locally

Test the worker locally before deploying:

```bash
wrangler dev --env=production
```

Then visit `http://localhost:8787` to test the worker.

Test with maintenance mode enabled:

```bash
wrangler dev --var MAINTENANCE_MODE:true --env=production
```

## How It Works

1. All requests to your domain hit the Cloudflare Worker first (at the edge)
2. Worker checks the `MAINTENANCE_MODE` environment variable
3. If `true`, serves the maintenance page with 503 status
4. If `false`, passes the request through to your origin server
5. No changes needed to your origin infrastructure

## Customization Examples

### Change Color Scheme

Edit `worker.js` to match your brand colors:

```javascript
body {
    background-color: #your-color-here;
    color: #your-text-color;
}
```

### Add Your Logo

Replace the SVG icon in `worker.js` (lines 69-72) with your own logo:

```html
<img src="https://yourdomain.com/logo.png" alt="Logo" class="icon">
```

Don't forget to update the CSS for `.icon` if needed.

### Customize Messages

Update the text in `worker.js`:

```html
<h1>Your Custom Title</h1>
<p>Your custom message about the maintenance.</p>
```

## Notes

- The worker uses a 503 status code which tells search engines the downtime is temporary
- The `Retry-After` header suggests clients retry in 1 hour (3600 seconds)
- Cache headers prevent browsers/CDNs from caching the maintenance page
- Changes to environment variables take effect immediately (no redeployment needed when using the dashboard)

## Troubleshooting

**Worker not intercepting traffic?**
- Verify your routes are correctly configured in `wrangler.toml`
- Check that your domain is active on Cloudflare (orange cloud enabled)
- Ensure the worker is deployed: `wrangler deploy --env=production`

**Maintenance page not showing?**
- Verify `MAINTENANCE_MODE` is set to `true`
- Check the worker logs in the Cloudflare dashboard
- Try clearing your browser cache

**Need to update the page?**
- Edit `worker.js`
- Run `wrangler deploy --env=production`
- Changes are deployed immediately

## License

This project is free to use and modify for your own projects.

## Contributing

Feel free to submit issues or pull requests to improve this maintenance mode worker.
