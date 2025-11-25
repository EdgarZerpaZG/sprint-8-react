export type Booking = {
  id: string;
  user_id: string | null;
  resource: string;
  title?: string;
  start_time: string;
  end_time: string;
  created_at: string;
};

export type Props = {
  open: boolean;
  onClose: () => void;
  start: string;
  end: string;
  resource: string;
  onSuccess?: () => void;
};