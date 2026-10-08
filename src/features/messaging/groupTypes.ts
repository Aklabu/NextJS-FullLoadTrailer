export type GroupMessageAttachment = {
  id: string;
  name: string;
  url: string;
  // 'image' renders inline; 'file' renders as a download link
  type: 'image' | 'file';
  size?: number; // bytes
};

export type GroupMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'shipper' | 'broker' | 'carrier';
  body: string;
  attachments: GroupMessageAttachment[];
  sentAt: string;
  status: 'sent' | 'sending' | 'error';
};

export const ROLE_COLORS: Record<string, string> = {
  shipper: '#a855f7',   // purple
  broker: '#f97316',    // orange
  carrier: '#e879f9',   // magenta
};

export const ROLE_LABELS: Record<string, string> = {
  shipper: 'Shipper',
  broker: 'Broker',
  carrier: 'Carrier',
};
