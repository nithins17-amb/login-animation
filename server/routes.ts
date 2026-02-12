import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/otp/send", async (req, res) => {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ message: "Contact details required" });
    }

    // Generate a simple 4-digit OTP for testing
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await storage.setOTP(contact, otp);

    console.log(`[OTP] Generated for ${contact}: ${otp}`);
    res.json({
      message: "OTP sent successfully (returned for dev)",
      otp: otp // Returning OTP for easier testing
    });
  });

  app.post("/api/otp/verify", async (req, res) => {
    const { contact, otp } = req.body;
    const storedOtp = await storage.getOTP(contact);

    if (storedOtp === otp) {
      res.json({ success: true, message: "OTP verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  });

  // Mock Social Login Routes
  app.get("/api/auth/mock/:provider", (req, res) => {
    const { provider } = req.params;
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Simple mock consent page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login with ${providerName}</title>
          <style>
            body { 
              font-family: sans-serif; 
              background: #1a1a1a; 
              color: white; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
            }
            .card {
              background: #2a2a2a;
              padding: 2rem;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 4px 20px rgba(0,0,0,0.5);
              max-width: 300px;
              width: 100%;
            }
            h1 { margin-bottom: 1.5rem; font-size: 1.5rem; }
            button {
              background: ${provider === 'google' ? '#DB4437' : '#333'};
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 1rem;
              cursor: pointer;
              width: 100%;
              transition: opacity 0.2s;
            }
            button:hover { opacity: 0.9; }
            .info { margin-bottom: 2rem; color: #aaa; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${providerName} Login</h1>
            <p class="info">This is a mock consent screen for demonstration.</p>
            <button onclick="authorize()">Authorize App</button>
          </div>
          <script>
            function authorize() {
              // Send success message to parent window
              if (window.opener) {
                window.opener.postMessage(
                  { type: 'oauth-success', provider: '${provider}' }, 
                  window.location.origin
                );
                window.close();
              } else {
                alert('No parent window found. Please close this manually.');
              }
            }
          </script>
        </body>
      </html>
    `;
    res.send(html);
  });

  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(userData.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful", user });
  });

  return httpServer;
}
