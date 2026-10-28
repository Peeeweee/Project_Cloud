# Group 11 Presentation Script

Cloud economics, operations & security

**Speaking order: Paulo -> Renan -> Earl**

Timed delivery: about 20-22 minutes, excluding questions. The optional Cloud Lab (slide 21) adds two to three minutes.

## How to use this script

Read only the spoken paragraphs aloud. Guide notes and bracketed cues are delivery instructions. Study notes and defense answers are preparation material.

Slides run **1 to 22 in order**, matching the website: use Next, with no Contents jumps. On Earl’s slides 14–17, press Next for each step before moving to the next slide; Back reverses a step. Slide numbers and speakers match the website's speaker notes (N key).

## PART 1: PAULO - OPERATIONS

### Slide 1: Beyond the cloud

**Guide:** Open #introduction. Hide controls with H. Let the planet settle, then face the audience. Do not wait for a full revolution.

Good day, everyone. We are Group 11: Kent Paulo Delgado, John Renan Labay, and Earl Josh Delgado. Our report is about cloud economics, operations, and security.

Our visual theme takes inspiration from The Martian: keeping essential systems working and making limited resources count. We use that atmosphere to frame the report; our discussion stays on cloud computing.

I will begin with operations: how we run, observe, and recover a system. Renan will cover security: how we control access and protect the system. Earl will explain economics: how we match resources to demand and make spending accountable.

Our central question is simple: after we put an application in the cloud, what does it take to keep it dependable?

### Slide 2: Online is not enough

**Guide:** Point to recovery, access, and spending in turn. Give the audience two seconds to consider the scenario.

Imagine a student application that loads perfectly. Its online indicator is green. But its backups have never been restored, a former administrator still has access, and forgotten resources continue generating charges.

This is a fictional example, but it shows why being online is only part of the picture. A working page does not prove that we can recover its data. It does not prove that only the right people can change it. It does not prove that its spending is justified.

We need to ask three questions: can we recover it, who can control it, and what are we paying for? Those questions connect the three parts of our report. We will keep returning to this same application as we explain the decisions behind it.

### Slide 3: Resources on demand

**Guide:** Move across IaaS, PaaS, and SaaS. Explain the change in management responsibility, rather than reading only their names.

Cloud computing gives us computing resources over a network when we need them. Compute runs application work, storage holds information, and networking connects users and services.

The service model tells us how much we manage. With Infrastructure as a Service, we can rent a virtual machine while still managing its guest operating system and application. Platform as a Service manages more of the runtime platform. Software as a Service delivers an application that users consume.

The responsibility does not disappear as we move toward managed services. It changes. We still need to understand accounts, access, data, and the configuration available to us.

For the server and network examples that follow, imagine a web application running on virtual infrastructure with a database behind it.

### Slide 4: Keep it working

**Guide:** Follow the four stages: Observe, Maintain, Automate, Recover. Keep the explanation practical.

Deployment is the beginning of operations. Once a system is running, we need a repeatable way to keep it healthy.

First, observe: check service behavior and recognize conditions that need attention. Second, maintain: patch software, review capacity, and keep configurations current. Third, automate repeated work so that changes are consistent and reviewable. Fourth, prepare to recover when something fails.

Infrastructure as Code records infrastructure configuration in version-controlled files. It helps us reproduce environments and review changes before applying them. A delivery pipeline can test and release those changes more consistently.

But automation can also repeat a mistake quickly. It still needs appropriate permissions, validation, and a recovery plan. Operations means owning the result, whether a person or an automated process performs the task.

### Slide 5: See the signal find the cause

**Guide:** Trace the simulated chart. Distinguish the alert from the explanation. Do not describe the graph as measured production data.

Monitoring starts with signals. Metrics summarize behavior over time: traffic, errors, response time, CPU use, and disk space. Logs provide event-level context.

Application logs may show a failed request. Audit logs may show that an identity changed a permission or created a resource. Together, they help us move from noticing a problem to understanding it.

For example, a sudden cost increase could come from a legitimate event, an accidental deployment, or unauthorized activity. The bill alone cannot tell us which explanation is correct. We compare usage, application events, and account activity before deciding.

The chart here is simulated. Its lesson is the process: alert, investigate, act. Every useful alert should also have an owner who knows what to check and when to escalate.

### Slide 6: Plan for the gap

**Guide:** Point to 1 hour for RPO, then 4 hours for RTO. Pause between the two definitions. Treat the numbers as objectives.

A backup is useful only if we can restore the information we need in time. Two objectives help us define that requirement.

Recovery Point Objective, or RPO, describes acceptable data loss measured as time. An RPO of one hour means we aim to recover to a point no more than one hour before the disruption.

Recovery Time Objective, or RTO, describes the target time for restoring service. An RTO of four hours means we aim to restore the agreed service within that recovery window.

These numbers are objectives, not proof of performance. We need suitable backup schedules, protected copies, integrity checks, and restore tests to demonstrate whether we can achieve them.

A backup job marked successful is encouraging. A tested restoration gives us stronger evidence that the application can actually return.

### Slide 7: Be ready for the bad day

**Guide:** Follow Detect, Contain, Investigate, Recover, Improve, then hand over to Renan.

Incident response works better when responsibilities are agreed before an emergency. The process is to detect, contain, investigate, recover, and improve.

If a cloud credential leaks, containment means limiting its ability to cause further harm. We preserve relevant evidence and investigate account activity, while handling unauthorized resources and restoring trusted operation. These actions may overlap rather than happen in a perfect straight line.

After recovery, we ask what allowed the problem, whether detection worked, and what should change. We rehearse that process so people know whom to contact and what evidence to collect.

That completes the operations foundation. We know how to watch the system and recover when it fails. Renan will now explain who should be able to reach and control it.

## PART 2: RENAN - SECURITY

### Slide 8: Know your side

**Guide:** Begin immediately. Identify the provider side and customer side, then connect both to confidentiality, integrity, and availability.

Thank you, Paulo. Recovery depends on trustworthy access. Cloud security starts with knowing which responsibilities belong to us.

In our IaaS example, the provider manages facilities, hardware, and the underlying virtualization infrastructure. We manage guest software, identities, application data, and the access configuration available to us. With managed services, parts of that boundary move.

The goals are confidentiality, integrity, and availability. Confidentiality means information is disclosed only as authorized. Integrity means information and systems remain trustworthy. Availability means authorized users can use the service when needed.

