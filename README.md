# ConnectHub AI Triage System

An AI-powered complaint triage and response tool built for ConnectHub customer support agents. Paste any customer complaint and instantly receive an urgency tier, complaint category, routing action, triage rationale, and a ready-to-send response draft — powered by Claude.

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "ConnectHub triage app"
git remote add origin https://github.com/YOUR_USERNAME/connecthub-triage.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import your `connecthub-triage` repository
4. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (from [console.anthropic.com](https://console.anthropic.com))
5. Click **Deploy**

That's it. Vercel will give you a URL like `https://connecthub-triage.vercel.app`.

## Run locally

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

The app implements the ConnectHub Triage Classification Framework v1.4:

- **3 urgency tiers**: Critical (2hr SLA), Standard (24hr), Low (72hr)
- **6 complaint categories**: Billing Dispute, Service Outage, Churn Risk, Contract Dispute, Device Issue, Agent Conduct
- **Ambiguity pre-check**: flags complaints that need clarification before classification
- **Multi-category rule**: highest tier wins; lower category number breaks ties
- **Response tone rules**: Critical responses must never use 3–5 business day timelines

Built as part of a Teleperformance AI Skills Assessment.
