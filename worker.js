// Cloudflare Worker for Maintenance Mode
// Toggle maintenance mode by setting the MAINTENANCE_MODE environment variable

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scheduled Maintenance</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #1e293b;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #ffffff;
        }

        .container {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
        }

        .icon {
            margin-bottom: 3rem;
            width: 80px;
            height: 80px;
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        p {
            font-size: 1.125rem;
            line-height: 1.6;
            opacity: 0.9;
        }

        @media (max-width: 640px) {
            h1 {
                font-size: 1.5rem;
            }

            p {
                font-size: 1rem;
            }

            .icon {
                width: 312px;
                height: 128px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
    <img src="https://res.cloudinary.com/dl5zwoezw/image/upload/v1780995319/logo_rxmsrm.png" alt="شعار الشركة" class="icon">
        
        <h1>We'll be back soon</h1>
        <p>We're currently performing scheduled maintenance. We'll be back online shortly. Thank you for your patience.</p>
    </div>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    // Check if maintenance mode is enabled
    const maintenanceMode =
      env.MAINTENANCE_MODE === "true" || env.MAINTENANCE_MODE === "1";

    // Optional: Allow bypass for specific IPs or with a secret token
    const bypassToken = new URL(request.url).searchParams.get("bypass");
    const shouldBypass = bypassToken === env.BYPASS_TOKEN;

    // If maintenance mode is off or bypass is used, pass through to origin
    if (!maintenanceMode || shouldBypass) {
      return fetch(request);
    }

    // Serve maintenance page
    return new Response(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Retry-After": "3600", // Suggest retry after 1 hour
      },
    });
  },
};