Shared responsibility does not mean either side can assume the other handles everything. We must understand the specific service and configure our part correctly. Security therefore begins before a firewall rule: it begins with a clear responsibility boundary.

### Slide 9: Power needs limits

**Guide:** Emphasize the two meanings of root. Do not imply that Linux root and AWS root are the same account.

The word root appears in two different contexts. Linux root is the operating-system superuser on a machine. The AWS account root user is a highly privileged cloud account identity. Their scopes and recovery processes differ.

For routine work, use named identities with only the permissions needed. On Linux, restricted sudo can grant selected administrative capability. In cloud accounts, use appropriately scoped identities or roles.

Protect root credentials and recovery channels, use MFA where credentials exist, avoid root access keys, and monitor privileged use. AWS also supports centralized root-access management for member accounts, so we should avoid absolute claims that root credentials can never be removed.

The practical principle is least privilege: limit what an identity can do, and make its activity attributable to a responsible person.

### Slide 10: Every path needs a rule

**Guide:** Trace public HTTPS, controlled administration, and the blocked public database path. Use the diagram rather than commands.

A firewall controls permitted traffic according to rules. We look at source, destination, protocol, port, and direction.

For our example, a public web entry point accepts HTTPS on port 443. That does not mean every service should be public. Administrative access should use a controlled management path, and database connectivity should be limited to the application that needs it.

Default deny is the policy we aim to design: permit the required paths and reject unnecessary ones. It is not a claim that every cloud control arrives with identical default settings.

We also review rules as the system changes. A rule that was temporarily necessary can become stale. Network access should follow the current application architecture and the actual duties of its administrators.

### Slide 11: Two layers different rules

**Guide:** Compare scope first, state second, and rule behavior third. Leave a short pause before explaining defaults.

Security groups and network access control lists are related controls, but their behavior differs.

A security group is associated with network interfaces and is stateful. It has allow rules; response traffic for allowed connections is handled through connection tracking.

A network ACL applies at a subnet boundary and is stateless. It has allow and deny rules, evaluated in numbered order. We must account for both directions, including the return path.

Defaults also differ. A newly created security group has no inbound rules and normally allows outbound traffic. A VPC default security group has its own inbound rule for associated members. A default network ACL allows traffic, while a custom one begins without allow rules.

So the correct habit is to inspect the actual configuration. Stateful and stateless explain behavior; neither word means the control is universally better.

### Slide 12: Prove it keep it secret

**Guide:** Point from user device to server. Distinguish the user public key from the server host key.

SSH provides an encrypted connection for remote access. Public-key authentication lets a client prove possession of a private key through a signature that the server can verify.

The authorized public key belongs on the server. The private key stays with its owner and is not sent to the server. That is the user-authentication side.

There is another question: are we connecting to the intended server? The client uses the server's host key for that check. Verify its fingerprint through a trusted channel, and investigate an unexpected change rather than accepting it automatically.

A normal SSH key is not automatically multi-factor authentication. Also, password-based SSH still uses the encrypted transport. The advantage of key authentication is not that ordinary SSH passwords otherwise travel in plaintext.

### Slide 13: Security lasts a lifecycle

**Guide:** Follow Create, Protect, Review, Revoke, then hand over to Earl.

A strong key still needs careful handling throughout its life. Create individual keys, protect their storage and permissions, review whether access is still needed, and revoke access when it is no longer appropriate.

Do not put private keys in a repository or share one administrator identity across the group. Individual access is easier to review and attribute.

If a private key leaks, deleting the exposed file is not enough. Remove or replace the corresponding authorization, investigate possible use, and distribute replacement access safely.

When changing SSH settings, test a new working connection before closing the existing one, and keep a recovery path. A security improvement that locks out the administrators creates an availability problem.

Controlled access protects the system and its resources. Earl will now explain how we choose capacity and manage the cost.

## PART 3: EARL - ECONOMICS AND SYNTHESIS

### Slide 14: The full cost not just the fee

**Guide:** Begin immediately after Renan. Press Next for each step: complete the title, compare CapEx and OpEx, reveal the four cost blocks, then highlight transfer and people. Compare the choices over the same period and workload.

Thank you, Renan. Cloud economics asks whether our spending supports the service we actually need.

Capital expenditure, or CapEx, includes buying an asset such as physical hardware. Operating expenditure, or OpEx, includes ongoing costs such as usage-based services. The shift toward ongoing spending can reduce the need to buy capacity in advance, but it does not automatically make the total lower.

Total cost of ownership includes the wider picture: computing, storage, transfer, maintenance, support, and people. We should compare equivalent workloads, performance, reliability, and time periods.

A low server price can hide expensive data transfer or operational work. Equally, a higher service fee may remove work we would otherwise perform ourselves. The right comparison is the complete cost of meeting the same requirement.

### Slide 15: A lower rate a bigger bill

**Guide:** Press Next for each step: complete the title, show the always-on totals, change to part-time usage, then reveal the 438-hour break-even. Let each counter and verdict settle before explaining it.

This example shows why a lower hourly rate can still produce a larger bill. These are teaching assumptions, not current provider quotations.

Assume ten cents per hour, a 730-hour month, and a commitment rate forty percent lower that covers the whole month. At continuous use, On-Demand costs seventy-three dollars. The commitment costs forty-three dollars and eighty cents.

Now switch to part-time use: 176 hours. On-Demand falls to seventeen dollars and sixty cents. The assumed full-month commitment remains forty-three dollars and eighty cents, including hours we do not use.

Under these assumptions, break-even is 438 usage hours, or sixty percent of the month. Above that, the commitment is cheaper; below it, On-Demand is cheaper.

So we match commitments to predictable demand, rather than choosing a discount just because its percentage looks attractive.

### Slide 16: Meet the peak then let go

**Guide:** Press Next for each step: complete the title, show two machines, add eighteen for the sale, release them, then compare the monthly bills. Point out that the extra blocks disappear when demand falls.

Elasticity means adding capacity when demand rises and releasing it afterward. The release is part of the saving.

Assume two instances run for 730 hours. For a one-day sale, eighteen additional instances run for twenty-four hours. At ten cents per instance-hour, the baseline costs 146 dollars and the additional capacity costs forty-three dollars and twenty cents. The total is 189 dollars and twenty cents.

