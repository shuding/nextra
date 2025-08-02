# 🚀 Nextra — Next-Level Site Generation

**Simple. Powerful. Flexible.**  
Everything you love from **Next.js**, supercharged with an optimized static site generation experience.

---

## 📚 Documentation

Dive into the official docs:  
👉 [https://nextra.site](https://nextra.site)

---

## 🛠️ Development Setup

Nextra uses [PNPM Workspaces](https://pnpm.io/workspaces) and [Turborepo](https://github.com/vercel/turborepo) to manage the monorepo efficiently.

### ⚙️ Prerequisites

1. **Enable Corepack**  
   Run the following in your terminal:

   ```bash
   corepack enable
   ```

   > If it fails, run:  
   > ```bash
   > npm install -g corepack@latest
   > ```

2. **Install Dependencies**  
   Using PNPM:

   ```bash
   pnpm install
   ```

---

## 🔧 Building the Packages

### 🧱 Build `nextra`

```bash
pnpm --filter nextra build
```

👀 Development mode (watch mode):

```bash
pnpm --filter nextra dev
```

---

### 🎨 Build `nextra-theme-docs`

```bash
pnpm --filter nextra-theme-docs build
```

---

## 🧪 Local Development Example

Want to see Nextra in action with a live site? Start the example project locally:

```bash
pnpm --filter example-docs dev
```

🔄 Changes to `examples/docs` will hot-reload in real time.  
🧠 If you make changes to the core or theme packages, rebuild or use watch mode for each package in separate terminals.

---

## 💖 Sponsors

<table>
  <tr>
    <td align="center">
      <a href="https://xyflow.com?utm_source=github&utm_campaign=nextra&utm_content=logolink">
        <img src="/docs/app/showcase/_logos/xyflow.png" alt="XYFlow Logo" width="180"><br>XYFlow
      </a>
    </td>
    <td align="center">
      <a href="https://speakeasyapi.dev/docs?utm_source=github&utm_campaign=nextra&utm_content=logolink">
        <img src="/docs/app/showcase/_logos/speakeasy.png" alt="Speakeasy Logo" width="180"><br>Speakeasy API
      </a>
    </td>
    <td align="center">
      <a href="https://the-guild.dev/graphql/hive?utm_source=github&utm_campaign=nextra&utm_content=logolink">
        <img src="/docs/app/showcase/_logos/graphql-hive.png" alt="GraphQL Hive Logo" width="180"><br>GraphQL Hive
      </a>
    </td>
  </tr>
</table>

---

## 🌟 Closing Thoughts

> “Simplicity is the soul of efficiency.” – Austin Freeman

Nextra is built to scale with you.  
Build smarter. Build faster. Build beautifully.
