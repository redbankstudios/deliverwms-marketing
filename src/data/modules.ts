// Per-module documentation content for /docs and /docs/[slug].
// Slugs and structure mirror the Lovable source site.

export interface Role {
  name: string;
  desc: string;
}

export interface ModuleDoc {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  audiences: string[]; // ['3PL', 'eCom', 'Dist', 'L-Mile']
  whyMatters?: string;
  roles?: Role[];
  overview?: string[]; // paragraphs
  capabilities: string[];
  related?: string[]; // slugs of related modules
}

const R = {
  platform: { name: 'Platform Owner', desc: 'Full system administrator with access to all tenants and configuration.' },
  business: { name: 'Business Owner', desc: 'Manages business operations, billing, and high-level reporting.' },
  manager: { name: 'Warehouse Manager', desc: 'Oversees warehouse floor operations, staff, and inventory accuracy.' },
  employee: { name: 'Warehouse Employee', desc: 'Executes picks, putaways, counts, and other floor tasks.' },
  packer: { name: 'Packer', desc: 'Packs confirmed picks into shipment-ready parcels.' },
  client: { name: 'B2B Client', desc: 'External client with self-service access to inventory, orders, and products.' },
  endCustomer: { name: 'End Customer', desc: 'Tracks order delivery status via a public tracking portal.' },
  driver: { name: 'Driver', desc: 'Delivers orders and confirms proof-of-delivery via mobile app.' },
  dispatcher: { name: 'Dispatcher', desc: 'Assigns drivers to routes and monitors delivery progress in real time.' },
  shipping: { name: 'Shipping Manager', desc: 'Manages outbound logistics, fleet, and delivery scheduling.' },
} satisfies Record<string, Role>;