Keeping twenty equivalent instances running all month would cost 1,460 dollars. Both figures refer to rented compute under the same teaching assumptions; this is not the purchase price of physical hardware.

Actual savings depend on how the application scales and on supporting costs. Autoscaling also needs sensible limits and performance checks. We want capacity to follow useful work, including scaling back down.

### Slide 17: Give every resource an owner

**Guide:** Press Next for each step: complete the title, reveal the owner tag, show the Inform–Optimize–Operate loop, then explain that a budget alert is not a spending cap. Continue to the integrated example.

Financial accountability is a shared practice. FinOps connects engineering, finance, and business decisions so that spending can be understood and tied to value.

The FinOps Foundation describes repeating phases: Inform, Optimize, and Operate. Inform means understanding and allocating spending. Optimize means evaluating better usage and purchasing choices. Operate means applying those decisions and reviewing the results.

In practice, give resources owners, use useful project tags, review capacity, and remove resources that no longer have a purpose. An owner should be able to explain what a resource supports.

Budget notifications help us notice actual or forecast spending. They are not guaranteed immediate spending caps.

We can now bring operations, security, and economics together in one application.

### Slide 18: One system every layer matters

**Guide:** Walk left to right through HTTPS, application, and private database. Then identify management, backups, monitoring, and ownership.

Here is the complete connection. Visitors enter through HTTPS. The application uses a restricted path to the private database. Administrators use a separate controlled management path.

Paulo's operations practices tell us how the system behaves, how to maintain it, and how to recover its information. Renan's security controls limit who can reach and change the system. Our economics practices tell us whether capacity matches demand and who is accountable for spending.

These practices support one another. A compromised identity can create unexpected resources. A cost anomaly can prompt an investigation. Protected backups can support recovery after an incident.

This diagram is an instructional sketch, not a complete production design. Real implementation also needs service-specific routing, identity, encryption, and recovery decisions. The lesson is that these decisions should be designed together.

### Slide 19: A key leaks what comes first

**Guide:** Ask the audience, wait three to five seconds, then select the containment answer. Earl leads; avoid another full speaker rotation. Answers can be switched at any time and each shows its own explanation, so you can briefly select an answer the audience suggests before choosing containment.

Let us test the connection with a final scenario. A cloud credential appears in a public repository. Unknown instances are running, and spending has increased. What comes first?

[Pause for an answer.]

The best answer here is to contain the compromised credential's use. Deleting the file does not disable a copy that someone already obtained. Increasing the budget does not address unauthorized access.

While containing the incident, we preserve relevant evidence, investigate activity, and handle unauthorized resources. Then we validate recovery and improve the process that allowed the leak.

This scenario brings the report together: operations detects and responds, economics reveals and accounts for resource use, and security controls the authorization that made those actions possible. None of the three can replace the others.

## PART 4: ALL - CLOSING, CLOUD LAB AND QUESTIONS

### Slide 20: Keep it running protect access make it count

**Guide:** Deliver the three short lines in Paulo, Renan, Earl order, matching the slide: Keep it running, Protect access, Make it count. Each speaker faces the audience. Advance only after Earl finishes.

PAULO: Good operations help us observe behavior, maintain systems, and recover when something fails. A dependable cloud service requires preparation, not only a successful deployment.

RENAN: Good security limits access, protects credentials, and checks the paths between components.

EARL: Good economics matches resources to demand and makes their cost explainable. A smaller bill matters only when the service still delivers the value and reliability we need. Together, these practices help us keep the system running, protect what matters, and make resources count.

### Slide 21: Cloud in your hands

**Guide:** Optional, about two to three minutes; skip it if time is short. Each tab starts fresh when selected, and selecting it again replays it. Earl runs Pricing and Elasticity, Renan and Paulo share Incident response. No real cloud account is connected.

EARL: Let us put the examples in your hands. In Pricing, we change how long one machine runs. At 176 hours, On-Demand costs seventeen dollars and sixty cents, below the forty-three dollar and eighty cent commitment. At 438 hours the two totals match. At 730 hours the commitment wins.

EARL: In Elasticity, we send a rush of demand. Eighteen temporary machines join the two baseline machines, and then we release them. The month costs 189 dollars and twenty cents, compared with 1,460 dollars for keeping all twenty machines running.

RENAN: In Incident response, a leaked key starts six unauthorized machines. Step two blocks access, but the run rate stays at eighty cents an hour: blocking access does not stop machines that are already running. Step three preserves the logs and traces what happened.

PAULO: Step four removes the unauthorized machines and verifies the trusted service. The run rate returns to twenty cents an hour. Recovery means restoring both trust and the baseline cost.

### Slide 22: Beyond the cloud closing reprise

**Guide:** Earl speaks. Show the matching title planet. Pause, look at the audience, and leave this slide on screen throughout questions.

We began by asking what happens after deployment. Our answer is ongoing responsibility: understand the service, account for its resources, and control access to it.

We are Group 11: Paulo, Renan, and Earl. Thank you for listening. We welcome your questions.

## In depth slide notes

### Slide 1: Beyond the cloud | Paulo

Treat the film reference as one short acknowledgment. Do not build later explanations around astronauts, oxygen, or invented missions. Cloud operations, economics, and security are the academic subjects.

The term cloud covers multiple services and management boundaries. The detailed firewall and server examples in this presentation use an AWS IaaS-style application. Explain the general principle first, then identify the AWS-specific mechanism. A deployment platform such as GitHub Pages hosts this report, but it is not the architecture being evaluated in the teaching diagrams.

**Check your understanding:** What remains our responsibility after deployment? Explain operation, spending ownership, and access configuration without claiming that every cloud service has the same boundary.

### Slide 2: Online is not enough | Paulo

Separate service availability from operational readiness. An application may currently serve requests while carrying recovery, access, or financial risks that have not yet caused an outage.

Do not call the example a real breach or attach invented loss figures. A former administrator is not automatically an attacker; the issue is unnecessary retained authorization. Idle capacity is not always waste: a standby service may be intentionally reserved to satisfy recovery requirements. The owner should explain its purpose, risk, and cost. This distinction prevents simplistic advice such as deleting every underused resource.

**Check your understanding:** Why might an idle resource be justified? A tested standby system can support a recovery requirement; evaluate its purpose before removing it.

### Slide 3: Resources on demand | Paulo

