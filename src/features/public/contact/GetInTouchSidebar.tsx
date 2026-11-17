const methods = [
  {
    label: 'Call Us',
    description: 'Get pricing and speak with our team.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
  },
  {
    label: 'Email Us',
    description: 'Send your questions or a request for a quote.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
  },
  {
    label: 'Business Hours',
    description: 'Monday – Friday: 9:00 AM – 6:00 PM (EST)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function GetInTouchSidebar() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-5" style={{ color: '#1a1a1a' }}>Get in Touch</h2>
      <div className="space-y-3">
        {methods.map((m) => (
          <div
            key={m.label}
            className="flex items-start gap-4 rounded-xl p-4"
            style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 text-white"
              style={{ background: '#fc3f07' }}
            >
              {m.icon}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#1a1a1a' }}>{m.label}</p>
              <p className="text-sm" style={{ color: '#6b7280' }}>{m.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