export const MODULES: ModuleDoc[] = [
  // ============= WAREHOUSE OPERATIONS =============
  {
    slug: 'dashboard',
    name: 'Operations Dashboard',
    tagline: 'Real-time KPIs, volume trends, and the new-tenant completion checklist.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'eCom', 'Dist', 'L-Mile'],
    whyMatters:
      "Operations managers can't afford to dig through five screens before morning standup. The dashboard gives you the pulse of your entire operation — orders behind SLA, inbound arrivals due, and floor utilization — so you know where to focus before your first coffee is cold. For new tenants, a completion checklist surfaces the four onboarding steps that take you from signup to operational.",
    roles: [R.platform, R.business, R.manager],
    overview: [
      'The Operations Dashboard provides a real-time overview of your warehouse performance. It surfaces key metrics like orders processed today, inbound shipments pending, inventory utilization, and task completion rates.',
      "Designed for managers and owners who need a pulse on operations without drilling into individual screens, it consolidates the most critical KPIs into a single view. Trend charts show volume patterns over time, helping you anticipate staffing and capacity needs.",
      "This is the first screen users see after logging in, and it adapts based on the viewer's role — showing warehouse-specific metrics for managers and cross-tenant summaries for platform owners.",
      "For tenants in their first weeks on the platform, a completion card surfaces the four prerequisites — set up billing, add a warehouse, add a client, invite a teammate — and disappears once they're complete.",
    ],
    capabilities: ['Real-time KPI cards', 'Volume trend charts', 'Task completion tracking', 'Role-adaptive content', 'New-tenant completion checklist', 'Quick-action shortcuts'],
    related: ['orders', 'inbound', 'tasks', 'reports'],
  },
  {
    slug: 'inbound',
    name: 'Inbound Receiving',
    tagline: 'Receive shipments with a 6-state pallet lifecycle, scan items, handle exceptions, and trigger putaway.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      'For 3PLs handling multiple clients, accurate receiving is the foundation of trust. Every miscount erodes margin and client confidence. Scan-driven receiving with a fully-tracked pallet lifecycle catches problems at the dock door — not weeks later during a cycle count. Every pallet has a place in the lifecycle and a timestamp at every transition.',
    roles: [R.platform, R.business, R.manager, R.employee],
    overview: [
      'Inbound Receiving is the entry point for all goods arriving at the warehouse. It manages the full lifecycle from shipment scheduling through dock arrival, pallet-level receiving, barcode scanning, exception handling, and putaway task generation.',
      'Each pallet moves through a six-state lifecycle: expected → arrived → receiving → putaway → emptied → removed. Every transition is timestamped, and a daily integrity check verifies that no pallet has drifted into an inconsistent state.',
      'Operators can scan barcodes to identify items or use manual SKU entry mode. The system automatically resolves barcodes against the product catalog and raises exceptions for unknown items, quantity mismatches, or damaged goods. Each scan is recorded as an immutable receiving event.',
      'Once receiving is complete, the system generates putaway tasks that direct workers to move pallets from the staging area to their assigned storage locations based on zone affinity, client preferences, and available capacity.',
    ],
    capabilities: [
      'Shipment scheduling & dock assignment',
      'Barcode scan & manual SKU modes',
      '6-state pallet lifecycle with full timestamping',
      'Exception handling (damage, shortage, unknown)',
      'Pallet-to-inventory junction for cross-checks',
      'Automatic putaway task generation',
      'Receiving session audit trail',
    ],
    related: ['storage', 'inventory', 'tasks', 'variance-review', 'pallet-lifecycle-health'],
  },
  {
    slug: 'storage',
    name: 'Storage Management',
    tagline: 'Monitor zone and rack utilization, manage storage locations, and optimize space.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      'Storage costs are your biggest fixed expense. Knowing which zones are underutilized and which clients are overflowing lets you optimize space allocation before you need to lease a second building. For 3PLs, proper client-zone affinity prevents cross-contamination and simplifies billing.',
    roles: [R.platform, R.business, R.manager],
    overview: [
      'Storage Management gives warehouse managers visibility into how warehouse space is being utilized. It provides zone-by-zone and rack-by-rack breakdowns of capacity, occupancy, and client allocation.',
      'The interface helps identify underutilized areas, fragmented storage patterns, and opportunities to consolidate inventory. It supports the directed putaway workflow by showing which locations are available and which zones have client affinity rules.',
      'Managers can drill into individual racks to see bay and level occupancy, review assigned clients, and plan capacity adjustments ahead of peak seasons.',
    ],
    capabilities: ['Zone & rack utilization heatmaps', 'Client-to-zone affinity tracking', 'Fragmentation scoring', 'Capacity planning views', 'Location-level drill-down'],
    related: ['inbound', 'inventory', 'warehouse-settings'],
  },
  {
    slug: 'inventory',
    name: 'Inventory Management',
    tagline: 'Track SKU-level stock with a ledger-backed audit trail and daily 3-way reconciliation.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      'Inventory accuracy is the difference between profitable fulfillment and costly chargebacks. The ledger-backed model means every unit is accounted for — every receive, every pick, every adjustment — creating an immutable record that clients and auditors can trust. A daily 3-way reconciliation confirms the movement history, per-item quantities, and per-bin balances all agree.',
    roles: [R.platform, R.business, R.manager, R.client],
    overview: [
      'Inventory Management is the central hub for tracking every SKU across the warehouse. It shows current stock levels, locations, client ownership, and status for all inventory items.',
      'Users can filter by client, location, or status to quickly find specific items. The screen supports transfers between locations, quantity adjustments (with audit trail), and low-stock alerting based on configurable minimum thresholds.',
      'All quantity changes flow through an append-only inventory ledger. Every night a 3-way reconciliation confirms the immutable movement history, the per-item quantity, and the per-bin balance all agree. Any drift is surfaced as an exception you see the next morning, not weeks later.',
      'A one-click on-demand self-test lets managers run the same reconciliation any time — useful before a month-end close or after a large adjustment.',
    ],
    capabilities: [
      'SKU-level stock tracking',
      'Multi-client filtering',
      'Location-based views',
      'Transfer & adjustment workflows',
      'Low-stock alerts',
      'Append-only ledger with full audit trail',
      'Daily 3-way reconciliation with exception detection',
      'On-demand integrity self-test',
    ],
    related: ['inbound', 'orders', 'returns', 'variance-review'],
  },
  {
    slug: 'tasks',
    name: 'Task Center',
    tagline: 'Centralized task queue for picks, putaways, counts, and custom warehouse jobs.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      "Floor productivity directly impacts your cost-per-order. The auto-assignment engine eliminates the daily scramble of 'who does what' and ensures high-priority picks are always worked first. Managers see bottlenecks forming in real time instead of discovering them at end-of-shift.",
    roles: [R.platform, R.business, R.manager, R.employee],
    overview: [
      'The Task Center is the operational backbone for warehouse floor workers. It aggregates all pending work — picks, putaways, cycle counts, and custom tasks — into a unified, prioritized queue.',
      'Tasks can be assigned manually by managers or auto-assigned based on zone, skill, and workload. Workers see their personal queue on mobile devices, with clear instructions for each task.',
      'Managers can monitor task progress in real time, reassign blocked work, and identify floor-level bottlenecks before they impact SLA.',
    ],
    capabilities: ['Unified task queue (picks, putaways, counts, custom)', 'Auto-assignment by zone and workload', 'Mobile-friendly worker view', 'Real-time progress tracking', 'Manager reassignment & priority controls'],
    related: ['orders', 'variance-review', 'worker-app'],
  },
  {
    slug: 'variance-review',
    name: 'Count Variance Review',
    tagline: 'Review cycle-count discrepancies, gate adjustments through manager approval, and post to the append-only ledger.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      'Unresolved variances snowball into shrinkage, mis-ships, and client disputes. A structured review queue with a manager approval gate ensures every discrepancy gets a decision — approve, reject, or recount — with a full audit trail. For 3PLs, this is your defense against inventory claims.',
    roles: [R.platform, R.manager],
    overview: [
      'The Count Variance Review screen is where warehouse managers resolve discrepancies found during cycle counts. When a counted quantity differs from the expected system quantity, it creates a variance record that requires managerial review before any ledger adjustment can post.',
      'Managers can approve adjustments (which post to the inventory ledger as an explicit additional entry, never an overwrite), reject them (triggering a recount), or add notes for investigation. Every decision is recorded with timestamps, user attribution, and reason codes for full audit compliance.',
      'The approval gate is the discipline that prevents silent inventory corrections. Combined with the append-only ledger, this screen is the spine of inventory accuracy.',
    ],
    capabilities: ['Pending variance queue with severity sorting', 'Per-bin recount workflow', 'Reject / recount / approve gate', 'Append-only adjustment audit trail', 'Reason code categorization', 'Per-decision actor + timestamp record'],
    related: ['inventory', 'tasks'],
  },
  {
    slug: 'packaging',
    name: 'Packaging Management',
    tagline: 'Smart box catalog with on-hand counts, cost tracking, and packing recommendations.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'eCom'],
    whyMatters:
      "Dimensional weight charges from carriers can quietly inflate shipping costs by 20-30%. The smart packaging engine picks the smallest box that safely fits — every time, on every order — so you stop paying for shipped air. Packers don't need to memorize a box chart; the system already knows.",
    roles: [R.platform, R.manager, R.packer],
    overview: [
      "Packaging Management is the catalog of shipping boxes available at each warehouse, with on-hand counts, dimensions, weight limits, and active status. Packers and managers see at a glance what's stocked, what's running low, and which boxes are approved for use.",
      'The smart packing engine uses this catalog to auto-select the optimal box for each pack task: it scores candidates based on product dimensions, total weight, and dimensional efficiency, then recommends the best fit to the packer.',
      'Reorder alerts surface when on-hand counts drop below threshold, so you keep the shelf stocked without manual checking.',
    ],
    capabilities: ['Box & material catalog', 'On-hand inventory of packaging', 'Cost-per-pack tracking', 'Recommended box sizing', 'Reorder alerts'],
    related: ['orders', 'inventory'],
  },
  {
    slug: 'warehouse-settings',
    name: 'Warehouse Settings',
    tagline: 'Per-warehouse configuration: facility profile, zones, racks, and operational preferences.',
    category: 'Warehouse Operations',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      "The system's intelligence is only as good as your warehouse model. Spending an hour up-front to define zones, racks, and client affinity rules means putaway tasks route correctly, storage allocation respects client preferences, and picks follow efficient paths. Skipping this step turns smart automation into chaos.",
    roles: [R.platform, R.business, R.manager],
    overview: [
      'Warehouse Settings is the per-warehouse configuration screen where managers define the physical and operational structure of each facility. The General tab handles the facility profile — name, contact, phone, address — and persists every field to the right record. A read-only billing summary surfaces the current tenant plan with a direct link to Account Management.',
      'The Zones and Racks tabs define the physical structure: zone layouts, rack-bay-level hierarchy, dock door assignments, capacity defaults, and client affinity rules. This configuration drives every automated decision the system makes about putaway, storage allocation, picking sequences, and dock scheduling.',
      'Multi-warehouse tenants can configure each location independently — different zone layouts, different client affinities, different operational hours — and the system respects each warehouse\'s rules.',
      'Team management lives in its own Employees screen; the Settings → Users entry redirects there with context. Integrations placeholders are hidden until real integrations exist.',
    ],
    capabilities: [
      'Facility profile (name, contact, phone, address) with full persistence',
      'Read-only billing summary with deep link to Account Management',
      'Zone, rack, bay, and level layout',
      'Client-to-zone affinity rules',
      'Operational hour configuration',
      'Multi-warehouse tenant support',
    ],
    related: ['storage', 'tenants', 'employees'],
  },
  {
    slug: 'pallet-lifecycle-health',
    name: 'Pallet Lifecycle Health',
    tagline: 'Platform-owner integrity dashboard for the inbound pallet lifecycle with daily exception detection.',
    category: 'Warehouse Operations',
    audiences: ['3PL'],
    whyMatters:
      "If pallets drift between lifecycle states without their corresponding inventory movements, billing and storage reporting silently degrade. The Pallet Lifecycle Health screen runs eleven independent assertions every night and surfaces any pallet that's out of step. You see drift the day it happens, not weeks later when a client questions a storage charge.",
    roles: [R.platform],
    overview: [
      "Pallet Lifecycle Health is a platform-owner integrity dashboard that runs eleven independent assertions against the inbound pallet lifecycle every night. It checks that pallets in 'receiving' have receiving events, that 'putaway' pallets have putaway timestamps, that 'emptied' pallets have zero inventory balances, and so on across the full state machine.",
      'Any discrepancy creates an exception record with the specific pallet, the failed assertion, the most likely cause, and a one-click jump to the underlying records. Exceptions auto-resolve when the underlying data corrects itself, so the queue only shows live issues.',
      'For platform owners running multi-tenant operations, this is the cheap insurance against silent operational drift — surfaced before it becomes a billing dispute.',
    ],
    capabilities: ['Eleven independent lifecycle assertions', 'Daily automatic execution', 'Auto-resolve when underlying data corrects', 'One-click drill-down to underlying records', 'Mark-removed action with mandatory reason capture'],
    related: ['inbound', 'inventory', 'variance-review'],
  },

  // ============= ORDER & FULFILLMENT =============
  {
    slug: 'orders',
    name: 'Order Management',
    tagline: 'Create, allocate, pick, pack, and ship customer orders with full lifecycle tracking.',
    category: 'Order & Fulfillment',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      "eCommerce brands need sub-24hr fulfillment. The allocation engine reserves stock the moment an order lands, preventing overselling. For 3PLs managing multiple clients, order isolation ensures one client's rush orders don't cannibalize another's inventory. Smart routing eliminates the daily question of 'which orders go on trucks vs. carrier?' — the system decides automatically.",
    roles: [R.platform, R.business, R.manager, R.client],
    overview: [
      'Order Management handles the complete lifecycle of customer orders — from creation through allocation, picking, packing, shipping, and delivery. It supports both manual order entry and integration-sourced orders.',
      'The allocation engine checks available inventory and routes orders to the appropriate warehouse and carrier flow automatically. Once allocated, the system generates pick tasks and pushes them into the Task Center for floor workers.',
      "Every status change — created, allocated, picked, packed, shipped, delivered — is captured as an event with timestamp and user attribution, so you always have a complete audit trail of what happened and when.",
    ],
    capabilities: ['Order intake (manual, API, CSV)', 'Allocation & reservation', 'Pick / pack / ship workflows', 'Carrier label generation', 'Order lifecycle audit trail'],
    related: ['auto-allocate', 'partial-order-splitting', 'tasks', 'returns'],
  },
  {
    slug: 'returns',
    name: 'Returns Dashboard',
    tagline: 'Process returns, inspect items, set disposition, and update inventory + billing in one step.',
    category: 'Order & Fulfillment',
    audiences: ['3PL', 'eCom'],
    whyMatters:
      'Returns are expensive — but untracked returns are devastating. Disposition-aware processing ensures restockable items get back to available inventory fast, while damaged goods are quarantined before they ship again. Reason-code analytics help identify root causes like packaging issues or wrong-item picks.',
    roles: [R.platform, R.business, R.manager],
    overview: [
      'The Returns Dashboard manages the reverse logistics flow — processing returned goods, inspecting condition, determining disposition, and restocking eligible inventory.',
      'Each return is linked to its original order for traceability. Workers inspect returned items and assign dispositions: restock, quarantine, damage-out, or return-to-vendor. Restocked items flow back through the inventory ledger to update available quantities immediately.',
      'Reason-code analytics roll up across returns to surface patterns — a sudden spike in a specific damage code might point to a packaging issue worth fixing upstream.',
    ],
    capabilities: ['Returns intake with photo capture', 'Per-item disposition (restock, damage, write-off)', 'Automatic ledger updates', 'Client-visible status with timestamps', 'Billable disposition events'],
    related: ['orders', 'inventory', 'b2b-outbound'],
  },
  {
    slug: 'auto-allocate',
    name: 'Auto-Allocation Engine',
    tagline: 'One-click inventory allocation that respects multi-warehouse rules and client affinity.',
    category: 'Order & Fulfillment',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      "Manual allocation is slow, error-prone, and doesn't scale. The auto-allocation engine turns a multi-step process into one click — verify stock, reserve it, and generate picks — all in a single atomic operation. For high-volume warehouses, this eliminates the allocation bottleneck that delays fulfillment start times.",
    roles: [R.platform, R.business, R.manager],
    overview: [
      'The Auto-Allocation Engine handles one-click inventory reservation for pending orders. When triggered, it checks available stock for every line item on the order, creates inventory reservations against specific SKU locations, and generates pick tasks for warehouse workers.',
      'The allocation process verifies available quantity (on-hand minus already-reserved) before committing. If all lines can be fully allocated, the order advances to picking. If not, partial-order splitting kicks in to peel off the fulfillable lines while backordering the rest.',
      'Multi-warehouse logic ranks locations by distance and stock depth, splitting across sites only when no single warehouse can fill the order.',
    ],
    capabilities: ['Distance-ranked warehouse allocation', 'Haversine geo math for stop assignment', 'Multi-warehouse split-shipment fallback', 'Primary-warehouse-wins tie-break', 'Stockout event logging'],
    related: ['orders', 'partial-order-splitting', 'inventory'],
  },
  {
    slug: 'partial-order-splitting',
    name: 'Partial Order Splitting',
    tagline: 'Automatically splits orders when inventory is spread across multiple warehouses.',
    category: 'Order & Fulfillment',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      "A single out-of-stock SKU shouldn't hold up an entire order. Partial splitting means you ship what you can today and backorder the rest — maximizing fulfillment velocity and customer satisfaction. The linked badge keeps operators aware of the relationship so nothing falls through the cracks.",
    roles: [R.platform, R.business, R.manager],
    overview: [
      "Partial Order Splitting ensures that inventory shortages don't block fulfillable lines. When auto-allocation detects that some order lines have sufficient stock but others don't, it automatically splits the order into two linked orders.",
      "The original order keeps the lines that can be fully allocated and advances to 'picking' status with reservations and pick tasks generated. A new backorder is created containing the shorted lines, linked to the original via a parent-child relationship.",
      'Operators see a linked-order badge on both records so the relationship is always visible from either side.',
    ],
    capabilities: ['Cross-warehouse split detection', 'Reservation per split shipment', 'Consolidated tracking under parent order', 'Per-split label generation', 'Customer-friendly tracking page'],
    related: ['auto-allocate', 'orders', 'tracking'],
  },

  // ============= DISPATCH & LAST-MILE =============
  {
    slug: 'fleet',
    name: 'Fleet Management',
    tagline: 'Manage vehicles, assign drivers, and track capacity utilization.',
    category: 'Dispatch & Last-Mile',
    audiences: ['3PL', 'L-Mile'],
    whyMatters:
      'A single vehicle breakdown can cascade into dozens of missed deliveries. Fleet management ensures you know which vehicles are available, which need maintenance, and whether you have enough capacity for tomorrow\'s routes before the day starts.',
    roles: [R.platform, R.business, R.shipping],
    overview: [
      'Fleet Management provides visibility into your delivery vehicle inventory. It tracks vehicle details, capacity, maintenance status, and driver assignments.',
      'Shipping managers use this screen to ensure adequate vehicle availability for upcoming routes, manage vehicle-driver pairings, and monitor fleet utilization over time.',
    ],
    capabilities: ['Vehicle records & capacity', 'Driver-to-vehicle assignment', 'Maintenance tracking', 'Utilization metrics', 'Multi-warehouse fleet support'],
    related: ['drivers', 'dispatch-queue', 'routes'],
  },
  {
    slug: 'dispatcher',
    name: 'Dispatcher Console',
    tagline: 'Live route monitoring, exception handling, and real-time driver communication.',
    category: 'Dispatch & Last-Mile',
    audiences: ['3PL', 'L-Mile'],
    whyMatters:
      'Last-mile companies live and die by on-time delivery. Real-time exception alerts let dispatchers intervene before a missed window becomes a failed delivery. The ability to message drivers and reassign stops on the fly turns potential failures into recoveries.',
    roles: [R.platform, R.shipping, R.dispatcher],
    overview: [
      'The Dispatcher Console is a real-time command center for monitoring active deliveries. It combines live map tracking, route exception alerts, and driver messaging into a single operational view.',
      'Dispatchers can see all active routes on a map, drill into individual stops, communicate with drivers, and handle exceptions like failed deliveries or customer no-shows. The console surfaces the most urgent issues first so dispatchers can triage effectively.',
    ],
    capabilities: ['Live map with driver positions', 'Active route status', 'Exception triage & resolution', 'In-app driver messaging', 'ETA monitoring'],
    related: ['routes', 'dispatch-queue', 'driver-app'],
  },
  {
    slug: 'routes',
    name: 'Route Board',
    tagline: 'Plan and visualize delivery routes, manage stop sequences, and assign drivers.',
    category: 'Dispatch & Last-Mile',
    audiences: ['3PL', 'L-Mile'],
    whyMatters:
      'Well-planned routes reduce fuel costs, improve delivery density, and keep drivers within their time windows. The route board gives planners a visual canvas to build efficient sequences and catch problems — like overweight vehicles or impossible time windows — before dispatch.',
    roles: [R.platform, R.shipping, R.dispatcher],
    overview: [
      'The Route Board is used to plan and visualize delivery routes before dispatch. It shows all routes for a given shift, their assigned drivers, stop sequences, and progress status.',
      'Route planners can create new routes, add or reorder stops, assign drivers and vehicles, and review estimated completion times. Once finalized, routes are pushed to the Dispatch Queue for execution.',
    ],
    capabilities: ['Drag-and-drop stop sequencing', 'Auto-route construction', 'Capacity-aware route planning', 'Driver assignment', 'Route templates for recurring runs'],
    related: ['dispatch-queue', 'dispatcher', 'fleet'],
  },
  {
    slug: 'dispatch-queue',
    name: 'Dispatch Queue',
    tagline: 'Assign packed orders to routes, drivers, and dispatch waves.',
    category: 'Dispatch & Last-Mile',
    audiences: ['3PL', 'L-Mile'],
    whyMatters:
      "The gap between 'packed' and 'on the truck' is where deliveries stall. The dispatch queue closes that gap by giving shipping managers a clear view of everything ready to go, with tools to batch-assign orders to routes and vehicles efficiently. Carrier orders are filtered out automatically so dispatchers focus only on fleet deliveries.",
    roles: [R.platform, R.business, R.shipping, R.dispatcher],
    overview: [
      'The Dispatch Queue is the bridge between the warehouse and the road. It lists all packed orders ready for outbound delivery, allowing shipping managers to assign them to routes, drivers, and vehicles.',
      'Orders in the queue can be filtered by priority, destination zone, and weight. Batch assignment tools help dispatchers move large groups of orders to routes in one operation, dramatically reducing the time spent on manual sequencing.',
    ],
    capabilities: ['Packed-order queue', 'Route + driver assignment', 'Wave batching', 'Priority and SLA sorting', 'Auto-dispatch rules'],
    related: ['routes', 'dispatcher', 'orders'],
  },
  {
    slug: 'drivers',
    name: 'Drivers Management',
    tagline: 'Add, edit, and manage drivers and delivery personnel.',
    category: 'Dispatch & Last-Mile',
    audiences: ['3PL', 'L-Mile'],
    whyMatters:
      "Driver capacity planning starts with knowing who's available and what they can handle. Zone assignments ensure local knowledge is used effectively, while max stop limits prevent overloading drivers and degrading delivery quality.",
    roles: [R.platform, R.business, R.shipping],
    overview: [
      'Drivers Management is the administrative screen for maintaining the driver roster. It supports adding new drivers, editing contact details, setting max stop limits, and assigning default delivery zones.',
      'Managers can also track driver status (active, on-leave, terminated) and view historical performance data.',
    ],
    capabilities: ['Driver records & credentials', 'Vehicle assignment', 'Performance metrics', 'Schedule & availability', 'Mobile driver-app onboarding'],
    related: ['fleet', 'driver-app', 'dispatcher'],
  },

  // ============= MOBILE APPS =============
  {
    slug: 'driver-app',
    name: 'Driver App',
    tagline: 'Mobile-optimized stop list, delivery confirmation, photo POD, and exception capture.',
    category: 'Mobile Apps',
    audiences: ['3PL', 'L-Mile'],
    whyMatters:
      "Drivers shouldn't need training to use your software. The mobile app gives them one clear task at a time — go here, deliver this, capture proof. Failed deliveries require notes so dispatchers have context, and offline mode keeps things moving even in spotty coverage areas.",
    roles: [R.platform, R.driver],
    overview: [
      "The Driver App is a mobile-optimized interface designed for delivery drivers in the field. It presents the day's stop list in sequence, provides navigation integration, and supports delivery confirmation with proof-of-delivery capture.",
      'Drivers can mark stops as delivered, failed, or skipped, with mandatory notes for non-delivery events. The app works in low-connectivity environments with offline-capable workflows.',
    ],
    capabilities: ['Optimized stop list with map view', 'Photo + signature proof of delivery', 'Exception capture with GPS', 'Live ETA broadcasts', 'Offline mode with queued sync'],
    related: ['dispatcher', 'routes', 'tracking'],
  },
  {
    slug: 'worker-app',
    name: 'Worker App',
    tagline: 'Simplified mobile interface for warehouse workers — picks, putaways, counts.',
    category: 'Mobile Apps',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      "Warehouse worker turnover is high, which means training time matters. The worker app is designed for zero learning curve — scan, confirm, move. Barcode verification prevents mispicks, and the single-task view keeps workers focused instead of overwhelmed. Pack tasks with integrated label generation mean packers never leave the app to create or print shipping labels.",
    roles: [R.platform, R.employee, R.packer],
    overview: [
      'The Worker App is a simplified mobile interface for warehouse floor workers. It presents assigned tasks one at a time with clear instructions — what to pick, where to go, how much to move.',
      'Designed for speed and minimal training, it supports barcode scanning for location and item verification, quantity confirmation, and task completion reporting.',
      'The app includes full pack task support with integrated label generation — packers complete pick, pack, and ship-label steps without leaving the mobile interface.',
    ],
    capabilities: ['Personal task queue', 'Barcode scanning', 'Step-by-step task guidance', 'Exception reporting', 'Offline tolerance for slow zones'],
    related: ['tasks', 'inbound', 'orders'],
  },

  // ============= MULTI-TENANT & CLIENT =============
  {
    slug: 'b2b-dashboard',
    name: 'Business Dashboard',
    tagline: 'Self-service dashboard for B2B clients with real-time inventory, order, and shipment KPIs.',
    category: 'Multi-tenant & Client',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      "3PL clients want transparency without phone calls. The self-service dashboard eliminates 'what's my inventory?' emails and builds trust through real-time visibility. KPIs surface the metrics that matter for each client — open orders, in-transit shipments, total units on hand, last-30-day order count — scoped strictly to their own data.",
    roles: [R.client, R.platform],
    overview: [
      'The Business Dashboard gives B2B clients self-service visibility into their inventory and order status within the warehouse. Live StatCards show open orders, in-transit shipments, total inventory units, and last-30-day order count, refreshing on every page load.',
      'Clients can drill into recent activity, jump to their inventory or orders views, and see at-a-glance whether anything in their operation needs attention.',
      'Data is scoped to the calling client tenant by row-level security at the database, so the same dashboard shape serves every client and never leaks across tenants.',
    ],
    capabilities: ['Real-data KPI cards (open orders, in-transit, units, last-30-day)', 'Inventory at a glance', 'Recent activity feed', 'Quick links to portal tools', 'Database-enforced data isolation'],
    related: ['b2b-outbound', 'b2b-products', 'b2b-reports', 'b2b-billing'],
  },
  {
    slug: 'b2b-outbound',
    name: 'Business Outbound',
    tagline: 'Submit outbound shipment requests atomically, with database-level transactional safety.',
    category: 'Multi-tenant & Client',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      'Manual order intake via email and phone is slow and error-prone. Self-service outbound requests let clients submit orders on their schedule. Database-level transactional safety means a partially-created order is impossible — either every record commits or none do — so the dispatcher queue is never corrupted by half-finished submissions.',
    roles: [R.client, R.platform],
    overview: [
      'Business Outbound lets B2B clients submit outbound shipment requests directly through the portal. They specify items, quantities, and delivery details, then track the fulfillment progress as the warehouse processes their request.',
      'The submission is wrapped in a database-level transaction so all the writes — the order record, line items, reservations, and shipment record — happen atomically. There is no path for a half-finished order to land in the dispatcher\'s queue if any write fails mid-flight.',
      'The request lands in the operator\'s dispatch queue with the client and requested items already filled in. The client sees status updates as the operator confirms, schedules, or pushes back.',
    ],
    capabilities: ['Outbound order submission', 'Address + service-level selection', 'Atomic multi-table writes (transactional safety)', 'Live shipment status', 'Tracking link sharing', 'Cancellation requests'],
    related: ['b2b-dashboard', 'orders', 'tracking'],
  },
  {
    slug: 'b2b-products',
    name: 'Business Products',
    tagline: 'Manage product catalog, SKUs, and item details from the client portal.',
    category: 'Multi-tenant & Client',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      'Inaccurate product data causes cascading problems — wrong storage allocation, incorrect pick weights, and shipping cost overruns. Letting clients own their product data ensures accuracy at the source and reduces the back-and-forth between 3PL ops and client teams.',
    roles: [R.client, R.platform],
    overview: [
      'Business Products lets B2B clients manage their product catalog within the system. They can view and update SKU details, dimensions, weights, and other item attributes that the warehouse uses for storage and fulfillment.',
      'Keeping product data current helps ensure accurate receiving, storage allocation, and order fulfillment.',
    ],
    capabilities: ['Product catalog management', 'SKU details & barcodes', 'Per-product images & descriptions', 'Bulk import via CSV', 'Audit trail of catalog changes'],
    related: ['inventory', 'b2b-dashboard'],
  },
  {
    slug: 'b2b-billing',
    name: 'Business Billing (client portal)',
    tagline: 'Clients see their own invoices, line items, payment status, and dispute conversations.',
    category: 'Multi-tenant & Client',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      "Most of a 3PL's inbound billing email is 'what do I owe you?' and 'what is this charge?' The client billing page makes both questions self-service. Clients answer their own questions from the data, your team stops being a switchboard, and your account managers go back to strategic work.",
    roles: [R.client, R.platform],
    overview: [
      "Business Billing inside the client portal is the full billing surface a client sees for their own account. Stat cards summarize total outstanding, paid year-to-date, and disputed invoice count. A filterable invoice table lists every invoice with sortable columns for date, due date, status, and amount.",
      'Inline drilldown on any invoice expands the line items — each one traced back to the underlying operational event (the stop, the storage day, the pick, the label) so the client can see exactly what they are being charged for. Payment metadata, the reminder timeline, and any dispute conversation are all visible.',
      'Operator-internal notes (the disposition notes your team writes when resolving a dispute) are excluded from the client view at the data query layer — so there is no path for a future bug to leak them. Clients see the conversation that involves them; they do not see your team\'s internal handling notes.',
    ],
    capabilities: [
      'Stat cards: total outstanding, paid YTD, disputed count',
      'Filterable, sortable invoice table',
      'Inline invoice drilldown with line items',
      'Payment metadata visibility',
      'Reminder timeline per invoice',
      'Client-visible dispute conversation',
      'Operator-internal notes excluded at query layer',
    ],
    related: ['b2b-dashboard', 'b2b-reports', 'billing'],
  },
  {
    slug: 'tracking',
    name: 'Tracking Portal',
    tagline: 'End-customer order tracking with real-time status and ETA.',
    category: 'Multi-tenant & Client',
    audiences: ['3PL', 'eCom', 'L-Mile'],
    whyMatters:
      "Every 'where's my order?' call costs time and money. A self-service tracking portal deflects support volume and gives end customers the instant answer they expect from modern delivery experiences.",
    roles: [R.platform, R.endCustomer],
    overview: [
      'The Tracking Portal is a public-facing page where end customers can check the real-time status of their deliveries. By entering a tracking number or order ID, customers see delivery progress, estimated arrival, and driver location.',
      'This self-service portal reduces inbound support calls and improves the end-customer experience.',
    ],
    capabilities: ['Public tracking link per order', 'Live status updates', 'ETA broadcast from driver app', 'Branded experience per tenant', 'No login required for end customers'],
    related: ['orders', 'driver-app', 'b2b-outbound'],
  },

  // ============= REPORTS & BILLING =============
  {
    slug: 'reports',
    name: 'Operational Reports',
    tagline: 'Hub for warehouse analytics — throughput, AR aging, revenue by customer, and order trends.',
    category: 'Reports & Billing',
    audiences: ['3PL', 'eCom', 'Dist', 'L-Mile'],
    whyMatters:
      "You can't improve what you don't measure. The reports surface gives managers throughput data to justify headcount, AR aging to prioritize collections, revenue-by-customer breakdowns for business reviews, and SLA dashboards to demonstrate service quality.",
    roles: [R.platform, R.business, R.manager],
    overview: [
      'The Reports area is the analytics hub for the operator surface. It groups every operational and financial report under one navigation entry: Throughput, AR Aging, Revenue by Customer, Order Reports, and the underlying Business Billing summary.',
      'Each report has its own focused page with filters, date ranges, and exports tailored to what that report needs. The hub itself provides the entry point and surfaces the most commonly viewed report on landing.',
    ],
    capabilities: ['Navigation to all operator-side reports', 'Day/week granularity toggle on time-series reports', 'Date-range filters shared across reports', 'Exportable PDF & CSV'],
    related: ['throughput-reports', 'ar-aging', 'revenue-reports', 'order-reports'],
  },
  {
    slug: 'throughput-reports',
    name: 'Throughput Report',
    tagline: 'Orders shipped, pallets received, picks, packs, and cycle-time charts with day/week granularity.',
    category: 'Reports & Billing',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      "Most operators have a hand-wavy sense of 'we ship same-day or next-day for most orders' and a much vaguer sense of how often that breaks down. Real throughput data — with both median and p90 cycle-time lines — tells you the truth: how slow the slowest 10% of your orders are, and whether that's trending up or down. That's the number that shapes your reputation.",
    roles: [R.platform, R.business, R.manager],
    overview: [
      'The Throughput Report shows what is actually happening on the floor across configurable date ranges. Four count charts cover orders shipped per period, pallets received, picks completed, and packs completed. A fifth chart shows cycle time — orders shipped vs orders created — with both p50 (median) and p90 (slow tail) plotted as lines.',
      'A strip of stat cards above the charts summarizes range totals plus the latest p50 and p90 cycle times.',
      'The day/week granularity toggle is a shared primitive that appears on every time-series report. Range filters use the same shared component as the rest of the reports area.',
    ],
    capabilities: ['Orders shipped per period chart', 'Pallets received per period chart', 'Picks completed per period chart', 'Packs completed per period chart', 'p50 + p90 cycle-time chart', 'Range total stat cards', 'Day / Week granularity toggle', 'Date-range filter'],
    related: ['reports', 'orders', 'inbound'],
  },
  {
    slug: 'ar-aging',
    name: 'AR Aging Report',
    tagline: 'Operator view of every customer\'s open invoices bucketed by age, with backdating and drilldown.',
    category: 'Reports & Billing',
    audiences: ['3PL'],
    whyMatters:
      "If you're chasing collections by gut feel today, AR Aging tells you exactly which accounts to call first. Backdate it to any past date and the report shows what your AR looked like that day — useful when reconciling against a client's month-end statement. Disputed invoices get their own column because disputed AR is not aged AR.",
    roles: [R.platform, R.business],
    overview: [
      "The AR Aging report shows every customer's open AR bucketed into 0-30 days, 31-60, 61-90, 90+, and a separate column for disputed invoices. Click any row to drill into the underlying invoices that make up the balance.",
      "The 'as of' date defaults to today but can be backdated to any past date. The report computes correctly for the chosen date: invoices that were sent but not yet paid as of that date, in the buckets they would have been in. Useful for matching the report against client month-end snapshots.",
      "Disputed invoices live in their own column, separate from the aging buckets. Disputed AR is frozen pending resolution, not aged — collapsing the two hides the fact that some of your 90+ balance is stuck in conversation rather than unpaid.",
    ],
    capabilities: ["'As of' date picker with backdating", '0-30 / 31-60 / 61-90 / 90+ aging buckets', 'Separate disputed-invoice column', 'Per-customer row totals', 'Invoice-level drilldown', 'Operator-only (clients see the AR view in b2b-reports)'],
    related: ['reports', 'billing', 'b2b-reports'],
  },
  {
    slug: 'revenue-reports',
    name: 'Revenue by Customer',
    tagline: 'Per-customer revenue slicing over any date range, with sort, filter, and clean export.',
    category: 'Reports & Billing',
    audiences: ['3PL'],
    whyMatters:
      "The report you pull up when a client asks for a quarterly summary, or when you're deciding which accounts are actually carrying your operation. Revenue by Customer tells you the truth about who's profitable and who's a logo on the wall.",
    roles: [R.platform, R.business],
    overview: [
      'Revenue by Customer slices your platform revenue by client tenant over any date range. Sort by total revenue, filter by activity status, and export to CSV or PDF for board decks and business reviews.',
      'The same date-range filter primitive used across the reports area drives the time scope. The report computes from the same operational ledger that drives invoicing, so the numbers tie out exactly with what you billed.',
    ],
    capabilities: ['Per-customer revenue rollup', 'Configurable date-range filter', 'Sort by revenue, name, or activity', 'Active / inactive client filter', 'PDF + CSV export'],
    related: ['reports', 'billing', 'platform-billing'],
  },
  {
    slug: 'order-reports',
    name: 'Order Reports',
    tagline: 'Daily order volume trends and vendor-level breakdowns.',
    category: 'Reports & Billing',
    audiences: ['3PL', 'eCom', 'Dist'],
    whyMatters:
      'Understanding demand patterns lets you staff proactively instead of reactively. Vendor-level breakdowns reveal which clients are growing (and need more space) and which are declining (freeing capacity for new business). Per-order shipping costs help identify carrier optimization opportunities.',
    roles: [R.platform, R.business, R.manager],
    overview: [
      'Order Reports focuses specifically on order volume analysis. It shows daily order trends, vendor-level breakdowns, fulfillment rate tracking, and per-order shipping cost data to help managers understand demand patterns and carrier spend.',
      'This data supports capacity planning, shipping cost optimization, and helps identify clients or product categories driving volume changes.',
    ],
    capabilities: ['Order volume by day, week, month', 'Vendor / client splits', 'SLA performance per channel', 'Source-of-order analysis', 'Drill-down to individual orders'],
    related: ['reports', 'orders', 'throughput-reports'],
  },
  {
    slug: 'b2b-reports',
    name: 'Business Reports (client portal)',
    tagline: 'Client-facing AR aging view, scoped strictly to the client\'s own invoices.',
    category: 'Reports & Billing',
    audiences: ['3PL', 'Dist'],
    whyMatters:
      "Clients reconciling their own AP want to see their open balance with you on their schedule, not on yours. The client-facing AR aging surface lets them check their own buckets, drill into invoices, and answer their own questions about what they owe. Most operators see a 60-70% reduction in 'what do I owe' email volume after this lands.",
    roles: [R.client, R.platform],
    overview: [
      'The Business Reports surface inside the client portal currently focuses on AR aging — the most-asked client question. Each client sees their own open invoices bucketed by age (0-30, 31-60, 61-90, 90+) and a separate column for any disputed invoices, all scoped strictly to their own data.',
      'Drill into any bucket to see the underlying invoices. Drill into any invoice to see line items, payment status, and dispute information (handled by the Business Billing page).',
      'Operator-side access to the same view is provided through an operator-mode banner — useful for support and during business reviews.',
    ],
    capabilities: ['Client-scoped AR aging', '0-30 / 31-60 / 61-90 / 90+ buckets', 'Disputed-invoice column', 'Invoice-level drilldown', 'Operator-mode banner for non-client roles', 'Database-enforced data isolation'],
    related: ['b2b-dashboard', 'b2b-billing', 'ar-aging'],
  },
  {
    slug: 'billing',
    name: 'Business Billing',
    tagline: 'Full invoice lifecycle, AR aging, automated reminders, dispute workflow, and event-level audit trail.',
    category: 'Reports & Billing',
    audiences: ['3PL'],
    whyMatters:
      "For 3PLs, billing transparency prevents disputes and builds long-term client relationships. Every billable event is captured the moment it happens — every stop, every label, every storage day — and assembled into invoices you can defend line by line. Automated reminders chase overdue invoices for you. The full invoice lifecycle (draft → sent → paid → disputed → resolved → void/cancelled) is gated by UI, API, and database constraints in lockstep.",
    roles: [R.platform, R.business],
    overview: [
      'Business Billing is the financial command center for the operator. It manages invoice generation, the full invoice lifecycle, automated reminders, dispute handling, payment tracking, and per-client rate configuration.',
      'Every invoice has a real due date computed from net terms (overridable per client, defaults to 30 days). The lifecycle gates are enforced three independent ways: the UI prevents wrong actions from being clickable, the API rejects invalid actions, and database constraints reject inconsistent states. Cancel and void actions require a non-empty reason, captured in the audit trail.',
      'The Invoices tab provides a unified surface for viewing, filtering, and acting on every invoice the operator has issued. Tabs cover all invoices, sent, overdue, disputed, resolved, void, and cancelled, with bulk and per-invoice actions.',
      'Invoice Reminders automate the polite-but-firm follow-up to clients with overdue invoices. Set a schedule once (typical: three days before due, on due date, and seven days past due) and the system sends each reminder automatically. The full reminder timeline is captured against each invoice and visible in both the operator UI and the client portal.',
      'Per-client rate cards use a versioned-row pattern: rate changes create new rows, the previous rate is preserved with its effective-to timestamp, and invoices generated from historical events use the rate that was in effect at the moment of the event — not the current rate.',
    ],
    capabilities: [
      'Per-client rate card management with versioned history',
      'Full invoice lifecycle (draft → sent → paid → overdue → disputed → resolved → void/cancelled)',
      'Three-layer defense (UI gating + API guards + DB constraints) on every transition',
      'Due-date infrastructure with per-business net-terms override',
      'AR aging integration',
      'Automated invoice reminders with configurable schedule',
      'Reminder history captured per invoice',
      'Dispute workflow with reason capture and resolution disposition',
      'Cancel / void actions with mandatory reason',
      'Margin markup on labels',
      'Exportable PDF invoices with event-level breakdown',
    ],
    related: ['ar-aging', 'revenue-reports', 'b2b-billing', 'platform-billing'],
  },
  {
    slug: 'platform-billing',
    name: 'Platform Billing',
    tagline: 'Cross-tenant revenue dashboard showing usage across every tenant.',
    category: 'Reports & Billing',
    audiences: ['3PL'],
    whyMatters:
      'Running a multi-tenant warehouse platform without an aggregate revenue view is like running a restaurant without a register. Platform Billing tells you which tenants are growing, which are at risk, and what the total business looks like — so commercial conversations are grounded in the actual numbers, not gut feel.',
    roles: [R.platform],
    overview: [
      "Platform Billing is the platform owner's revenue dashboard — an aggregate view of usage-based billing across every tenant on the platform. It shows total monthly recurring revenue, per-tenant breakdowns, billable event counts (deliveries, carrier labels), and trend lines over time.",
      'Unlike the per-tenant Business Billing screen, this view rolls up everything into a single cross-tenant picture, helping platform owners forecast revenue, identify top-spending accounts, and spot tenants whose usage growth justifies an account expansion conversation.',
      'Metrics are calculated from the same event ledger that powers per-tenant invoices, so the numbers tie out exactly.',
    ],
    capabilities: ['Cross-tenant usage rollup', 'Per-tenant breakdown & trends', 'Stop & label fee accounting', 'Margin analysis', 'Platform-wide revenue dashboard'],
    related: ['billing', 'revenue-reports', 'tenants'],
  },

  // ============= PLATFORM & CONFIGURATION =============
  {
    slug: 'tenants',
    name: 'Tenant Management',
    tagline: 'Multi-tenant administration: onboard clients, manage access, and isolate data.',
    category: 'Platform & Configuration',
    audiences: ['3PL'],
    whyMatters:
      'Multi-tenant operations need a birds-eye view. Tenant management lets platform owners see which clients are growing, which are at risk, and how resources are distributed — critical for capacity planning and revenue forecasting.',
    roles: [R.platform],
    overview: [
      'Tenant Management is the platform-level administration screen for managing multiple warehouse clients (tenants). Platform owners can onboard new clients, review volume trends across tenants, and manage access permissions.',
      'This screen is only available to platform owners and provides the highest-level view of the multi-tenant system.',
    ],
    capabilities: ['Tenant creation & onboarding', 'Per-tenant configuration', 'Row-level security policies', 'Impersonation for support', 'Tenant lifecycle management'],
    related: ['warehouse-settings', 'employees', 'platform-billing'],
  },
  {
    slug: 'employees',
    name: 'Employee Management',
    tagline: 'Invitations, role-aware welcome flow, and team management across the platform.',
    category: 'Platform & Configuration',
    audiences: ['3PL', 'eCom', 'Dist', 'L-Mile'],
    whyMatters:
      "Role-based access isn't just about security — it's about focus. Warehouse workers see their task queue, not financial reports. Drivers see their stops, not inventory ledgers. Proper role assignment reduces errors and training time. The invitation system + role-aware welcome page makes new-hire onboarding a one-screen experience.",
    roles: [R.platform, R.business, R.manager],
    overview: [
      'Employee Management handles the warehouse workforce — adding staff, assigning roles, managing permissions, and tracking worker information. Invitations are sent from this screen with rate-limited resends, hashed tokens, and lifecycle tracking (pending, accepted, expired, revoked).',
      'New invitees receive a single-screen welcome page tailored to their role. A business owner lands on a workspace orientation, a warehouse employee on a worker-app intro, a B2B client on a portal walkthrough. Role-appropriate next-step CTAs drive each invitee to the screen they should use first.',
      'Managers set role-based access levels to ensure workers only see screens relevant to their responsibilities. Activity tracking and role audit logs give you a clean record of who has access to what.',
    ],
    capabilities: [
      'Employee records & roles',
      'RBAC permission assignment',
      'Invitation system with hashed tokens + rate-limited resends',
      'Role-aware welcome page for new invitees',
      'Per-invitation lifecycle tracking',
      'Mobile-app onboarding',
      'Activity tracking',
      'Multi-warehouse assignment',
    ],
    related: ['tenants', 'warehouse-settings'],
  },
];

export const CATEGORIES = [
  'Warehouse Operations',
  'Order & Fulfillment',
  'Dispatch & Last-Mile',
  'Mobile Apps',
  'Multi-tenant & Client',
  'Reports & Billing',
  'Platform & Configuration',
];

export const AUDIENCE_LABELS: Record<string, string> = {
  '3PL': '3PL',
  eCom: 'eCom',
  Dist: 'Dist',
  'L-Mile': 'L-Mile',
};

export function getModule(slug: string): ModuleDoc | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getRelatedModules(slugs: string[] | undefined): ModuleDoc[] {
  if (!slugs) return [];
  return slugs.map((s) => getModule(s)).filter((m): m is ModuleDoc => Boolean(m));
}