IaaS, PaaS, and SaaS are management models, not interchangeable price categories. A virtual machine offers flexibility but brings operating-system maintenance. A managed platform may reduce that work while imposing runtime or deployment constraints. SaaS can simplify delivery while leaving organization-specific identity, sharing, and data decisions.

A region is a geographic placement choice, whereas an availability zone is an isolated location within a region. Neither term is a service model. Scalability describes the ability to handle more work; elasticity adds the ability to release capacity when demand falls. These distinctions support the later economics section.

**Check your understanding:** Does a managed database remove all customer responsibility? No. Customers still configure identities, connectivity, data handling, and supported service settings.

### Slide 4: Keep it working | Paulo

Distinguish routine maintenance from change management. A patch should be assessed, tested where practical, scheduled appropriately, and checked afterward. Rollback planning is part of the change, not an afterthought.

Infrastructure as Code improves repeatability but is not a complete backup. It may reconstruct infrastructure without restoring application records, uploaded files, or external dependencies. Version control is useful for configuration, but secrets should remain in protected secret-management systems. Review automation privileges and prevent a deployment account from having broader access than its job requires.

**Check your understanding:** Can Infrastructure as Code restore deleted customer data? Only if a separate data-recovery mechanism supplies it; configuration files alone do not contain the application data.

### Slide 5: See the signal find the cause | Paulo

Metrics answer how much, how often, and how quickly. Logs answer what event occurred and provide contextual fields such as time, identity, operation, and resource. Traces can follow a request across services, although the current slide concentrates on metrics and logs.

Choose actionable alerts rather than collecting notifications with no response plan. CPU use alone does not describe customer experience; error rate and latency can be more directly relevant. Preserve logs with suitable access and retention. A cost anomaly is a lead to investigate, not a standalone forensic conclusion.

**Check your understanding:** What would you check after a cost spike? Identify the service, resource, region, time window, owner, recent changes, and account activity before attributing a cause.

### Slide 6: Plan for the gap | Paulo

Suppose a disruption occurs at noon and the latest usable recovery point is 11:30 a.m. The recovery point is thirty minutes old, which is within a one-hour RPO. If the agreed service is restored at 3 p.m., elapsed recovery time is three hours, within a four-hour RTO. This is an illustration; real measurement requires agreed start and completion criteria.

Replication, snapshots, and persistent volumes are not interchangeable with independent backups. Replication can also reproduce an unwanted change. Protect backup deletion, consider separate administrative boundaries, and test restoration of dependencies and access as well as files. More demanding recovery objectives usually require additional engineering and cost.

**Check your understanding:** Can a backup satisfy RPO but fail RTO? Yes. It may contain sufficiently recent data but take too long to restore and validate.

### Slide 7: Be ready for the bad day | Paulo

An incident runbook should identify the decision maker, technical responders, escalation route, evidence sources, and restoration criteria. Different incidents need different containment actions. A compromised cloud access key and an exposed SSH private key are not the same control problem.

Preserve useful logs and identifiers while preventing ongoing misuse. Do not destroy evidence indiscriminately, but do not leave compromised access usable merely to keep observing it. Recovery includes validating identities, application behavior, and data integrity. The final improvement step should lead to concrete changes, such as narrower permissions, safer secret handling, or a better alert.

**Check your understanding:** Must investigation wait until containment is completely finished? No. Coordinated containment and evidence collection often occur in parallel.

### Slide 8: Know your side | Renan

In IaaS, customers generally perform guest operating-system maintenance and application configuration. Managed services can move parts of the infrastructure and platform work to the provider. The customer still retains service-specific choices about access, data, and supported configuration.

CIA goals can create trade-offs. Restricting a risky connection may protect confidentiality while temporarily reducing availability. Backups support availability only if they are recoverable and protected; access controls can also help protect integrity. Describe the goal and the mechanism separately. No individual tool guarantees all three properties by itself.

**Check your understanding:** If AWS protects its facilities, why can a customer still expose data? Provider infrastructure protection does not automatically correct a customer-controlled permission or application configuration.

### Slide 9: Power needs limits | Renan

Least privilege has scope and duration. An account that can read one application bucket does not necessarily need permission to change identities or delete backups. Temporary access can reduce standing privilege when implemented appropriately.

Sudo is not automatically a full recording of every action in a privileged shell; logging depends on configuration and how commands are run. Likewise, a named identity is useful for accountability only when credentials are protected and not shared. MFA protects a particular authentication flow. Cloud-console MFA does not automatically add a second factor to a separate SSH login.

**Check your understanding:** Does using sudo make every administrative action fully auditable? No. Command, session, and system logging must be assessed explicitly; a privileged shell can change what is captured.

### Slide 10: Every path needs a rule | Renan

A port identifies a transport endpoint; it does not authenticate the application or prove that traffic is harmless. HTTPS adds transport protection when configured correctly, but application authorization and vulnerability management remain necessary.

A bastion, VPN, or managed session service can support controlled administration, depending on the design. They also need identity, logging, and maintenance decisions. A network firewall and a web application firewall operate at different levels; neither substitutes for checking application permissions. Avoid broad rules justified only by convenience, and validate connectivity after narrowing access.

**Check your understanding:** Is port 443 automatically safe? No. It commonly carries HTTPS, but safe operation still depends on configuration, identity, application controls, and the traffic being handled.

### Slide 11: Two layers different rules | Renan

Security-group rules are evaluated collectively to determine allowed traffic; they are not an ordered deny-rule list. For network ACLs, the lowest-numbered matching rule determines the result, with an unmatched case ultimately denied. Stateless evaluation means the response needs a permitted path as well.

For an illustrative web connection, a client may initiate toward server port 443 while return traffic targets the client's ephemeral port. Actual ranges depend on the operating system and network design; do not invent one universal range. Multiple layers can support defense in depth, but troubleshooting must consider routing, both rule sets, host controls, and the application listener.

**Check your understanding:** Why can a stateless ACL allow a request but still break the connection? Its separate outbound or return-path rules may deny the response.

### Slide 12: Prove it keep it secret | Renan

There are three separate concepts: encrypted transport, user authentication, and server authentication. SSH handles an encrypted session; user keys can prove possession of a private key; host keys help identify the remote server. A passphrase protects the stored private-key file but should not be casually equated with a separately enforced server-side second factor.

