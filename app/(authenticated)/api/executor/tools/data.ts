export const architect_system_prompt = `
###INSTRUCTIONS###
ALWAYS ANSWER TO THE USER IN THE MAIN LANGUAGE OF THEIR MESSAGE.
YOU ARE AN AZURE ARCHITECT WITH EXPERTISE IN THE WELL-ARCHITECTED FRAMEWORK AND BEST PRACTICES. FOLLOW THE INSTRUCTION SET BELOW TO PROVIDE DETAILED INFORMATION ABOUT AZURE'S WELL-ARCHITECTED FRAMEWORK AND BEST PRACTICES TO ANY USER QUERY.

###CHAIN OF THOUGHTS###
####IDENTIFICATION AND CLARIFICATION####
1. IDENTIFY THE USER'S QUERY:
    1.1. DETERMINE the specific aspect of the Well-Architected Framework or best practices the user is asking about.
    1.2. CLARIFY any vague or broad questions to target specific information.
2. ASK if the user would like to complete a questionnaire for a specific pillar or receive detailed information directly.

####DETAILED INFORMATION EXPLANATION####
3. FOR DIRECT DETAILED INFORMATION:
    3.1. EXPLAIN the core pillars of the Well-Architected Framework: Cost Optimization, Operational Excellence, Performance Efficiency, Reliability, and Security.
    3.2. OFFER best practices and design principles associated with each pillar.
    3.3. INCLUDE examples and case studies to illustrate real-world application of these principles.
    3.4. PROVIDE resources such as official Azure documentation, whitepapers, and learning paths.
    3.5. SUGGEST tools like the Azure Well-Architected Review or Advisor to assess and improve architecture.

####QUESTIONNAIRE OPTION####
4. FOR QUESTIONNAIRE COMPLETION:
    4.1. IF THE USER OPTS FOR A QUESTIONNAIRE, initiate waf_questionnaire function for the first pillar ("Security").
    4.2. CONTINUE to the next pillars sequentially until all five pillars have been covered.
    4.3. RETURN the collected questions in a JSON format once a pillar's questionnaire is completed.
    4.4. ENSURE to collate and provide results from all five pillars back to the user.

####CITATION OF SOURCES####
FOR CITATION OF SOURCES: 
    4.1. SEARCH internal documents using the AISEARCH function for relevant information. 
    4.2. INCLUDE a citation at the end of your answer and don't include a full stop after the citations. 
    Use the format for your citation {% citation items=[{name:"filename 1",id:"file id"}, {name:"filename 2",id:"file id"}] /%}

###WHAT NOT TO DO###
- NEVER PROVIDE VAGUE OR GENERIC ANSWERS.
- NEVER OMIT KEY ASPECTS OF THE WELL-ARCHITECTED FRAMEWORK.
- NEVER ASSUME THE USER'S NEEDS WITHOUT CLARIFICATION.
- NEVER FAIL TO PROVIDE EXAMPLES AND RESOURCES FOR FURTHER GUIDANCE.
- NEVER IGNORE FOLLOW-UP QUESTIONS OR REQUESTS FOR CLARIFICATION.

###FEW-SHOT EXAMPLES###
####USER QUERY: "How can I optimize cost using Azure's Well-Architected Framework?"
EXPERT RESPONSE
To optimize cost using Azure's Well-Architected Framework, focus on the Cost Optimization pillar, which includes strategies like:
- **Choosing the Right Resources:** Select appropriate VM sizes and types for your workloads.
- **Implementing Autoscaling:** Configure autoscaling to dynamically adjust resources based on demand.
- **Utilizing Reserved Instances:** Purchase reserved instances for predictable workloads to save costs.
- **Monitoring and Analysis:** Use Azure Cost Management and Advisor to monitor spending and identify optimization opportunities.

CHAIN OF THOUGHTS:
- IDENTIFY the focus on cost optimization.
- EXPLAIN strategies within the Cost Optimization pillar.
- PROVIDE relevant resources for further guidance.
- FOLLOW-UP to ensure the information meets user needs.

####QUESTIONNAIRE EXAMPLE####
USER QUERY "I want to complete a questionnaire for Cost Optimization."
EXPERT RESPONSE
- Let's start with the Cost Optimization pillar. I will ask you a series of questions to better understand your current setup. Once we've gone through these questions, I'll provide the next steps and analysis.

**Questionnaire: Cost Optimization**
1. Are you using the appropriate VM sizes and types for your workload?
2. Have you implemented autoscaling to adjust resources dynamically?
3. Are you utilizing reserved instances for predictable workloads?
4. Do you regularly monitor and analyze your spending using Azure Cost Management tools?

I'll compile these answers in a JSON format and we can proceed with the next pillar.

CHAIN OF THOUGHTS:
- INITIATE the questionnaire for Cost Optimization.
- ASK targeted questions to gather essential information.
- ENSURE comprehensiveness and relevance in the questions.
- COMPILE answers and prepare for the next steps.

####FINAL RESPONSE FORMAT####

###Understanding Your Azure Architecture Needs####
How can I assist you with Azure's Well-Architected Framework today? Please specify if you need detailed information on a specific pillar or if you would like to complete a questionnaire to evaluate your architecture against the five pillars. 

1. **Cost Optimization**
2. **Operational Excellence**
3. **Performance Efficiency**
4. **Reliability**
5. **Security**

Feel free to choose the option that best meets your needs. 
`

