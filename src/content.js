export const people = {
  Paulo: 'Kent Paulo Delgado', Renan: 'John Renan Labay', Earl: 'Earl Josh Delgado'
};

export const sources = {
  mars: ['Mars surface map · NASA/JPL/USGS', 'https://space.jpl.nasa.gov/tmaps/mars.html'],
  cloud: ['Cloud computing explained · AWS', 'https://aws.amazon.com/what-is-cloud-computing/'],
  recovery: ['Recovery objectives · AWS', 'https://aws.amazon.com/what-is/recovery-time-objective/'],
  ops: ['Operational excellence · AWS', 'https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html'],
  shared: ['Shared responsibility · AWS', 'https://aws.amazon.com/compliance/shared-responsibility-model/'],
  root: ['Root user best practices · AWS', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html'],
  network: ['Security groups and network ACLs · AWS', 'https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html'],
  sg: ['Security groups · AWS', 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html'],
  nacl: ['Network ACLs · AWS', 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html'],
  ssh: ['SSH authentication · OpenBSD / OpenSSH', 'https://man.openbsd.org/ssh'],
  finops: ['FinOps phases · FinOps Foundation', 'https://www.finops.org/framework/phases/'],
  budgets: ['AWS Budgets · AWS', 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html'],
  pricing: ['Compute purchasing options · AWS', 'https://aws.amazon.com/ec2/pricing/']
};

// Original summaries based on the supplied Group 11 guide. All money examples
// are teaching assumptions, not live provider quotations.
export const slides = [
  {
    id: 'introduction', chapter: 'Overview', speaker: 'Paulo', time: '0:35', scene: 'planet',
    eyebrow: 'A GROUP 11 REPORT', title: 'Beyond\nthe cloud.',
    subtitle: 'Cloud economics, operations & security', kind: 'cover',
    takeaway: 'Keep it running. Protect access. Make resources count.', refs: [],
    notes: 'Good day. We are Group 11: Kent Paulo Delgado, John Renan Labay, and Earl Josh Delgado. Our report covers cloud operations, security, and economics. The visual theme takes inspiration from The Martian: keeping essential systems working, protecting what matters, and making limited resources count. These are the ideas we connect to the report; we are not retelling the film. I will start with operations, Renan will cover security, and Earl will explain economics.',
    detail: 'Cloud decisions affect availability, access, and spending at the same time. This report connects the daily work of operating a system with the controls that protect it and the financial choices that sustain it.'
  },
  {
    id: 'online-is-not-enough', chapter: 'Overview', speaker: 'Paulo', time: '0:50', scene: 'planet',
    eyebrow: 'THE BIG PICTURE', title: 'Online isn’t\nenough.', subtitle: 'A working app can still be at risk.', kind: 'risks',
    items: [['Recovery', 'Untested backups'], ['Access', 'Old administrator'], ['Spending', 'Idle resources']],
    takeaway: 'Reliability. Security. Accountability.', refs: ['ops'],
    notes: 'Imagine a small student web application. It loads correctly, but nobody has tested a restore. A former administrator still has access. Several forgotten resources keep billing. These are three independent risks in a fictional example. A green online indicator does not tell us whether the system is recoverable, protected, or financially controlled. We need to manage all three.',
    detail: 'A successful page request is only one signal. Operational readiness also requires recovery procedures, appropriate access, and ownership of resource spending. Treat this as a teaching scenario rather than a documented incident.'
  },
  {
    id: 'cloud-basics', chapter: 'Operations', speaker: 'Paulo', time: '0:55', scene: 'compute',
    eyebrow: '01 / UNDERSTAND THE SYSTEM', title: 'Resources.\nOn demand.', subtitle: 'Rent computing capacity over a network.', kind: 'models',
    items: [['IaaS', 'Infrastructure'], ['PaaS', 'Platform'], ['SaaS', 'Software']],
    takeaway: 'Compute · Storage · Networking', refs: ['cloud', 'shared'],
    notes: 'Cloud computing gives us on-demand access to computing resources. Compute runs applications, storage holds data, and networks connect services. IaaS provides infrastructure such as virtual machines; customers manage the guest operating system and application. PaaS manages more of the platform. SaaS delivers a finished application. Responsibilities depend on the service. Most of our detailed network examples use an IaaS-style web application.',
    detail: 'IaaS, PaaS, and SaaS describe different management boundaries. Regions and availability zones describe placement. Scalability is the ability to increase capacity; elasticity includes scaling back down as demand falls. These concepts influence both operations and cost.'
  },
  {
    id: 'daily-operations', chapter: 'Operations', speaker: 'Paulo', time: '0:55', scene: 'compute',
    eyebrow: '01 / CLOUD OPERATIONS', title: 'Keep it\nworking.', subtitle: 'Deployment is the beginning.', kind: 'steps',
    items: [['01', 'Observe'], ['02', 'Maintain'], ['03', 'Automate'], ['04', 'Recover']],
    takeaway: 'Run it. Improve it. Repeat.', refs: ['ops'],
    notes: 'Cloud operations is the daily work of running and improving cloud systems. We observe health, maintain software, automate repeated tasks, and prepare for recovery. Patching reduces exposure to known flaws. Infrastructure as Code records infrastructure settings in version-controlled files, making changes reviewable and environments easier to reproduce. Automation still needs validation and careful access control; it does not eliminate accountability.',
    detail: 'Operational work includes monitoring, patching, backups, capacity management, and incident response. Infrastructure as Code supports repeatable changes and recovery. CI/CD can validate and deliver changes consistently. Secrets belong in protected secret-management systems, not in source files.'
  },
  {
    id: 'observability', chapter: 'Operations', speaker: 'Paulo', time: '1:00', scene: 'compute',
    eyebrow: '01 / MONITORING & LOGS', title: 'See the signal.\nFind the cause.', subtitle: 'Metrics show changes. Logs add context.', kind: 'monitor',
    takeaway: 'Alert → Investigate → Act', refs: ['ops'],
    notes: 'Metrics tell us how a system behaves over time: traffic, error rate, CPU, and disk space. Application logs provide event details. Audit logs record cloud account activity, such as permission or resource changes. An alert brings attention to a condition; investigation checks the evidence. The chart on this slide is simulated. A spending spike is worth investigating but is not, by itself, proof of an attack.',
    detail: 'Useful monitoring connects signals to an action and an owner. Compare an unusual metric with application and audit events. A sudden traffic increase may be legitimate demand, an application issue, or malicious activity. Evidence determines the response.'
  },
  {
    id: 'recovery', chapter: 'Operations', speaker: 'Paulo', time: '1:15', scene: 'orbit',
    eyebrow: '01 / BACKUPS & RECOVERY', title: 'Plan for\nthe gap.', subtitle: 'How much data? How much downtime?', kind: 'recovery',
    takeaway: 'A backup needs a successful restore test.', refs: ['recovery'],
    notes: 'Recovery Point Objective, or RPO, is the maximum acceptable data loss expressed as time. Recovery Time Objective, or RTO, is the target limit for restoring service after disruption. In this example we tolerate up to one hour of lost changes and target recovery within four hours. These are objectives, not achieved results. Backup schedules, replication, integrity checks, and restore tests determine whether we can meet them. Protect backup access and keep an independent copy.',
    detail: 'RPO concerns the recovery point before a disruption; RTO concerns elapsed time after it. The 3-2-1 guideline suggests three copies, two storage types, and one offsite copy. A persistent container volume alone is not a backup. Test restores and protect backup deletion separately from routine application access.'
  },
  {
    id: 'incident-response', chapter: 'Operations', speaker: 'Paulo', time: '1:05', scene: 'orbit',
    eyebrow: '01 / INCIDENT RESPONSE', title: 'Be ready for\nthe bad day.', subtitle: 'A response works better when rehearsed.', kind: 'response',
    items: [['01', 'Detect'], ['02', 'Contain'], ['03', 'Investigate'], ['04', 'Recover'], ['05', 'Improve']],
    takeaway: 'Prepare the process before the incident.', refs: ['ops'],
    notes: 'For a leaked cloud credential, contain its use promptly, preserve relevant evidence, examine account activity, and handle unauthorized resources. Recovery includes restoring trusted services and validating access. Afterward, improve the process that allowed the leak. Investigation and containment often happen in parallel. We now know how to observe and recover; Renan will explain who should be able to reach and control the system.',
    detail: 'Document an owner, escalation path, evidence sources, and recovery checks. Cloud activity may span multiple regions. Preserve logs and relevant evidence while containing damage. Rehearse the procedure, then update it after incidents and exercises.'
  },
  {
    id: 'shared-responsibility', chapter: 'Security', speaker: 'Renan', time: '1:05', scene: 'shield',
    eyebrow: '02 / SHARED RESPONSIBILITY', title: 'Know your\nside.', subtitle: 'The boundary changes with the service.', kind: 'shared',
    takeaway: 'Confidentiality · Integrity · Availability', refs: ['shared'],
    notes: 'In our IaaS example, the provider maintains physical facilities, hardware, and the underlying virtualization infrastructure. The customer configures identities, guest software, application data, and access rules. Managed services move parts of this boundary. Security goals are confidentiality, integrity, and availability: appropriate disclosure, trustworthy data, and usable services. Shared responsibility means we must understand the particular service we chose.',
    detail: 'Shared responsibility is service-specific. A managed database removes some operating-system work, but customers still choose access, data handling, and supported configuration. Layered controls protect the CIA goals without assuming any single control is sufficient.'
  },
  {
    id: 'root-access', chapter: 'Security', speaker: 'Renan', time: '1:00', scene: 'shield',
    eyebrow: '02 / PRIVILEGED ACCESS', title: 'Power needs\nlimits.', subtitle: 'Two meanings of root. Different scopes.', kind: 'root',
    takeaway: 'Named identities. Minimum permissions.', refs: ['root', 'ssh'],
    notes: 'Linux root is the operating system superuser. The AWS account root user is a highly privileged cloud account identity. They are different. Use named users and restricted sudo for Linux administration, and use appropriately scoped identities or roles for routine cloud work. Secure root credentials, use MFA where credentials exist, avoid root access keys, and monitor privileged access. AWS Organizations can centrally manage member-account root access; avoid the blanket claim that root credentials can never be removed. Sudo logging does not automatically capture every action performed inside a privileged shell.',
    detail: 'Limit both the duration and scope of privileged access. Avoid shared administrator identities. Linux root controls a machine; cloud account root has account-level powers. Recovery and emergency access should be documented and protected. AWS organizational root-management features are an exception to simplistic “never remove root credentials” guidance.'
  },
  {
    id: 'firewalls', chapter: 'Security', speaker: 'Renan', time: '1:00', scene: 'shield',
    eyebrow: '02 / FIREWALLS', title: 'Every path\nneeds a rule.', subtitle: 'Default deny. Permit what is necessary.', kind: 'firewall',
    takeaway: 'Source · Destination · Protocol · Port · Direction', refs: ['sg', 'nacl'],
    notes: 'A firewall decides which traffic is permitted according to rules. Consider source, destination, protocol, port, and direction. A public web entry point can accept HTTPS on port 443. Administrative access should use a controlled path, such as a VPN, bastion, or managed session service. Keep database connectivity restricted to its application path. Default deny describes the policy we aim to configure, not the factory defaults of every cloud control.',
    detail: 'Use a web application firewall when application-layer filtering is needed, network controls for connectivity boundaries, and host controls where appropriate. Restrict administrative reachability and review stale rules. Public web access does not require making database ports public.'
  },
  {
    id: 'sg-vs-nacl', chapter: 'Security', speaker: 'Renan', time: '1:15', scene: 'shield',
    eyebrow: '02 / NETWORK CONTROLS', title: 'Two layers.\nDifferent rules.', subtitle: 'Security groups and network ACLs.', kind: 'compare',
    takeaway: 'Stateful remembers. Stateless checks both ways.', refs: ['network', 'sg', 'nacl'],
    notes: 'A security group applies to associated network interfaces and tracks connection state. Its rules allow traffic. A network ACL applies at the subnet boundary, has allow and deny rules, and evaluates numbered rules in order. With stateless ACLs, return traffic needs appropriate rules too. A newly created security group has no inbound rules and normally allows outbound traffic; a VPC default security group has its own inbound rule for associated group members. Default NACLs allow traffic; custom NACLs start without allow rules. This is why we check the actual configuration.',
    detail: 'Security-group state tracking permits return traffic for allowed connections. NACLs evaluate each direction separately, including relevant ephemeral ports. Defaults differ between a new security group, a VPC default security group, a default NACL, and a custom NACL. Never substitute a slogan for inspection of the actual rules.'
  },
  {
    id: 'ssh-authentication', chapter: 'Security', speaker: 'Renan', time: '1:00', scene: 'key',
    eyebrow: '02 / SSH AUTHENTICATION', title: 'Prove it.\nKeep it secret.', subtitle: 'The private key stays on your device.', kind: 'ssh',
    takeaway: 'Verify the server’s host-key fingerprint too.', refs: ['ssh'],
    notes: 'SSH encrypts remote connections. In public-key authentication, the client proves possession of a private key using a signature that the server can verify. The matching public key is authorized on the server. The private key is not sent. Separately, the client verifies the server through its host key. Verify fingerprints through a trusted channel and investigate unexpected changes. A normal SSH key is not automatically multi-factor authentication.',
    detail: 'User public keys authenticate users; server host keys authenticate servers. These are different checks. Passphrases protect stored private keys, while host-key verification helps detect server impersonation. Password-based SSH also uses the encrypted connection; the advantage of key authentication is not that passwords normally travel as plaintext.'
  },
  {
    id: 'key-lifecycle', chapter: 'Security', speaker: 'Renan', time: '0:55', scene: 'key',
    eyebrow: '02 / KEY MANAGEMENT', title: 'Security lasts\na lifecycle.', subtitle: 'Strong keys still need careful handling.', kind: 'steps',
    items: [['01', 'Create'], ['02', 'Protect'], ['03', 'Review'], ['04', 'Revoke']],
    takeaway: 'One person. One device. Accountable access.', refs: ['ssh'],
    notes: 'Use individual keys, protect storage and file permissions, add a passphrase, and remove old access. For a leaked private key, remove the corresponding authorization and investigate; merely deleting the leaked file is not enough. Test a new working session before closing an existing session when changing SSH settings. Controlled access protects the system and its resources. Earl will explain how we choose capacity and manage cost.',
    detail: 'Key management covers creation, storage, enrollment, review, and revocation. Do not embed private keys in repositories or images. Larger teams may use short-lived credentials or certificates. Validate configuration changes and preserve a recovery path to avoid accidental lockout.'
  },
  {
    id: 'total-cost', chapter: 'Economics', speaker: 'Earl', time: '1:00', scene: 'resources',
    eyebrow: '03 / CLOUD ECONOMICS', title: 'The full cost.\nNot just the fee.', subtitle: 'Compare total cost of ownership.', kind: 'cost',
    takeaway: 'Capacity + Time + Operations + Hidden costs', refs: ['pricing'],
    notes: 'CapEx means upfront capital spending, such as buying hardware. OpEx is ongoing operating spending, such as usage-based services. TCO includes all relevant costs over the same period: hardware or service charges, electricity, networking, support, maintenance, and staff time. Cloud is not always cheaper. Large steady workloads or heavy outbound transfer can change the comparison. The answer depends on equivalent performance, reliability requirements, and time horizon.',
    detail: 'A fair comparison uses comparable workloads, service quality, support, and time periods. Data transfer, snapshots, public addressing, licenses, and idle capacity can add costs. Opportunity cost also matters: time managing hardware may displace development work.'
  },
  {
    id: 'pricing', chapter: 'Economics', speaker: 'Earl', time: '1:20', scene: 'resources',
    eyebrow: '03 / PRICING MODELS', title: 'A lower rate.\nA bigger bill?', subtitle: 'Match the commitment to actual usage.', kind: 'pricing',
    takeaway: 'Illustrative rates. Equivalent compute only.', refs: ['pricing'],
    notes: 'Our example assumes an On-Demand rate of ten cents per hour, a 730-hour month, and a commitment rate forty percent lower covering every hour. Always on costs 73 dollars On-Demand versus 43 dollars 80 committed. At 176 hours of actual use, On-Demand costs 17 dollars 60, while the same full-month commitment still costs 43 dollars 80. At these assumptions, break-even is 438 usage hours. Spot is another option for interruptible work, not guaranteed capacity. These are teaching figures, not live quotes, and exclude storage, networking, taxes, and other charges.',
    detail: 'Commitment discounts reward predictable baseline demand but create an obligation. In the simplified model, $0.10 × 730 × 0.60 = $43.80. Dividing by $0.10 gives a 438-hour break-even. Actual Reserved Instance and Savings Plan products have different terms and coverage rules. Spot workloads must tolerate interruption.'
  },
  {
    id: 'elasticity', chapter: 'Economics', speaker: 'Earl', time: '1:00', scene: 'resources',
    eyebrow: '03 / ELASTICITY', title: 'Meet the peak.\nThen let go.', subtitle: 'Extra capacity only when demand needs it.', kind: 'elasticity',
    takeaway: 'Scaling down is part of saving.', refs: ['cloud'],
    notes: 'Assume two instances run for 730 hours, with eighteen additional instances for a 24-hour sale, all at ten cents per hour. The total is 146 dollars plus 43 dollars 20, or 189 dollars 20. Keeping twenty equivalent instances for all 730 hours costs 1,460 dollars. This is a compute-only rental comparison. It is not the purchase price of physical hardware, and it excludes supporting services. Autoscaling still needs sensible limits and performance checks.',
    detail: 'Elasticity aligns resource use with demand, increasing capacity and releasing it afterward. Savings depend on how the application scales, billing granularity, startup times, and supporting infrastructure. A fixed fleet may be appropriate for some workloads, so compare requirements rather than assuming every application is elastic.'
  },
  {
    id: 'finops', chapter: 'Economics', speaker: 'Earl', time: '1:05', scene: 'resources',
    eyebrow: '03 / FINOPS', title: 'Give every\nresource an owner.', subtitle: 'Make cost control a shared practice.', kind: 'finops',
    takeaway: 'Budget notifications are not hard spending caps.', refs: ['finops', 'budgets'],
    notes: 'FinOps connects engineering, finance, and business decisions. Inform means understanding and allocating spending. Optimize means evaluating ways to improve rates and usage. Operate means putting decisions into practice and improving them. The phases repeat. Use owner and project tags, right-size capacity, remove waste, and review results. Budget notifications can warn about actual or forecast spending; they are not guaranteed immediate caps. Configured actions and quotas have specific limitations.',
    detail: 'Cost allocation makes accountability possible. Optimization considers business value and acceptable service quality, not only the smallest bill. The Inform, Optimize, Operate phase names are attributed to the FinOps Foundation; this report uses original summaries. Notifications and billing data may have delays.'
  },
  {
    id: 'architecture', chapter: 'Together', speaker: 'Earl', time: '1:10', scene: 'compute',
    eyebrow: '04 / THE CONNECTED SYSTEM', title: 'One system.\nEvery layer matters.', subtitle: 'Availability, access, and cost work together.', kind: 'architecture',
    takeaway: 'Observe it. Protect it. Account for it.', refs: ['shared', 'network', 'budgets'],
    notes: 'Visitors enter through HTTPS. The application accesses a private database through restricted rules. Administrators use a separate controlled management path. Monitoring and audit logs support investigation. Protected backups support recovery. Resource ownership and spending alerts support accountability. Cloud-console MFA does not automatically turn an SSH key into MFA. A cost anomaly may be an early sign of misuse, while security controls can reduce its impact.',
    detail: 'The architecture is an instructional sketch, not a complete production design. Routing, identities, encryption, recovery strategy, and service-specific controls all require implementation detail. Separate the public application path from privileged management access.'
  },
  {
    id: 'decision', chapter: 'Together', speaker: 'Earl', time: '1:00', scene: 'orbit',
    eyebrow: '04 / YOUR CALL', title: 'A key leaks.\nWhat comes first?', subtitle: 'Unknown instances. Unexpected spending.', kind: 'quiz',
    takeaway: 'Fictional teaching scenario.', refs: ['ops'],
    notes: 'Ask the audience what they would do first. The best answer here is to contain the compromised cloud credential. Investigate activity, preserve evidence, and handle unauthorized resources while coordinating recovery. Increasing the budget or deleting the public file does not stop use of an already copied credential. Removing a key from a repository also does not automatically revoke its cloud access. Each speaker can connect one response to their section.',
    detail: 'Containment limits ongoing misuse. Follow with evidence-led investigation and recovery. Revoke exposed credentials even if the source file is removed. Review permissions, secret handling, detection, and spending controls after the incident.'
  },
  {
    id: 'conclusion', chapter: 'Together', speaker: 'All', time: '0:45', scene: 'planet',
    eyebrow: 'GROUP 11 / THE TAKEAWAY', title: 'Keep it running.\nProtect access.\nMake it count.', subtitle: 'Three disciplines. One better cloud.', kind: 'closing',
    takeaway: 'Questions & discussion', refs: [],
    notes: 'Paulo: Good operations help us see problems, maintain systems, and recover. Renan: Good security limits access, protects credentials, and adds layers of control. Earl: Good economics matches resources to workload and makes spending accountable. Together these practices keep the cloud reliable, secure, and cost-conscious. Thank you. We are ready for your questions.',
    detail: 'Reliability, security, and financial accountability reinforce each other. Choose controls and capacity according to workload, risk, recovery needs, and total cost. Explain trade-offs clearly and revisit decisions as conditions change.'
  }
];

slides.push({
  id:'cloud-lab',chapter:'Together',speaker:'All',time:'2:30',scene:'price',kind:'lab',
  eyebrow:'GROUP 11 / CLOUD LAB',title:'Make it visible.',subtitle:'Pricing. Elasticity. Incident response.',
  takeaway:'Change a condition. See the consequence.',refs:['pricing','cloud','ops'],
  notes:'Optional two-to-three minute interactive recap. Earl: Pricing compares 176, 438, and 730 usage hours against a $43.80 full-month commitment. At 438 hours the totals match. Elasticity adds eighteen temporary machines to two baseline instances and releases them after the peak. The monthly compute comparison stays $189.20 versus $1,460. Renan: Expose a fictional cloud credential, contain access, preserve audit evidence, then remove unauthorized resources and validate recovery. Paulo: explain detection and recovery checks. Containment stops new credential actions; existing unauthorized machines may keep billing until cleanup. Reset lab restores all examples. No real cloud account is connected.',
  detail:'Interactive teaching simulation with three modes. Pricing assumes $0.10 per hour, a 730-hour month, and a 40% commitment discount. Elasticity assumes two baseline instances for 730 hours and eighteen additions for 24 hours. Incident response uses two trusted and six unauthorized machines at an illustrative $0.10 each per hour: $0.80/h before cleanup and $0.20/h afterward. Revoking a credential alone does not terminate existing resources or guarantee all sessions are invalidated. The simulation is deterministic and is not a production security tool or live billing dashboard.'
});
// End on the same visual as the opening, after the lab.
slides.push({
  ...slides[0],
  id: 'closing-title',
  chapter: 'Together',
  speaker: 'All',
  time: '0:15',
  notes: 'Thank you for listening. We are Group 11. We are ready for your questions on cloud operations, security, and economics.',
  detail: 'Closing title reprise. Group 11 welcomes questions and discussion.'
});

export const glossary = [
  ['CloudOps', 'The ongoing work of running, maintaining, and improving cloud systems.'],
  ['RPO', 'Maximum acceptable data loss, expressed as time.'],
  ['RTO', 'Target maximum duration for restoring service after disruption.'],
  ['IAM', 'Identity and access management: who can perform which actions.'],
  ['Least privilege', 'Only the permissions required for the task.'],
  ['MFA', 'Authentication using more than one distinct factor.'],
  ['Security group', 'A stateful allow-rule control for associated network interfaces.'],
  ['NACL', 'A stateless subnet-boundary control with ordered allow and deny rules.'],
  ['SSH', 'An encrypted protocol for remote access and related functions.'],
  ['CapEx / OpEx', 'Upfront capital spending / ongoing operational spending.'],
  ['TCO', 'Total cost of ownership over a defined time and scope.'],
  ['Elasticity', 'Increasing and reducing capacity to match demand.'],
  ['FinOps', 'Collaborative financial accountability for technology value.'],
  ['Egress', 'Data transferred out of a service or network boundary; charges depend on the route and provider.']
];

export const questions = [
  ['Is cloud always cheaper?', 'No. Compare equivalent workloads, reliability, transfer costs, staff time, and the full ownership period.'],
  ['Are backups enough?', 'Only if they are usable, protected, and restore-tested against recovery objectives.'],
  ['Does an SSH key give MFA?', 'Not automatically. A typical key is one authentication method; additional distinct factors require an appropriate configuration.'],
  ['Does a budget alert stop spending?', 'No guaranteed cap. Billing updates and notifications can be delayed; configured actions have their own scope.'],
  ['Why can On-Demand beat a commitment?', 'Low actual usage can cost less than an obligation covering unused capacity.'],
  ['What if a credential reaches Git?', 'Contain and revoke the compromised access, investigate, replace credentials as needed, and fix the leak. Deleting the file alone is insufficient.'],
  ['Are security groups and NACLs interchangeable?', 'No. They have different scope, state handling, rule actions, and evaluation behavior.'],
  ['Can Linux root and AWS root be treated alike?', 'No. One is an OS identity; the other is an account identity. Scope and recovery mechanisms differ.']
];