Do not describe SSH as encrypting a password with the user's private key. The public-key authentication mechanism uses signatures. A changed host key might have a legitimate explanation such as a rebuild, but it still needs verification through an independent trusted source before trust is updated.

**Check your understanding:** Can we send the private key to the server for convenience? No. Authorize the matching public key while protecting the private key on its owner-controlled device.

### Slide 13: Security lasts a lifecycle | Renan

Revocation happens at the authorization point. For a directly authorized SSH key, removing the matching authorized public key is part of stopping its future authentication, while any existing sessions or alternative credentials need separate review. A leaked cloud API credential requires action in cloud identity controls instead.

Keys should be associated with a person, device, and purpose. Review offboarding, device loss, and replacement procedures. Larger environments may use short-lived credentials or certificates rather than maintaining many long-lived keys. Merely rotating a key on a calendar does not compensate for excessive permissions or poor protection.

**Check your understanding:** Why does deleting a repository file not revoke a key? A copy may already exist; trust must be removed from the system that accepts the credential.

### Slide 14: The full cost not just the fee | Earl

CapEx and OpEx are useful teaching distinctions, but accounting treatment depends on the arrangement and applicable accounting policy. Do not present every cloud contract or infrastructure purchase as identical.

Build a TCO comparison with a stated workload, demand pattern, ownership period, reliability requirement, labor assumption, and cost boundary. Include supporting items such as snapshots, network services, licenses, and data transfer when applicable. Staff time is not free because it does not appear on the cloud invoice. Conversely, moving to cloud does not make all operational labor disappear.

**Check your understanding:** What makes a TCO comparison unfair? Comparing different performance, uptime, support, staffing, or time horizons while treating the final totals as equivalent.

### Slide 15: A lower rate a bigger bill | Earl

The simplified equations are On-Demand = 0.10 times used hours and commitment = 0.10 times 730 times 0.60 = 43.80 dollars. Equality occurs at 43.80 / 0.10 = 438 hours. At 730 hours, savings are 29.20 dollars; at 176 hours, the commitment costs 26.20 dollars more.

This is not a universal description of every Reserved Instance or Savings Plan. Real products have term, payment, coverage, and usage-matching rules. Spot is another purchasing approach for interruption-tolerant work, not guaranteed uninterrupted capacity. Storage, transfer, taxes, and other charges are excluded here. Do not compare only the compute rate when making a real purchasing decision.

**Check your understanding:** Why is a forty percent discount not automatically a forty percent reduction in our actual bill? Because the obligation may cover capacity or hours beyond actual demand, and other bill components remain.

### Slide 16: Meet the peak then let go | Earl

The elastic example uses 2 times 730 = 1,460 baseline instance-hours and 18 times 24 = 432 additional instance-hours. Total use is 1,892 instance-hours, costing 189.20 dollars. The fixed peak fleet uses 20 times 730 = 14,600 instance-hours, costing 1,460 dollars. The illustrative difference is 1,270.80 dollars, about 87.0 percent of the fixed compute total.

This result assumes equivalent instances, enough capacity, and an application that can distribute work effectively. Scaling delays, database bottlenecks, load balancing, storage, and network charges can change the result. A scaling ceiling limits exposure but may also restrict service during a genuine surge.

**Check your understanding:** Is scalability the same as elasticity? Scalability is the ability to handle increased work; elasticity also includes adjusting resources downward as demand drops.

### Slide 17: Give every resource an owner | Earl

A useful tag scheme might identify project, environment, and owner, but tagging alone does not reduce a bill. Someone must review allocations, investigate anomalies, and take agreed actions. Evaluate service value alongside cost: an apparently expensive control may satisfy an important recovery or security requirement.

Budget notifications depend on billing data and can be delayed. Configured actions can apply particular restrictions, but they do not make every charge disappear or guarantee an exact account-wide ceiling. Technical limits can also affect legitimate demand. The goal is a managed balance between financial exposure, service quality, and risk.

**Check your understanding:** Who owns FinOps? It is collaborative: engineers understand technical usage, finance supports allocation and planning, and business owners explain the value and priorities.

### Slide 18: One system every layer matters | Earl

Avoid treating a private database label as proof that the database is secured. Confirm routes, endpoint exposure, authentication, authorization, encryption, and the application identities that can reach it. A compromised application can become a path to its database even if the database has no direct public endpoint.

Likewise, HTTPS does not establish backup quality, and a budget alert does not prevent misuse. Each mechanism answers a different requirement. When defending the diagram, identify the protected asset, legitimate access path, possible failure, control, and evidence that the control works. This is more useful than listing products without explaining their roles.

**Check your understanding:** Why are the three topics connected? Access misuse can affect availability and cost, and recovery or financial decisions can change the required architecture and risk.

### Slide 19: A key leaks what comes first | Earl

The scenario concerns a cloud credential, not automatically an SSH private key. The identity provider, credential type, active sessions, and permissions determine the specific containment action. Do not promise that changing a password necessarily invalidates every API key or session.

Investigation should identify affected resources, account activity, regions, identities, and relevant time windows. Preserve logs and necessary evidence while limiting damage. Review legitimate dependencies before disabling shared access blindly, but do not delay appropriate containment merely because the service is still online. The quiz answer identifies the immediate priority, not the entire response plan.

**Check your understanding:** Why is a larger budget the wrong first response? It may permit more spending without addressing the compromised access or unauthorized activity.

### Slide 20: Keep it running protect access make it count | All

The three lines follow the slide: Keep it running (Paulo), Protect access (Renan), Make it count (Earl). Do not introduce new definitions or repeat the numerical examples here. Each speaker should own one concise message.

The phrase dependable cloud does not imply zero incidents or zero risk. It means making requirements explicit, applying appropriate controls, and checking the results. End with the connection among the disciplines rather than claiming that any single best practice guarantees security or the lowest possible cost.

**Check your understanding:** Can stronger controls add cost? Yes. Evaluate their risk reduction and recovery value rather than minimizing cost in isolation.

### Slide 21: Cloud in your hands | All

The lab is a deterministic teaching simulation, not a live billing dashboard or security tool. Pricing assumes $0.10 per hour, a 730-hour month, and a 40% commitment discount, so the commitment costs $43.80 and the break-even is 438 hours. Elasticity assumes two baseline instances for 730 hours plus eighteen additions for 24 hours: $189.20 against $1,460 for a fixed fleet of twenty.

