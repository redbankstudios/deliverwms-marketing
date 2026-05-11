import { useMemo, useState } from 'react';

// Rough multipliers calibrated to produce results matching the live site's outputs.
// Operator: tune these as you get better data on actual customer savings.
const RATE = {
  receivingPerOrder: 0.18, // ~24h/mo at 600 orders × ~$15/hr → ~$0.6 per order; scaled
  cycleCountPerOrder: 0.08,
  allocationPerOrder: 0.1,
  portalPerClient: 80, // $80/mo per active B2B client
  billingFixed: 165, // ~11h/mo × $15/hr at any volume above zero
  returnsPerReturn: 2.1, // $2.1 per return handled
  dispatchFixed: 120, // ~8h/mo if at least one staff member
};

function formatUsd(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function SavingsCalculator() {
  const [orders, setOrders] = useState(600);
  const [clients, setClients] = useState(5);
  const [returns, setReturns] = useState(50);
  const [staff, setStaff] = useState(8);

  const { low, high } = useMemo(() => {
    const base =
      orders * (RATE.receivingPerOrder + RATE.cycleCountPerOrder + RATE.allocationPerOrder) +
      clients * RATE.portalPerClient +
      (orders > 0 ? RATE.billingFixed : 0) +
      returns * RATE.returnsPerReturn +
      (staff > 0 ? RATE.dispatchFixed : 0);
    // Present as a ±15% range so it reads honestly as an estimate.
    return {
      low: Math.round(base * 0.85),
      high: Math.round(base * 1.15),
    };
  }, [orders, clients, returns, staff]);

  const roiMultiple = low > 0 ? Math.round((low / 299) * 10) / 10 : 0;

  const inputClass =
    'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-3">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="orders" className={labelClass}>Monthly orders</label>
            <input
              id="orders"
              type="number"
              min="0"
              step="50"
              value={orders}
              onChange={(e) => setOrders(Math.max(0, Number(e.target.value)))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="clients" className={labelClass}>Active B2B clients</label>
            <input
              id="clients"
              type="number"
              min="0"
              step="1"
              value={clients}
              onChange={(e) => setClients(Math.max(0, Number(e.target.value)))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="returns" className={labelClass}>Returns / month</label>
            <input
              id="returns"
              type="number"
              min="0"
              step="5"
              value={returns}
              onChange={(e) => setReturns(Math.max(0, Number(e.target.value)))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="staff" className={labelClass}>Warehouse staff count</label>
            <input
              id="staff"
              type="number"
              min="0"
              step="1"
              value={staff}
              onChange={(e) => setStaff(Math.max(0, Number(e.target.value)))}
              className={inputClass}
            />
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
          Estimated using process design benchmarks across receiving, B2B support, billing reconciliation, returns, and cycle counts. Your actual savings depend on current workflow and labor cost basis.
        </p>
      </div>

      {/* Output */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white lg:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">
          Estimated monthly savings
        </p>
        <p className="mt-3 text-3xl font-bold sm:text-4xl">
          {formatUsd(low)} – {formatUsd(high)}
        </p>
        <p className="mt-2 text-sm text-brand-100">in operational time / month</p>
        {roiMultiple > 0 && (
          <p className="mt-6 rounded-lg bg-white/10 px-3 py-2 text-sm text-brand-50">
            At Starter ($299/month), that's an estimated <span className="font-bold text-white">{roiMultiple}× ROI</span> on the platform fee.
          </p>
        )}
      </div>
    </div>
  );
}
