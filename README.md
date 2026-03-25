<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b28c3826-971f-452a-82ed-7853e445be4e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
Step 1: Define your app prototype 
Once in AI Studio, make sure you are signed in with your Google account. Next, navigate to “Build AI apps”. In the prompt box on the Build page, describe the Interactive dashboard app: 

I want to make an interactive dashboard that allows me to visualize data in many different ways. I am going to provide the data for you, so please set up the dashboard with it accurately.

Then, attach your data. You can use this 
sample data
 or your own. 

When you are ready, click the “Build” button.

Step 2: Explore and filter your data 
Once AI Studio generates the app, test its interactivity.

For example:

Observe how the model automatically created different chart types (e.g., pie charts, line graphs, and data tables).

Use the auto-generated filters to drill down into specific data points (e.g., filter by a specific product like "Premium Tailored Trousers").

Verify that the charts update in real-time as you change the filters.

Step 3: Iterate on the design and layout
If you want to change the design or layout, you can manually add your feedback onto the app. 

Click the “Annotate app” button in the prompt box.

Use the comment tool to highlight a specific area (e.g., draw a box around the KPI cards).

Type a design request, such as:

Let's make these cards white

and click “Ok.” This will automatically add a screenshot with your feedback into the prompt box.

Click the “Send prompt” button and the model will read your visual feedback and update the app's code accordingly.

Once the model has updated the app. observe how it has changed the specific elements you pointed out (like the "KPI cards") and applies the visual changes without you needing to explain the technical details.