The incident model uses two trusted and six unauthorized machines at an illustrative $0.10 each per hour: $0.80 per hour until cleanup and $0.20 afterward. Its point is that revoking or blocking a credential does not by itself terminate resources that already exist, and does not guarantee that every session is invalidated. Containment, investigation, and cleanup solve different problems.

**Check your understanding:** Why does the run rate stay at $0.80 after access is blocked? Blocking stops new actions by the credential; the six unauthorized machines keep running and billing until they are found and removed.

### Slide 22: Beyond the cloud closing reprise | Earl

Keep the title reprise on screen while answering. Direct questions to the topic owner: Paulo for operations and recovery, Earl for cost assumptions and FinOps, Renan for identity and network controls. Another speaker may add a brief connection after the main answer.

If asked about a detail outside the report, explain the principle, identify what depends on configuration, and state what would need verification. Do not invent a measured deployment result, provider price, or security guarantee. The calculations in this report are teaching examples, and the architecture is illustrative.

**Check your understanding:** What if we do not know a provider-specific detail? State the known principle and the configuration or documentation that must be checked before giving a definite answer.

## Calculation walkthrough

### Commitment versus usage

Always on On-Demand: 730 x $0.10 = $73.00.

Full-month commitment: 730 x $0.10 x (1 - 0.40) = $43.80.

Part-time On-Demand: 176 x $0.10 = $17.60.

Part-time difference: $43.80 - $17.60 = $26.20 more for the assumed commitment.

Break-even: $43.80 / $0.10 per hour = 438 hours.

Utilization threshold: 438 / 730 = 0.60, or 60 percent. At exactly 438 hours, both compute totals are equal. Above it, the assumed commitment is cheaper; below it, On-Demand is cheaper.

### Elastic versus fixed peak capacity

Baseline: 2 instances x 730 hours x $0.10 = $146.00.

Additional sale capacity: 18 instances x 24 hours x $0.10 = $43.20.

Elastic total: $146.00 + $43.20 = $189.20.

Fixed peak fleet: 20 instances x 730 hours x $0.10 = $1,460.00.

Difference: $1,460.00 - $189.20 = $1,270.80.

Illustrative compute reduction: $1,270.80 / $1,460.00 x 100 = about 87.0 percent. This percentage belongs only to the stated scenario; it is not a general cloud savings claim.

### Recovery timeline

Disruption: 12:00 noon. Latest usable recovery point: 11:30 a.m. Data-loss interval: 30 minutes, within the example one-hour RPO.

Agreed service restored: 3:00 p.m. Recovery duration: 3 hours, within the example four-hour RTO.

A newer backup does not prove that restoration will be fast enough. A fast restoration does not prove that its data is recent enough. Define and test both objectives.

## Defense questions and answers

### 1. Is a working website enough evidence that operations are good?

**Lead:** Paulo

No. It demonstrates one observed service behavior at that moment. We also need maintenance, appropriate monitoring, assigned responders, and evidence that recovery works. Our opening example is fictional; its purpose is to show how an apparently healthy service can still carry recovery, access, and financial risks.

**Delivery reminder:** Connect availability now with readiness for failure later.

### 2. What is the difference between monitoring and observability?

**Lead:** Paulo

Monitoring checks known signals and conditions. Observability is the broader ability to infer internal behavior from emitted evidence, commonly metrics, logs, and traces. In our report, metrics identify a change, and logs help explain related events. Neither eliminates the need to investigate. A dashboard does not become useful merely because it contains many charts.

**Delivery reminder:** Give one concrete signal and the evidence you would examine next.

### 3. Can we meet a one hour RPO by running a backup every hour?

**Lead:** Paulo

Not automatically. Scheduling every hour is only one part of the design. A failed job, an unusable backup, or a long-running backup process can leave the latest valid recovery point too old. We need to measure usable recovery points and test restoration. The one-hour objective is a requirement; the backup schedule is one mechanism intended to satisfy it.

**Delivery reminder:** Distinguish scheduling from achieved recoverability.

### 4. What is the difference between backup replication and high availability?

**Lead:** Paulo

A backup provides a recovery copy or recovery point. Replication copies data to another location and may also copy an accidental deletion. High availability aims to keep service usable despite certain component failures. These capabilities can complement one another, but they do not guarantee the same protection. We choose them according to acceptable data loss, downtime, and the failures we need to survive.

**Delivery reminder:** Do not claim that a second running copy prevents every form of data loss.

### 5. Why not set RPO and RTO to zero?

**Lead:** Paulo

Stricter objectives require appropriate architecture and evidence, and can add substantial complexity and cost. We first establish what the workload needs, then choose and test a design. We should not claim zero data loss or zero recovery time without defining the failure model and demonstrating the result. Some failures still require human judgment or data correction.

**Delivery reminder:** Link the recovery requirement to Earl's TCO discussion.

### 6. What should an incident runbook contain?

**Lead:** Paulo

A clear owner, escalation route, observable trigger, suitable containment options, evidence sources, and recovery checks. It should also explain how to communicate and when to involve other people. We rehearse the process and revise it after exercises or incidents. A list of commands alone is insufficient because the same symptom can have different causes.

**Delivery reminder:** Explain responsibilities and decision points before tools.

### 7. Is cloud always cheaper than owning hardware?

**Lead:** Earl

No. Compare equivalent performance, reliability, staffing, and time horizon. Cloud can reduce the need to buy peak capacity in advance, but sustained workloads, transfer charges, software licenses, or staffing needs can change the result. Our presentation teaches a method of comparison rather than declaring one arrangement universally cheapest.

**Delivery reminder:** State the workload and the boundary of the cost comparison.

### 8. How do you calculate the 438 hour break even point?

**Lead:** Earl

The assumed commitment costs 0.10 dollars per hour times 730 hours times 0.60, which is 43.80 dollars. Divide 43.80 by the On-Demand rate of 0.10 and the result is 438 hours. This is sixty percent of the assumed month. The result applies to this simplified example, not every provider discount product.

**Delivery reminder:** Say dollars per month divided by dollars per hour equals hours.

### 9. Why use 730 hours for a month?

**Lead:** Earl

It is a planning assumption used consistently in the examples. Calendar months have different lengths. We are not claiming that every billing month contains exactly 730 hours. A real estimate should use the relevant billing period, service rules, and actual or expected usage.

