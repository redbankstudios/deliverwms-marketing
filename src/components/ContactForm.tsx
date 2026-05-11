import { useState, type FormEvent } from 'react';

// Where contact form submissions land. Update this if the destination changes.
const TO_EMAIL = 'wmsdeliver@gmail.com';
// Formsubmit.co — free, no-signup form-to-email service. First submission triggers
// a one-time confirmation email; click the link in that email to activate the inbox.
// After that, every submission arrives directly at TO_EMAIL.
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${TO_EMAIL}`;

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

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          // Form fields (these appear in the email body)
          Name: form.name,
          Company: form.company || '(not provided)',
          Email: form.email,
          Phone: form.phone || '(not provided)',
          'Ideal time to contact': form.ideal_time || '(any time)',
          Message: form.message,
          // Formsubmit.co control parameters
          _subject: `New contact form submission — ${form.name}`,
          _template: 'table',
          _captcha: 'false', // Disable Formsubmit's default reCAPTCHA for cleaner UX
          _replyto: form.email, // Replying to the email goes back to the sender
        }),
      });

      const data = await res.json();
      const ok = data?.success === true || data?.success === 'true';

      if (!ok) {
        setStatus('error');
        setErrorMessage(
          data?.message ||
            'We could not send your message. Please email us directly at ' + TO_EMAIL + '.',
        );
        return;
      }

      setStatus('success');
      setForm(initial);
    } catch (_err) {
      setStatus('error');
      setErrorMessage(
        'Network error. Please try again, or email us directly at ' + TO_EMAIL + '.',
      );
    }
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
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={updateField('name')}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={updateField('company')}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={updateField('email')}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={updateField('phone')}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="ideal_time" className={labelClass}>
          Ideal Time to Contact
        </label>
        <select
          id="ideal_time"
          value={form.ideal_time}
          onChange={updateField('ideal_time')}
          className={fieldClass}
        >
          <option value="">Select a time</option>
          <option value="Morning (9am–12pm)">Morning (9am–12pm)</option>
          <option value="Afternoon (12pm–5pm)">Afternoon (12pm–5pm)</option>
          <option value="Evening (5pm–8pm)">Evening (5pm–8pm)</option>
          <option value="Any time">Any time</option>
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
