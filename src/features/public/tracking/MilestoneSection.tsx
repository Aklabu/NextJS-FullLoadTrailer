import type { TrackingResult } from './types';

interface Props {
  result: TrackingResult;
}

// Each milestone step with its active condition per status
const STEPS = [
  {
    icon: '📋',
    title: 'Booking Confirmed',
    description: 'Load details locked, driver assigned, and job ID issued.',
    activeFor: ['not_picked', 'in_transit', 'complete'],
  },
  {
    icon: '📦',
    title: 'Awaiting Pickup',
    description: 'Driver en route to the origin location for loading.',
    activeFor: ['not_picked', 'in_transit', 'complete'],
    currentFor: ['not_picked'],
  },
  {
    icon: '🚚',
    title: 'In Transit',
    description: 'Shipment picked up and on the way to the destination.',
    activeFor: ['in_transit', 'complete'],
    currentFor: ['in_transit'],
  },
  {
    icon: '✅',
    title: 'Delivered',
    description: 'Shipment arrived at destination and delivery confirmed.',
    activeFor: ['complete'],
    currentFor: ['complete'],
  },
] as const;

export default function MilestoneSection({ result }: Props) {
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 48px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1a1a1a', marginBottom: 20 }}>
        Shipment Progress
      </h2>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
        className="tracking-milestones-grid"
      >
        {STEPS.map((step) => {
          const isCompleted = (step.activeFor as readonly string[]).includes(result.status);
          const isCurrent = 'currentFor' in step && (step.currentFor as readonly string[]).includes(result.status);

          return (
            <div
              key={step.title}
              style={{
                background: isCurrent ? '#fff7ed' : isCompleted ? '#f0fdf4' : '#fff',
                borderRadius: 16,
                padding: 24,
                border: isCurrent ? '1px solid #fed7aa' : isCompleted ? '1px solid #bbf7d0' : '1px solid #f3f4f6',
              }}
            >
              {/* Icon circle */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14,
              }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: isCurrent ? '#fc3f07' : isCompleted ? '#22c55e' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}
                >
                  {step.icon}
                </div>
                {isCurrent && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#d93506', letterSpacing: 1 }}>CURRENT</span>
                )}
                {isCompleted && !isCurrent && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#15803d', letterSpacing: 1 }}>DONE</span>
                )}
              </div>

              <h3 style={{
                fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 400,
                color: isCompleted ? '#1a1a1a' : '#9ca3af',
                marginBottom: 8,
              }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 13, color: isCompleted ? '#4b5563' : '#9ca3af', lineHeight: 1.6 }}>
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