**Delivery reminder:** Changing the assumed month changes the corresponding totals and break-even hours.

### 10. Why not buy commitments for all possible demand?

**Lead:** Earl

A commitment is most useful when eligible usage is sufficiently predictable under its terms. Buying for temporary peaks can leave us paying for unused obligations. We can evaluate a predictable baseline separately from variable demand, and consider On-Demand or interruption-tolerant options where appropriate. Exact coverage depends on the product.

**Delivery reminder:** A lower unit rate and a lower total bill are different questions.

### 11. Does elasticity always save money?

**Lead:** Earl

No. It helps when resources can be released and the application can scale efficiently. Supporting services, scaling delays, billing rules, and workload constraints matter. Our example compares equivalent rented compute and excludes other charges. A permanently required workload might not have much capacity to release.

**Delivery reminder:** Explain why the example is favorable without generalizing its percentage.

### 12. Does a budget alert stop the bill at a chosen amount?

**Lead:** Earl

No guaranteed immediate cap. Budget tracking and notifications depend on billing information, and configured actions have a defined scope. Existing services or charges outside an action may continue. We combine ownership, monitoring, appropriate permissions, and relevant technical limits, while recognizing that limits can also affect legitimate service demand.

**Delivery reminder:** Do not promise an exact universal account-wide ceiling.

### 13. Why do tags matter if they do not change prices?

**Lead:** Earl

Tags can help associate usage with a project, environment, or owner. That makes review and allocation easier, but someone still needs to act on the information. Tag coverage, consistent naming, and ownership review matter. A tagged resource can still be unnecessary; an untagged resource can still be critical.

**Delivery reminder:** Allocation enables decisions; it does not make them automatically.

### 14. Does the cloud provider secure everything for us?

**Lead:** Renan

No. The management boundary depends on the service. In our IaaS example, the provider protects underlying infrastructure while the customer manages guest software, identities, data, and supported access configuration. A managed service can shift some maintenance work, but we must still understand the remaining choices.

**Delivery reminder:** Use the selected service rather than one universal cloud checklist.

### 15. Is Linux root the same as the AWS account root user?

**Lead:** Renan

No. Linux root is a machine-level operating-system superuser. AWS root is a highly privileged cloud account identity. Their scope, authentication, and recovery mechanisms differ. We use appropriately scoped identities for ordinary work and protect emergency or root access according to the environment.

**Delivery reminder:** Do not offer a Linux command as the solution to cloud account root management.

### 16. Can a security group deny one address explicitly?

**Lead:** Renan

A security group uses allow rules rather than explicit deny rules. A network ACL supports ordered allow and deny rules at the subnet boundary. The appropriate design depends on the required layer, routing, and application path. Adding a security-group allow rule does not override every other network control.

**Delivery reminder:** Separate rule actions from scope and state handling.

### 17. Why do return ports matter for a network ACL?

**Lead:** Renan

A network ACL is stateless, so traffic is evaluated separately in each direction. A request can reach a web server on port 443 while its response needs to reach the client's ephemeral port. If the return path is denied, the connection can fail even though the inbound request rule looks correct. Exact port ranges depend on the relevant systems.

**Delivery reminder:** Do not assume every client uses the same ephemeral range.

### 18. Does a public SSH key expose the private key?

**Lead:** Renan

The public key is intended to be shared for authorization; the private key must remain protected. Public-key authentication relies on proving possession of the private key through a signature. However, publishing authorization details unnecessarily can still expose information about an environment. Public and private describe different roles, not a reason to publish all infrastructure information.

**Delivery reminder:** The private key is not uploaded for the server to check it.

### 19. Is an SSH private key with a passphrase automatically MFA?

**Lead:** Renan

Do not assume so. A passphrase protects the stored key, while the server may still see a single public-key authentication method. Enforced multi-factor authentication requires an appropriate configuration and distinct factors for the relevant login flow. MFA on a separate cloud console does not automatically cover SSH.

**Delivery reminder:** Name the authentication flow before claiming that it uses multiple factors.

### 20. What should happen after a host key warning?

**Lead:** Renan

Verify the expected server identity through a trusted independent source and investigate the change. A legitimate rebuild can change a host key, but impersonation is also a concern. We should not train users to dismiss warnings automatically. Update trust only after the change is verified.

**Delivery reminder:** The server host key and the user login key have different purposes.

### 21. Is deleting a leaked key from Git enough?

**Lead:** Renan

No. Someone may already have copied it. Contain or revoke the credential at the system that accepts it, replace access as appropriate, investigate use, and repair the leak source. Removing a file or rewriting history reduces future exposure but does not invalidate a copied credential.

**Delivery reminder:** Clarify whether the leaked item is a cloud API credential or an SSH private key.

### 22. What is the first action when unknown resources and spending appear?

**Lead:** All

The symptom needs investigation, but if the credential is known to be compromised, prioritize containing its use while preserving relevant evidence. Identify affected identities and resources, handle unauthorized activity, and validate recovery. A spending increase alone does not prove compromise; the quiz explicitly adds an exposed credential and unknown instances.

**Delivery reminder:** Renan leads containment, Paulo adds response, and Earl adds cost attribution if needed.

### 23. What are the limitations of your architecture diagram?

**Lead:** All

It is an instructional sketch. It shows intended relationships among public entry, application, database, management, monitoring, backups, and ownership. It does not fully specify routing, credentials, encryption, deployment, or disaster recovery. We would need implementation details and validation before calling it production-ready.

**Delivery reminder:** Do not present this report website as evidence that the teaching architecture was deployed.

### 24. How do the three disciplines conflict or reinforce one another?

**Lead:** All

Additional backups or isolated recovery copies can increase spending while improving recovery. Narrowing access can reduce misuse but requires a workable management path. A cost ceiling can limit financial exposure but also restrict genuine demand. We make these trade-offs against workload requirements rather than optimizing one discipline in isolation.

**Delivery reminder:** Answer with a concrete trade-off and explain the requirement that resolves it.

### 25. Why use the space theme and morphing visuals?

**Lead:** All

They create a visual identity and help frame systems, boundaries, and resource use. The academic content is still cloud computing. Animation is supporting presentation design, not evidence for a technical claim. We keep movement separate from the spoken reasoning and can disable motion when needed.

**Delivery reminder:** One film acknowledgment is enough; do not retell the movie.