export const security_questions = `### Security

**Question: How do you secure the application code, development environment, and software supply chain?**
- None of the above.
- We ensure data from production environments isn't available to development or test environments.
- We ensure developers meet security training requirements before they gain access to application source code.
- We include framework and library updates in the workload lifecycle.
- We maintain a catalog of all deployed assets and their versions.
- We maintain a manifest that enumerates all dependencies, frameworks, and libraries that the workload uses, and we update the manifest regularly.
- We promptly remove unused and legacy assets from the development environment.
- We safeguard development environments by controlling access to code, scripts, pipeline tools, and source control systems.
- We've adopted threat modeling processes, ranked identified threats based on organizational impact, mapped them to mitigations, and communicated these to stakeholders.
- We've identified all business and security requirements of the application.

**Question: What are your plans and procedures for encrypting data?**
- None of the above.
- We employ native encryption methods for cloud-hosted environments.
- We encrypt data in transit with Transport Layer Security (TLS) version 1.2 or later.
- We have a method for revoking and reissuing certificates quickly when a private key becomes compromised.
- We store our encryption keys and our resources that host the encrypted data in separate locations.
- We use a modern identity platform to allow just-in-time (JIT) access and just enough access (JEA) to the encryption keys.
- We use double encryption where business or regulatory requirements dictate its use.
- We use only industry-standard encryption algorithms for the workload data.
- We use strong encryption-at-rest techniques in the system that hosts our encryption keys.
- We use the latest secure version of the secure hash algorithms (SHA) family of algorithms.

**Question: Do you have a documented security baseline?**
- None of the above.
- We continuously revisit the baseline as the workload gets updated and changes over time.
- We have a baseline with recommendations for incident response, including communication and recovery.
- We have a clear understanding of all regulatory compliance requirements for our industry and location.
- We provide role-based security training that enhances skills in maintaining baselines.
- We use a cloud security posture management tool to detect gaps and drift from our baseline.
- We use the baseline to drive the use of preventative guardrails.
- We've documented an initial baseline for our workload that's based on industry standards, compliance, and business requirements.

**Question: How do you monitor the application and the infrastructure?**
- None of the above.
- We collect activity logs from all the infrastructure components in our workload.
- We collect logs from all application flows.
- We monitor configuration drift away from the baseline and agreed-upon standards.
- We periodically review access to the control plane and data plane of the application.
- We use a threat-detection tool to aggregate and analyze logs.
- We use cloud-native tools to monitor our workload resources and the infrastructure in which our workload runs.
- We use modern threat-detection techniques to detect suspicious activities.

**Question: How do you secure your secrets and the other credentials that your workload uses?**
- None of the above.
- We don't share secrets between development, testing, and production environments.
- We employ role-based access control (RBAC) to manage access to keys.
- We have a method in place to respond to secret rotation without disruption.
- We have a secure process in place for distributing secrets to the locations where they're used.
- We rotate keys and expire old keys on a regular basis.
- We store application secrets and credentials separately from the workload in a secret management system that uses strong encryption.
- We use automation to detect and remove hard-coded secrets from our source code and build artifacts.

**Question: What identity and access controls do you use to secure your application?**
- None of the above.
- We implement identity lifecycle management and have a documented offboarding process.
- We separate the control plane and the data access plane.
- We use attribute-based access controls to enforce just-in-time (JIT) and just-enough-access (JEA) principles.
- We use role-based access control (RBAC) for this workload, and we've clearly defined roles and responsibilities.
- We've identified all identity personas for this workload and avoid hard-coded credentials where possible.
- We've isolated critical impact accounts and strictly enforce privilege separation and access reviews.

**Question: How do you secure connectivity for this workload?**
- None of the above.
- We have plans and capabilities in place to mitigate distributed denial-of-service (DDoS) attacks.
- We use firewalls to protect ingress and egress edge traffic.
- We use network restrictions and IP firewall rules to ensure public IP addresses can't access individual services.
- We use network security groups to isolate and protect traffic within the workload's virtual networks.
- We've evaluated all network flows based on their direction, scope, and level of restriction.
- We've secured connectivity to platform as a service (PaaS) endpoints.

**Question: What measures do you take to continuously harden your workload against attack?**
- None of the above.
- We document the requirements and decisions made for hardening, including any exceptions.
- We don't use legacy authentication methods.
- We have a comprehensive inventory of all hardware, software, and data assets for this workload.
- We place isolation boundaries around critical assets and sensitive data to protect against lateral movement attacks.
- We train our teams on methods of hardening the code and components of our workload.
- We've disabled the use of legacy and insecure protocols from the workload.

**Question: How do you test your workload before and after it reaches production?**
- None of the above.
- We perform manual security testing and use various scanning technologies that Microsoft and third parties offer.
- We periodically simulate attacks by using ethical hacking practices that involve penetration testing and war game exercises.
- We test the functional and structural aspects of our workload by using different test methodologies.
- We use various types of tests on our data, networking, application, and components.
- We're prepared to handle improvised tests that are conducted by central teams.
- We've integrated security routine tests as part of DevOps practices, and we run tests in our build processes and deployment pipelines.

**Question: How prepared are you to respond to incidents?**
- None of the above.
- We have a designated incident contact who uses established documentation for communication and reporting during incidents.
- We have a process in place to prevent incident recurrence.
- We have a triage team responsible for assessing incident severity, impact, and action plans.
- We have a well-defined communication plan for incident response.
- We have an established security operations center (SOC) within the organization.
- We systemically conduct post-incident reviews to extract valuable insights for the incident response.

**Question: Have you classified all data persisted by the workload?**
- None of the above.
- We apply consistent classification tagging that's designed for querying.
- We regularly review the classification and taxonomy applied to our workload.
- We've aligned the taxonomy for our data classifications with our business requirements.
- We've designed our architecture according to the classification labels.
- We've performed an inventory showing where all data is stored in our workload.

**Question: How do you segment your workload as a defense-in-depth measure?**
- None of the above.
- We have clear lines of workload responsibility and have implemented access controls accordingly.
- We implement the defense-in-depth concept in our workload, take a layered approach toward security, and ensure clear segmentation boundaries.
- We recognize identity as the primary security perimeter for this workload.
- We segregate resources by using resource organization and isolate resources by using polyglot persistence.
- We've established network segmentation perimeter controls.
`;
export const reliability_questions = `### Reliability

**Question: How do you plan for disaster scenarios?**
- None of the above.
- We created dedicated failback plans.
- We define, document, and understand the roles and responsibilities during an incident response.
- We ensure that recovery and failover plans have clear criteria.
- We have a disaster recovery plan with processes to recover the workload, components, and data.
- We know the expected recovery time of each of our recovery plans.
- We minimized the risk of our disaster recovery plan itself becoming unavailable if there's a disaster.
- We regularly test our recovery plans in a dry run.
- We use the results of our failure mode analysis to create recovery plans.
- We've deliberately automated disaster recovery processes wherever reasonable.

**Question: How do define a scaling strategy?**
- None of the above.
- Not applicable.
- We align scaling triggers with the time that it takes for the operation to finish.
- We configure autoscaling to avoid unplanned or excessive costs.
- We deliberately define scale units.
- We determined a data partitioning strategy.
- We ensure that the scaling strategy includes all components that are candidates for scaling.
- We identified the load patterns of user and system flows.
- We make sure that none of our scaled components overwhelm downstream components during a scale-out operation.
- We use platform-provided capabilities to automatically scale components where appropriate and whenever possible.

**Question: How do you perform failure mode analysis?**
- None of the above.
- We assessed the impact of each failure mode for each of our workload's flows.
- We decompose the workload to identify its components and their relationships.
- We documented and published the outcome of the failure mode analysis.
- We established continuous improvement processes to reduce dependencies and review our failure mode analysis.
- We have failure mitigation strategies.
- We identified all internal and external dependencies.
- We identified failure modes for all internal and external dependencies.
- We understand the performance and reliability characteristics of all our internal and external dependencies.

**Question: How do you implement self-preservation and self-healing measures?**
- None of the above.
- We designed the system to follow the paradigm of loosely coupled services.
- We enable the application to degrade its service gracefully.
- We ensure all components of the workload provide insights into their behavior by writing appropriate log statements for later analysis.
- We implement asynchronous communication rather than synchronous communication between components wherever appropriate.
- We mitigate intermittent communication failures and congestion.
- We use vendor or framework-provided retry mechanisms, where possible.
- We use well-known standards to enable communication between our services.
- We're familiar with cloud infrastructure design as well as application design patterns for reliability.

**Question: How do you implement redundancy?**
- None of the above.
- We derive the redundancy requirement for each flow from the business requirements and the service-level agreements (SLAs) of the components.
- We don't have any state in the compute layer components, and we can dispose of every instance at any time without data loss.
- We embrace polyglot persistence and intentionally select data services based on our workload's data requirements.
- We ensure stakeholders understand the basic concepts of high availability and that they're familiar with the related features.
- We ensure the workload's network traffic has the appropriate level of redundancy.
- We follow the Deployment Stamps design pattern to deploy our workload.
- We replicate data across physical locations by using platform-provided capabilities whenever possible.
- We use platform-provided capabilities to introduce and manage the redundancy of our compute resources.

**Question: How do monitor workload health?**
- None of the above.
- We can monitor each flow of our workload individually and assess its health state.
- We ensure our team is familiar with telemetry at various levels.
- We only use structured logs that have a defined schema.
- We present the workload and individual flow health in a simple visual to users who have the right permissions.
- We send out alerts when the health of a flow degrades.
- We're intentional about our monitoring system design.
- We've taken measures to stay updated on the health of platforms that our workload depends on.

**Question: How do you test your resiliency and availability strategies?**
- None of the above.
- We ensure that the development and operations teams are familiar with the concepts of fault injection and chaos engineering.
- We learn from production incidents.
- We monitor total application health during chaos experiments.
- We perform testing early in the development process and throughout it.
- We run tests in a production-like environment, and we run a targeted subset of tests in production.
- We use planned downtime to run tests on production.
- We use the results of a failure mode analysis to identify and define meaningful chaos experiments.

**Question: How do you define reliability targets?**
- None of the above.
- We agree on definitions of healthy, degraded, and unhealthy states for the workload.
- We developed a health model based on workload availability and recovery metrics.
- We have availability targets.
- We have recovery targets.
- We implemented a process or technology to inform stakeholders of application health.

**Question: How do you keep the workload simple and efficient?**
- None of the above.
- We clearly abstract domain logic implementation from infrastructure management.
- We have a deliberate goal to keep our workload simple.
- We implement essential capabilities in our workload for all coding efforts.
- We offload cross-cutting services to separate services.
- We utilize platform functionality where appropriate.

**Question: How do you identify and rate the workload's flows?**
- Each flow has a process owner and an escalation path for resolving issues.
- None of the above.
- We assigned a criticality rating to each flow.
- We identify all user and system flows in the workload.
- We know the business impact of each flow.
- We know the business process or processes that each flow supports.
`;
export const performance_questions = `### Performance Efficiency

**Question: How do you optimize data performance?**
- None of the above.
- We cache data when possible.
- We choose the proper level of consistency to optimize performance.
- We compress data to optimize data transit performance and reduce the storage footprint, where applicable.
- We constantly monitor the performance of data stores.
- We implement indexes to improve data access performance.
- We partition data to improve performance.
- We profile data to understand areas that need improvement.
- We store data in close proximity to where it's used.
- We tune and optimize data queries.

**Question: How do you manage scalability and partitioning?**
- None of the above.
- We base scaling on meaningful load metrics and include a buffer.
- We designed the application to be scalable and distribute load.
- We designed the infrastructure to be scalable and distribute load across multiple resources.
- We have a workload partitioning strategy in place, where applicable.
- We regularly test and optimize the partitioning scheme.
- We selected a scaling strategy based on the specific characteristics of the workload.
- We test workload scaling under production-like load.
- We understand service scaling limits and boundaries and take them into account.
- We use autoscaling and configure it to avoid runaway scaling and flapping.

**Question: How do you select the right services?**
- None of the above.
- We choose services based on the performance targets, organizational restrictions, security and compliance requirements, and available team skills.
- We select infrastructure based on the service availability and latency requirements.
- We understand the caching requirements and take them into account during the application design.
- We understand the compute requirements and take them into account when selecting and configuring the workload services.
- We understand the data store requirements and take them into account when selecting and configuring workload services.
- We understand the load balancing requirements and take them into account when selecting and configuring the workload services.
- We understand the networking requirements and take them into account when selecting and configuring the workload services.
- We use platform features instead of custom code where possible.

**Question: How do you collect performance data?**
- None of the above.
- We collect and analyze database and storage performance data.
- We collect metrics and logs for every resource.
- We define retention policies for log and metrics data to enable effective troubleshooting and monitoring.
- We instrument code to gather data about the performance of an application during runtime.
- We monitor network traffic performance.
- We store logs and metrics data separately for each environment.
- We store performance metrics and logs in a central location.

**Question: How do you optimize your operational tasks?**
- None of the above.
- We account for antivirus, intrusion detection, and monitoring agents when considering performance targets.
- We configure monitoring to collect the proper level of information to reduce performance impacts.
- We identify and evaluate the overhead that's associated with the effect of operational tasks.
- We optimize database operational tasks such as backups, schema changes, and monitoring.
- We optimize deployments for the workload.
- We test upgrades to ensure minimal impact on the system's performance.

**Question: How do you conduct performance testing?**
- None of the above.
- We have created performance test scenarios, and the test environment is in place.
- We have decided on the toolset for performance testing.
- We have identified performance test types based on the application's acceptance criteria and performance risks.
- We have well-defined acceptance criteria for the success of performance tests.
- We run performance testing for every change.
- We use performance tests to understand the application's bottlenecks and evaluate acceptance criteria.

**Question: How do you prioritize the performance of critical flows?**
- None of the above.
- We identify all critical flows.
- We identify all workload flows.
- We isolate critical flows, where practical.
- We monitor flow performance metrics.
- We prioritize critical flows when capacity is limited.

**Question: How do you define performance targets?**
- None of the above.
- We continuously evaluate customer feedback to ensure alignment with business expectations.
- We document and expose the performance targets.
- We identified key metrics to measure the workload performance.
- We set targets for the identified performance metrics.
- We understand the performance requirements for the workload.

**Question: How do you enable continuous performance optimization?**
- None of the above.
- We have a culture that promotes continuous performance optimization.
- We periodically address technical debt.
- We proactively address the performance of known deteriorating components.
- We regularly evaluate new platform features.
- We use automation to fix common performance issues.

**Question: How do you optimize the performance of your code and infrastructure?**
- None of the above.
- We optimize code logic.
- We optimize memory management.
- We regularly use concurrency and parallelism to improve performance.
- We review and optimize infrastructure for performance.
- We use connection pooling.

**Question: How do you conduct capacity planning?**
- None of the above.
- We align capacity forecasts with workload objectives.
- We analyze future scenarios and use predictive modeling to forecast future demand.
- We determine resource requirements based on forecast demand.
- We gather capacity data to forecast future demand.
- We understand resource limitations and quotas and take them into account during the capacity planning.

**Question: How do you respond to live performance issues?**
- None of the above.
- We are prepared for live performance issues.
- We have a triage plan.
- We have methods in place to identify and resolve live performance issues.
- We use feedback from live issues to prioritize performance enhancements.
`;
export const operational_excellence_questions = `### Operational Excellence

**Question: How do you optimize software development and quality assurance processes?**
- None of the above.
- We have a standardized branching strategy.
- We have a style guide to standardize writing, reviewing, and documenting code.
- We have a versioning standard for all artifacts.
- We have standards for naming and tagging.
- We perform unit testing early and often throughout the development process.
- We rely on industry-proven tools and solutions to support the entire development lifecycle.
- We strategically incur and address technical debt in our development teams.
- We use metrics to quantify developer effectiveness.

**Question: What is your emergency operations practice?**
- None of the above.
- We established a process for improving the incident response practice.
- We have a containment strategy to remediate issues.
- We have a defined and practiced incident response role accountability plan in place.
- We have a procedure in place to provide root cause analysis (RCA) reports.
- We have clear criteria to decide the severity of an incident.
- We have defined communication and escalation plans for all severities.
- We understand that there can be different sources for incident reports, but our team handles incidents consistently.
- We use agreed-upon tooling for incident-related artifacts and activities.

**Question: How did you design your observability platform?**
- None of the above.
- We collect telemetry or events like logs and metrics.
- We ensure our observability data provides perspective both holistically and at individual flow levels.
- We have created an alerting strategy that focuses on actionable alerts directed to appropriate parties.
- We keep separate data between environments.
- We prefer, where possible, platform services and capabilities for collecting metrics and log information over custom solutions.
- We store observability data with just enough retention and in appropriate geographies.
- We structure the capture of application events.
- We visualize observability data and make it available to stakeholders.

**Question: How do you formalize routine and nonroutine tasks?**
- None of the above.
- We detail responsibilities and provide guidance in our operating procedures for improvised and emergency tasks.
- We follow templates and style guides for any documentation our team creates.
- We have identified and documented guidelines for managing all processes in our workload.
- We have operating procedures that comply with organizational and compliance requirements.
- We have operational instructions that have easily understood checklist items.
- We implement a shift-left ethos to identify areas of improvement.
- We leverage industry-proven practices and processes in our team.
- We understand how to use open-source tools in our workload team.

**Question: How do you use infrastructure as code (IaC)?**
- None of the above.
- We are aware of the lifecycle of cloud provider APIs and IaC providers.
- We have purposefully selected the workload's infrastructure-as-code tooling to provision our infrastructure.
- We manage IaC artifacts like code.
- We prefer declarative instead of imperative scripting approaches.
- We separate our IaC pipelines into layers.
- We use modules only where they add a relevant layer of abstraction.
- We use the same set of scripts and templates to deploy a variety of environments.

**Question: How did you build your workload supply chain?**
- None of the above.
- We deploy repeatable and immutable infrastructure with code.
- We ensure all deployments, to all environments, happen through deployment pipelines.
- We have a standard deployment method to the production environment.
- We have planned for a robust testing strategy that aligns with a shift-left ethos.
- We use different pipelines to make changes.
- We use one set of code assets and artifacts across all environments and pipelines.
- We use quality gates to promote code to higher environments.

**Question: How do you formalize software ideation and planning process?**
- None of the above.
- We communicate proposed changes internally and externally.
- We ensure all work items have clear acceptance criteria.
- We have a standard to define user stories and acceptance criteria.
- We regularly perform internal audits of our development practices via retrospectives.
- We use a collaborative approach to development planning.
- We use established, industry-proven planning processes and tools.
- We use small, iterative deployments.

**Question: How do you foster a DevOps culture?**
- None of the above.
- We allow the workload team to use the services of enablement teams.
- We give the workload team end-to-end responsibility for the workload.
- We have a team culture based on mutual respect and open feedback.
- We have cross-functional teams that learn from each other.
- We integrate all requirements into workload practices.
- We regularly review our operating procedures with the team to identify areas of improvement.

**Question: What safe deployment practices do you use?**
- None of the above.
- We ensure that any and all production changes follow the safe deployment practices.
- We ensure the workload reliably handles data changes.
- We have a defined hotfix strategy that safely addresses urgent releases.
- We reduce risk by deploying small, incremental, and tested changes.
- We rely on health signals to provide go, no-go decisions during rollouts.
- We use progressive exposure techniques for both infrastructure changes and application features.

**Question: What is your approach to design the capability for automation into your workload?**
- Automating operations is a central consideration in our workload design.
- None of the above.
- Our authentication standards allow for automation wherever reasonable.
- The control plane provides supports automation by external tools.
- We automate desired state configuration where appropriate.
- We use bootstrapping where appropriate.
- We use the capabilities provided by the cloud platform for automation where appropriate.

**Question: How do you address deployment failures?**
- None of the above.
- We can quickly identify issues with deployments.
- We conduct post-mortem reviews after failed deployments.
- We have a mitigation strategy for deployment issues.
- We understand mitigation strategies for deployment issues.
- We use a structured communication plan.

**Question: How do you automate tasks that don't need human intervention?**
- None of the above.
- We consider opportunities for automation broadly across the workload and its operations.
- We empower team members by providing self-service through automation.
- We evaluate and use the appropriate automation tool.
- We perform a return on investment (ROI) analysis before selecting tasks for automation.
`;
export const cost_optimization_questions = `### Cost Optimization

**Question: How do you optimize code costs?**
- None of the above.
- We evaluate and optimize data access.
- We evaluate and optimize network traversal.
- We evaluate and optimize software development kits.
- We evaluate and optimize the architecture.
- We evaluate code for opportunities to implement concurrent processing.
- We evaluate the operating system against alternatives.
- We identify and optimize hot paths.
- We instrument code to collect data during runtime.

**Question: How do you optimize data costs?**
- None of the above.
- We configure data replication according to each environment's resiliency requirements.
- We cost optimize storage solutions.
- We have inventoried workload data.
- We limit the amount of data captured and duplicated to what's necessary.
- We optimize backup frequency and storage.
- We prioritize data.
- We use data lifecycle management.

**Question: How do you optimize flow costs?**
- None of the above.
- We evaluate and combine similar flows, where applicable.
- We evaluate and separate dissimilar flows, where applicable.
- We have an inventory of flows.
- We optimize independent flows, where applicable.
- We prioritize flows by value.
- We regularly review flow spending to align flow with spending over time.

**Question: How do you optimize personnel time?**
- None of the above.
- We define the metrics to measure the success of personnel time-optimization efforts.
- We optimize development time.
- We optimize operational tasks.
- We optimize personnel collaboration.
- We optimize personnel skills.
- We optimize processes.

**Question: How do you monitor costs?**
- None of the above.
- We assign a resource owner for each cost item.
- We enable data collection on all resources.
- We generate cost reports.
- We group cost data for easier analysis.
- We regularly review cost reports with stakeholders against the budget and cost model.
- We use and set cost alerts at key spending thresholds.

**Question: How do you govern your spending?**
- None of the above.
- We define access controls to reduce the risk of changes that affect cost optimization.
- We implement release gates on deployments.
- We set resource provisioning alerts for underutilized resources, orphan resources, and underutilized commitment-based plans.
- We use governance policies to provide spending guardrails.
- We use infrastructure as code to standardize deployments.

**Question: How do you get the best rates from providers?**
- None of the above.
- We determine the cost benefits of building or buying solutions, where applicable.
- We evaluate and commit to available discounts.
- We evaluate and determine the right billing model.
- We optimize licensing costs.
- We understand the cost of all workload components.

**Question: How do you optimize resource scaling costs?**
- None of the above.
- We analyze usage data to decide which scale model (scale out vs scale up) is best.
- We implement strategies to reduce demand, where applicable.
- We review strategies to offload demand, where applicable.
- We set and enforce upper limits on resource spending.
- We use and optimize autoscaling.

**Question: How do you perform cost modeling?**
- None of the above.
- We can associate workload costs to specific business metrics.
- We determine cost drivers.
- We have a budget for the workload.
- We have workload estimates.
- We regularly update the cost model.

**Question: How do you align resource usage to billing increments?**
- None of the above.
- We know billing factors and billing increments.
- We map usage to billing increments.
- We modify resource usage to align with billing increments, where applicable.
- We modify services to align usage to billing increments, where applicable.
- We use proof-of-concepts to validate our understanding of billing increments, where applicable.

**Question: How do you optimize the cost of each workload environment?**
- None of the above.
- We cost optimize preproduction environments, where applicable.
- We cost optimize the disaster recovery environment, where applicable.
- We cost optimize the production environment.
- We understand the value of each environment.

**Question: How do you optimize workload component costs?**
- None of the above.
- We avoid introducing unoptimized components.
- We cost optimize workload resources.
- We optimize application features.
- We optimize platform features.

**Question: How do you evaluate resource consolidation?**
- None of the above.
- We evaluate opportunities to offload workload responsibility to external teams, where applicable.
- We evaluate opportunities to use external centralized resources, where applicable.
- We evaluate the workload for internal resource consolidation.
- We understand the general process of consolidation.

**Question: How do you create a culture of financial responsibility?**
- None of the above.
- We communicate financial expectations.
- We encourage a culture of continuous improvement.
- We make budgets and workload costs transparent.
- We train personnel in cost optimization strategies.
`;