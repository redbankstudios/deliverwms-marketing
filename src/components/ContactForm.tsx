import { useState, type FormEvent } from 'react';
import { invokeEdgeFunction, restInsert } from '@/lib/api';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  ideal_time: string;
  message: string;
}

const initial: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  ideal_time: '',
  message: '',
};

const fieldClass =
  'mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    // Mirror the original Lovable behavior: insert into contact_submissions,
    // then fire the transactional-email edge function. Both must succeed.
    const insert = await restInsert('contact_submissions', {
      name: form.name,
      company: form.company || null,
      email: form.email,
      phone: form.phone || null,
      ideal_time: form.ideal_time || null,
      message: form.message,
    });

    if (insert.error) {
      setStatus('error');
      setErrorMessage(insert.error.message);
      return;
    }

    const emailResult = await invokeEdgeFunction('send-transactional-email', {
      body: {
        type: 'contact_submission',
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        ideal_time: form.ideal_time,
        message: form.message,
      },
    });

    if (emailResult.error) {
      // Submission saved but email failed — treat as success since the lead is captured.
      console.warn('Email send failed:', emailResult.error.message);
    }

    setStatus('success');
    setForm(initial);
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center dark:border-brand-900/50 dark:bg-brand-950/30">
        <h3 className="text-xl font-semibold text-brand-900 dark:text-brand-200">
          Thanks — we'll be in touch.
        </h3>
        <p className="mt-2 text-sm text-brand-800 dark:text-brand-300">
          Your message is in. Expect to hear back within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-brand-700 underline hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-red-500">*</span>
          </label>
          <input id="name" type="text" required value={form.name} onChange={updateField('name')} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>Company</label>
          <input id="company" type="text" value={form.company} onChange={updateField('company')} className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <input id="email" type="email" required value={form.email} onChange={updateField('email')} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" type="tel" value={form.phone} onChange={updateField('phone')} className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="ideal_time" className={labelClass}>Ideal Time to Contact</label>
        <select id="ideal_time" value={form.ideal_time} onChange={updateField('ideal_time')} className={fieldClass}>
          <option value="">Select a time</option>
          <option value="morning">Morning (9am–12pm)</option>
          <option value="afternoon">Afternoon (12pm–5pm)</option>
          <option value="evening">Evening (5pm–8pm)</option>
          <option value="any">Any time</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={updateField('message')}
          className={fieldClass}
          placeholder="Tell us about your operation — how many SKUs, how many monthly orders, what's painful today."
        />
      </div>

      {status === 'error' && errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