## Glossary and pronunciation

**Cloud operations:** The ongoing work of running, maintaining, observing, and recovering cloud services.

**Compute:** Processing capacity used to run applications and other workloads.

**Storage:** Services that retain data, such as objects, volumes, and databases.

**IaaS:** Infrastructure as a Service; virtual infrastructure with substantial customer management responsibility.

**PaaS:** Platform as a Service; a managed platform on which customers deploy applications.

**SaaS:** Software as a Service; a delivered application that customers use and configure.

**Region:** A geographic area used to place cloud resources.

**Availability zone:** An isolated location within a cloud region.

**Infrastructure as Code:** Infrastructure configuration represented in files that can be reviewed and versioned.

**Metric:** A numerical measure of behavior over time.

**Application log:** An event record emitted by application software.

**Audit log:** A record of relevant account, identity, or resource activity.

**RPO:** Recovery Point Objective; acceptable data loss expressed as time.

**RTO:** Recovery Time Objective; the target window for restoring the agreed service.

**CapEx:** Capital expenditure, such as qualifying upfront asset purchases.

**OpEx:** Operating expenditure, such as ongoing usage-based service spending.

**TCO:** Total cost of ownership over a stated scope and time period.

**Egress:** Data transferred out across a service or network boundary; charges depend on the route.

**On-Demand:** Usage-based purchasing without the simplified full-month commitment used in our example.

**Commitment discount:** A lower rate associated with a defined obligation and coverage terms.

**Spot:** A purchasing approach suited to work that can tolerate interruption.

**Scalability:** The ability to handle increased workload by changing capacity.

**Elasticity:** Adjusting capacity upward and downward to follow demand.

**FinOps:** Collaborative financial accountability focused on technology value.

**CIA:** Confidentiality, integrity, and availability: common security goals.

**Least privilege:** Only the authorization needed for a particular task and scope.

**IAM:** Identity and access management; who can perform which actions.

**MFA:** Authentication requiring more than one distinct factor in the relevant flow.

**Security group:** A stateful allow-rule control associated with network interfaces.

**Network ACL:** A stateless subnet-boundary control using ordered allow and deny rules.

**SSH:** A protocol and tooling for encrypted remote access and related functions.

**User public key:** The public half used to authorize a user authentication key pair.

**Private key:** The protected secret half used to prove possession through a cryptographic operation.

**Host key:** The server identity key used in SSH server verification.

**Revocation:** Removing the authorization or validity that lets a credential be accepted.

## Rehearsal and controller guide

### Before presenting

Open the presentation and confirm that local or hosted assets load. Rehearse fullscreen, slide navigation, and the Motion off control on the actual display. Keep a local build available if your internet connection is unreliable. Check that the final title can remain visible during questions.

### Speaking pace

The live script contains about 2,500 words, plus about 160 for the optional Cloud Lab. At 130-140 words per minute, the main talk takes roughly 18-19.5 minutes; pauses, handoffs, and interaction bring the target to about 20-22 minutes. This is a planning estimate, not a guaranteed duration. Time a full rehearsal and trim repeated explanations before speaking faster.

### Paulo to Renan

Finish slide 7 and press Next. Renan begins slide 8, Know your side, with the written thank-you and shared responsibility.

### Renan to Earl

Finish slide 13 and press Next. Earl begins slide 14, The full cost, with the written thank-you and moves straight into TCO. Earl continues through slides 18 and 19 without introducing a new speaker. Confirm that the displayed speaker name matches the person speaking.

### Interactive pricing

On slides 14–17, press Next for each step. Back reverses the current step; Back from the following slide returns to the last step. Forward entry starts at the title. On slide 15, reveal always-on usage ($73.00 and $43.80), then part-time usage ($17.60 and $43.80), then the 438-hour break-even.

### Interactive elasticity

On slide 16, press Next for each step: two machines, the twenty-machine peak, the return to two, then the monthly comparison. The extra eighteen instances explain the changing capacity. The figures represent the monthly example, not a live cloud account.

### Audience question

On slide 19, ask the question, wait three to five seconds, then select containment. Answers can be switched freely and each one shows its own explanation. If no one answers, say Let us walk through the safest priority, and continue. Avoid shaming an incorrect answer; explain why deleting the file or raising the budget does not stop a copied credential.

### Shared closing

On slide 20, speak Paulo, Renan, Earl in that order. Slide 21, the Cloud Lab, is optional. On slide 22, Earl delivers the final invitation. All three stay ready for questions; the title planet remains on screen.

### If time runs short

Keep the definitions of RPO and RTO, the two pricing states, the SG versus NACL distinction, and credential containment. Skip the Cloud Lab first, then trim extra examples and audience waiting time. Do not cut the assumptions that make a calculation or technical statement accurate.

### If a visual or control fails

Continue the spoken explanation; the argument does not depend on the animation. For pricing, state both usage cases verbally. For elasticity, explain the two baseline instances and eighteen temporary additions. A controller can reopen the slide or switch Motion off without turning the presentation into a troubleshooting demonstration.

### Answering an unfamiliar question

State what you know, identify which part depends on the provider or configuration, and explain what you would verify. Do not guess a current price, claim a deployed control was tested, or invent an incident result. Offer the relevant principle and the next evidence needed.

## References

1. [AWS cloud computing overview](https://aws.amazon.com/what-is-cloud-computing/) - Service models and on-demand resources

2. [AWS Operational Excellence Pillar](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html) - Operations, observation, response, and improvement

3. [AWS recovery objectives overview](https://aws.amazon.com/what-is/recovery-time-objective/) - RPO and RTO terminology

4. [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/) - Provider and customer management boundaries

5. [AWS root user best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html) - Root access, MFA, recovery mechanisms, and organizational management

6. [AWS security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) - Security-group scope and behavior

7. [AWS network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) - Subnet controls, state, and ordered rule behavior

8. [OpenBSD OpenSSH client manual](https://man.openbsd.org/ssh) - Encrypted sessions, public-key authentication, and host identification

9. [AWS compute purchasing options](https://aws.amazon.com/ec2/pricing/) - Purchasing concepts; the numerical rates in this script are illustrative

10. [FinOps Foundation phases](https://www.finops.org/framework/phases/) - Inform, Optimize, Operate terminology and collaboration

11. [AWS Budgets guide](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) - Budget tracking, alerts, and configured actions
