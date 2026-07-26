import { PageHeader } from "../PageHeader";
import { ActivitySidebar } from "./activity-feed";
import { EmailActivityOverview } from "./email-activity-overview";
import { RecentCampaigns } from "./recent-campaigns";
import { RepliesReceived } from "./replies-received";
import { Sidebar } from "./Sidebar";
import { TopPerformingCampaigns } from "./top-performing-campaigns";

export const Dashboard = () => {
    return (
        <div className="p-4 bg-slate-50/10">

        <PageHeader
  title="Welcome back, Alex"
  subtitle="Here's what's happening with your campaigns today."
/>
<div className="flex gap-4 mt-4">
<Sidebar
  emailSent={4820}
  emailLimit={10000}
  mailboxes={[
    { email: 'alex@roxshield.com', score: 98 },
    { email: 'team@roxshield.com', score: 96 },
    { email: 'outreach@roxshield.com', score: 97 },
  ]}
  onQuickAction={(key) => console.log(key)}
/>
<div className="flex gap-4" >

  <div>
    <div className="flex w-full gap-2">
<EmailActivityOverview />
<TopPerformingCampaigns />
    </div>

<div className="flex flex-col gap-2 mt-2">
<RecentCampaigns />
<RepliesReceived />
</div>

  </div>

<ActivitySidebar />
</div>
</div>



        </div>

    )
}